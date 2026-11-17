import { useState } from 'react';
import { parsePhotos } from '../utils/photos';

// photo slider for a listing card
export default function PropertyImageCarousel({ rawPhotos, alt }) {
  const photos = parsePhotos(rawPhotos);
  const [index, setIndex] = useState(0);

  if (photos.length === 0) {
    return <div className="property-card__photo property-card__photo--empty">No photo available</div>;
  }

  // show another photo without opening the detail page
  function show(event, newIndex) {
    event.stopPropagation();
    setIndex((newIndex + photos.length) % photos.length);
  }

  return (
    <div>
      <img className="property-card__photo" src={photos[index]} alt={alt} />
      {photos.length > 1 && (
        <div>
          <button onClick={(e) => show(e, index - 1)}>‹</button>
          <span> {index + 1} / {photos.length} </span>
          <button onClick={(e) => show(e, index + 1)}>›</button>
        </div>
      )}
    </div>
  );
}
