import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import UserData from '@/models/UserData'
import { verifyToken } from '@/lib/auth'

// POST: Save user profile
export async function POST(req: NextRequest) {
  await dbConnect()

  try {
    const token = req.cookies.get('token')?.value
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

// GET: Fetch profile
export async function GET(req: NextRequest) {
  await dbConnect()

  try {
    const token = req.cookies.get('token')?.value
    const decoded = token && verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await UserData.findOne({ username: decoded.username })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const gender = user.profile?.gender || 'Other'
    const avatarUrl =
      gender === 'Male'
        ? '/avatars/male.png'
        : gender === 'Female'
        ? '/avatars/female.png'
        : '/avatars/default.png'

    return NextResponse.json({
      success: true,
      profile: {
        ...user.profile.toObject(),
        avatarUrl
      }
    }, { status: 200 })
  } catch (err) {
    console.error('GET /api/user/profile error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
