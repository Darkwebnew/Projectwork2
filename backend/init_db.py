from backend.database import Base, engine

from backend.models.user import User
from backend.models.schema import Scan


def init():

    Base.metadata.create_all(bind=engine)

    print("Database created")


if __name__ == "__main__":

    init()
