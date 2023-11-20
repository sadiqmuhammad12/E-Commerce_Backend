import express from 'express';
import bodyParser from 'body-parser';
// import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes'
import categoryRoutes from './routes/categoryRoutes'
import connectDb from './db';
import morgan = require('morgan');


const app = express();
const PORT = process.env.PORT || 3000;

connectDb();

app.use(bodyParser.urlencoded({ extended: true }));   
app.use(bodyParser.json());
app.use(morgan('tiny'))


app.use('/', userRoutes);
app.use('/', productRoutes);
app.use('/', categoryRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
