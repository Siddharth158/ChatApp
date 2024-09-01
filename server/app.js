import express from 'express'
import { connectDb } from './utils/features.js';
import dotenv from 'dotenv'
import { errorMiddleware } from './middlewares/error.js';
import cookieParser from 'cookie-parser';
import userRoute from './routes/user.routes.js';
import chatRoute from './routes/chat.routes.js';
import { createUser } from './seeders/user.seeder.js';

//dot env configurations
dotenv.config({
    path: "./.env",
});

const port = process.env.PORT || 3000
const mongoUri = process.env.MONGODB_URI
connectDb(mongoUri);
// createUser(10);

const app = express();
app.use(express.json());
app.use(cookieParser());

// user routes as the middleware with /user as the prefix in the url
app.use("/user",userRoute);
app.use("/chat",chatRoute);


app.use(errorMiddleware);
app.listen(port,()=>{
    console.log("app is listening on 3000");
})