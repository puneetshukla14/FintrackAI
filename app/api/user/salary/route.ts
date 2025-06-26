import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import UserData from '@/models/UserData'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  await dbConnect()

  try {
    const token =
      req.cookies.get('token')?.value || req.headers.get('authorization')?.split(' ')[1]

    const decoded = token && verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await UserData.findOne({ username: decoded.username })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const salary = user.profile?.monthlySalary || 0

    return NextResponse.json({ data: { salary } }, { status: 200 })
  } catch (err) {
    console.error('GET /api/user/salary error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
