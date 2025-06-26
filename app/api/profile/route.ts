import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import UserData from '@/models/UserData'
import { verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  await dbConnect()

  const token =
    req.cookies.get('token')?.value || req.headers.get('authorization')?.split(' ')[1]

  const decoded = token && verifyToken(token)
  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { fullName, monthlySalary } = body

  try {
    const updated = await UserData.findOneAndUpdate(
      { username: decoded.username },
      { profile: { fullName, monthlySalary } },
      { new: true, upsert: true }
    )

    return NextResponse.json(
      { success: true, profile: updated.profile },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}