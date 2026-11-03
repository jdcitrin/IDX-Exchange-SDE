export function getFirstPhoto(rawPhotos) {
  if (typeof rawPhotos !== 'string' || rawPhotos.trim() === '') return null;

  let photos;
  try {
    photos = JSON.parse(rawPhotos);
  } catch {
    return null;
  }

  if (!Array.isArray(photos)) return null;
  const first = photos.find((url) => typeof url === 'string' && url.trim() !== '');
  return first ?? null;
}
