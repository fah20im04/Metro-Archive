import mongoose from "mongoose";

// Read the MongoDB connection string from the environment.
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to your .env.local file");
}

// Store the connection globally to reuse it during development.
const globalForMongoose = globalThis as typeof globalThis & {
  mongooseConnection?: Promise<typeof mongoose>;
};

async function connectDB() {
  if (!globalForMongoose.mongooseConnection) {
    globalForMongoose.mongooseConnection = mongoose
      .connect(MONGODB_URI)
      .catch((error) => {
        globalForMongoose.mongooseConnection = undefined;
        throw error;
      });
  }

  return globalForMongoose.mongooseConnection;
}

export default connectDB;