import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/user'
import UserData from '@/models/UserData'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/jwt'

export async function POST(req: Request) {
  try {
    console.log('Connecting to DB...');
    await dbConnect();

    const { username, password } = await req.json();
    console.log('Received signup:', { username, password: password ? '***' : null });

    if (!username || !password) {
      console.error('Missing fields');
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const exists = await User.findOne({ username });
    if (exists) {
      console.error('Username already exists');
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed });

    await UserData.create({
      username,
      profile: {
        fullName: '',
        email: '',
        monthlySalary: 0,
        bio: '',
        phone: '',
        dob: '',
        address: '',
        gender: 'Other'
      },
      expenses: [],
      credits: []
    });

    const token = signToken({ userId: user._id, username });

    const res = NextResponse.redirect(new URL('/setup-profile', req.url));
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
    console.error('🚨 SIGNUP ERROR:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
