import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  try {
    // Test the connection by trying to fetch a single row
    const { data, error } = await supabase
      .from('api_keys')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { 
          error: 'Supabase connection failed', 
          details: error.message,
          code: error.code 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Supabase connection successful',
      data: data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { 
        error: 'Unexpected error occurred',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 