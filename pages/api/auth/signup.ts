import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import User from '@/models/user'
import UserData from '@/models/UserData'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/jwt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await dbConnect()

    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Missing username or password' })
    }

    const exists = await User.findOne({ username })
    if (exists) {
      return res.status(409).json({ error: 'Username already exists' })
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ username, password: hash })

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
        gender: 'Other',
      },
      expenses: [],
    })

    const token = signToken({ userId: user._id, username })

    // 🍪 Set token cookie manually if needed (Netlify might not support it directly)
    res.status(201).json({ success: true, token })
  } catch (error: any) {
    console.error('❌ Signup Error:', error.message)
    res.status(500).json({ error: 'Internal server error' })
  }
}
