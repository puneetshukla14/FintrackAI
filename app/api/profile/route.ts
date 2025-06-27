import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import UserData from '@/models/UserData'
import { verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  await dbConnect()

  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.split(' ')[1]
    const decoded = token && verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { fullName, monthlySalary, gender } = await req.json()
    if (!fullName || !monthlySalary || !gender) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const updated = await UserData.findOneAndUpdate(
      { username: decoded.username },
      {
        $set: {
          'profile.fullName': fullName,
          'profile.monthlySalary': monthlySalary,
          'profile.gender': gender
        }
      },
      { new: true, upsert: true }
    )

    return NextResponse.json({ success: true, profile: updated.profile }, { status: 200 })
  } catch (err) {
    console.error('POST /api/user/profile error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
