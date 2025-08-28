from sqlalchemy import Boolean, Column, Integer, String, DateTime, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database.database import Base

class VehicleType(enum.Enum):
    CAR = "car"
    TRUCK = "truck"
    MOTORCYCLE = "motorcycle"
    OTHER = "other"

class Direction(enum.Enum):
    IN = "in"
    OUT = "out"

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(Integer, ForeignKey("cameras.id"))
    vehicle_type = Column(Enum(VehicleType))
    direction = Column(Enum(Direction))
    timestamp = Column(DateTime, default=datetime.utcnow)
    license_plate = Column(String, nullable=True)
    confidence = Column(Float)  # Detection confidence score
    image_path = Column(String, nullable=True)
    
    # Relationships
    camera = relationship("Camera")