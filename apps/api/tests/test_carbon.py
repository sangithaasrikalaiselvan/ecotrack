from app.services.carbon_engine import (
  calculate_transport,
  calculate_electricity,
  calculate_food,
  calculate_waste,
  calculate_green_score,
  calculate_full_footprint,
)

class TestCalculateTransport:
  def test_cycle_returns_zero(self):
    assert calculate_transport('cycle', 10, 5) == 0.0

  def test_walking_returns_zero(self):
    assert calculate_transport('walking', 10, 5) == 0.0

  def test_petrol_car_correct(self):
    result = calculate_transport('petrol_car', 15, 5)
    assert abs(result - 62.4) < 1.0

  def test_unknown_vehicle_returns_zero(self):
    assert calculate_transport('hovercraft', 10, 5) == 0.0

  def test_zero_km_returns_zero(self):
    assert calculate_transport('petrol_car', 0, 5) == 0.0

  def test_zero_days_returns_zero(self):
    assert calculate_transport('petrol_car', 15, 0) == 0.0

class TestCalculateElectricity:
  def test_india_grid_intensity(self):
    result = calculate_electricity(100, 'IN')
    assert abs(result - 82.0) < 0.1

  def test_us_grid_intensity(self):
    result = calculate_electricity(100, 'US')
    assert abs(result - 38.6) < 0.1

  def test_unknown_country_uses_default(self):
    result = calculate_electricity(100, 'ZZ')
    assert result == 50.0  # DEFAULT 0.5

  def test_zero_kwh_returns_zero(self):
    assert calculate_electricity(0, 'IN') == 0.0

class TestCalculateFood:
  def test_vegan(self):
    assert calculate_food('vegan') == 30

  def test_high_meat(self):
    assert calculate_food('high_meat') == 150

  def test_unknown_returns_default(self):
    assert calculate_food('unknown') == 90

class TestCalculateWaste:
  def test_recycle_always(self):
    assert calculate_waste('recycle_always') == 10

  def test_no_recycling(self):
    assert calculate_waste('no_recycling') == 40

  def test_unknown_returns_default(self):
    assert calculate_waste('unknown') == 20

class TestGreenScore:
  def test_exactly_average_returns_50(self):
    assert calculate_green_score(300, 300) == 50

  def test_below_average_above_50(self):
    assert calculate_green_score(150, 300) > 50

  def test_never_exceeds_100(self):
    assert calculate_green_score(0, 300) <= 100

  def test_never_below_zero(self):
    assert calculate_green_score(9999, 300) >= 0

class TestFullFootprint:
  def test_returns_all_fields(self):
    result = calculate_full_footprint(
      vehicle_type='petrol_car',
      km_per_day=15,
      days_per_week=5,
      monthly_kwh=150,
      diet_type='mixed',
      waste_habit='recycle_sometimes',
      country_code='IN'
    )
    assert 'transport_kg' in result
    assert 'electricity_kg' in result
    assert 'food_kg' in result
    assert 'waste_kg' in result
    assert 'total_kg' in result
    assert 'green_score' in result
    assert 'equivalent' in result
    assert 'breakdown_pct' in result

  def test_breakdown_pct_sums_to_100(self):
    result = calculate_full_footprint(
      'petrol_car', 15, 5, 150, 'mixed', 'recycle_sometimes', 'IN'
    )
    total_pct = sum(result['breakdown_pct'].values())
    assert abs(total_pct - 100.0) < 0.1

  def test_total_equals_sum_of_parts(self):
    result = calculate_full_footprint(
      'petrol_car', 15, 5, 150, 'mixed', 'recycle_sometimes', 'IN'
    )
    expected = (
      result['transport_kg'] +
      result['electricity_kg'] +
      result['food_kg'] +
      result['waste_kg']
    )
    assert abs(result['total_kg'] - expected) < 0.01
