import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!
if (!MONGODB_URI) throw new Error('Please define MONGODB_URI')

type MongooseCache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
declare global { var mongooseCache: MongooseCache }
const globalCache = globalThis as typeof globalThis & { mongooseCache: MongooseCache }
if (!globalCache.mongooseCache) globalCache.mongooseCache = { conn: null, promise: null }

export default async function dbConnect(): Promise<typeof mongoose> {
  if (globalCache.mongooseCache.conn) return globalCache.mongooseCache.conn
  if (!globalCache.mongooseCache.promise) {
    globalCache.mongooseCache.promise = mongoose.connect(MONGODB_URI, { dbName: 'expensexpro' })
  }
  globalCache.mongooseCache.conn = await globalCache.mongooseCache.promise
  return globalCache.mongooseCache.conn
}