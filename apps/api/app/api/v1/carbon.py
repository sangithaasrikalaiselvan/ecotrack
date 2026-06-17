from fastapi import APIRouter, HTTPException
from typing import Dict, Any

from app.schemas.carbon import CarbonCalculateRequest, CarbonResult, SimulateRequest, SimulateResult
from app.services.carbon_engine import calculate_full_footprint, calculate_food, calculate_waste, calculate_green_score
from app.services.memory_store import save_record, get_all_records, get_record

router = APIRouter()

@router.post("/calculate", response_model=CarbonResult)
async def calculate(request: CarbonCalculateRequest):
    """Evaluate footprint based on incoming lifestyle values without saving."""
    data = calculate_full_footprint(
        vehicle_type=request.vehicle_type,
        km_per_day=request.km_per_day,
        days_per_week=request.days_per_week,
        monthly_kwh=request.monthly_kwh,
        diet_type=request.diet_type,
        waste_habit=request.waste_habit,
        country_code=request.country_code
    )
    # the schema requires record_id, but it's generated on save.
    data["record_id"] = "unsaved"
    return data

@router.get("/sample", response_model=CarbonResult)
async def sample():
    """Return a hardcoded CarbonResult for an average Indian user so frontend can test."""
    data = calculate_full_footprint(
        vehicle_type="petrol_car",
        km_per_day=15,
        days_per_week=5,
        monthly_kwh=150,
        diet_type="mixed",
        waste_habit="recycle_sometimes",
        country_code="IN"
    )
    data["record_id"] = "sample-id"
    return data

@router.post("/save")
async def save(result: CarbonResult):
    """Persist a CarbonResult in the memory store."""
    record_id = save_record(result.model_dump())
    return {"record_id": record_id, "saved": True}

@router.get("/history")
async def history():
    """Retrieve all saved records from the memory store."""
    records = get_all_records()
    return {"records": records, "count": len(records)}

@router.get("/records/{record_id}")
async def get_record_endpoint(record_id: str):
    """Retrieve a specific record by its UUID."""
    record = get_record(record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return record

@router.post("/simulate", response_model=SimulateResult)
async def simulate(request: SimulateRequest):
    """Simulate projected reductions applied against a base CarbonResult."""
    base = request.base_result
    
    new_transport = base.transport_kg * (1 - request.reduce_transport_pct / 100)
    new_electricity = base.electricity_kg * (1 - request.reduce_electricity_pct / 100)
    
    if request.switch_diet_to:
        new_food = calculate_food(request.switch_diet_to)
    else:
        new_food = base.food_kg
        
    if request.switch_waste_to:
        new_waste = calculate_waste(request.switch_waste_to)
    else:
        new_waste = base.waste_kg
        
    projected_kg = round(new_transport + new_electricity + new_food + new_waste, 2)
    original_kg = base.total_kg
    reduction_kg = round(original_kg - projected_kg, 2)
    reduction_pct = round((reduction_kg / original_kg * 100) if original_kg > 0 else 0.0, 1)
    
    # We lack country_code in CarbonResult, but we can reverse-engineer the score
    # score = int((1 - projected_kg / country_avg) * 100 + 50)
    avg = base.country_avg_kg
    if avg > 0:
        score = int((1 - projected_kg / avg) * 100 + 50)
    else:
        score = 50
    new_score = max(0, min(100, score))
    
    return SimulateResult(
        original_kg=original_kg,
        projected_kg=projected_kg,
        reduction_kg=reduction_kg,
        reduction_pct=reduction_pct,
        new_green_score=new_score
    )
