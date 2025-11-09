import mongoose from "mongoose";

let isConnected = false;

const ConnectToDB = async () => {
  if (isConnected) return console.log("Using existing MongoDB connection");

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("Connected to MongoDB");
    console.log("Using DB:", mongoose.connection.name);

  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default ConnectToDB;
