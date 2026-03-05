import azure.functions as func
import logging
import os
import json
import re
import datetime
from azure.ai.vision.imageanalysis import ImageAnalysisClient
from azure.ai.vision.imageanalysis.models import VisualFeatures
from azure.core.credentials import AzureKeyCredential
from azure.cosmos import CosmosClient

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

# --- 1. Helper: Financial Analysis Engine ---
def get_financial_metrics(ticker):
    # Mock data for demonstration - in production, this would call a Finance API
    market_data = {
        "AAPL": {"pe": 28.5, "pb": 45.2, "name": "Apple Inc."},
        "MSFT": {"pe": 35.2, "pb": 12.8, "name": "Microsoft Corp."},
        "TSLA": {"pe": 42.1, "pb": 8.5, "name": "Tesla, Inc."},
        "GOOGL": {"pe": 25.4, "pb": 6.2, "name": "Alphabet Inc."},
        "AMZN": {"pe": 40.8, "pb": 7.4, "name": "Amazon.com Inc."},
        "NVDA": {"pe": 65.2, "pb": 32.1, "name": "NVIDIA Corp."}
    }
    
    data = market_data.get(ticker, {"pe": 15.0 + (os.urandom(1)[0] % 20), "pb": 2.0 + (os.urandom(1)[0] % 5), "name": ticker})
    
    pe = data["pe"]
    suggestion = "Neutral"
    if pe < 20: suggestion = "Strong Buy (Undervalued)"
    elif pe < 30: suggestion = "Healthy Buy"
    elif pe < 50: suggestion = "Hold (Fair Value)"
    else: suggestion = "Avoid (Overvalued)"
    
    return {
        "pe_ratio": pe,
        "pb_ratio": data["pb_ratio"] if "pb_ratio" in data else data.get("pb", 3.0),
        "suggestion": suggestion,
        "company_name": data["name"]
    }

# --- 2. Helper Function for OCR and Save ---
def analyze_and_save(image_data, filename):
    endpoint = os.environ["VISION_ENDPOINT"]
    key = os.environ["VISION_KEY"]
    cosmos_url = os.environ["COSMOS_URL"]
    cosmos_key = os.environ["COSMOS_KEY"]
    
    cv_client = ImageAnalysisClient(endpoint=endpoint, credential=AzureKeyCredential(key))
    cosmos_client = CosmosClient(cosmos_url, cosmos_key)
    database = cosmos_client.get_database_client("PortfolioDB")
    container = database.get_container_client("Investments")

    result = cv_client.analyze(image_data=image_data, visual_features=[VisualFeatures.READ])

    extracted_text = ""
    if result.read is not None:
        for block in result.read.blocks:
            for line in block.lines:
                extracted_text += line.text + "\n"
    
    portfolio_data = {
        "id": f"{os.path.basename(filename)}_{os.urandom(4).hex()}",
        "userId": "default_user",
        "filename": filename,
        "raw_text": extracted_text,
        "assets": [],
        "processed_at": str(datetime.datetime.now())
    }

    # Strategy 1: Line-by-line OCR
    lines = [l.strip() for l in extracted_text.split('\n') if l.strip()]
    for i, line in enumerate(lines):
        if re.match(r'^[A-Z]{2,5}$', line):
            ticker = line
            qty_val = None
            price_val = None
            for j in range(i+1, min(i+4, len(lines))):
                next_line = lines[j]
                if qty_val is None and re.match(r'^\d[\d,]*$', next_line):
                    qty_val = int(next_line.replace(',', ''))
                elif price_val is None:
                    price_match = re.search(r'\$?([\d,]+\.?\d*)', next_line)
                    if price_match and qty_val is not None:
                        price_val = float(price_match.group(1).replace(',', ''))
                        break
            if qty_val and price_val:
                metrics = get_financial_metrics(ticker)
                portfolio_data["assets"].append({
                    "ticker": ticker,
                    "company_name": metrics["company_name"],
                    "quantity": qty_val,
                    "price": price_val,
                    "total_value": qty_val * price_val,
                    "pe_ratio": metrics["pe_ratio"],
                    "pb_ratio": metrics["pb_ratio"],
                    "suggestion": metrics["suggestion"]
                })

    # Strategy 2: Same-line format fallback
    if not portfolio_data["assets"]:
        matches = re.findall(r'([A-Z]{2,5})\s+([\d,]+)\s+\$?([\d\.]+)', extracted_text)
        for name, qty, price in matches:
            clean_qty = qty.replace(',', '')
            metrics = get_financial_metrics(name)
            portfolio_data["assets"].append({
                "ticker": name,
                "company_name": metrics["company_name"],
                "quantity": int(clean_qty),
                "price": float(price),
                "total_value": int(clean_qty) * float(price),
                "pe_ratio": metrics["pe_ratio"],
                "pb_ratio": metrics["pb_ratio"],
                "suggestion": metrics["suggestion"]
            })

    container.upsert_item(portfolio_data)
    return portfolio_data

# --- 2. API: Get All Portfolios ---
@app.route(route="get_portfolios", methods=["GET"])
def get_portfolios(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("API: Fetching all portfolios.")
    cosmos_url = os.environ["COSMOS_URL"]
    cosmos_key = os.environ["COSMOS_KEY"]
    cosmos_client = CosmosClient(cosmos_url, cosmos_key)
    database = cosmos_client.get_database_client("PortfolioDB")
    container = database.get_container_client("Investments")
    
    items = list(container.query_items(query="SELECT * FROM c ORDER BY c.processed_at DESC", enable_cross_partition_query=True))
    return func.HttpResponse(json.dumps(items), mimetype="application/json")

# --- 3. API: Direct Upload and Process ---
@app.route(route="upload", methods=["POST"])
def upload_and_process(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("API: Direct upload triggered.")
    try:
        if not req.get_body():
            return func.HttpResponse("No image data received", status_code=400)
        
        result = analyze_and_save(req.get_body(), "web_upload.png")
        return func.HttpResponse(json.dumps(result), mimetype="application/json")
    except Exception as e:
        logging.error(f"Upload error: {e}")
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)

# --- 4. Background: Blob Trigger ---
@app.function_name(name="ProcessPortfolio")
@app.blob_trigger(arg_name="myblob", path="screenshots/{name}", connection="portfolioaccount9914_STORAGE")
def process_portfolio(myblob: func.InputStream):
    logging.info(f"Background Trigger: processing {myblob.name}")
    analyze_and_save(myblob.read(), myblob.name)
