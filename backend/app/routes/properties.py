from fastapi import APIRouter

router = APIRouter(prefix="/properties", tags=["properties"])

@router.get("/")
async def list_properties():
    return {"message": "List of properties"}