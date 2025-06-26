// models/userProfile.ts
import mongoose from 'mongoose'

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  monthlySalary: {
    type: Number,
    required: false, // or true if you want
    default: 0
  },
  bio: String,
  dob: String,
  address: String,
  phone: String
}, { timestamps: true })

export default mongoose.models.UserProfile || mongoose.model('UserProfile', userProfileSchema)
