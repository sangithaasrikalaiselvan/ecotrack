from fastapi.testclient import TestClient
from app.main import app
import sys

client = TestClient(app)

try:
    print("1. Health Check:")
    r1 = client.get("/health")
    print(r1.json())

    print("\n2. Calculate:")
    calc_data = {
        "vehicle_type": "petrol_car",
        "km_per_day": 15,
        "days_per_week": 5,
        "monthly_kwh": 150,
        "diet_type": "mixed",
        "waste_habit": "recycle_sometimes",
        "country_code": "IN"
    }
    r2 = client.post("/api/v1/carbon/calculate", json=calc_data)
    res2 = r2.json()
    print(res2)

    print("\n3. Sample:")
    r3 = client.get("/api/v1/carbon/sample")
    print(r3.json())

    print("\n4. AI Coach:")
    chat_data = {
        "session_id": "test-session-1",
        "message": "How can I reduce my footprint?",
        "carbon_data": res2
    }
    r4 = client.post("/api/v1/coach/chat", json=chat_data)
    print(r4.json())

    print("\n5. Simulator:")
    sim_data = {
        "base_result": res2,
        "reduce_transport_pct": 30,
        "switch_diet_to": "vegetarian"
    }
    r5 = client.post("/api/v1/carbon/simulate", json=sim_data)
    print(r5.json())

except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
