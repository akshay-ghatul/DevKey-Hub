import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const apiKey = authHeader.replace('Bearer ', '');

    // For demo purposes, return mock status data
    // In a real application, you'd query the database for actual usage
    return NextResponse.json({
      message: 'API Status',
      status: 'operational',
      timestamp: new Date().toISOString(),
      apiKey: apiKey.substring(0, 8) + '...',
      data: {
        uptime: '99.9%',
        responseTime: '45ms',
        totalRequests: 1234,
        monthlyLimit: 1000,
        remainingRequests: 766,
        endpoints: [
          {
            path: '/api/test',
            methods: ['GET', 'POST'],
            status: 'active'
          },
          {
            path: '/api/status',
            methods: ['GET'],
            status: 'active'
          }
        ]
      }
    });

  } catch (error) {
    console.error('Error in status endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 