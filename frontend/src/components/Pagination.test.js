import { fireEvent, render, screen } from '@testing-library/react';
import Pagination, { getPageNumbers } from './Pagination';

// render pagination with a mock click handler
function renderPagination(currentPage, totalPages) {
  const onPageChange = jest.fn();
  const { container } = render(
    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
  );
  return { onPageChange, container };
}

describe('getPageNumbers', () => {
  test('shows every page when they fit without ellipsis', () => {
    expect(getPageNumbers(3, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  test('current page near the start', () => {
    expect(getPageNumbers(2, 24)).toEqual([1, 2, 3, 4, 5, '...', 24]);
  });

  test('current page in the middle', () => {
    expect(getPageNumbers(5, 24)).toEqual([1, '...', 4, 5, 6, '...', 24]);
  });

  test('current page near the end', () => {
    expect(getPageNumbers(23, 24)).toEqual([1, '...', 20, 21, 22, 23, 24]);
  });

  test('never repeats a page number on any page', () => {
    for (let totalPages = 1; totalPages <= 30; totalPages++) {
      for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        const pages = getPageNumbers(currentPage, totalPages).filter((p) => p !== '...');
        expect(new Set(pages).size).toBe(pages.length);
        expect(pages[0]).toBe(1);
        expect(pages[pages.length - 1]).toBe(totalPages);
      }
    }
  });
});

describe('Pagination', () => {
  test('is hidden when there is only one page', () => {
    const { container } = renderPagination(1, 1);
    expect(container).toBeEmptyDOMElement();
  });

  test('first page: Previous is disabled and Next is enabled', () => {
    renderPagination(1, 24);
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
  });

  test('last page: Next is disabled and Previous is enabled', () => {
    renderPagination(24, 24);
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous' })).toBeEnabled();
  });

  test('middle page: both buttons are enabled and ellipsis appears on both sides', () => {
    renderPagination(5, 24);
    expect(screen.getByRole('button', { name: 'Previous' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
    expect(screen.getAllByText('...')).toHaveLength(2);
    expect(screen.getByRole('button', { name: '5' })).toHaveAttribute('aria-current', 'page');
  });

  test('clicking a page number navigates to that page', () => {
    const { onPageChange } = renderPagination(5, 24);
    fireEvent.click(screen.getByRole('button', { name: '6' }));
    expect(onPageChange).toHaveBeenCalledWith(6);
  });

  test('Previous and Next move one page', () => {
    const { onPageChange } = renderPagination(5, 24);
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPageChange).toHaveBeenNthCalledWith(1, 4);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 6);
  });

  test('last page number appears only once near the end', () => {
    renderPagination(22, 24);
    expect(screen.getAllByRole('button', { name: '24' })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: '1' })).toHaveLength(1);
  });
});
