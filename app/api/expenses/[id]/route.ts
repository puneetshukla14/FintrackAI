import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { verifyToken } from '@/lib/jwt'
import UserData from '@/models/UserData'

// 🛠 Correct type for dynamic params
interface RouteParams {
  params: { id: string }
}

// ✅ DELETE expense by ID
export async function DELETE(req: NextRequest, context: RouteParams) {
  await dbConnect()

  const token = req.headers.get('authorization')?.split(' ')[1]
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { username } = verifyToken(token) as { username: string }

    const user = await UserData.findOne({ username })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const initialLength = user.expenses.length

    user.expenses = user.expenses.filter((exp: any) => exp._id.toString() !== context.params.id)

    if (user.expenses.length === initialLength) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 })
    }

    await user.save()
    return NextResponse.json({ success: true, message: 'Expense deleted' })
  } catch (err) {
    console.error('Error deleting expense:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// ✅ UPDATE expense by ID
export async function PUT(req: NextRequest, context: RouteParams) {
  await dbConnect()

  const token = req.headers.get('authorization')?.split(' ')[1]
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { username } = verifyToken(token) as { username: string }
    const updatedData = await req.json()

    const user = await UserData.findOne({ username })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const expense = user.expenses.id(context.params.id)
    if (!expense) return NextResponse.json({ error: 'Expense not found' }, { status: 404 })

    Object.assign(expense, updatedData)

    await user.save()
    return NextResponse.json({ success: true, message: 'Expense updated' })
  } catch (err) {
    console.error('Error updating expense:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
