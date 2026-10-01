import mongoose from "mongoose";

export const connectAuthDB = async (mongoUri) => {
  if (!mongoUri) {
    throw new Error("MongoDB URI is required");
  }

  try {
    const connection = await mongoose.connect(mongoUri);

    console.log(
      `AuthFlow MongoDB connected: ${connection.connection.host}`
    );

    return connection;
  } catch (error) {
    console.error(
      "AuthFlow MongoDB connection failed:",
      error.message
    );

    throw error;
  }
};