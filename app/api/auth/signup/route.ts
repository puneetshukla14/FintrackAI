import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/user'
import UserData from '@/models/UserData'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/jwt'

export async function POST(req: Request) {
  try {
    await dbConnect()

    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const exists = await User.findOne({ username })
    if (exists) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ username, password: hashed })

    await UserData.create({
      username,
      profile: {
        fullName: '',
        monthlySalary: 0,
        gender: 'Other',
        email: '',
        bio: '',
        phone: '',
        dob: '',
        address: ''
      },
      expenses: [],
      credits: []
    })

    const token = signToken({ userId: user._id, username })

    // ✅ Set the token cookie using NextResponse
    const res = NextResponse.redirect(new URL('/setup-profile', req.url)) // redirect after signup
    res.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return res
  } catch (err: any) {
    console.error('Signup Error:', err.message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
