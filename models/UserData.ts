import mongoose from 'mongoose'

const userDataSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    profile: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      monthlySalary: { type: Number, default: 0 }, // ✅ required field default
      bio: { type: String, default: '' },
      phone: { type: String, default: '' },
      dob: { type: String, default: '' },
      address: { type: String, default: '' },
      gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        default: 'Other', // ✅ safe fallback
      },
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
