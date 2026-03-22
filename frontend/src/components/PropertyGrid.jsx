import React from 'react';
import PropertyCard from './PropertyCard';

const PropertyGrid = ({ properties = [] }) => {
  return (
    <div className="property-grid">
      {properties.length === 0 ? (
        <p>Nenhum imóvel encontrado</p>
      ) : (
        properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))
      )}
    </div>
  );
};

export default PropertyGrid;