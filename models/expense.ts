// models/expense.ts
import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: Number,
  date: String,
  category: String,
  notes: String,
  location: String
}, { timestamps: true })

export default mongoose.models.Expense || mongoose.model('Expense', expenseSchema)
