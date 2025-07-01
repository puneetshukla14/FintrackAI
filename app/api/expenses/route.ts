import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { verifyToken } from '@/lib/auth'
import UserData from '@/models/UserData'

// Define the structure of an expense
interface Expense {
  amount: number
  date: string
  category?: string
  description: string
}

// Categorize expenses based on description keywords
function getCategory(desc: string): string {
  const lowered = desc.toLowerCase()

  if (lowered.includes('zomato') || lowered.includes('swiggy')) return 'Dining'
  if (lowered.includes('uber') || lowered.includes('ola')) return 'Travel'
  if (lowered.includes('amazon') || lowered.includes('flipkart')) return 'Shopping'
  if (lowered.includes('rent')) return 'Rent'
  if (lowered.includes('electricity') || lowered.includes('water') || lowered.includes('bill')) return 'Bills'
  if (lowered.includes('doctor') || lowered.includes('hospital')) return 'Health'
  if (lowered.includes('school') || lowered.includes('tuition')) return 'Education'
  if (lowered.includes('netflix') || lowered.includes('spotify')) return 'Subscriptions'

  return 'Other'
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const token = req.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized (no token)' }, { status: 401 })
    }

    const decoded = verifyToken(token) as { username: string }
    const body = await req.json()

    const { amount, description = 'No description', date, category } = body

    if (typeof amount !== 'number') {
      return NextResponse.json({ error: 'Amount must be a number' }, { status: 400 })
    }

    const expense: Expense = {
      amount,
      date: date || new Date().toISOString(),
      description,
      category: category || getCategory(description),
    }

    const updatedUser = await UserData.findOneAndUpdate(
      { username: decoded.username },
      { $push: { expenses: expense } },
      { new: true }
    )

    return NextResponse.json({ success: true, data: updatedUser?.expenses || [] })
  } catch (err) {
    console.error('❌ Error saving expense:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const token = req.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized (no token)' }, { status: 401 })
    }

    const decoded = verifyToken(token) as { username: string }

    const user = await UserData.findOne({ username: decoded.username })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user.expenses || [])
  } catch (err) {
    console.error('❌ Error fetching expenses:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
