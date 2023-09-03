# ベースイメージの指定
FROM postgres:latest

# 初期化スクリプトのコピー（必要に応じて使用）
COPY init.sql /docker-entrypoint-initdb.d/

# コンテナ起動時に実行するコマンド
CMD ["postgres"]
