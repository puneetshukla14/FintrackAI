// File: lib/aiInsights.ts

import { getMonth } from 'date-fns'

export function generateMonthlyInsights(expenses: { date: string; amount: number }[]): string {
  if (!expenses.length) return 'No expenses found for this year. Start logging your expenses regularly 💰.'

  const monthlyTotals: number[] = Array(12).fill(0)

  for (const exp of expenses) {
    const date = new Date(exp.date)
    if (!isNaN(date.getTime())) {
      const month = getMonth(date) // 0 = Jan
      monthlyTotals[month] += exp.amount || 0
    }
  }

  const totalSpent = monthlyTotals.reduce((acc, val) => acc + val, 0)
  const avg = totalSpent / 12

  const max = Math.max(...monthlyTotals)
  const min = Math.min(...monthlyTotals)

  const maxMonth = monthlyTotals.indexOf(max)
  const minMonth = monthlyTotals.indexOf(min)

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const percentageDiff = (a: number, b: number) => Math.abs(((a - b) / ((a + b) / 2)) * 100).toFixed(1)

  const maxVsAvg = percentageDiff(max, avg)
  const minVsAvg = percentageDiff(min, avg)

  return `
📅 Yearly Overview:
- 🧾 Total Spent: ₹${totalSpent.toLocaleString()}
- 📊 Monthly Average: ₹${avg.toFixed(0)}
  
📈 Highest Spend: ${monthNames[maxMonth]} (₹${max.toLocaleString()}) — ${maxVsAvg}% above average
📉 Lowest Spend: ${monthNames[minMonth]} (₹${min.toLocaleString()}) — ${minVsAvg}% below average

🧠 Tip: Try to reduce the peak in ${monthNames[maxMonth]} and maintain a steady flow like in ${monthNames[minMonth]} for better financial health. 💡
`.trim()
}
