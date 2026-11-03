import { useState } from 'react';
import './PropertyFilters.css';

export const EMPTY_FILTERS = {
  city: '',
  zipcode: '',
  minPrice: '',
  maxPrice: '',
  beds: '',
  baths: '',
};

export default function PropertyFilters({ onSearch, onClear }) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  function handleChange(event) {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(filters);
  }

  function handleClear() {
    setFilters(EMPTY_FILTERS);
    onClear();
  }

  return (
    <form className="filters" onSubmit={handleSubmit}>
      <label>
        City
        <input name="city" value={filters.city} onChange={handleChange} />
      </label>

      <label>
        ZIP code
        <input name="zipcode" value={filters.zipcode} onChange={handleChange} />
      </label>

      <label>
        Min price
        <input name="minPrice" type="number" value={filters.minPrice} onChange={handleChange} />
      </label>

      <label>
        Max price
        <input name="maxPrice" type="number" value={filters.maxPrice} onChange={handleChange} />
      </label>

      <label>
        Beds
        <select name="beds" value={filters.beds} onChange={handleChange}>
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>
      </label>

      <label>
        Baths
        <select name="baths" value={filters.baths} onChange={handleChange}>
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </label>

      <div className="filters__buttons">
        <button type="submit">Search</button>
        <button type="button" onClick={handleClear}>Clear Filters</button>
      </div>
    </form>
  );
}
