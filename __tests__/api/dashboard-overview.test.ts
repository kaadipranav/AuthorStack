/**
 * Integration test for /api/dashboard/overview
 * 
 * Note: These are basic integration tests. For full testing,
 * you may need to set up a test database or use more sophisticated mocks.
 */

import { GET } from '@/app/api/dashboard/overview/route';

// Mock Supabase
const mockGetUser = jest.fn();
const mockFrom = jest.fn();
const mockSelect = jest.fn();
const mockEq = jest.fn();
const mockIn = jest.fn();
const mockGte = jest.fn();

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: jest.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  })),
}));

// Mock cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

// Mock error handler
jest.mock('@/lib/errors/handler', () => ({
  handleApiError: jest.fn((error) => {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500 }
    );
  }),
}));

describe('/api/dashboard/overview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock chain
    mockFrom.mockReturnValue({
      select: mockSelect,
    });
    
    mockSelect.mockReturnValue({
      eq: mockEq,
      in: mockIn,
    });
    
    mockEq.mockReturnValue({
      data: [],
      error: null,
      gte: mockGte,
    });
    
    mockIn.mockReturnValue({
      gte: mockGte,
    });
    
    mockGte.mockReturnValue({
      data: [],
      error: null,
    });
  });

  it('should return 401 if user is not authenticated', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return empty data if user has no books', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
    });
    
    // Mock books query to return empty array
    mockSelect.mockReturnValueOnce({
      eq: jest.fn(() => ({
        data: [],
        error: null,
      })),
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.totalRevenue).toBe(0);
    expect(data.totalUnits).toBe(0);
    expect(data.revenueByPlatform).toEqual([]);
    expect(data.topBooks).toEqual([]);
  });

  it('should aggregate sales data correctly', async () => {
    const mockBooks = [{ id: 'book-1' }];
    const mockSalesData = [
      {
        book_id: 'book-1',
        platform: 'amazon',
        revenue: 10,
        units_sold: 1,
        page_reads: 100,
      },
      {
        book_id: 'book-1',
        platform: 'gumroad',
        revenue: 20,
        units_sold: 2,
        page_reads: 0,
      },
    ];

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
    });

    // Mock books query
    mockFrom.mockImplementation((table) => {
      if (table === 'books') {
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              data: mockBooks,
              error: null,
            })),
          })),
        };
      }
      if (table === 'sales_data') {
        return {
          select: jest.fn(() => ({
            in: jest.fn(() => ({
              gte: jest.fn(() => ({
                data: mockSalesData,
                error: null,
              })),
            })),
          })),
        };
      }
      // For bookDetails query
      return {
        select: jest.fn(() => ({
          in: jest.fn(() => ({
            data: [{ id: 'book-1', title: 'Test Book' }],
            error: null,
          })),
        })),
      };
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.totalRevenue).toBe(30); // 10 + 20
    expect(data.totalUnits).toBe(3); // 1 + 2
    expect(data.totalPageReads).toBe(100);
    expect(data.revenueByPlatform).toHaveLength(2);
  });
});

