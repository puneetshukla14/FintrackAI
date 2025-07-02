import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import UserData from '@/models/UserData'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  await dbConnect()

  try {
    const token =
      req.cookies.get('token')?.value ||
      req.headers.get('authorization')?.split(' ')[1]

    const decoded = token && verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await UserData.findOne({ username: decoded.username })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const credits = Array.isArray(user.credits) ? user.credits : []
    const expenses = Array.isArray(user.expenses) ? user.expenses : []
    const bankBalance = typeof user.profile?.bankBalance === 'number'
      ? user.profile.bankBalance
      : 0

    const totalAddedMoney = credits.reduce(
      (sum: number, c: any) =>
        typeof c.amount === 'number' ? sum + c.amount : sum,
      0
    )

    const totalExpenses = expenses.reduce(
      (sum: number, e: any) =>
        typeof e.amount === 'number' ? sum + e.amount : sum,
      0
    )

    const currentBalance = totalAddedMoney + bankBalance
    const totalSavings = Math.max(currentBalance - totalExpenses, 0)

    return NextResponse.json({
      success: true,
      data: {
        currentBalance,
        totalSavings,
        totalExpenses,
      },
    })
  } catch (err) {
    console.error('GET /api/summary error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
