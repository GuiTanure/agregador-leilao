from pydantic import BaseModel, Field
from typing import List, Optional

class Property(BaseModel):
    property_id: str = Field(..., alias="id")
    image: str
    property_type: str
    address: str
    city: str
    state: str
    sale_price: float
    evaluation_price: float
    discount_percent: float
    tags: List[str]
    auction_date: str
    area: float
    bedrooms: int
    parking_spaces: int
    occupied: bool
    condo_fee: Optional[float]
    condo_fee_condition: Optional[str]
    iptu: Optional[float]
    iptu_condition: Optional[str]
    detail_url: str

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "id": "123456",
                "image": "https://example.com/image.jpg",
                "property_type": "Apartamento",
                "address": "Rua das Flores, 123",
                "city": "São Paulo",
                "state": "SP",
                "sale_price": 250000.0,
                "evaluation_price": 300000.0,
                "discount_percent": 16.67,
                "tags": ["FGTS", "Financing"],
                "auction_date": "2023-12-15",
                "area": 85.0,
                "bedrooms": 2,
                "parking_spaces": 1,
                "occupied": False,
                "condo_fee": 300.0,
                "condo_fee_condition": "Monthly",
                "iptu": 1500.0,
                "iptu_condition": "Annual",
                "detail_url": "https://venda-imoveis.caixa.gov.br/imovel/123456"
            }
        }