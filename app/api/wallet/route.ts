// app/api/wallet/route.ts
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Expense from '@/models/expense'

const allowedMethods = ['Cash', 'Card', 'UPI', 'Wallet', 'Bank Transfer']

export async function GET() {
  try {
    await dbConnect()

    const expenses = await Expense.find({}, { amount: 1, paymentMethod: 1 })

    const methodTotals: Record<string, number> = {
      Cash: 0,
      Card: 0,
      UPI: 0,
      Wallet: 0,
      'Bank Transfer': 0,
      Other: 0,
    }

    for (const expense of expenses) {
      const raw = expense.paymentMethod?.trim().toLowerCase() || 'other'

      let method = allowedMethods.find(
        (m) => m.toLowerCase().replace(/\s/g, '') === raw.replace(/\s/g, '')
      )

      if (!method) method = 'Other'

      methodTotals[method] += expense.amount
    }

    return NextResponse.json({ success: true, data: methodTotals }, { status: 200 })
  } catch (error: any) {
    console.error('❌ Wallet API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch payment method totals' },
      { status: 500 }
    )
  }
}
