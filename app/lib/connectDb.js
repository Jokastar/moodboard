import mongoose from "mongoose";

const DATABASE_URL = process.env.MONGODB_URL || "mongodb+srv://kevinlolaka:Jokastar@cluster0.dsqagpa.mongodb.net/moodboard?retryWrites=true&w=majority&appName=Cluster0";

if (!DATABASE_URL) {
  throw new Error("Please define the DATABASE_URL environment variable inside .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    console.log("Using existing mongo database connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,  // This option disables mongoose buffering, requiring a connection to send operations to the server.
    };

    cached.promise = mongoose.connect(DATABASE_URL, opts).then((mongoose) => {
      console.log("Database connected successfully"); // Log on successful connection
      return mongoose;
    }).catch(err => {
      console.error("Database connection failed", err); // Log if connection attempt fails
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
