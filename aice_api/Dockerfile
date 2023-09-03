# ベースイメージの指定
FROM python:3.11

# 作業ディレクトリの設定
WORKDIR /app

# requirements.txtをコピー
COPY requirements.txt /app/requirements.txt

# 必要なパッケージのインストール
RUN pip install -r requirements.txt

# ソースコードをコピー
COPY . /app/

# コンテナ起動時に実行するコマンド
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
