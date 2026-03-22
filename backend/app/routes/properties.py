from fastapi import APIRouter, Query, Path, HTTPException
from typing import List, Optional
from starlette.responses import JSONResponse
from app.models.property import Property
from app.services.property_service import PropertyService
from app.db import properties_collection

router = APIRouter(prefix="/properties", tags=["properties"])

property_service = PropertyService(properties_collection)

@router.get("/")
async def get_properties(
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    state: Optional[str] = None,
    city: Optional[str] = None,
    neighborhood: Optional[str] = None,
    property_type: Optional[str] = None,
    auction_status: Optional[str] = None
):
    filters = {}
    if state:
        filters['state'] = state
    if city:
        filters['city'] = city
    if neighborhood:
        filters['neighborhood'] = neighborhood
    if property_type:
        filters['property_type'] = property_type
    if auction_status:
        today_str = datetime.datetime.now().strftime('%Y-%m-%d')
        if auction_status == 'active':
            filters['auction_date'] = {'$gte': today_str}
        elif auction_status == 'finished':
            filters['auction_date'] = {'$lt': today_str}
    skip = (page - 1) * page_size
    properties = await property_service.find_properties(filters, skip=skip, limit=page_size)
    total = await properties_collection.count_documents(filters)
    return {
        "properties": [prop.dict(by_alias=True) for prop in properties],
        "total": total,
        "page": page,
        "pageSize": page_size
    }

@router.get("/filter")
async def get_filters():
    # For simplicity, returning static options; in real case, fetch from database or config
    options = {
        "states": ["SP", "RJ", "MG", "RS"],
        "cities": ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Porto Alegre"],
        "neighborhoods": ["Centro", "Jardim", "Copacabana", "Pinheiros"],
        "propertyTypes": ["Apartamento", "Casa", "Terreno"],
        "auctionTypes": ["Leilão", "Venda Direta"]
    }
    return options

@router.get("/{property_id}")
async def get_property(property_id: str = Path(...)):
    property_obj = await property_service.find_property_by_id(property_id)
    if not property_obj:
        raise HTTPException(status_code=404, detail="Property not found")
    return property_obj.dict(by_alias=True)