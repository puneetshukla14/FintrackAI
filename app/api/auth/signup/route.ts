import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/user'
import UserData from '@/models/UserData'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/jwt'
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing username or password' }, { status: 400 });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash });

    const token = jwt.sign(
      { userId: user._id, username },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );

    const res = NextResponse.json({ success: true, token }, { status: 201 });

    res.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err: any) {
    console.error('🔥 SIGNUP ERROR:', err.message);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
