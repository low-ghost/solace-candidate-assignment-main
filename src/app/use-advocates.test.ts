import { renderHook } from '@testing-library/react';
import { useAdvocates } from './use-advocates';

jest.mock('swr');
const useSWR = require('swr').default;

afterEach(() => {
  jest.clearAllMocks();
});

describe('useAdvocates', () => {
  it('returns advocates and total on success', () => {
    const mockData = {
      data: [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          city: 'New York',
          degree: 'MD',
          specialties: ['A'],
          yearsOfExperience: 10,
          phoneNumber: 123,
        },
      ],
      total: 1,
    };
    useSWR.mockReturnValue({
      data: mockData,
      error: undefined,
      isLoading: false,
    });

    const { result } = renderHook(() => useAdvocates('search', 2, 5));
    expect(useSWR).toHaveBeenCalledWith(
      '/api/advocates?search=search&page=2&limit=5',
      expect.any(Function),
    );
    expect(result.current.advocates).toEqual(mockData.data);
    expect(result.current.total).toBe(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('returns error on fetch failure', () => {
    useSWR.mockReturnValue({
      data: undefined,
      error: new Error('Failed to fetch advocates'),
      isLoading: false,
    });

    const { result } = renderHook(() => useAdvocates('search', 2, 5));
    expect(useSWR).toHaveBeenCalledWith(
      '/api/advocates?search=search&page=2&limit=5',
      expect.any(Function),
    );
    expect(result.current.advocates).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error?.message).toBe('Failed to fetch advocates');
  });
});
