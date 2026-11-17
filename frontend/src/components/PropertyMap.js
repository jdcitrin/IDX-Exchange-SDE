// google map and directions link for a location
export default function PropertyMap({ lat, lng }) {
  if (lat == null || lng == null || lat === '' || lng === '') return null;

  const key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  return (
    <div>
      <iframe
        title="Property location"
        width="100%"
        height="350"
        src={`https://www.google.com/maps/embed/v1/place?key=${key}&q=${lat},${lng}&zoom=15`}
      />
      <a href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`} target="_blank" rel="noreferrer">
        Get Directions
      </a>
    </div>
  );
}
