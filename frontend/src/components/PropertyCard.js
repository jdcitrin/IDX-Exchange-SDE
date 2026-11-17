import { useNavigate } from 'react-router-dom';
import PropertyImageCarousel from './PropertyImageCarousel';
import './PropertyCard.css';

function formatPrice(price) {
  return price == null ? 'Price unavailable' : `$${Number(price).toLocaleString()}`;
}

function formatNumber(value) {
  return value == null ? '—' : Number(value).toLocaleString();
}

// one listing card that opens the detail page
export default function PropertyCard({ property }) {
  const navigate = useNavigate();

  return (
    <article className="property-card" onClick={() => navigate(`/property/${property.listingId}`)}>
      <PropertyImageCarousel rawPhotos={property.photos} alt={property.address || 'Property photo'} />

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
