import { NextResponse } from 'next/server'
import { authenticateUser, verifyResourceOwnership } from '../../../../../lib/authUtils'
import { supabase } from '../../../../../lib/supabase'

// GET /api/keys/[id] - Get a specific API key for authenticated user
export async function GET(request, { params }) {
  try {
    const auth = await authenticateUser()
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }

    const { id } = params

    // Verify ownership
    const isOwner = await verifyResourceOwnership('api_keys', id, auth.userId)
    if (!isOwner) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 })
    }

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

// PUT /api/keys/[id] - Update an API key for authenticated user
export async function PUT(request, { params }) {
  try {
    const auth = await authenticateUser()
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { name, limitUsage, monthlyLimit } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Verify ownership
    const isOwner = await verifyResourceOwnership('api_keys', id, auth.userId)
    if (!isOwner) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 })
    }

    const updateData = { name }
    if (limitUsage !== undefined) updateData.limit_usage = limitUsage
    if (monthlyLimit !== undefined) updateData.monthly_limit = monthlyLimit

    const { data, error } = await supabase
      .from('api_keys')
      .update(updateData)
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

// DELETE /api/keys/[id] - Delete an API key for authenticated user
export async function DELETE(request, { params }) {
  try {
    const auth = await authenticateUser()
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }

    const { id } = params

    // Verify ownership
    const isOwner = await verifyResourceOwnership('api_keys', id, auth.userId)
    if (!isOwner) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 })
    }

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