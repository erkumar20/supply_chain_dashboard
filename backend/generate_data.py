import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

np.random.seed(42)

# -----------------------------
# 1️⃣ PARAMETERS
# -----------------------------
start_date = datetime(2025, 1, 1)
end_date = datetime(2025, 6, 30)
dates = pd.date_range(start_date, end_date)

raw_material_id = "RM-STEEL-01"

suppliers = [
    {"supplier_id": "S1", "supplier_name": "Alpha Metals", "allocation": 0.5, "lead_time": 5},
    {"supplier_id": "S2", "supplier_name": "Beta Alloys", "allocation": 0.3, "lead_time": 7},
    {"supplier_id": "S3", "supplier_name": "Gamma Steels", "allocation": 0.2, "lead_time": 4},
]

# -----------------------------
# 2️⃣ SUPPLIER MASTER TABLE
# -----------------------------
supplier_master = pd.DataFrame(suppliers)
supplier_master["cost_per_unit"] = np.random.randint(90, 120, size=3)
supplier_master["quality_rating"] = np.random.uniform(3.5, 5.0, size=3).round(2)

# -----------------------------
# 3️⃣ DEMAND GENERATION
# -----------------------------
demand_data = []

base_demand = 300

for date in dates:
    seasonal_factor = 1.2 if date.month in [5, 6] else 1
    demand = int((base_demand + np.random.randint(-40, 60)) * seasonal_factor)
    
    demand_data.append({
        "date": date,
        "raw_material_id": raw_material_id,
        "actual_demand": demand
    })

demand_data = pd.DataFrame(demand_data)

# -----------------------------
# 4️⃣ PURCHASE ORDER GENERATION
# -----------------------------
purchase_orders = []
po_counter = 1

for date in dates:
    
    daily_demand = demand_data.loc[demand_data["date"] == date, "actual_demand"].values[0]
    
    for supplier in suppliers:
        
        allocated_qty = daily_demand * supplier["allocation"]
        
        # Add realistic variation ±10%
        actual_order_qty = int(allocated_qty * np.random.normal(1, 0.1))
        allocation_breach_flag = 1 if actual_order_qty > allocated_qty else 0
        
        lead_time = supplier["lead_time"]
        
        planned_delivery = date + timedelta(days=lead_time)
        
        # Random delay
        delay_days = np.random.choice(
            [0, 1, 2, 3, 5],
            p=[0.6, 0.2, 0.1, 0.07, 0.03]
        )
        
        actual_delivery = planned_delivery + timedelta(days=int(delay_days))
        
        purchase_orders.append({
            "po_id": f"PO{po_counter}",
            "supplier_id": supplier["supplier_id"],
            "raw_material_id": raw_material_id,
            "order_date": date,
            "planned_delivery_date": planned_delivery,
            "actual_delivery_date": actual_delivery,
            "ordered_quantity": actual_order_qty,
            "received_quantity": actual_order_qty - np.random.randint(0, 5),
            "delay_days": delay_days,
            "delay_flag": 1 if delay_days > 0 else 0,
            "allocation_breach_flag": allocation_breach_flag
        })
        
        po_counter += 1

purchase_orders = pd.DataFrame(purchase_orders)

# -----------------------------
# 5️⃣ INVENTORY LEDGER
# -----------------------------
inventory_records = []

opening_stock = 5000
safety_stock = 1000

for date in dates:
    
    received_today = purchase_orders.loc[
        purchase_orders["actual_delivery_date"] == date,
        "received_quantity"
    ].sum()
    
    consumed_today = demand_data.loc[
        demand_data["date"] == date,
        "actual_demand"
    ].values[0]
    
    closing_stock = opening_stock + received_today - consumed_today
    
    inventory_records.append({
        "date": date,
        "raw_material_id": raw_material_id,
        "opening_stock": opening_stock,
        "received_quantity": received_today,
        "consumed_quantity": consumed_today,
        "closing_stock": closing_stock,
        "safety_stock_level": safety_stock,
        "stockout_flag": 1 if closing_stock < safety_stock else 0
    })
    
    opening_stock = closing_stock

inventory_ledger = pd.DataFrame(inventory_records)

# -----------------------------
# 6️⃣ EXPORT TO CSV (Optional)
# -----------------------------
supplier_master.to_csv("backend/supplier_master.csv", index=False)
purchase_orders.to_csv("backend/purchase_orders.csv", index=False)
demand_data.to_csv("backend/demand_data.csv", index=False)
inventory_ledger.to_csv("backend/inventory_ledger.csv", index=False)

print("Data generation complete ✅")