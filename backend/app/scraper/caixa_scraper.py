import httpx
from bs4 import BeautifulSoup
from datetime import datetime
from typing import List, Dict, Any
import asyncio

BASE_URL = "https://venda-imoveis.caixa.gov.br"
SEARCH_URL = f"{BASE_URL}/busca-imovel.asp"
LOAD_LIST_URL = f"{BASE_URL}/sistema/carregaListaImoveis.asp"
DETAIL_URL_TEMPLATE = f"{BASE_URL}/imovel/{{property_id}}"

async def fetch_hidden_inputs(session: httpx.AsyncClient) -> List[str]:
    """
    Fetch the search page and extract all hidden input values named hdnImov1, hdnImov2, etc.
    """
    response = await session.get(SEARCH_URL)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'lxml')
    inputs = soup.find_all('input', {'type': 'hidden'})
    property_ids = []
    for inp in inputs:
        name = inp.get('name', '')
        if name.startswith('hdnImov'):
            value = inp.get('value', '')
            if value:
                property_ids.extend(value.split('|'))
    return list(set(property_ids))  # Remove duplicates

async def load_property_list(session: httpx.AsyncClient, property_ids: List[str]) -> List[Dict[str, Any]]:
    """
    Send POST request with all property IDs joined by '|', parse the HTML response to extract property cards.
    """
    if not property_ids:
        return []

    payload = {'hdnImov': '|'.join(property_ids)}
    response = await session.post(LOAD_LIST_URL, data=payload)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'lxml')
    properties = []

    # Assuming each property card is within a specific container, e.g., div with class 'property-card'
    cards = soup.find_all('div', class_='property-card')
    for card in cards:
        # Extract basic info
        property_id = ''
        title = ''
        sale_price = 0.0

        # Example extraction, adjust selectors as per actual HTML
        link_tag = card.find('a', href=True)
        if link_tag:
            href = link_tag['href']
            # Extract property_id from URL, assuming pattern
            if 'imovel/' in href:
                property_id = href.split('imovel/')[-1]
        title_tag = card.find('h3')
        if title_tag:
            title = title_tag.get_text(strip=True)
        price_tag = card.find('span', class_='sale-price')
        if price_tag:
            try:
                sale_price = float(price_tag.get_text(strip=True).replace('R$', '').replace('.', '').replace(',', '.'))
            except:
                sale_price = 0.0

        if property_id:
            properties.append({
                'property_id': property_id,
                'title': title,
                'sale_price': sale_price
            })

    return properties

async def fetch_property_details(session: httpx.AsyncClient, property_id: str) -> Dict[str, Any]:
    """
    Fetch the detail page for a property and extract detailed info.
    """
    url = DETAIL_URL_TEMPLATE.format(property_id=property_id)
    response = await session.get(url)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'lxml')

    # Extract details - adjust selectors as per actual HTML structure
    def get_text(selector):
        tag = soup.select_one(selector)
        return tag.get_text(strip=True) if tag else ''

    def get_value(selector):
        tag = soup.select_one(selector)
        if tag:
            text = tag.get_text(strip=True)
            try:
                return float(text.replace('R$', '').replace('.', '').replace(',', '.'))
            except:
                return text
        return None

    # Example selectors, need adjustment based on actual HTML
    property_data = {
        'property_id': property_id,
        'title': get_text('h1.property-title'),
        'state': get_text('.location .state'),
        'city': get_text('.location .city'),
        'neighborhood': get_text('.location .neighborhood'),
        'address': get_text('.address'),
        'property_type': get_text('.property-type'),
        'area': get_value('.area'),
        'bedrooms': int(get_text('.bedrooms')) if get_text('.bedrooms') else 0,
        'parking_spaces': int(get_text('.parking-spaces')) if get_text('.parking-spaces') else 0,
        'sale_price': get_value('.sale-price') or 0.0,
        'evaluation_price': get_value('.evaluation-price') or 0.0,
        'discount_percent': get_value('.discount-percent') or 0.0,
        'occupied': 'Ocupado' in get_text('.status'),
        'accepts_financing': 'Financiamento' in get_text('.tags'),
        'accepts_fgts': 'FGTS' in get_text('.tags'),
        'in_dispute': 'Em disputa' in get_text('.status'),
        'auction_type': get_text('.auction-type'),
        'auction_date': get_text('.auction-date'),
        'auction_status': 'active' if is_auction_active(get_text('.auction-date')) else 'finished',
        'condo_fee': get_value('.condo-fee'),
        'condo_fee_condition': get_text('.condo-fee-condition'),
        'iptu': get_value('.iptu'),
        'iptu_condition': get_text('.iptu-condition'),
        'image_url': get_attribute('.property-image img', 'src'),
        'detail_url': url
    }
    return property_data

def get_attribute(soup_obj, attr):
    tag = soup_obj.select_one