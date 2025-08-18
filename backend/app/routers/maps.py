from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.database import get_db
from app.models.map import Building
from app.schemas.map import Building as BuildingSchema, BuildingCreate, BuildingUpdate
from app.utils.auth import get_current_active_user, has_role
from app.models.user import User

router = APIRouter()

@router.get("/buildings", response_model=List[BuildingSchema])
async def get_all_buildings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    buildings = db.query(Building).offset(skip).limit(limit).all()
    return buildings

@router.get("/buildings-full", response_model=List[BuildingSchema])
async def get_all_buildings_full(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    buildings = db.query(Building).all()
    return buildings

@router.get("/buildings/{building_id}", response_model=BuildingSchema)
async def get_building(building_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    building = db.query(Building).filter(Building.id == building_id).first()
    if not building:
        raise HTTPException(status_code=404, detail="Building not found")
    return building

@router.post("/buildings", response_model=BuildingSchema, status_code=status.HTTP_201_CREATED)
async def create_building(building: BuildingCreate, db: Session = Depends(get_db), current_user: User = Depends(has_role(["admin"]))):
    db_building = Building(**building.dict())
    db.add(db_building)
    db.commit()
    db.refresh(db_building)
    return db_building

@router.put("/buildings/{building_id}", response_model=BuildingSchema)
async def update_building(building_id: int, building: BuildingUpdate, db: Session = Depends(get_db), current_user: User = Depends(has_role(["admin"]))):
    db_building = db.query(Building).filter(Building.id == building_id).first()
    if not db_building:
        raise HTTPException(status_code=404, detail="Building not found")
    
    # Update building fields if provided
    for key, value in building.dict(exclude_unset=True).items():
        setattr(db_building, key, value)
    
    db.commit()
    db.refresh(db_building)
    return db_building

@router.delete("/buildings/{building_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_building(building_id: int, db: Session = Depends(get_db), current_user: User = Depends(has_role(["admin"]))):
    db_building = db.query(Building).filter(Building.id == building_id).first()
    if not db_building:
        raise HTTPException(status_code=404, detail="Building not found")
    
    db.delete(db_building)
    db.commit()
    return {"detail": "Building deleted"}