import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProperty } from '../services/api';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProperty(parseInt(id))
      .then((data) => {
        setProperty(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Erro ao carregar detalhes do imóvel.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!property) {
    return <p>Imóvel não encontrado.</p>;
  }

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
    <div className="container p-4">
      <h1 className="text-2xl font-semibold mb-4">Detalhes do Imóvel</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <img src={image} alt="Property" className="w-full md:w-1/2 h-64 object-cover rounded" />
        <div className="flex-1 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">{propertyType}</h2>
          <p className="mb-2">{address}</p>
          <p className="mb-2">{city}/{state}</p>
          <p className="mb-2">
            <strong>Preço de venda:</strong> R$ {salePrice.toLocaleString()}
          </p>
          <p className="mb-2">
            <strong>Avaliação:</strong> R$ {evaluationPrice.toLocaleString()}
          </p>
          <p className="mb-2">
            <strong>Desconto:</strong> {discountPercent}%
          </p>
          <div className="mb-2 flex flex-wrap gap-2">
            {tags.includes('FGTS') && <span className="tag">FGTS</span>}
            {tags.includes('Financing') && <span className="tag">Financiamento</span>}
            {tags.includes('In dispute') && <span className="tag">Em disputa</span>}
            {tags.includes('Occupied') && <span className="tag">Ocupado</span>}
          </div>
          <p className="mb-2">
            <strong>Data do leilão:</strong> {auctionDate}
          </p>
          <p className="mb-2">
            <strong>Área:</strong> {area} m²
          </p>
          <p className="mb-2">
            <strong>Quartos:</strong> {bedrooms}
          </p>
          <p className="mb-2">
            <strong>Vagas de estacionamento:</strong> {parkingSpaces}
          </p>
          <p className="mb-2">
            <strong>Status:</strong> {occupied ? 'Ocupado' : 'Disponível'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;