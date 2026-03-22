import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProperty } from '../services/api';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProperty(id)
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
    property_type,
    address,
    city,
    state,
    sale_price,
    evaluation_price,
    discount_percent,
    tags,
    auction_date,
    area,
    bedrooms,
    parking_spaces,
    occupied,
  } = property;

  return (
    <div className="container p-4">
      <h1 className="text-2xl font-semibold mb-4">Detalhes do Imóvel</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <img src={image} alt="Property" className="w-full md:w-1/2 h-64 object-cover rounded" />
        <div className="flex-1 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">{property_type}</h2>
          <p className="mb-2">{address}</p>
          <p className="mb-2">{city}/{state}</p>
          <p className="mb-2">
            <strong>Preço de venda:</strong> R$ {sale_price.toLocaleString()}
          </p>
          <p className="mb-2">
            <strong>Avaliação:</strong> R$ {evaluation_price.toLocaleString()}
          </p>
          <p className="mb-2">
            <strong>Desconto:</strong> {discount_percent}%
          </p>
          <div className="mb-2 flex flex-wrap gap-2">
            {tags && tags.includes('FGTS') && <span className="tag">FGTS</span>}
            {tags && tags.includes('Financing') && <span className="tag">Financiamento</span>}
            {tags && tags.includes('In dispute') && <span className="tag">Em disputa</span>}
            {tags && tags.includes('Occupied') && <span className="tag">Ocupado</span>}
          </div>
          <p className="mb-2">
            <strong>Data do leilão:</strong> {auction_date}
          </p>
          <p className="mb-2">
            <strong>Área:</strong> {area} m²
          </p>
          <p className="mb-2">
            <strong>Quartos:</strong> {bedrooms}
          </p>
          <p className="mb-2">
            <strong>Vagas de estacionamento:</strong> {parking_spaces}
          </p>
          <p className="mb-2">
            <strong>Ocupado:</strong> {occupied ? 'Sim' : 'Não'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;