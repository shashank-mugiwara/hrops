from passlib.context import CryptContext
from backend.db import SessionLocal
from backend.models import AdminUser

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
db = SessionLocal()
user = db.query(AdminUser).filter(AdminUser.username == "sheerin.taj").first()
if user:
    user.password_hash = pwd_context.hash("password")
    db.commit()
    print("Password reset to 'password'")
else:
    print("User not found")
