import json
import re
import os

def mock_parse_text(text):
    """
    Simulates the improved parsing logic used in the Azure Function.
    """
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    assets = []
    
    for i, line in enumerate(lines):
        # Must start with a letter, 2-7 chars
        if re.match(r'^[A-Z][A-Z0-9\.]{1,6}$', line):
            ticker = line
            qty_val = None
            price_val = None
            for j in range(i+1, min(i+6, len(lines))):
                next_line = lines[j]
                num_match = re.search(r'[\d,]+\.?\d*', next_line)
                if num_match:
                    val = float(num_match.group(0).replace(',', ''))
                    if qty_val is None:
                        qty_val = val
                    elif price_val is None:
                        price_val = val
                        break
            if qty_val is not None and price_val is not None:
                assets.append({
                    "ticker": ticker,
                    "quantity": qty_val,
                    "price": price_val,
                    "total_value": qty_val * price_val
                })
    return assets

if __name__ == "__main__":
    test_cases = [
        {
            "name": "Standard Portfolio",
            "text": "AAPL\n50\n175.50\nMSFT\n10\n420.00"
        },
        {
            "name": "Crypto & Decimals",
            "text": "BTC\n0.125\n65,000.00\nETH\n2.5\n3,400.50"
        },
        {
            "name": "Alphanumeric Tickers",
            "text": "BRK.B\n5\n400.20\n1234.HK\n1000\n55.50"
        }
    ]
    
    for case in test_cases:
        print(f"--- Running Test: {case['name']} ---")
        results = mock_parse_text(case['text'])
        print(json.dumps(results, indent=4))
        print()
