import { NextRequest, NextResponse } from 'next/server'
import { signToken } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import UserData from '@/models/UserData'

export async function POST(req: NextRequest) {
  await dbConnect()
  const { username, password } = await req.json()

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
  }

  const existing = await UserData.findOne({ username })
  if (existing) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 })
  }

  const newUser = await UserData.create({ username, password })

  const token = signToken({ username })

  const response = NextResponse.json({ success: true })

  // ✅ Set cookie here
  response.cookies.set({
    name: 'token',
    value: token,
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return response
}
