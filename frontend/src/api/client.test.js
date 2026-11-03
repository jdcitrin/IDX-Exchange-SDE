import { fetchProperties, fetchPropertyDetail } from './client';

function mockResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => (body === undefined ? Promise.reject(new Error('no json')) : Promise.resolve(body)),
  };
}

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

test('fetchProperties returns the data on success', async () => {
  const data = { total: 1, limit: 20, offset: 0, results: [{ id: 1 }] };
  global.fetch.mockResolvedValue(mockResponse(200, data));

  await expect(fetchProperties({ city: 'Irvine' })).resolves.toEqual(data);
  expect(global.fetch).toHaveBeenCalledWith('/api/properties?city=Irvine');
});

test('fetchProperties leaves out empty filter values', async () => {
  global.fetch.mockResolvedValue(mockResponse(200, { total: 0, results: [] }));

  await fetchProperties({ city: 'Irvine', zipcode: '', minPrice: '300000', beds: '', baths: null });

  expect(global.fetch).toHaveBeenCalledWith('/api/properties?city=Irvine&minPrice=300000');
});

test('throws the error message sent by the backend', async () => {
  global.fetch.mockResolvedValue(mockResponse(400, { error: 'minPrice must be a non-negative number' }));

  await expect(fetchProperties({ minPrice: 'abc' })).rejects.toThrow('minPrice must be a non-negative number');
});

test('throws a helpful message when the server cannot be reached', async () => {
  global.fetch.mockRejectedValue(new TypeError('Failed to fetch'));

  await expect(fetchProperties()).rejects.toThrow('Unable to reach the server');
});

test('fetchPropertyDetail throws on 404', async () => {
  global.fetch.mockResolvedValue(mockResponse(404, { error: 'No property found with listing ID 123' }));

  await expect(fetchPropertyDetail('123')).rejects.toThrow('No property found with listing ID 123');
  expect(global.fetch).toHaveBeenCalledWith('/api/properties/123');
});
