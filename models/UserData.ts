import mongoose from 'mongoose'

const userDataSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },

    profile: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      dob: { type: String, default: '' },
      address: { type: String, default: '' },
      bio: { type: String, default: '' },

      gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        default: 'Other',
      },
      avatar: { type: String, default: '' },
      monthlySalary: { type: Number, default: 0 },
      salaryDate: { type: String, default: '' },
      bankBalance: { type: Number, default: 0 },
      location: { type: String, default: '' },

      currency: { type: String, default: 'INR' },
      expenseLimit: { type: Number, default: 0 },
      savingsGoal: { type: Number, default: 0 },
      startDate: { type: Date, default: Date.now },
    },

    expenses: [
      {
        amount: { type: Number, default: 0 },
        date: { type: String, default: '' },
        category: { type: String, default: '' },
        notes: { type: String, default: '' },
        location: { type: String, default: '' },
      },
    ],

    credits: [
      {
        amount: { type: Number, required: true },
        date: { type: String, default: () => new Date().toISOString() },
        source: { type: String, default: 'Manual Add' },
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.models.UserData || mongoose.model('UserData', userDataSchema)
