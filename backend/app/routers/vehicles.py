from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta

from app.database.database import get_db
from app.models.vehicle import Vehicle, VehicleType, Direction
from app.schemas.vehicle import Vehicle as VehicleSchema, VehicleCreate, VehicleStats
from app.utils.auth import get_current_active_user
from app.models.user import User

router = APIRouter()

@router.get("/getChartMasukKeluar", response_model=Dict[str, Any])
async def get_chart_masuk_keluar(filter: str = "day", db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    # Get date range based on filter
    now = datetime.utcnow()
    if filter == "day":
        start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = now
    elif filter == "week":
        start_date = now - timedelta(days=7)
        end_date = now
    elif filter == "month":
        start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end_date = now
    else:
        raise HTTPException(status_code=400, detail="Invalid filter")
    
    # Get vehicles in date range
    vehicles = db.query(Vehicle).filter(
        Vehicle.timestamp >= start_date,
        Vehicle.timestamp <= end_date
    ).all()
    
    # Count vehicles by direction
    in_count = sum(1 for v in vehicles if v.direction == Direction.IN)
    out_count = sum(1 for v in vehicles if v.direction == Direction.OUT)
    
    return {
        "labels": ["Masuk", "Keluar"],
        "data": [in_count, out_count],
        "total": len(vehicles)
    }

@router.get("/getMasukKeluarByArah", response_model=Dict[str, Any])
async def get_masuk_keluar_by_arah(filter: str = "day", db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    # Get date range based on filter
    now = datetime.utcnow()
    if filter == "day":
        start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = now
    elif filter == "week":
        start_date = now - timedelta(days=7)
        end_date = now
    elif filter == "month":
        start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end_date = now
    else:
        raise HTTPException(status_code=400, detail="Invalid filter")
    
    # Get vehicles in date range
    vehicles = db.query(Vehicle).filter(
        Vehicle.timestamp >= start_date,
        Vehicle.timestamp <= end_date
    ).all()
    
    # Count vehicles by direction and type
    data = {
        "in": {
            "car": 0,
            "truck": 0,
            "motorcycle": 0,
            "other": 0
        },
        "out": {
            "car": 0,
            "truck": 0,
            "motorcycle": 0,
            "other": 0
        }
    }
    
    for v in vehicles:
        direction = "in" if v.direction == Direction.IN else "out"
        vehicle_type = v.vehicle_type.value
        data[direction][vehicle_type] += 1
    
    return {
        "data": data,
        "total": len(vehicles)
    }

@router.get("/getRataPerJam", response_model=Dict[str, Any])
async def get_rata_per_jam(filter: str = "day", db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    # Get date range based on filter
    now = datetime.utcnow()
    if filter == "day":
        start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = now
    elif filter == "week":
        start_date = now - timedelta(days=7)
        end_date = now
    elif filter == "month":
        start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end_date = now
    else:
        raise HTTPException(status_code=400, detail="Invalid filter")
    
    # Get vehicles in date range
    vehicles = db.query(Vehicle).filter(
        Vehicle.timestamp >= start_date,
        Vehicle.timestamp <= end_date
    ).all()
    
    # Count vehicles by hour
    hours = {}
    for i in range(24):
        hours[i] = {"in": 0, "out": 0}
    
    for v in vehicles:
        hour = v.timestamp.hour
        direction = "in" if v.direction == Direction.IN else "out"
        hours[hour][direction] += 1
    
    # Format data for chart
    labels = list(range(24))
    in_data = [hours[h]["in"] for h in labels]
    out_data = [hours[h]["out"] for h in labels]
    
    return {
        "labels": labels,
        "data": {
            "in": in_data,
            "out": out_data
        },
        "total": len(vehicles)
    }

@router.get("/getRataPer15Menit", response_model=Dict[str, Any])
async def get_rata_per_15_menit(filter: str = "day", db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    # Get date range based on filter
    now = datetime.utcnow()
    if filter == "day":
        start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = now
    elif filter == "week":
        start_date = now - timedelta(days=7)
        end_date = now
    elif filter == "month":
        start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end_date = now
    else:
        raise HTTPException(status_code=400, detail="Invalid filter")
    
    # Get vehicles in date range
    vehicles = db.query(Vehicle).filter(
        Vehicle.timestamp >= start_date,
        Vehicle.timestamp <= end_date
    ).all()
    
    # Count vehicles by 15-minute intervals
    intervals = {}
    for h in range(24):
        for m in range(0, 60, 15):
            key = f"{h:02d}:{m:02d}"
            intervals[key] = {"in": 0, "out": 0}
    
    for v in vehicles:
        hour = v.timestamp.hour
        minute = (v.timestamp.minute // 15) * 15
        key = f"{hour:02d}:{minute:02d}"
        direction = "in" if v.direction == Direction.IN else "out"
        intervals[key][direction] += 1
    
    # Format data for chart
    labels = sorted(intervals.keys())
    in_data = [intervals[k]["in"] for k in labels]
    out_data = [intervals[k]["out"] for k in labels]
    
    return {
        "labels": labels,
        "data": {
            "in": in_data,
            "out": out_data
        },
        "total": len(vehicles)
    }

@router.get("/getGroupTipeKendaraan", response_model=Dict[str, Any])
async def get_group_tipe_kendaraan(filter: str = "day", db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    # Get date range based on filter
    now = datetime.utcnow()
    if filter == "day":
        start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = now
    elif filter == "week":
        start_date = now - timedelta(days=7)
        end_date = now
    elif filter == "month":
        start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end_date = now
    else:
        raise HTTPException(status_code=400, detail="Invalid filter")
    
    # Get vehicles in date range
    vehicles = db.query(Vehicle).filter(
        Vehicle.timestamp >= start_date,
        Vehicle.timestamp <= end_date
    ).all()
    
    # Count vehicles by type
    vehicle_types = {
        "car": 0,
        "truck": 0,
        "motorcycle": 0,
        "other": 0
    }
    
    for v in vehicles:
        vehicle_type = v.vehicle_type.value
        vehicle_types[vehicle_type] += 1
    
    return {
        "labels": list(vehicle_types.keys()),
        "data": list(vehicle_types.values()),
        "total": len(vehicles)
    }