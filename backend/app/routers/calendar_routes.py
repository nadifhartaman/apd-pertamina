from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database.database import get_db
from app.models.map import Holiday
from app.schemas.map import Holiday as HolidaySchema, HolidayCreate, HolidayUpdate
from app.utils.auth import get_current_active_user, has_role
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[HolidaySchema])
async def get_all_holidays(
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    skip = (page - 1) * limit
    holidays = db.query(Holiday).offset(skip).limit(limit).all()
    return holidays

@router.get("/{holiday_id}", response_model=HolidaySchema)
async def get_holiday(holiday_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    holiday = db.query(Holiday).filter(Holiday.id == holiday_id).first()
    if not holiday:
        raise HTTPException(status_code=404, detail="Holiday not found")
    return holiday

@router.post("/", response_model=HolidaySchema, status_code=status.HTTP_201_CREATED)
async def create_holiday(holiday: HolidayCreate, db: Session = Depends(get_db), current_user: User = Depends(has_role(["admin"]))):
    db_holiday = Holiday(**holiday.dict())
    db.add(db_holiday)
    db.commit()
    db.refresh(db_holiday)
    return db_holiday

@router.put("/{holiday_id}", response_model=HolidaySchema)
async def update_holiday(holiday_id: int, holiday: HolidayUpdate, db: Session = Depends(get_db), current_user: User = Depends(has_role(["admin"]))):
    db_holiday = db.query(Holiday).filter(Holiday.id == holiday_id).first()
    if not db_holiday:
        raise HTTPException(status_code=404, detail="Holiday not found")
    
    # Update holiday fields if provided
    for key, value in holiday.dict(exclude_unset=True).items():
        setattr(db_holiday, key, value)
    
    db.commit()
    db.refresh(db_holiday)
    return db_holiday

@router.delete("/{holiday_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_holiday(holiday_id: int, db: Session = Depends(get_db), current_user: User = Depends(has_role(["admin"]))):
    db_holiday = db.query(Holiday).filter(Holiday.id == holiday_id).first()
    if not db_holiday:
        raise HTTPException(status_code=404, detail="Holiday not found")
    
    db.delete(db_holiday)
    db.commit()
    return {"detail": "Holiday deleted"}

@router.post("/import", status_code=status.HTTP_200_OK)
async def import_holidays(
    file: UploadFile = File(...),
    mode: str = Form("append"),
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role(["admin"]))
):
    # In a real app, you would parse the Excel file and import holidays
    # For now, we'll just return a success message
    
    return {
        "detail": "Holidays imported successfully",
        "mode": mode,
        "filename": file.filename
    }