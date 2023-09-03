# models.py
from flask_login import UserMixin
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from sql.setting import ENGINE, Base, session

Base = Base

session = session

class Member(Base, UserMixin):
    __tablename__ = 'member'

    id = Column(Integer, primary_key=True)
    last_name = Column(String(255), nullable=False)
    first_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    trance_flg = Column(Boolean, nullable=False, default=True)
    advice_flg = Column(Boolean, nullable=False, default=True)
    delete_flg = Column(Boolean, nullable=False, default=False)
    created_by = Column(String(255))
    updated_by = Column(String(255))
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    
def main(args):
    Base.metadata.create_all(bind=ENGINE)
