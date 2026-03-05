import json
import re
import os

def mock_parse_text(text):
    """
    Simulates the parsing logic used in the Azure Function.
    This helps verify regex patterns without needing a live Azure connection.
    """
    assets = []
    # Pattern: StockName Quantity Price
    # Example: APPLE 10 150.25
    matches = re.findall(r'([A-Z][A-Za-z0-9]+)\s+(\d+)\s+([\d\.]+)', text)
    
    for name, qty, price in matches:
        assets.append({
            "ticker": name,
            "quantity": int(qty),
            "price": float(price),
            "total_value": int(qty) * float(price)
        })
    return assets

if __name__ == "__main__":
    # Sample OCR output text for testing
    sample_ocr_text = """
    PORTFOLIO OVERVIEW
    APPLE 50 175.50
    MICROSOFT 10 420.00
    TESLA 5 200.10
    BITCOIN 1 65000.00
    Total Value: 95000.00
    """
    
    print("--- Running Mock Extraction Test ---")
    results = mock_parse_text(sample_ocr_text)
    
    if results:
        print(f"Extracted {len(results)} assets:")
        print(json.dumps(results, indent=4))
    else:
        print("No assets found. Check regex patterns.")
