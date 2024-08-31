import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import jwt from 'jsonwebtoken';

const isAuthenticated = asyncHandler(async(req,res,next)=>{
    const token = req.cookies["apna-tele-token"];
    // console.log(token)
    if(!token)
        return next(new ErrorHandler("Please login to access this route", 401));

    const decodedData = jwt.verify(token,process.env.JWT_SECRET);
    // console.log(decodedData)
    req.user = await User.findById(decodedData._id);
    // console.log(req.user)
    next();
})

export {isAuthenticated}