# app/services/carbon_engine.py

TRANSPORT_FACTORS = {
    "petrol_car": 0.192,
    "diesel_car": 0.171,
    "electric_car": 0.053,
    "motorcycle": 0.114,
    "bus": 0.089,
    "train": 0.041,
    "cycle": 0.0,
    "walking": 0.0,
}

FOOD_FACTORS = {
    "vegan": 30,
    "vegetarian": 50,
    "flexitarian": 70,
    "mixed": 90,
    "high_meat": 150,
}

WASTE_FACTORS = {
    "recycle_always": 10,
    "recycle_sometimes": 20,
    "no_recycling": 40,
}

GRID_INTENSITY = {
    "IN": 0.82,   # India (CEA 2023)
    "US": 0.386,
    "GB": 0.233,
    "DE": 0.364,
    "DEFAULT": 0.5,
}

COUNTRY_AVERAGES = {
    "IN": 150,    # kg CO2 per month average Indian
    "US": 500,
    "GB": 300,
    "DEFAULT": 300,
}

def calculate_transport(
    vehicle_type: str,
    km_per_day: float,
    days_per_week: int
) -> float:
    """Monthly transport emissions in kg CO2."""
    factor = TRANSPORT_FACTORS.get(vehicle_type, 0.0)
    return round(factor * km_per_day * days_per_week * 4.33, 2)

def calculate_electricity(
    monthly_kwh: float,
    country_code: str = "IN"
) -> float:
    """Monthly electricity emissions in kg CO2."""
    factor = GRID_INTENSITY.get(country_code, GRID_INTENSITY["DEFAULT"])
    return round(monthly_kwh * factor, 2)

def calculate_food(diet_type: str) -> float:
    """Monthly food emissions in kg CO2."""
    factor = FOOD_FACTORS.get(diet_type, 90)
    return float(factor)

def calculate_waste(waste_habit: str) -> float:
    """Monthly waste emissions in kg CO2."""
    factor = WASTE_FACTORS.get(waste_habit, 20)
    return float(factor)

def calculate_green_score(total_kg: float, country_code: str = "IN") -> int:
    """
    Score 0-100. Higher = greener.
    Formula: score = max(0, min(100, int((1 - total/country_avg) * 100 + 50)))
    50 = exactly average, >50 = better than average, <50 = worse
    """
    avg = COUNTRY_AVERAGES.get(country_code, COUNTRY_AVERAGES["DEFAULT"])
    score = int((1 - total_kg / avg) * 100 + 50)
    return max(0, min(100, score))

def get_carbon_equivalent(total_kg: float) -> str:
    """
    Return a human-readable equivalent string.
    Examples:
      < 50kg   -> "= {x} km driven by a petrol car"
      50-200kg -> "= {x} trees needed to offset this"
      > 200kg  -> "= {x} flights from Mumbai to Delhi"
    Use these conversion factors:
      1 km petrol car = 0.192 kg
      1 tree absorbs ~21 kg CO2/year = 1.75 kg/month
      Mumbai-Delhi flight = ~150 kg CO2
    """
    if total_kg < 50:
        x = int(round(total_kg / 0.192))
        return f"= {x} km driven by a petrol car"
    elif total_kg <= 200:
        x = int(round(total_kg / 1.75))
        return f"= {x} trees needed to offset this"
    else:
        x = int(round(total_kg / 150))
        return f"= {x} flights from Mumbai to Delhi"

def calculate_full_footprint(
    vehicle_type: str,
    km_per_day: float,
    days_per_week: int,
    monthly_kwh: float,
    diet_type: str,
    waste_habit: str,
    country_code: str = "IN"
) -> dict:
    """
    Master function. Returns the full calculated footprint and breakdowns.
    """
    transport_kg = calculate_transport(vehicle_type, km_per_day, days_per_week)
    electricity_kg = calculate_electricity(monthly_kwh, country_code)
    food_kg = calculate_food(diet_type)
    waste_kg = calculate_waste(waste_habit)
    
    total_kg = round(transport_kg + electricity_kg + food_kg + waste_kg, 2)
    green_score = calculate_green_score(total_kg, country_code)
    equivalent = get_carbon_equivalent(total_kg)
    
    country_avg_kg = float(COUNTRY_AVERAGES.get(country_code, COUNTRY_AVERAGES["DEFAULT"]))
    
    breakdown_pct = {
        "transport": round((transport_kg / total_kg * 100) if total_kg > 0 else 0, 1),
        "electricity": round((electricity_kg / total_kg * 100) if total_kg > 0 else 0, 1),
        "food": round((food_kg / total_kg * 100) if total_kg > 0 else 0, 1),
        "waste": round((waste_kg / total_kg * 100) if total_kg > 0 else 0, 1),
    }

    return {
        "transport_kg": transport_kg,
        "electricity_kg": electricity_kg,
        "food_kg": food_kg,
        "waste_kg": waste_kg,
        "total_kg": total_kg,
        "green_score": green_score,
        "equivalent": equivalent,
        "breakdown_pct": breakdown_pct,
        "country_avg_kg": country_avg_kg,
    }
