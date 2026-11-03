import { fireEvent, render, screen } from '@testing-library/react';
import PropertyFilters, { EMPTY_FILTERS } from './PropertyFilters';

function renderFilters() {
  const onSearch = jest.fn();
  const onClear = jest.fn();
  render(<PropertyFilters onSearch={onSearch} onClear={onClear} />);
  return { onSearch, onClear };
}

test('shows all six filter inputs', () => {
  renderFilters();

  for (const label of ['City', 'ZIP code', 'Min price', 'Max price', 'Beds', 'Baths']) {
    expect(screen.getByLabelText(label)).toBeInTheDocument();
  }
});

test('submitting sends the entered filters to onSearch', () => {
  const { onSearch } = renderFilters();

  fireEvent.change(screen.getByLabelText('City'), { target: { value: 'Irvine' } });
  fireEvent.change(screen.getByLabelText('Min price'), { target: { value: '300000' } });
  fireEvent.change(screen.getByLabelText('Beds'), { target: { value: '3' } });
  fireEvent.click(screen.getByRole('button', { name: 'Search' }));

  expect(onSearch).toHaveBeenCalledWith({ ...EMPTY_FILTERS, city: 'Irvine', minPrice: '300000', beds: '3' });
});

test('Clear Filters empties every input and calls onClear', () => {
  const { onClear } = renderFilters();

  fireEvent.change(screen.getByLabelText('City'), { target: { value: 'Irvine' } });
  fireEvent.change(screen.getByLabelText('Baths'), { target: { value: '2' } });
  fireEvent.click(screen.getByRole('button', { name: 'Clear Filters' }));

  expect(screen.getByLabelText('City')).toHaveValue('');
  expect(screen.getByLabelText('Baths')).toHaveValue('');
  expect(onClear).toHaveBeenCalledTimes(1);
});

test('searching after clearing only sends the new values', () => {
  const { onSearch } = renderFilters();

  fireEvent.change(screen.getByLabelText('City'), { target: { value: 'Irvine' } });
  fireEvent.click(screen.getByRole('button', { name: 'Clear Filters' }));
  fireEvent.change(screen.getByLabelText('City'), { target: { value: 'Anaheim' } });
  fireEvent.click(screen.getByRole('button', { name: 'Search' }));

  expect(onSearch).toHaveBeenLastCalledWith({ ...EMPTY_FILTERS, city: 'Anaheim' });
});
