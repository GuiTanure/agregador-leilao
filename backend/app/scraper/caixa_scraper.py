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
        property_id = ''
        title = ''
        sale_price = 0.0

        # Extract property_id from link
        link_tag = card.find('a', href=True)
        if link_tag:
            href = link_tag['href']
            # Example pattern: /imovel/123456
            parts = href.split('/')
            if len(parts) >= 3:
                property_id = parts[-1]
            # Extract title
            title_tag = card.find('h3')
            if title_tag:
                title = title_tag.get_text(strip=True)
            # Extract sale price
            price_tag = card.find('span', class_='sale-price')
            if price_tag:
                price_text = price_tag.get_text(strip=True).replace('R$', '').replace('.', '').replace(',', '.')
                try:
                    sale_price = float(price_text)
                except:
                    sale_price = 0.0
            properties.append({
                'property_id': property_id,
                'title': title,
                'sale_price': sale_price
            })
    return properties

async def fetch_property_details(session: httpx.AsyncClient, property_id: str) -> Dict[str, Any]:
    """
    Fetch detailed property info from the detail page.
    """
    detail_url = DETAIL_URL_TEMPLATE.format(property_id=property_id)
    response = await session.get(detail_url)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'lxml')

    def get_text(selector):
        tag = soup.select_one(selector)
        return tag.get_text(strip=True) if tag else ''

    def get_float(selector):
        text = get_text(selector).replace('R$', '').replace('.', '').replace(',', '.')
        try:
            return float(text)
        except:
            return None

    def get_int(selector):
        text = get_text(selector)
        try:
            return int(text)
        except:
            return None

    # Extract basic info
    property_data = {
        'property_id': property_id,
        'title': get_text('h1.property-title'),
        'state': get_text('span.state'),
        'city': get_text('span.city'),
        'neighborhood': get_text('span.neighborhood'),
        'address': get_text('span.address'),
        'property_type': get_text('span.property-type'),
        'area': get_float('span.area'),
        'bedrooms': get_int('span.bedrooms'),
        'parking_spaces': get_int('span.parking-spaces'),
        'sale_price': get_float('span.sale-price'),
        'evaluation_price': get_float('span.evaluation-price'),
        'discount_percentage': get_float('span.discount-percentage'),
        'occupied': 'Occupied' in get_text('span.status'),
        'accepts_financing': 'Financing' in get_text('span.tags'),
        'accepts_fgts': 'FGTS' in get_text('span.tags'),
        'in_dispute': 'In Dispute' in get_text('span.status'),
        'auction_type': get_text('span.auction-type'),
        'auction_date': get_text('span.auction-date'),
        'auction_status': 'active' if get_text('span.auction-date') >= datetime.now().strftime('%Y-%m-%d') else 'finished',
        'condo_fee': get_float('span.condo-fee'),
        'condo_fee_condition': get_text('span.condo-fee-condition'),
        'iptu': get_float('span.iptu'),
        'iptu_condition': get_text('span.iptu-condition'),
        'image_url': get_text('img.property-image')['src'] if soup.find('img', class_='property-image') else '',
        'detail_url': detail_url
    }
    return property_data

async def run():
    """
    Main function to run the scraper.
    """
    async