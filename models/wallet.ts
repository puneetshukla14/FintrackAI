// models/wallet.ts
import mongoose, { Schema } from 'mongoose'

const WalletSchema = new Schema({
  bank: { type: Number, required: true },
  upi: { type: Number, required: true },
  cash: { type: Number, required: true },
  card: { type: Number, required: true }
})

export default mongoose.models.Wallet || mongoose.model('Wallet', WalletSchema)