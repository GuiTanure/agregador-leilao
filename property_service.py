from typing import List, Dict, Any, Optional
from motor.motor_asyncio import AsyncIOMotorCollection
from app.models.property import Property
from bson import ObjectId
from datetime import datetime

class PropertyService:
    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection

    async def upsert_property(self, property_data: Dict[str, Any]) -> None:
        """
        Insert or update a property based on property_id.
        """
        property_id = property_data.get("property_id")
        if not property_id:
            return
        await self.collection.update_one(
            {"property_id": property_id},
            {"$set": property_data},
            upsert=True
        )

    async def find_property_by_id(self, property_id: str) -> Optional[Property]:
        """
        Find a property by its property_id.
        """
        data = await self.collection.find_one({"property_id": property_id})
        if data:
            return Property(**data)
        return None

    async def find_properties(self, filters: Dict[str, Any], skip: int = 0, limit: int = 20) -> List[Property]:
        """
        Find properties matching filters with pagination.
        """
        cursor = self.collection.find(filters).skip(skip).limit(limit)
        results = []
        async for doc in cursor:
            results.append(Property(**doc))
        return results

    async def get_stats(self) -> Dict[str, int]:
        """
        Return statistics: total, active, finished.
        """
        total = await self.collection.count_documents({})
        today_str = datetime.now().strftime('%Y-%m-%d')
        active = await self.collection.count_documents({"auction_date": {"$gte": today_str}})
        finished = total - active
        return {
            "total": total,
            "active": active,
            "finished": finished
        }