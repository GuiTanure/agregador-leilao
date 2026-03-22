from fastapi import APIRouter, HTTPException
from starlette.responses import JSONResponse
from app.scraper.caixa_scraper import fetch_hidden_inputs, load_property_list
import asyncio
import datetime

router = APIRouter(prefix="/scraper", tags=["scraper"])

@router.post("/scrape")
async def run_caixa_scrape():
    """
    Trigger the Caixa scraper to fetch properties and save them to the database.
    """
    import app.db as db_module
    from app.services.property_service import PropertyService

    # Initialize database collection and service
    collection = db_module.properties_collection
    property_service = PropertyService(collection)

    async with httpx.AsyncClient() as session:
        try:
            # Step 1: Fetch hidden inputs with property IDs
            property_ids = await fetch_hidden_inputs(session)

            # Step 2: Load property list HTML and parse basic info
            property_list = await load_property_list(session, property_ids)

            # Step 3: For each property, fetch detailed info
            tasks = []
            for prop in property_list:
                prop_id = prop.get("property_id")
                if not prop_id:
                    continue
                tasks.append(fetch_property_details(session, prop_id))
            detailed_properties = await asyncio.gather(*tasks)

            # Step 4: Save/update properties in database
            for prop_data in detailed_properties:
                if prop_data:
                    await property_service.upsert_property(prop_data)

            return JSONResponse(content={"status": "success", "message": "Properties scraped and saved."})
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

async def fetch_property_details(session: httpx.AsyncClient, property_id: str) -> Dict[str, Any]:
    """
    Fetch detailed property info from the detail page.
    """
    detail_url = f"https://venda-imoveis.caixa.gov.br/imovel/{property_id}"
    response = await session.get(detail_url)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'lxml')

    # Extract details from the detail page
    # Adjust selectors as per actual HTML structure
    property_data = {
        "property_id": property_id,
        "title": "",
        "state": "",
        "city": "",
        "neighborhood": "",
        "address": "",
        "property_type": "",
        "area": 0.0,
        "bedrooms": 0,
        "parking_spaces": 0,
        "sale_price": 0.0,
        "evaluation_price": 0.0,
        "discount_percent": 0.0,
        "occupied": False,
        "accepts_financing": False,
        "accepts_fgts": False,
        "in_dispute": False,
        "auction_type": "",
        "auction_date": "",
        "auction_status": "active",
        "condo_fee": None,
        "condo_fee_condition": None,
        "iptu": None,
        "iptu_condition": None,
        "image_url": "",
        "detail_url": detail_url
    }

    # Example extraction, replace with actual selectors
    # For illustration purposes only
    title_tag = soup.find('h1', class_='property-title')
    if title_tag:
        property_data["title"] = title_tag.text.strip()

    # Extract other fields similarly...
    # For brevity, only some fields are assigned here
    # In real implementation, parse the HTML accordingly

    # Example: extract auction date and determine status
    auction_date_str = "2023-12-15"  # Placeholder, parse from HTML
    property_data["auction_date"] = auction_date_str
    try:
        auction_date_obj = datetime.datetime.strptime(auction_date_str, "%Y-%m-%d").date()
        today = datetime.date.today()
        if auction_date_obj >= today:
            property_data["auction_status"] = "active"
        else:
            property_data["auction_status"] = "finished"
    except:
        property_data["auction_status"] = "active"

    return property_data