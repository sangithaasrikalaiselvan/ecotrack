# app/schemas/carbon.py
from pydantic import BaseModel, Field
from typing import Literal, Optional

class CarbonCalculateRequest(BaseModel):
    vehicle_type: Literal["petrol_car", "diesel_car", "electric_car",
                          "motorcycle", "bus", "train", "cycle", "walking"]
    km_per_day: float = Field(ge=0, le=1000)
    days_per_week: int = Field(ge=0, le=7)
    monthly_kwh: float = Field(ge=0, le=10000)
    diet_type: Literal["vegan", "vegetarian", "flexitarian", "mixed", "high_meat"]
    waste_habit: Literal["recycle_always", "recycle_sometimes", "no_recycling"]
    country_code: str = Field(default="IN", min_length=2, max_length=2)

class CarbonResult(BaseModel):
    transport_kg: float
    electricity_kg: float
    food_kg: float
    waste_kg: float
    total_kg: float
    green_score: int
    equivalent: str
    breakdown_pct: dict[str, float]
    country_avg_kg: float
    record_id: str

class SimulateRequest(BaseModel):
    base_result: CarbonResult
    reduce_transport_pct: float = Field(default=0, ge=0, le=100)
    reduce_electricity_pct: float = Field(default=0, ge=0, le=100)
    switch_diet_to: Optional[str] = None
    switch_waste_to: Optional[str] = None

class SimulateResult(BaseModel):
    original_kg: float
    projected_kg: float
    reduction_kg: float
    reduction_pct: float
    new_green_score: int
