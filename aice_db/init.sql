-- init.sql

-- データベースの作成
CREATE DATABASE aice_db;
-- データベースの所有権をユーザーに付与
ALTER DATABASE aice_db OWNER TO aice_db_user;
-- ユーザーにデータベースの接続権限を付与
GRANT ALL PRIVILEGES ON DATABASE aice_db TO aice_db_user;

-- データベースに接続
\c aice_db;

-- ユーザー
CREATE TABLE member (
    id SERIAL PRIMARY KEY,
    last_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    trance_flg BOOLEAN DEFAULT true,
    advice_flg BOOLEAN DEFAULT true,
    delete_flg BOOLEAN DEFAULT false,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- チャット履歴
CREATE TABLE chat_history (
    id SERIAL PRIMARY KEY,
    member_id INT REFERENCES member(id),
    chat_history TEXT NOT NULL,
    delete_flg BOOLEAN DEFAULT false,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);