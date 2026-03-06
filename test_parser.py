from typing import List, Dict, Any, Optional

def mock_parse_text(text: str) -> List[Dict[str, Any]]:
    """
    Simulates the improved parsing logic used in the Azure Function.
    """
    lines: List[str] = [l.strip() for l in text.split('\n') if l.strip()]
    assets: List[Dict[str, Any]] = []
    
    for i, line in enumerate(lines):
        # Must start with a letter, 2-7 chars
        if re.match(r'^[A-Z][A-Z0-9\.]{1,6}$', line):
            ticker: str = line
            qty_val: Optional[float] = None
            price_val: Optional[float] = None
            for j in range(i+1, min(i+6, len(lines))):
                next_line: str = lines[j]
                num_match = re.search(r'[\d,]+\.?\d*', next_line)
                if num_match:
                    val: float = float(num_match.group(0).replace(',', ''))
                    if qty_val is None:
                        qty_val = val
                    elif price_val is None:
                        price_val = val
                        break
            if qty_val is not None and price_val is not None:
                # Deterministic ratios based on ticker
                ticker_hash: int = sum(ord(c) for c in ticker) % 100
                pe: float = 15.0 + (ticker_hash % 20)
                
                # Mock advanced metrics
                beta: float = 0.7 + (ticker_hash / 100.0)
                sharpe: float = 1.0 + (ticker_hash % 10) / 10.0
                
                assets.append({
                    "ticker": ticker,
                    "quantity": qty_val,
                    "price": price_val,
                    "total_value": qty_val * price_val,
                    "company_name": f"{ticker} Corp",
                    "pe_ratio": round(pe, 2),
                    "suggestion": "Healthy Buy" if pe < 30 else "Hold",
                    "advanced_metrics": {
                        "sharpe_ratio": round(sharpe, 2),
                        "beta": round(beta, 2),
                        "alpha": round((ticker_hash % 5), 2)
                    }
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
