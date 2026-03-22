import React from 'react';

const PropertyCard = ({ property }) => {
  const {
    image,
    propertyType,
    address,
    city,
    state,
    salePrice,
    evaluationPrice,
    discountPercent,
    tags,
    auctionDate,
    area,
    bedrooms,
    parkingSpaces,
    occupied,
  } = property;

  return (
    <div className="card flex flex-col">
      <img src={image} alt="Property" className="w-full h-48 object-cover rounded mb-2" />
      <div className="flex flex-col flex-1">
        <h3 className="text-lg font-semibold mb-1">{propertyType}</h3>
        <p className="mb-1">{address}</p>
        <p className="mb-1">{city}/{state}</p>
        <div className="mb-2">
          <span className="font-semibold">Preço de venda:</span> R$ {salePrice.toLocaleString()}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Avaliação:</span> R$ {evaluationPrice.toLocaleString()}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Desconto:</span> {discountPercent}%
        </div>
        <div className="mb-2 flex flex-wrap gap-2">
          {tags.includes('FGTS') && <span className="tag">FGTS</span>}
          {tags.includes('Financing') && <span className="tag">Financiamento</span>}
          {tags.includes('In dispute') && <span className="tag">Em disputa</span>}
          {tags.includes('Occupied') && <span className="tag">Ocupado</span>}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Data do leilão:</span> {auctionDate}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Área:</span> {area} m²
        </div>
        <div className="mb-2">
          <span className="font-semibold">Quartos:</span> {bedrooms}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Vagas de estacionamento:</span> {parkingSpaces}
        </div>
        <button className="mt-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
          Ver detalhes
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;