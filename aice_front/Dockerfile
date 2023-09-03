# ベースイメージの指定
FROM node:18.17

# 作業ディレクトリの設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json /app/

# 依存関係のインストール
RUN npm install

# ソースコードをコピー
COPY . /app/

# ビルドを実行
RUN npm run build

# コンテナ起動時に実行するコマンド
CMD [ "npm", "start" ]
