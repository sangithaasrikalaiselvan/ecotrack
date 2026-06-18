import pytest
from app.services.carbon_engine import (
    calculate_transport,
    calculate_electricity,
    calculate_food,
    calculate_waste,
    calculate_green_score,
)

def test_calculate_transport():
    # Test valid transport
    kg = calculate_transport("petrol_car", 10, 5)
    assert kg > 0
    # Test zero emissions
    assert calculate_transport("walking", 10, 5) == 0.0
    # Test unknown type
    assert calculate_transport("unknown_type", 10, 5) == 0.0

def test_calculate_electricity():
    kg = calculate_electricity(100)
    assert kg > 0
    assert calculate_electricity(0) == 0.0

def test_calculate_food():
    assert calculate_food("vegan") > 0
    assert calculate_food("meat_heavy") > calculate_food("vegan")
    assert calculate_food("unknown") == 90.0 # default fallback

def test_calculate_waste():
    assert calculate_waste("recycle_all") > 0
    assert calculate_waste("no_recycling") > calculate_waste("recycle_all")
    assert calculate_waste("unknown") == 20.0 # default fallback

def test_calculate_green_score():
    score1 = calculate_green_score(50.0, "IN")
    assert 0 <= score1 <= 100
    
    score2 = calculate_green_score(500.0, "IN")
    assert 0 <= score2 <= 100
    
    assert score1 > score2
