// app/api/credits/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import UserData from '@/models/UserData'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  await dbConnect()
  const token =
    req.cookies.get('token')?.value || req.headers.get('authorization')?.split(' ')[1]

  const decoded = token && verifyToken(token)
  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await UserData.findOne({ username: decoded.username })
    return NextResponse.json(user?.credits || [], { status: 200 })
  } catch (err) {
    console.error('GET /api/credits error:', err)
    return NextResponse.json({ error: 'Failed to load credits' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  await dbConnect()
  const token =
    req.cookies.get('token')?.value || req.headers.get('authorization')?.split(' ')[1]

  const decoded = token && verifyToken(token)
  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    if (typeof body.amount !== 'number') {
      return NextResponse.json({ error: 'Amount is required and must be a number' }, { status: 400 })
    }

    const credit = {
      amount: body.amount,
      date: new Date().toISOString(),
      source: body.source || 'Manual Add',
    }

    const updatedUser = await UserData.findOneAndUpdate(
      { username: decoded.username },
      { $push: { credits: credit } },
      { new: true }
    )

    return NextResponse.json({ success: true, data: updatedUser.credits }, { status: 200 })
  } catch (err) {
    console.error('POST /api/credits error:', err)
    return NextResponse.json({ error: 'Failed to add credit' }, { status: 500 })
  }
}
