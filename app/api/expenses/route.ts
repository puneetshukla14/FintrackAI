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

// Optional: Auto-categorize based on description
function getCategory(desc: string): string {
  const lowered = desc.toLowerCase()
  if (lowered.includes('zomato') || lowered.includes('swiggy')) return 'Food'
  if (lowered.includes('uber') || lowered.includes('ola')) return 'Transport'
  if (lowered.includes('amazon') || lowered.includes('flipkart')) return 'Shopping'
  if (lowered.includes('rent')) return 'Rent'
  return 'Other'
}
export async function POST(req: NextRequest) {
  await dbConnect()

  const token = req.headers.get('authorization')?.split(' ')[1]
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { username } = verifyToken(token) as { username: string }
    const body = await req.json()

    if (typeof body.amount !== 'number') {
      return NextResponse.json({ error: 'Amount is required and must be a number' }, { status: 400 })
    }

    const expense = {
      amount: body.amount,
      date: body.date || new Date().toISOString(),
      description: body.description || 'No description',
      category: body.category || getCategory(body.description || ''),
    }

    const update = await UserData.findOneAndUpdate(
      { username },
      { $push: { expenses: expense } },
      { new: true }
    )

    return NextResponse.json({ success: true, data: update?.expenses })
  } catch (err) {
    console.error('Error saving expense:', err)
    return NextResponse.json({ error: 'Error saving expense' }, { status: 500 })
  }
}


export async function GET(req: NextRequest) {
  await dbConnect()

  const token = req.headers.get('authorization')?.split(' ')[1]
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { username } = verifyToken(token) as { username: string }
    const userDoc = await UserData.findOne({ username })
    return NextResponse.json(userDoc?.expenses || [])
  } catch (err) {
    console.error('Error fetching expenses:', err)
    return NextResponse.json([], { status: 500 })
  }
}
