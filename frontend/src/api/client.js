async function request(path) {
  let res;
  try {
    res = await fetch(path);
  } catch {
    throw new Error('Unable to reach the server. Make sure the backend is running.');
  }

  const body = await res.json().catch(() => null);
  if (!res.ok && body === null && res.status >= 500) {
    throw new Error('Unable to reach the server. Make sure the backend is running.');
  }
  if (!res.ok) {
    throw new Error(body?.error || `Request failed with status ${res.status}`);
  }
  return body;
}

function cleanParams(params) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined)
  );
}

export function fetchProperties(params = {}) {
  const query = new URLSearchParams(cleanParams(params)).toString();
  return request(`/api/properties${query ? `?${query}` : ''}`);
}

export function fetchPropertyDetail(id) {
  return request(`/api/properties/${encodeURIComponent(id)}`);
}
