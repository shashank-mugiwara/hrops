from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base, AdminUser

SQLALCHEMY_DATABASE_URL = "sqlite:///./hrportal.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

    # Initialize default admin user
    try:
        import bcrypt
        db = SessionLocal()
        # Check if the admin user exists
        admin = db.query(AdminUser).filter(AdminUser.username == "sheerin.taj").first()
        if not admin:
            # Hash the password
            password = b"jtulcie51A8r9kRm"
            salt = bcrypt.gensalt()
            hashed = bcrypt.hashpw(password, salt)

            # Create user
            new_admin = AdminUser(username="sheerin.taj", password_hash=hashed.decode('utf-8'))
            db.add(new_admin)
            db.commit()
    except Exception as e:
        print(f"Error initializing admin user: {e}")
    finally:
        db.close()
