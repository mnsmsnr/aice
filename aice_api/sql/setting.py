from sqlalchemy import *
from sqlalchemy.orm import *
from sqlalchemy.ext.declarative import declarative_base
import os

# DB接続設定
db_config = {
    'username': os.environ.get('POSTGRES_USER'),
    'password': os.environ.get('POSTGRES_PASSWORD'),
    'host': os.environ.get('DB_HOST'),
    'port': os.environ.get('DB_PORT'),
    'dbname': os.environ.get('DB_NAME'),
}
# DB接続するためのEngineインスタンス
ENGINE = create_engine(
    'postgresql://' +
    '?user=' + db_config['username'] +
    '&password=' + db_config['password'] +
    '&host=' + db_config['host'] +
    '&port=' + db_config['port'] +
    '&dbname=' + db_config['dbname'],
    echo=True
)

# DBに対してORM操作するときに利用
# Sessionを通じて操作を行う
session = scoped_session(
    sessionmaker(autocommit=False, autoflush=False, bind=ENGINE)
)

# 各modelで利用
# classとDBをMapping
Base = declarative_base()