import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { verifyToken } from '@/lib/jwt'
import UserData from '@/models/UserData'

// Helper: Extract token from Authorization header OR cookie
function getToken(req: NextRequest): string | null {
  const headerToken = req.headers.get('authorization')?.split(' ')[1] || null
  const cookieToken = req.cookies.get('token')?.value || null
  return headerToken || cookieToken
}

// ✅ DELETE /api/expenses/[id]
export async function DELETE(req: NextRequest) {
  await dbConnect()

  const url = new URL(req.url)
  const id = url.pathname.split('/').pop()
  const token = getToken(req)

  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { username } = verifyToken(token) as { username: string }

    const user = await UserData.findOne({ username })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const initialLength = user.expenses.length
    user.expenses = user.expenses.filter((exp: any) => exp._id.toString() !== id)

    if (user.expenses.length === initialLength) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 })
    }

    await user.save()
    return NextResponse.json({ success: true, message: 'Expense deleted' })
  } catch (err) {
    console.error('DELETE Error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// ✅ PUT /api/expenses/[id]
export async function PUT(req: NextRequest) {
  await dbConnect()

  const url = new URL(req.url)
  const id = url.pathname.split('/').pop()
  const token = getToken(req)

  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { username } = verifyToken(token) as { username: string }
    const updatedData = await req.json()

    const user = await UserData.findOne({ username })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const expense = user.expenses.id(id)
    if (!expense) return NextResponse.json({ error: 'Expense not found' }, { status: 404 })

    Object.assign(expense, updatedData)
    await user.save()

    return NextResponse.json({ success: true, message: 'Expense updated' })
  } catch (err) {
    console.error('PUT Error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
