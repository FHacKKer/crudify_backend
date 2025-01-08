import mongoose from "mongoose";
import { env } from "./env";

// function to connect with database
const connectToDB = async () => {
  try {
    const { MONGODB_URI } = env(); // getting MONGODB_URI from environment variable
    const conn = await mongoose.connect(MONGODB_URI); // connecting with database
    if (conn) {
      console.log(`Connected with db ${conn.connection.host}`);
    }
  } catch (error) {
    // failed to connect with database, throwing error
    throw new Error(`Failed To Connect with Database : ${error}`);
  }
};

export default connectToDB;
