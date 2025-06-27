import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/user'
import UserData from '@/models/UserData'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/jwt'

export async function POST(req: Request) {
  try {
    console.log('Connecting to DB...')
    await dbConnect()

    const { username, password } = await req.json()
    console.log('Received:', { username, password })

    if (!username || !password)
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const exists = await User.findOne({ username })
    console.log('User exists:', exists)

    if (exists)
      return NextResponse.json({ error: 'Username exists' }, { status: 409 })

    const hash = await bcrypt.hash(password, 10)
    console.log('Password hashed')

    const user = await User.create({ username, password: hash })
    console.log('User created')

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
        gender: 'Other' // ✅ fix here
      },
      expenses: []
    })
    console.log('UserData created')

    const token = signToken({ userId: user._id, username })
    console.log('JWT created')

    return NextResponse.json({ token }, { status: 201 })
  } catch (error: any) {
    console.error('Signup Error:', error.message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
