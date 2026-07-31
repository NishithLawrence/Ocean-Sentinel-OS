from pydantic import BaseModel, ConfigDict, EmailStr


class UserRead(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    organization: str
    model_config = ConfigDict(from_attributes=True)
