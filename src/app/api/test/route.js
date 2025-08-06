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

    // For demo purposes, we'll just return a success response
    // In a real application, you'd validate the API key here
    return NextResponse.json({
      message: 'Test endpoint successful!',
      status: 'success',
      timestamp: new Date().toISOString(),
      apiKey: apiKey.substring(0, 8) + '...',
      data: {
        id: 1,
        name: 'Test Resource',
        description: 'This is a test resource from the API',
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in test endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
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
    const body = await request.json();

    return NextResponse.json({
      message: 'POST request successful!',
      status: 'success',
      timestamp: new Date().toISOString(),
      apiKey: apiKey.substring(0, 8) + '...',
      receivedData: body,
      data: {
        id: Math.floor(Math.random() * 1000),
        name: body.name || 'Default Name',
        description: body.description || 'Default Description',
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in test POST endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 