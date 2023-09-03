from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from datetime import timedelta
# 秘密鍵生成用
import secrets
# モジュールインポート
from bp.member_bp import member_bp
from bp.chat_bp import chat_bp

import sys
import os
# アプリケーションルートのパスを取得
app_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, app_root)

# .envファイルをロードして環境変数に設定
load_dotenv()

# アプリケーションインスタンス
app = Flask(__name__)

# CORS設定
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ログインマネージャー初期化とログインビューを指定
login_manager = LoginManager(app)
login_manager.login_view = 'member_bp.login'

# エンドポイント登録
app.register_blueprint(member_bp, url_prefix='/api')
app.register_blueprint(chat_bp, url_prefix='/api')

# load_user関数の実装
@login_manager.user_loader
def load_user(user_id):
    from model.member import Member  # Memberモデルのインポート
    from sql.setting import session  # sessionのインポート

    # ユーザーIDを使ってユーザー情報をデータベースから取得
    return session.query(Member).get(int(user_id))

# 秘密鍵を生成しセット
app.secret_key = secrets.token_hex(16)
app.config['JWT_SECRET_KEY'] = secrets.token_hex(16)
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7) 
# JWTManager初期化
jwt = JWTManager(app)

if __name__ == '__main__':
    app.run()
