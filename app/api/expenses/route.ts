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

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const token = req.cookies.get('token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized (no token)' }, { status: 401 })

    const decoded = verifyToken(token) as { username: string }

    const { amount, description = 'No description', date, category } = await req.json()

    if (typeof amount !== 'number') {
      return NextResponse.json({ error: 'Amount must be a number' }, { status: 400 })
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

    return NextResponse.json({ success: true, data: update?.expenses || [] })
  } catch (err) {
    console.error('❌ Error saving expense:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const token = req.cookies.get('token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized (no token)' }, { status: 401 })

    const decoded = verifyToken(token) as { username: string }
    const userDoc = await UserData.findOne({ username: decoded.username })

    if (!userDoc) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(userDoc.expenses || [])
  } catch (err) {
    console.error('❌ Error fetching expenses:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
