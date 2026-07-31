from pydantic import BaseModel, ConfigDict, EmailStr


class UserRead(BaseModel):
    id: int
    employee_id: str
    full_name: str
    email: EmailStr
    role: str
    organization: str
    assigned_region: str | None
    model_config = ConfigDict(from_attributes=True)
