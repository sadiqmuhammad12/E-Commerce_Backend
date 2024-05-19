import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDb = async () => {
  try {
    if (!process.env.mongodbUrl) {
      throw new Error('MongoDB URL is not defined');
   }
    await mongoose.connect(process.env.mongodbUrl,
      {
        dbName: "E-Commerce_Backend"
      }
    );
    console.log('MongoDb is connected');
  } catch (error: any) {
    console.log(error.message);
  }
};

export default connectDb;
