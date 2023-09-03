from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from datetime import datetime
from sql.setting import ENGINE, Base, session

session = session

class ChatHistory(Base):
    __tablename__ = 'chat_history'

    id = Column(Integer, primary_key=True)
    member_id = Column(Integer, ForeignKey('member.id'), nullable=False)
    chat_history = Column(String, nullable=False)
    delete_flg = Column(Boolean, default=False)
    created_by = Column(String(255))
    updated_by = Column(String(255))
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

def main(args):
    Base.metadata.create_all(bind=ENGINE)