# backend/schemas/user_schema.py

from pydantic import BaseModel

class UserCreate(BaseModel):

    name: str
    email: str
    password: str
    role: str


class UserLogin(BaseModel):

    email: str
    password: str


class TokenResponse(BaseModel):

    access_token: str
    token_type: str
