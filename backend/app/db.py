from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv
load_dotenv()

MYSQL_HOST = os.getenv('MYSQL_HOST','db')
MYSQL_PORT = os.getenv('MYSQL_PORT','3306')
MYSQL_USER = os.getenv('MYSQL_USER','root')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD','123456')
MYSQL_DATABASE = os.getenv('MYSQL_DATABASE','nuevaroma_db')

DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}?charset=utf8mb4"

engine = create_engine(DATABASE_URL, pool_pre_ping=True, future=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
