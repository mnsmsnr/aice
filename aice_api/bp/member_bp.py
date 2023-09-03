from flask import Blueprint, jsonify, request
from flask_login import login_user, logout_user
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from model.member import Member, session

# Blueprintの作成
member_bp = Blueprint('member_bp', __name__)

# サインアップ
@member_bp.route('/signup', methods=['POST'])
def signup():
    # リクエストから送信されたデータを受け取る
    # ここでデータベースにデータを保存する処理を実装する
    member = Member()
    member.last_name = request.json.get('last_name')
    member.first_name = request.json.get('first_name')
    member.email = request.json.get('email')
    member.password_hash = generate_password_hash(request.json.get('password'))
    session.add(member)
    session.commit()

    response = {'message': 'User registered successfully'}

    return jsonify(response)

# ログイン
@member_bp.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')

    user = session.query(Member).where(Member.email==email).first()

    if user and check_password_hash(user.password_hash, password):
        initials = generate_initials(user.first_name, user.last_name)
        # JWTトークンを生成
        access_token = create_access_token(identity=user.id)
        login_user(user)
        # 【!TODO】ユーザーイニシャル生成
        return jsonify({'access_token': access_token, 'initials': initials})
    else:
        return jsonify({'message': 'Login failed'}), 401

# ログアウト
@member_bp.route('/logout', methods=['GET'])
# @login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'})

# ログインユーザー情報の取得
@member_bp.route('/getLoggedInUserInfo', methods=['GET'])
@jwt_required()  # JWTトークンの検証
def getLoggedInUserInfo():
    try:
        current_user_id = get_jwt_identity()  # トークンからユーザーIDを取得
        user = session.query(Member).filter_by(id=current_user_id).first()
        initials = generate_initials(user.first_name, user.last_name)
        if user:
            return jsonify({
                'user_id': current_user_id,
                'initials': initials,
                'trance_flg': user.trance_flg,
                'advice_flg': user.advice_flg
            })
        else:
            return jsonify({'message': 'login check failed'}), 401
    except Exception as e:
        return jsonify({'message': 'login check failed'}), 401

# アイコン用イニシャル整形
def generate_initials(first_name, last_name):
    formatted_initials = f"{first_name[0].upper()}.{last_name[0].upper()}"
    return formatted_initials