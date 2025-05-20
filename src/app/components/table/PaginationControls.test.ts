import { getPageNumbers } from './PaginationControls';

describe('getPageNumbers', () => {
  it('handles totals of less than 5', () => {
    expect(getPageNumbers(1, 2)).toEqual([1, 2]);
    expect(getPageNumbers(2, 2)).toEqual([1, 2]);
  });

  it('handles total of 5 when at the first page', () => {
    expect(getPageNumbers(1, 5)).toEqual([1, 2, 3, '...', 5]);
  });

  it('handles total of 5 when at the middle page', () => {
    expect(getPageNumbers(3, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('handles total of 5 when at the last page', () => {
    expect(getPageNumbers(5, 5)).toEqual([1, '...', 3, 4, 5]);
  });

  it('handles total of 10 when at the middle page', () => {
    expect(getPageNumbers(5, 10)).toEqual([1, '...', 3, 4, 5, 6, 7, '...', 10]);
  });
});
