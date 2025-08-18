from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class VehicleTypeEnum(str, Enum):
    CAR = "car"
    TRUCK = "truck"
    MOTORCYCLE = "motorcycle"
    OTHER = "other"

class DirectionEnum(str, Enum):
    IN = "in"
    OUT = "out"

class VehicleBase(BaseModel):
    camera_id: int
    vehicle_type: VehicleTypeEnum
    direction: DirectionEnum
    license_plate: Optional[str] = None
    confidence: float
    image_path: Optional[str] = None

class VehicleCreate(VehicleBase):
    pass

class Vehicle(VehicleBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class VehicleStats(BaseModel):
    total: int
    by_type: dict
    by_direction: dict
    by_hour: dict