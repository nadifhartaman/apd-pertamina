from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class BuildingBase(BaseModel):
    name: str
    description: Optional[str] = None
    latitude: float
    longitude: float
    geometry: Optional[Dict[str, Any]] = None  # GeoJSON format

class BuildingCreate(BuildingBase):
    pass

class BuildingUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    geometry: Optional[Dict[str, Any]] = None

class Building(BuildingBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class HolidayBase(BaseModel):
    name: str
    date: datetime
    description: Optional[str] = None
    is_national: bool = True

class HolidayCreate(HolidayBase):
    pass

class HolidayUpdate(BaseModel):
    name: Optional[str] = None
    date: Optional[datetime] = None
    description: Optional[str] = None
    is_national: Optional[bool] = None

class Holiday(HolidayBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True