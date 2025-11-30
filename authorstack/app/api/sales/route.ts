import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/sales
 * Get aggregated sales data for authenticated user
 * Query params: range (7d, 30d, 90d), platform, bookId
 * 
 * POST /api/sales/sync
 * Trigger manual sales sync from connected platforms
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d'
    
    // Placeholder - implement with sales.service.ts
    return NextResponse.json(
      { 
        sales: [],
        range,
        message: 'Sales endpoint - implement with Azure PostgreSQL' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get sales error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Placeholder - implement with sales.service.ts
    return NextResponse.json(
      { message: 'Sales sync endpoint - implement with BullMQ jobs' },
      { status: 501 }
    )
  } catch (error) {
    console.error('Sync sales error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
