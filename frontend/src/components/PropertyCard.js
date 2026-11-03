import { useState } from 'react';
import { getFirstPhoto } from '../utils/photos';
import './PropertyCard.css';

function formatPrice(price) {
  return price == null ? 'Price unavailable' : `$${Number(price).toLocaleString()}`;
}

function formatNumber(value) {
  return value == null ? '—' : Number(value).toLocaleString();
}

export default function PropertyCard({ property }) {
  const photo = getFirstPhoto(property.photos);
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="property-card">
      {photo && !imageFailed ? (
        <img
          className="property-card__photo"
          src={photo}
          alt={property.address || 'Property photo'}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="property-card__photo property-card__photo--empty">No photo available</div>
      )}

      <ul className="property-card__details">
        <li>{formatPrice(property.price)}</li>
        <li>{property.address || 'Address unavailable'}</li>
        <li>{[property.city, property.state].filter(Boolean).join(', ')}</li>
        <li>{formatNumber(property.beds)} beds</li>
        <li>{formatNumber(property.baths)} baths</li>
        <li>{formatNumber(property.sqft)} sqft</li>
      </ul>
    </article>
  );
}
