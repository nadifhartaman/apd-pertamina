from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime
import os
import uuid
import json
import cv2
import numpy as np
from PIL import Image
import io

from app.database.database import get_db
from app.models.camera import Camera, Detection, APDDetection
from app.schemas.camera import DetectionResult, Detection as DetectionSchema
from app.utils.auth import get_current_active_user, has_role
from app.models.user import User
from app.socket.socket_manager import socket_manager

router = APIRouter()

# Directory to save detection images
UPLOAD_DIR = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/process-image", response_model=DetectionResult)
async def process_image(
    background_tasks: BackgroundTasks,
    camera_id: int = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if camera exists
    camera = db.query(Camera).filter(Camera.id == camera_id).first()
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    # Read and process the image
    contents = await image.read()
    
    # Save the image
    filename = f"{uuid.uuid4()}.jpg"
    image_path = os.path.join(UPLOAD_DIR, filename)
    with open(image_path, "wb") as f:
        f.write(contents)
    
    # Mock detection results (in a real app, you would use a detection model here)
    detection_result = mock_apd_detection(image_path)
    
    # Create detection record
    db_detection = Detection(
        camera_id=camera_id,
        image_path=image_path,
        has_violation=detection_result["has_violation"],
        detection_data=detection_result
    )
    db.add(db_detection)
    db.commit()
    db.refresh(db_detection)
    
    # Create APD detection records for each person
    for person in detection_result["persons"]:
        apd_detection = APDDetection(
            detection_id=db_detection.id,
            person_id=person["person_id"],
            helmet=person["helmet"],
            vest=person["vest"],
            gloves=person["gloves"],
            boots=person["boots"],
            confidence=person["confidence"],
            bounding_box=person["bounding_box"]
        )
        db.add(apd_detection)
    
    db.commit()
    
    # Emit detection result via Socket.IO in background
    background_tasks.add_task(
        emit_detection_result,
        camera_id=camera_id,
        detection_data=detection_result
    )
    
    # Return detection result
    return DetectionResult(
        camera_id=camera_id,
        timestamp=db_detection.timestamp,
        image_path=image_path,
        has_violation=detection_result["has_violation"],
        persons=detection_result["persons"],
        summary=detection_result["summary"]
    )

@router.get("/statistics", response_model=Dict[str, Any])
async def get_detection_statistics(
    camera_id: Optional[int] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Base query
    query = db.query(Detection)
    
    # Apply filters
    if camera_id:
        query = query.filter(Detection.camera_id == camera_id)
    if date_from:
        query = query.filter(Detection.timestamp >= date_from)
    if date_to:
        query = query.filter(Detection.timestamp <= date_to)
    
    # Get detections
    detections = query.all()
    
    # Calculate statistics
    total_detections = len(detections)
    violations = sum(1 for d in detections if d.has_violation)
    compliance_rate = (total_detections - violations) / total_detections if total_detections > 0 else 0
    
    # Return statistics
    return {
        "total_detections": total_detections,
        "violations": violations,
        "compliance_rate": compliance_rate,
        "camera_id": camera_id,
        "date_from": date_from,
        "date_to": date_to
    }

# Mock APD detection function (replace with actual detection model in production)
def mock_apd_detection(image_path: str) -> Dict[str, Any]:
    # In a real app, you would use a detection model here
    # For now, we'll just return mock data
    
    # Generate random detection results
    import random
    
    # Number of persons detected (1-3)
    num_persons = random.randint(1, 3)
    
    persons = []
    has_violation = False
    
    for i in range(num_persons):
        # Random APD compliance
        helmet = random.random() > 0.2
        vest = random.random() > 0.2
        gloves = random.random() > 0.3
        boots = random.random() > 0.3
        
        # Check for violations
        person_has_violation = not (helmet and vest and gloves and boots)
        if person_has_violation:
            has_violation = True
        
        # Random bounding box
        x1 = random.randint(50, 300)
        y1 = random.randint(50, 300)
        x2 = x1 + random.randint(100, 200)
        y2 = y1 + random.randint(200, 400)
        
        persons.append({
            "person_id": i + 1,
            "helmet": helmet,
            "vest": vest,
            "gloves": gloves,
            "boots": boots,
            "confidence": random.uniform(0.7, 0.98),
            "bounding_box": f"{x1},{y1},{x2},{y2}"
        })
    
    # Calculate summary
    total_persons = len(persons)
    compliant_persons = sum(1 for p in persons if all([p["helmet"], p["vest"], p["gloves"], p["boots"]]))
    
    summary = {
        "total_persons": total_persons,
        "compliant_persons": compliant_persons,
        "violation_persons": total_persons - compliant_persons,
        "compliance_rate": compliant_persons / total_persons if total_persons > 0 else 1.0,
        "violations": {
            "helmet": sum(1 for p in persons if not p["helmet"]),
            "vest": sum(1 for p in persons if not p["vest"]),
            "gloves": sum(1 for p in persons if not p["gloves"]),
            "boots": sum(1 for p in persons if not p["boots"])
        }
    }
    
    return {
        "has_violation": has_violation,
        "persons": persons,
        "summary": summary,
        "timestamp": datetime.utcnow().isoformat()
    }

async def emit_detection_result(camera_id: int, detection_data: Dict[str, Any]):
    """Emit detection result via Socket.IO"""
    await socket_manager.emit_detection_result(str(camera_id), detection_data)