import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_health_check():
  async with AsyncClient(
    transport=ASGITransport(app=app), base_url="http://test"
  ) as client:
    response = await client.get('/health')
    assert response.status_code == 200
    assert response.json()['status'] == 'ok'

@pytest.mark.asyncio
async def test_calculate_endpoint():
  async with AsyncClient(
    transport=ASGITransport(app=app), base_url="http://test"
  ) as client:
    response = await client.post('/api/v1/carbon/calculate', json={
      'vehicle_type': 'petrol_car',
      'km_per_day': 15,
      'days_per_week': 5,
      'monthly_kwh': 150,
      'diet_type': 'mixed',
      'waste_habit': 'recycle_sometimes',
      'country_code': 'IN'
    })
    assert response.status_code == 200
    data = response.json()
    assert 'total_kg' in data
    assert 'green_score' in data
    assert data['total_kg'] > 0

@pytest.mark.asyncio
async def test_sample_endpoint():
  async with AsyncClient(
    transport=ASGITransport(app=app), base_url="http://test"
  ) as client:
    response = await client.get('/api/v1/carbon/sample')
    assert response.status_code == 200
    assert 'total_kg' in response.json()

@pytest.mark.asyncio
async def test_simulate_endpoint():
  async with AsyncClient(
    transport=ASGITransport(app=app), base_url="http://test"
  ) as client:
    # First calculate
    calc = await client.post('/api/v1/carbon/calculate', json={
      'vehicle_type': 'petrol_car',
      'km_per_day': 15,
      'days_per_week': 5,
      'monthly_kwh': 150,
      'diet_type': 'mixed',
      'waste_habit': 'recycle_sometimes',
      'country_code': 'IN'
    })
    base = calc.json()
    # Then simulate
    response = await client.post('/api/v1/carbon/simulate', json={
      'base_result': base,
      'reduce_transport_pct': 30,
      'switch_diet_to': 'vegetarian'
    })
    assert response.status_code == 200
    data = response.json()
    assert data['projected_kg'] < data['original_kg']
    assert data['reduction_pct'] > 0

@pytest.mark.asyncio
async def test_invalid_vehicle_type_rejected():
  async with AsyncClient(
    transport=ASGITransport(app=app), base_url="http://test"
  ) as client:
    response = await client.post('/api/v1/carbon/calculate', json={
      'vehicle_type': 'hovercraft',
      'km_per_day': 15,
      'days_per_week': 5,
      'monthly_kwh': 150,
      'diet_type': 'mixed',
      'waste_habit': 'recycle_sometimes',
      'country_code': 'IN'
    })
    assert response.status_code == 422
