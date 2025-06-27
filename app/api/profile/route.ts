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

  const { fullName, monthlySalary, gender } = await req.json()

  try {
    const updated = await UserData.findOneAndUpdate(
      { username: decoded.username },
      {
        $set: {
          'profile.fullName': fullName,
          'profile.monthlySalary': monthlySalary,
          'profile.gender': gender,
        },
      },
      { new: true }
    )

    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(
      { success: true, profile: updated.profile },
      { status: 200 }
    )
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
