from sqlalchemy import Boolean, Column, Integer, String, DateTime, Float, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

class Camera(Base):
    __tablename__ = "cameras"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    location = Column(String)
    description = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    rtsp_url = Column(String, nullable=True)
    status = Column(String, default="offline")  # online, offline, error
    last_online = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    detections = relationship("Detection", back_populates="camera")
    status_logs = relationship("CameraStatusLog", back_populates="camera")

class CameraStatusLog(Base):
    __tablename__ = "camera_status_logs"

    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(Integer, ForeignKey("cameras.id"))
    status = Column(String)  # online, offline, error
    timestamp = Column(DateTime, default=datetime.utcnow)
    details = Column(String, nullable=True)
    
    # Relationships
    camera = relationship("Camera", back_populates="status_logs")

class Detection(Base):
    __tablename__ = "detections"

    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(Integer, ForeignKey("cameras.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    image_path = Column(String, nullable=True)
    has_violation = Column(Boolean, default=False)
    detection_data = Column(JSON, nullable=True)  # Store detection results as JSON
    
    # Relationships
    camera = relationship("Camera", back_populates="detections")
    apd_detections = relationship("APDDetection", back_populates="detection")

class APDDetection(Base):
    __tablename__ = "apd_detections"

    id = Column(Integer, primary_key=True, index=True)
    detection_id = Column(Integer, ForeignKey("detections.id"))
    person_id = Column(Integer)  # ID to track the same person across frames
    helmet = Column(Boolean, default=False)
    vest = Column(Boolean, default=False)
    gloves = Column(Boolean, default=False)
    boots = Column(Boolean, default=False)
    confidence = Column(Float)  # Detection confidence score
    bounding_box = Column(String)  # Format: "x1,y1,x2,y2"
    
    # Relationships
    detection = relationship("Detection", back_populates="apd_detections")