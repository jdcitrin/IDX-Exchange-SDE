import { useEffect, useState } from 'react';
import { fetchProperties } from '../api/client';
import Pagination from '../components/Pagination';
import PropertyCard from '../components/PropertyCard';
import PropertyFilters from '../components/PropertyFilters';
import './ListingsPage.css';

// filters with the property grid and pagination
export default function ListingsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);

    fetchProperties({ ...filters, limit: itemsPerPage, offset: (currentPage - 1) * itemsPerPage })
      .then((result) => {
        if (!ignore) setData(result);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [filters, currentPage, itemsPerPage]);

  // apply new filters and go back to page 1
  function handleSearch(newFilters) {
    setFilters({ ...newFilters });
    setCurrentPage(1);
  }

  // remove all filters and go back to page 1
  function handleClear() {
    setFilters({});
    setCurrentPage(1);
  }

  // change page and scroll to the top
  function handlePageChange(page) {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }

  let content;
  if (loading) {
    content = <p>Loading properties…</p>;
  } else if (error) {
    content = <p role="alert">Error: {error}</p>;
  } else if (data.results.length === 0) {
    content = <p>No properties match your filters. Try changing or clearing them.</p>;
  } else {
    const first = (currentPage - 1) * itemsPerPage + 1;
    const last = first + data.results.length - 1;
    content = (
      <>
        <p className="listings__count">
          Showing {first.toLocaleString()}-{last.toLocaleString()} of {data.total.toLocaleString()} properties
        </p>
        <div className="listings__grid">
          {data.results.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(data.total / itemsPerPage)}
          onPageChange={handlePageChange}
        />
      </>
    );
  }

  return (
    <section>
      <PropertyFilters onSearch={handleSearch} onClear={handleClear} />
      {content}
    </section>
  );
}
