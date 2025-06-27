import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

// 👇 Fix: tell TypeScript about global.mongoose
declare global {
  var mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

const globalForMongoose = global as typeof globalThis & {
  mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

// 👇 Use globalForMongoose instead of global directly
globalForMongoose.mongoose ??= { conn: null, promise: null }

async function dbConnect() {
  if (globalForMongoose.mongoose.conn) return globalForMongoose.mongoose.conn
  if (!globalForMongoose.mongoose.promise) {
    globalForMongoose.mongoose.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
  }
  globalForMongoose.mongoose.conn = await globalForMongoose.mongoose.promise
  return globalForMongoose.mongoose.conn
}

export default dbConnect
