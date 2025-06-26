import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!
if (!MONGODB_URI) throw new Error('Missing MONGODB_URI')

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return
  await mongoose.connect(MONGODB_URI, { dbName: 'expensexpro' })
}
export default dbConnect
