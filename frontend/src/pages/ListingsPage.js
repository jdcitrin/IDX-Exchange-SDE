import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchProperties } from '../api/client';
import PropertyCard from '../components/PropertyCard';
import PropertyFilters from '../components/PropertyFilters';
import './ListingsPage.css';

export default function ListingsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const latestRequest = useRef(0);

  const loadProperties = useCallback(async (filters = {}) => {
    const requestId = ++latestRequest.current;
    setLoading(true);
    setError(null);

    try {
      const result = await fetchProperties({ ...filters, limit: 20, offset: 0 });
      if (requestId === latestRequest.current) setData(result);
    } catch (err) {
      if (requestId === latestRequest.current) setError(err.message);
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProperties();
    return () => {
      latestRequest.current += 1;
    };
  }, [loadProperties]);

  let content;
  if (loading) {
    content = <p>Loading properties…</p>;
  } else if (error) {
    content = <p role="alert">Error: {error}</p>;
  } else if (data.results.length === 0) {
    content = <p>No properties match your filters. Try changing or clearing them.</p>;
  } else {
    content = (
      <>
        <p className="listings__count">
          Showing {data.results.length} of {data.total.toLocaleString()} properties
        </p>
        <div className="listings__grid">
          {data.results.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </>
    );
  }

  return (
    <section>
      <PropertyFilters onSearch={loadProperties} onClear={() => loadProperties()} />
      {content}
    </section>
  );
}
