import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home, { formatPhoneNumber } from './page';
import { useAdvocates } from './use-advocates';

jest.mock('./use-advocates');

describe('formatPhoneNumber', () => {
  it('formats a 10-digit string correctly', () => {
    expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
  });

  it('formats a 10-digit number correctly', () => {
    expect(formatPhoneNumber(1234567890 as any)).toBe('(123) 456-7890');
  });

  it('returns input as string if not 10 digits', () => {
    expect(formatPhoneNumber('12345')).toBe('12345');
  });
});

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the main heading', () => {
    (useAdvocates as jest.Mock).mockImplementation(() => ({
      advocates: [],
      total: 0,
      isLoading: false,
      error: undefined,
    }));
    render(<Home />);
    expect(
      screen.getByRole('heading', { name: /solace advocates/i }),
    ).toBeInTheDocument();
  });

  it('shows empty state when there are no advocates', () => {
    (useAdvocates as jest.Mock).mockImplementation(() => ({
      advocates: [],
      total: 0,
      isLoading: false,
      error: undefined,
    }));
    render(<Home />);
    expect(screen.getByText(/no advocates found/i)).toBeInTheDocument();
  });

  it('shows error state when there is an error', () => {
    (useAdvocates as jest.Mock).mockImplementation(() => ({
      advocates: [],
      total: 0,
      isLoading: false,
      error: { message: 'Failed to fetch' },
    }));
    render(<Home />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
  });

  it('shows some data in the table', () => {
    (useAdvocates as jest.Mock).mockImplementation(() => ({
      advocates: [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          city: 'New York',
          degree: 'MD',
          specialties: ['A'],
          yearsOfExperience: 10,
          phoneNumber: 1234567890,
        },
      ],
      total: 1,
      isLoading: false,
      error: undefined,
    }));
    render(<Home />);
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('(123) 456-7890')).toBeInTheDocument();
  });
});
