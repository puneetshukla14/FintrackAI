// app/api/analytics/categories/route.ts

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { verifyToken } from '@/lib/auth' // or jwt if you're using that
import UserData from '@/models/UserData'

export async function GET(req: NextRequest) {
  await dbConnect()

  const token = req.headers.get('authorization')?.split(' ')[1]
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { username } = verifyToken(token) as { username: string }

    const user = await UserData.findOne({ username })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const categoryTotals: Record<string, number> = {}

    user.expenses.forEach((exp: any) => {
      const cat = exp.category || 'Other'
      categoryTotals[cat] = (categoryTotals[cat] || 0) + exp.amount
    })

    const formatted = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }))

    return NextResponse.json({ success: true, data: formatted })
  } catch (err) {
    console.error('Error in category analytics:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
