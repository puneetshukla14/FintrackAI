import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  monthlySalary: { type: Number, required: true },
}, { timestamps: true })

export default mongoose.models.Profile || mongoose.model('Profile', profileSchema)
