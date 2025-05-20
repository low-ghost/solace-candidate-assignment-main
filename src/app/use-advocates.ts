import useSWR from 'swr';

export type Advocate = {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
};

export function useAdvocates(searchTerm: string, page: number, limit: number) {
  const getKey = (search: string, page: number, limit: number) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('page', String(page));
    params.append('limit', String(limit));
    return `/api/advocates?${params.toString()}`;
  };

  const fetcher = (url: string) =>
    fetch(url).then((res) => {
      if (!res.ok) throw new Error('Failed to fetch advocates');
      return res.json();
    });

  const {
    data,
    error: swrError,
    isLoading,
  } = useSWR(getKey(searchTerm, page, limit), fetcher);

  // Always return an Error object for error if there is an error
  const error = swrError
    ? swrError instanceof Error
      ? swrError
      : new Error(String(swrError))
    : undefined;

  return {
    advocates: data?.data || [],
    total: data?.total || 0,
    isLoading,
    error,
  };
}
