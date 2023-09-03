from flask import Blueprint, jsonify, request
# チャットモデル
from langchain.chat_models import ChatOpenAI
# チャットテンプレート
from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
# チャットメモリ
from langchain.memory import ChatMessageHistory
# メッセージ履歴のdict相互変換関数
from langchain.schema import messages_from_dict, messages_to_dict

from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.exc import SQLAlchemyError
from sql.setting import ENGINE, Base
from model.chat import ChatHistory, session

# deepl用
import requests

import os
import json

# Blueprintの作成
chat_bp = Blueprint('chat_bp', __name__)

# チャットモデル
chat = ChatOpenAI()

# チャット履歴保存
@chat_bp.route('/save_chat_history', methods=['POST'])
@jwt_required()
def save_chat_history():
    try:
        # リクエストボディをJSONとして取得
        data = request.json
        if 'chatHistory' not in data:
            return jsonify({'error': 'chatHistory is missing'}), 400
        # ユーザーID
        current_user_id = get_jwt_identity()
        # 最新のチャット履歴を取得
        latest_chat_history_list = data['chatHistory']
        latest_chat_history = json.dumps(latest_chat_history_list)
        # ChatHistoryレコードを取得（存在しない場合は新規作成）
        chat_history = session.query(ChatHistory).filter_by(member_id=current_user_id).first()
        if not chat_history:
            new_chat_history = ChatHistory()
            new_chat_history.member_id = current_user_id
            new_chat_history.chat_history = latest_chat_history
            session.add(new_chat_history)
        else :
            chat_history.chat_history = latest_chat_history
        # データベースセッションのコミット
        session.commit()
        # レスポンス生成
        response = {'message': 'Chat history saved successfully'}
        return jsonify(response), 200
    except SQLAlchemyError as e:
        # データベースエラーが発生した場合の処理
        session.rollback()
        return jsonify({'error': 'Database error'}), 500
    except Exception as e:
        # その他のエラーが発生した場合の処理
        return jsonify({'error': str(e)}), 500
    
# チャット履歴取得
@chat_bp.route('/get_chat_history', methods=['GET'])
@jwt_required()
def get_chat_history():
    try:
        # ユーザーID
        current_user_id = get_jwt_identity()
        # ChatHistoryレコードを取得
        chat_history = session.query(ChatHistory).filter_by(member_id=current_user_id).first()
        if not chat_history:
            # レコードが存在しない場合は空のリストを返す
            return jsonify([])
        # chat_historyがJSON形式の文字列であることを前提として、文字列をデコードしてリストに変換
        chat_history_list = json.loads(chat_history.chat_history)
        return jsonify(chat_history_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# チャット送受信
@chat_bp.route('/openai', methods=['POST'])
def openai():
    # リクエストボディをJSONとして取得
    data = request.json
    # 送信メッセージを取得
    sendMsg_sentence = data.get('sendMsg')

    # システム条件セット
    template="{sys_prompt}"
    system_message_prompt = SystemMessagePromptTemplate.from_template(template)
    # 送信英文をセット
    human_template="{human_prompt}"
    human_message_prompt = HumanMessagePromptTemplate.from_template(human_template)
    # 
    chat_prompt = ChatPromptTemplate.from_messages([system_message_prompt, human_message_prompt])

    # 送信メッセージに対するアドバイスを取得
    # 【TODO!】精度不足のため実装見送り
    # sendMsg_advice = chat(
    #     chat_prompt.format_prompt(
    #         input_language="English",
    #         output_language="Japanese",
    #         sys_prompt = 
    #             "You are an English language corrector.",
                
    #         human_prompt =
    #             "Please correct the English text that follows." +
    #             "If there are any mistakes, explain the mistake and the correct answer; if there are no particular mistakes," +
    #             "only answer 'No remarks'. The English sentence to be corrected is after the next colon:" +
    #             sendMsg_sentence,
    #     ).to_messages()
    # )
    # sendMsg_advice = sendMsg_advice.content

    # 返信メッセージを取得
    receiveMsg = chat(
        chat_prompt.format_prompt(
            input_language="English",
            output_language="English",
            sys_prompt = "You are a Free Talk English conversation partner.",
            human_prompt = sendMsg_sentence,
        ).to_messages()
    )
    receiveMsg= receiveMsg.content

    # 送信メッセージ・返信メッセージ・アドバイスの翻訳情報を取得
    result = requests.get( 
        # 無料版のURL
        "https://api-free.deepl.com/v2/translate",
        params={ 
            "auth_key": os.getenv("DEEPL_AUTH_KEY"),
            "target_lang": "JA",
            "text": [sendMsg_sentence, receiveMsg],
        },
    ) 
    sendMsg_trans = result.json()["translations"][0]["text"]
    receiveMsg_trans = result.json()["translations"][1]["text"]

    # メモリの初期化
    history = ChatMessageHistory()
    # メッセージの追加
    history.add_user_message(sendMsg_sentence)
    history.add_ai_message(receiveMsg)

    #【TODO!】会話履歴の保持
    # メッセージ履歴を辞書型に変換
    dicts = messages_to_dict(history.messages)
    # 辞書型のメッセージ履歴をメッセージオブジェクトに変換
    new_messages = messages_from_dict(dicts)
    
    # レスポンス生成
    response = {
        'sendChat': {
            'sentence': sendMsg_sentence,
            'trans': sendMsg_trans,
        },
        'receiveChat': {
            'sentence': receiveMsg,
            'trans': receiveMsg_trans,
        },
    }

    return response

