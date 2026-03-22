# helpers.py
import re
from datetime import datetime
from bs4 import BeautifulSoup
from typing import Dict, Any, Optional

def extract_property_id_from_url(url: str) -> Optional[str]:
    """
    Extract property ID from URL pattern.
    Example URL: /imovel/123456
    """
    match = re.search(r'/imovel/(\d+)', url)
    if match:
        return match.group(1)
    return None

def parse_price(price_str: str) -> float:
    """
    Parse a price string like 'R$ 250.000,00' to float.
    """
    if not price_str:
        return 0.0
    price_str = price_str.replace('R$', '').replace('.', '').replace(',', '.').strip()
    try:
        return float(price_str)
    except ValueError:
        return 0.0

def parse_boolean(text: str) -> bool:
    """
    Parse text to boolean.
    """
    return text.strip().lower() in ['sim', 'true', 'yes', '1']

def parse_date(date_str: str) -> str:
    """
    Parse date string to ISO format (YYYY-MM-DD).
    """
    try:
        dt = datetime.strptime(date_str, '%d/%m/%Y')
        return dt.strftime('%Y-%m-%d')
    except ValueError:
        return ''

def get_text_or_default(soup: BeautifulSoup, selector: str, default: str = '') -> str:
    """
    Helper to get text content from a selector or default.
    """
    tag = soup.select_one(selector)
    return tag.get_text(strip=True) if tag else default

def get_attribute_or_default(soup: BeautifulSoup, selector: str, attr: str, default: str = '') -> str:
    """
    Helper to get attribute value from a selector or default.
    """
    tag = soup.select_one(selector)
    return tag[attr] if tag and attr in tag.attrs else default

def clean_number(text: str) -> float:
    """
    Clean number string and convert to float.
    """
    if not text:
        return 0.0
    text = text.replace('.', '').replace(',', '.').strip()
    try:
        return float(text)
    except ValueError:
        return 0.0
```