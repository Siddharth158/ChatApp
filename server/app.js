import express from 'express'
import userRoute from './routes/user.routes.js';
import { connectDb } from './utils/features.js';
import dotenv from 'dotenv'
import { errorMiddleware } from './middlewares/error.js';
import cookieParser from 'cookie-parser';

//dot env configurations
dotenv.config({
    path: "./.env",
});

const port = process.env.PORT || 3000
const mongoUri = process.env.MONGODB_URI
connectDb(mongoUri);

const app = express();
app.use(express.json());
app.use(cookieParser());

// user routes as the middleware with /user as the prefix in the url
app.use("/user",userRoute);


app.use(errorMiddleware);
app.listen(port,()=>{
    console.log("app is listening on 3000");
})