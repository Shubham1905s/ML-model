import mongoose from "mongoose";

let connectionPromise;

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (connectionPromise) {
    return connectionPromise;
  }

  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
  const dbName = process.env.MONGODB_DB || "stayease";

  mongoose.set("strictQuery", true);

  connectionPromise = mongoose.connect(uri, {
    dbName
  });
  await connectionPromise;

  return mongoose.connection;
}
