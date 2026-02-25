import os
import glob
import pandas as pd
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = FastAPI()
alerted_pos = set()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Helper to load latest CSV dynamically
# -------------------------
def load_latest_csv(pattern: str):
    """Load the most recent CSV file matching the pattern"""
    list_of_files = glob.glob(pattern)
    if not list_of_files:
        raise FileNotFoundError(f"No files match {pattern}")
    latest_file = max(list_of_files, key=os.path.getmtime)
    return pd.read_csv(latest_file)

# -------------------------
# Dynamic Data Load Functions
# -------------------------
def load_data():
    global supplier_df, po_df, demand_df, inventory_df

    supplier_df = load_latest_csv("data/supplier_master*.csv")
    po_df = load_latest_csv("data/purchase_orders*.csv")
    demand_df = load_latest_csv("data/demand_data*.csv")
    inventory_df = load_latest_csv("data/inventory_ledger*.csv")

    # Convert dates
    po_df["order_date"] = pd.to_datetime(po_df["order_date"])
    po_df["planned_delivery_date"] = pd.to_datetime(po_df["planned_delivery_date"])
    po_df["actual_delivery_date"] = pd.to_datetime(po_df["actual_delivery_date"])

# Load data at startup
load_data()

# -------------------------
# Reusable Filter Function
# -------------------------
def filter_po_data(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    supplier: Optional[str] = None
):
    load_data()
    df = po_df.copy()

    if start_date:
        df = df[df["actual_delivery_date"] >= pd.to_datetime(start_date)]

    if end_date:
        df = df[df["actual_delivery_date"] <= pd.to_datetime(end_date)]

    if supplier:
        df = df[df["supplier_id"] == supplier]

    print("Filtered rows:", len(df))  # debug line

    return df

# -------------------------
# Email Alert Function
# -------------------------
def send_allocation_alert(po_row):
    sender_email = "karan.kumar@varnueai.com"
    receiver_email = "abhishek.damani@varnueai.com"
    password = os.getenv("EMAIL_PASSWORD")

    message = MIMEMultipart()
    message["Subject"] = f"ALERT: Allocation Breach PO {po_row['po_id']}"
    message["From"] = sender_email
    message["To"] = receiver_email

    body = f"""
    ALERT! Allocation breach detected.

    PO ID: {po_row['po_id']}
    Supplier: {po_row['supplier_id']}
    Ordered Quantity: {po_row['ordered_quantity']}
    Received Quantity: {po_row['received_quantity']}
    """
    message.attach(MIMEText(body, "plain"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message.as_string())

# -------------------------
# Basic Routes
# -------------------------
@app.get("/")
def home():
    return {"message": "Supply Chain Dashboard API Running"}

@app.get("/suppliers")
def get_suppliers():
    load_data()
    return supplier_df.to_dict(orient="records")

@app.get("/inventory")
def get_inventory():
    load_data()
    return inventory_df.to_dict(orient="records")

# -------------------------
# KPI Endpoints (Dynamic)
# -------------------------
@app.get("/kpi/stockout-days")
def stockout_days():
    load_data()
    count = inventory_df["stockout_flag"].sum()
    return {"stockout_days": int(count)}

@app.get("/kpi/on-time-delivery")
def on_time_delivery(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    supplier: Optional[str] = Query(None)
):

    df = filter_po_data(start_date, end_date, supplier)
    total = len(df)
    if total == 0:
        return {"on_time_percentage": 0}
    on_time = len(df[df["delay_flag"] == 0])
    return {"on_time_percentage": round((on_time / total) * 100, 2)}

@app.get("/kpi/avg-delay")
def avg_delay(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    supplier: Optional[str] = Query(None)
):
    df = filter_po_data(start_date, end_date, supplier)
    if len(df) == 0:
        return {"avg_delay_days": 0}
    return {"avg_delay_days": round(df["delay_days"].mean(), 2)}

@app.get("/kpi/current-stock")
def current_stock():
    load_data()
    latest = inventory_df.iloc[-1]["closing_stock"]
    return {"current_stock": int(latest)}

@app.get("/kpi/supplier-performance")
def supplier_performance(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None)
):
    df = filter_po_data(start_date, end_date)
    if len(df) == 0:
        return []
    performance = df.groupby("supplier_id")["delay_flag"].mean().reset_index()
    performance["on_time_percentage"] = (1 - performance["delay_flag"]) * 100
    return performance[["supplier_id", "on_time_percentage"]].round(2).to_dict(orient="records")

@app.get("/kpi/allocation-compliance")
def allocation_compliance(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    supplier: Optional[str] = Query(None)
):
    df = filter_po_data(start_date, end_date, supplier)
    total = len(df)
    if total == 0:
        return {"allocation_compliance_percentage": 0}
    compliant = len(df[df["allocation_breach_flag"] == 0])
    return {"allocation_compliance_percentage": round((compliant / total) * 100, 2)}

@app.get("/kpi/supplier-allocation-compliance")
def supplier_allocation_compliance(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None)
):
    df = filter_po_data(start_date, end_date)
    if len(df) == 0:
        return []
    grouped = df.groupby("supplier_id")["allocation_breach_flag"].mean().reset_index()
    grouped["allocation_compliance_percentage"] = (1 - grouped["allocation_breach_flag"]) * 100
    return grouped[["supplier_id", "allocation_compliance_percentage"]].round(2).to_dict(orient="records")

# -------------------------
# Alerts Endpoint
# -------------------------
@app.get("/alerts/allocation-breach")
def allocation_breach_alerts(date: str):
    load_data()

    target_date = pd.to_datetime(date)

    df = po_df[
        po_df["actual_delivery_date"] == target_date
    ]

    breaches = df[df["received_quantity"] > df["ordered_quantity"]]

    emails_sent = []

    for _, row in breaches.iterrows():
        if row["po_id"] not in alerted_pos:
            send_allocation_alert(row)
            alerted_pos.add(row["po_id"])
            emails_sent.append(row["po_id"])

    return {
        "date_checked": date,
        "breaches_detected": len(breaches),
        "emails_sent_for_po_ids": emails_sent
    }

# -------------------------
# Chatbot Endpoint
# -------------------------
@app.post("/chatbot")
def chatbot(query: str):
    load_data()
    query_lower = query.lower()
    if "on-time delivery" in query_lower:
        total = len(po_df)
        on_time = len(po_df[po_df["delay_flag"] == 0])
        return {"response": f"On-time delivery is {round((on_time/total)*100, 2)}%"}
    elif "allocation breach" in query_lower:
        breaches = po_df[po_df["allocation_breach_flag"] == 1]
        return {"response": f"There are {len(breaches)} allocation breaches."}
    elif "stockout" in query_lower:
        count = inventory_df["stockout_flag"].sum()
        return {"response": f"Stockout days: {count}"}
    else:
        return {"response": "I can answer only about KPIs and suppliers for now."}