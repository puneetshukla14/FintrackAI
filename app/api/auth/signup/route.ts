import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// ====== ENV ======
const MONGODB_URI = 'mongodb+srv://puneetshukla043:u2c38K7nwVNnKNIk@fintrack.um7seop.mongodb.net/?retryWrites=true&w=majority&appName=Fintrack'
const JWT_SECRET = 'skdjf8329r98u32r98u23r98u23r98u23r98u23r98'

// ====== DB Setup ======
if (!global.mongoose) global.mongoose = { conn: null, promise: null }

async function dbConnect() {
  if (global.mongoose.conn) return global.mongoose.conn
  if (!global.mongoose.promise) {
    global.mongoose.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
  }
  global.mongoose.conn = await global.mongoose.promise
  return global.mongoose.conn
}

// ====== User Schema ======
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

const User = mongoose.models.User || mongoose.model('User', UserSchema)

// ====== Route POST ======
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
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return res
  } catch (err: any) {
    console.error('🔥 Signup Error:', err.message)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
