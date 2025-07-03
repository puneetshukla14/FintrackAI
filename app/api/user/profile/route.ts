import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import UserData from '@/models/UserData'
import { verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  await dbConnect()

  try {
    const token =
      req.cookies.get('token')?.value ||
      req.headers.get('authorization')?.split(' ')[1]

    const decoded = token && verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const {
      fullName,
      gender,
      avatar,
      phone,
      dob,
      monthlySalary,
      salaryDate,
      bankBalance,
      location,
    } = await req.json()

    if (!fullName || !gender || !avatar) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
    }

    const updated = await UserData.findOneAndUpdate(
      { username: decoded.username },
      {
        $set: {
          'profile.fullName': fullName,
          'profile.gender': gender,
          'profile.avatar': avatar,
          'profile.phone': phone || '',
          'profile.dob': dob || '',
          'profile.monthlySalary': monthlySalary || 0,
          'profile.salaryDate': salaryDate || '',
          'profile.bankBalance': bankBalance || 0,
          'profile.location': location || '',
        },
      },
      { new: true, upsert: true }
    )

    return NextResponse.json({ success: true, profile: updated.profile }, { status: 200 })
  } catch (err) {
    console.error('POST /api/user/profile error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  await dbConnect()

  try {
    const token =
      req.cookies.get('token')?.value ||
      req.headers.get('authorization')?.split(' ')[1]

    const decoded = token && verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await UserData.findOne({ username: decoded.username })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json(
      {
        success: true,
        profile: user.profile.toObject?.() || user.profile,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('GET /api/user/profile error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
