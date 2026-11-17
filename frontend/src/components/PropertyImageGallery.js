import { useEffect, useRef, useState } from 'react';
import { parsePhotos } from '../utils/photos';
import './PropertyImageGallery.css';

// main photo with arrows and a lightbox
export default function PropertyImageGallery({ rawPhotos }) {
  const photos = parsePhotos(rawPhotos);
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const lightboxRef = useRef(null);

  useEffect(() => {
    if (lightboxOpen) lightboxRef.current.focus();
  }, [lightboxOpen]);

  if (photos.length === 0) return <p>No photos available</p>;

  // go to the previous or next photo
  function move(event, step) {
    event.stopPropagation();
    setIndex((index + step + photos.length) % photos.length);
  }

  // escape closes and arrow keys change photo
  function handleKeyDown(event) {
    if (event.key === 'Escape') setLightboxOpen(false);
    if (event.key === 'ArrowLeft') move(event, -1);
    if (event.key === 'ArrowRight') move(event, 1);
  }

  return (
    <div>
      <div className="gallery__viewer">
        <button onClick={(e) => move(e, -1)}>‹</button>
        <img className="gallery__main" src={photos[index]} alt="" onClick={() => setLightboxOpen(true)} />
        <button onClick={(e) => move(e, 1)}>›</button>
      </div>

      {lightboxOpen && (
        <div
          className="gallery__lightbox"
          ref={lightboxRef}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          onClick={() => setLightboxOpen(false)}
        >
          <button onClick={(e) => move(e, -1)}>‹</button>
          <img src={photos[index]} alt="" onClick={(e) => e.stopPropagation()} />
          <button onClick={(e) => move(e, 1)}>›</button>
        </div>
      )}
    </div>
  );
}
