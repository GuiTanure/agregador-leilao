from fastapi import APIRouter, HTTPException
from starlette.responses import JSONResponse
import httpx
from app.scraper.caixa_scraper import fetch_hidden_inputs, load_property_list, load_property_details
import asyncio
import datetime
from typing import Dict, Any

router = APIRouter(prefix="/scraper", tags=["scraper"])

@router.post("/scrape")
async def run_caixa_scrape():
    """
    Trigger the Caixa scraper to fetch properties and save them to the database.
    """
    import app.db as db_module
    from app.services.property_service import PropertyService

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
                tasks.append(load_property_details(session, prop_id))
            detailed_properties = await asyncio.gather(*tasks)

            # Step 4: Save/update properties in database
            for prop_data in detailed_properties:
                if prop_data:
                    await property_service.upsert_property(prop_data)

            return JSONResponse(content={"status": "success", "message": "Properties scraped and saved."})
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))