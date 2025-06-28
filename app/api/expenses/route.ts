import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { verifyToken } from '@/lib/auth'
import UserData from '@/models/UserData'

interface Expense {
  amount: number
  date: string
  category?: string
  description: string
}

function getCategory(desc: string): string {
  const lowered = desc.toLowerCase()
  if (lowered.includes('zomato') || lowered.includes('swiggy')) return 'Food'
  if (lowered.includes('uber') || lowered.includes('ola')) return 'Transport'
  if (lowered.includes('amazon') || lowered.includes('flipkart')) return 'Shopping'
  if (lowered.includes('rent')) return 'Rent'
  return 'Other'
}

function getTokenFromRequest(req: NextRequest): string | null {
  const cookieToken = req.cookies.get('token')?.value
  const authHeader = req.headers.get('authorization')
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null
  return cookieToken || headerToken || null
}

// ✅ POST: Add new expense
export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const token = getTokenFromRequest(req)
    if (!token) return NextResponse.json({ error: 'Unauthorized (no token)' }, { status: 401 })

    let decoded
    try {
      decoded = verifyToken(token) as { username: string }
    } catch (err) {
      console.error('❌ Token verify failed (POST):', err)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { amount, description = 'No description', date, category } = await req.json()

    if (typeof amount !== 'number' || isNaN(amount)) {
      return NextResponse.json({ error: 'Amount must be a valid number' }, { status: 400 })
    }

    const expense: Expense = {
      amount,
      date: date || new Date().toISOString(),
      description,
      category: category || getCategory(description),
    }

    const update = await UserData.findOneAndUpdate(
      { username: decoded.username },
      { $push: { expenses: expense } },
      { new: true }
    )

    if (!update) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: update.expenses })
  } catch (err) {
    console.error('❌ Error in POST /api/expenses:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ✅ GET: Get all expenses
export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const token = getTokenFromRequest(req)
    if (!token) return NextResponse.json({ error: 'Unauthorized (no token)' }, { status: 401 })

    let decoded
    try {
      decoded = verifyToken(token) as { username: string }
    } catch (err) {
      console.error('❌ Token verify failed (GET):', err)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const userDoc = await UserData.findOne({ username: decoded.username })

    if (!userDoc) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, expenses: userDoc.expenses || [] })
  } catch (err) {
    console.error('❌ Error in GET /api/expenses:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
