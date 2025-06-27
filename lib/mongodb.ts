import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('❌ Please define the MONGODB_URI environment variable');
}

// 👇 Define types properly for global caching
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// 👇 Attach to globalThis
declare global {
  // This allows hot-reloading in dev + avoids type error in prod
  var _mongoose: MongooseCache | undefined;
}

const globalWithMongoose = globalThis as typeof globalThis & {
  _mongoose: MongooseCache;
};

// 👇 Initialize if not already
if (!globalWithMongoose._mongoose) {
  globalWithMongoose._mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
  if (globalWithMongoose._mongoose.conn) return globalWithMongoose._mongoose.conn;

  if (!globalWithMongoose._mongoose.promise) {
    globalWithMongoose._mongoose.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  globalWithMongoose._mongoose.conn = await globalWithMongoose._mongoose.promise;
  return globalWithMongoose._mongoose.conn;
}

export default dbConnect;
