import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    await mongoose.connect("mongodb+srv://sadiqmuhammad795:sadiqkhang123@cluster0.9zt68tx.mongodb.net/",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "E-Commerce_Backend"
      } as Parameters<typeof mongoose.connect>[1]
    );
    console.log('MongoDb is connected');
  } catch (error: any) {
    console.log(error.message);
  }
};

export default connectDb;
