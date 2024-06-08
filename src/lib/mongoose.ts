import mongoose from "mongoose";
let isConnected = false;

export async function connectToDB() {
  const MONGODB_URL = process.env.MONGODB_URL;
  if (!MONGODB_URL) return console.log("Missing MongoDB URL");
  if (isConnected) {
    console.log("MongoDB connection already established");
    return;
  }

  try {
    const mongodbInstance = await mongoose.connect(
      `${MONGODB_URL}/thread-clone`
    );
    isConnected = true;
    console.log(`MongoDB connected ${mongodbInstance.connection.name}`);
  } catch (error) {
    console.log(error);
  }
}
