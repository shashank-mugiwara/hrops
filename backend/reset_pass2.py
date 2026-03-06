import bcrypt
from backend.db import SessionLocal
from backend.models import AdminUser

db = SessionLocal()
user = db.query(AdminUser).filter(AdminUser.username == "sheerin.taj").first()
if user:
    password = b"jtulcie51A8r9kRm"
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password, salt)
    user.password_hash = hashed.decode('utf-8')
    db.commit()
    print("Password reset successfully")
else:
    print("User not found")
