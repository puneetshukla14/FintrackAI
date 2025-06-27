import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'

const JWT_SECRET = process.env.JWT_SECRET as string

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

const User = mongoose.models.User || mongoose.model('User', UserSchema)

export async function POST(req: Request) {
  try {
    await dbConnect()

    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing username or password' }, { status: 400 })
    }

    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 })
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ username, password: hash })

    const token = jwt.sign({ userId: user._id, username }, JWT_SECRET, { expiresIn: '7d' })

    const res = NextResponse.json({ success: true, token }, { status: 201 })
    res.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    return res
  } catch (err: any) {
    console.error('🔥 Signup Error:', err.message)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
