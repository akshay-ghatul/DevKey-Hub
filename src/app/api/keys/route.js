import { NextResponse } from 'next/server'
import { authenticateUser } from '../../../../lib/authUtils'
import { supabase } from '../../../../lib/supabase'

// GET /api/keys - Get all API keys for authenticated user
export async function GET() {
  try {
    const auth = await authenticateUser()
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', auth.userId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/keys - Create a new API key for authenticated user
export async function POST(request) {
  try {
    const auth = await authenticateUser()
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }

    const body = await request.json()
    const { name, limitUsage, monthlyLimit } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Generate a unique API key
    const value = `dandi-dev-${Math.random().toString(36).substr(2, 9)}`

    const { data, error } = await supabase
      .from('api_keys')
      .insert([
        {
          name,
          value,
          usage: 0,
          limit_usage: limitUsage || false,
          monthly_limit: monthlyLimit || 1000,
          user_id: auth.userId
        }
      ])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 