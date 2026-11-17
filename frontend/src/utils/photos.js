// turn the L_Photos json string into an array of urls
export function parsePhotos(rawPhotos) {
  try {
    const photos = JSON.parse(rawPhotos);
    return Array.isArray(photos) ? photos.filter((url) => typeof url === 'string' && url !== '') : [];
  } catch {
    return [];
  }
}
