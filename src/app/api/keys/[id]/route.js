import { NextResponse } from 'next/server'
import { supabase } from '../../../../../lib/supabase'

// GET /api/keys/[id] - Get a specific API key
export async function GET(request, { params }) {
  try {
    const { id } = params

    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'API key not found' }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/keys/[id] - Update an API key
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('api_keys')
      .update({ name })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'API key not found' }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/keys/[id] - Delete an API key
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'API key deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 