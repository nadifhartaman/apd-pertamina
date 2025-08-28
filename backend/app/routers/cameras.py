from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database.database import get_db
from app.models.camera import Camera, CameraStatusLog, Detection, APDDetection
from app.schemas.camera import (
    Camera as CameraSchema,
    CameraCreate,
    CameraUpdate,
    CameraStatusLog as CameraStatusLogSchema,
    Detection as DetectionSchema
)
from app.utils.auth import get_current_active_user, has_role
from app.models.user import User
from app.socket.socket_manager import socket_manager

router = APIRouter()

@router.get("/", response_model=List[CameraSchema])
async def get_all_cameras(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    cameras = db.query(Camera).offset(skip).limit(limit).all()
    return cameras

@router.get("/{camera_id}", response_model=CameraSchema)
async def get_camera(camera_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    camera = db.query(Camera).filter(Camera.id == camera_id).first()
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    return camera

@router.post("/", response_model=CameraSchema, status_code=status.HTTP_201_CREATED)
async def create_camera(camera: CameraCreate, db: Session = Depends(get_db), current_user: User = Depends(has_role(["admin"]))):
    db_camera = Camera(**camera.dict())
    db.add(db_camera)
    db.commit()
    db.refresh(db_camera)
    return db_camera

@router.put("/{camera_id}", response_model=CameraSchema)
async def update_camera(camera_id: int, camera: CameraUpdate, db: Session = Depends(get_db), current_user: User = Depends(has_role(["admin"]))):
    db_camera = db.query(Camera).filter(Camera.id == camera_id).first()
    if not db_camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    # Update camera fields if provided
    for key, value in camera.dict(exclude_unset=True).items():
        setattr(db_camera, key, value)
    
    # If status is updated, create a status log
    if camera.status is not None and camera.status != db_camera.status:
        status_log = CameraStatusLog(
            camera_id=camera_id,
            status=camera.status,
            details=f"Status changed from {db_camera.status} to {camera.status}"
        )
        db.add(status_log)
        
        # If camera is online, update last_online timestamp
        if camera.status == "online":
            db_camera.last_online = datetime.utcnow()
    
    db.commit()
    db.refresh(db_camera)
    return db_camera

@router.delete("/{camera_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_camera(camera_id: int, db: Session = Depends(get_db), current_user: User = Depends(has_role(["admin"]))):
    db_camera = db.query(Camera).filter(Camera.id == camera_id).first()
    if not db_camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    db.delete(db_camera)
    db.commit()
    return {"detail": "Camera deleted"}

@router.get("/{camera_id}/status-log", response_model=List[CameraStatusLogSchema])
async def get_camera_status_log(camera_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    camera = db.query(Camera).filter(Camera.id == camera_id).first()
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    logs = db.query(CameraStatusLog).filter(CameraStatusLog.camera_id == camera_id).order_by(CameraStatusLog.timestamp.desc()).offset(skip).limit(limit).all()
    return logs

@router.get("/{camera_id}/detections", response_model=List[DetectionSchema])
async def get_camera_detections(camera_id: int, skip: int = 0, limit: int = 100, date_from: Optional[datetime] = None, date_to: Optional[datetime] = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    camera = db.query(Camera).filter(Camera.id == camera_id).first()
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    query = db.query(Detection).filter(Detection.camera_id == camera_id)
    
    if date_from:
        query = query.filter(Detection.timestamp >= date_from)
    if date_to:
        query = query.filter(Detection.timestamp <= date_to)
    
    detections = query.order_by(Detection.timestamp.desc()).offset(skip).limit(limit).all()
    return detections