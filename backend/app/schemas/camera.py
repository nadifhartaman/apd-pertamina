from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class CameraBase(BaseModel):
    name: str
    location: str
    description: Optional[str] = None
    ip_address: Optional[str] = None
    rtsp_url: Optional[str] = None

class CameraCreate(CameraBase):
    pass

class CameraUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    ip_address: Optional[str] = None
    rtsp_url: Optional[str] = None
    status: Optional[str] = None

class Camera(CameraBase):
    id: int
    status: str
    last_online: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CameraStatusLogBase(BaseModel):
    camera_id: int
    status: str
    details: Optional[str] = None

class CameraStatusLogCreate(CameraStatusLogBase):
    pass

class CameraStatusLog(CameraStatusLogBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class APDDetectionBase(BaseModel):
    person_id: int
    helmet: bool = False
    vest: bool = False
    gloves: bool = False
    boots: bool = False
    confidence: float
    bounding_box: str  # Format: "x1,y1,x2,y2"

class APDDetectionCreate(APDDetectionBase):
    detection_id: int

class APDDetection(APDDetectionBase):
    id: int
    detection_id: int

    class Config:
        from_attributes = True

class DetectionBase(BaseModel):
    camera_id: int
    has_violation: bool = False
    image_path: Optional[str] = None
    detection_data: Optional[Dict[str, Any]] = None

class DetectionCreate(DetectionBase):
    pass

class Detection(DetectionBase):
    id: int
    timestamp: datetime
    apd_detections: List[APDDetection] = []

    class Config:
        from_attributes = True

class DetectionResult(BaseModel):
    camera_id: int
    timestamp: datetime
    image_path: Optional[str] = None
    has_violation: bool
    persons: List[Dict[str, Any]]
    summary: Dict[str, Any]