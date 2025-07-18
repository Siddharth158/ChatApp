import { APNA_TELE_TOKEN } from "../constants/config.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import jwt from 'jsonwebtoken';

const isAuthenticated = asyncHandler(async(req,res,next)=>{
    const token = req.cookies[APNA_TELE_TOKEN];
    // console.log(token)
    if(!token)
        return next(new ErrorHandler("Please login to access this route", 401));

    const decodedData = jwt.verify(token,process.env.JWT_SECRET);
    // console.log(decodedData)
    req.user = await User.findById(decodedData._id);
    // console.log(req.user)
    next();
})

const socketAuthenticator = async (err, socket, next)=>{
    try {
        if(err) return next(err)
        
        const authToken = socket.request.cookies[APNA_TELE_TOKEN]

        if(!authToken) return next(new ErrorHandler("Please login to access this route", 401))

        const decodedData = jwt.verify(authToken, process.env.JWT_SECRET)
        const user =  await User.findById(decodedData._id)

        if(!user) return next(new ErrorHandler("Please login to access this route", 401))
        socket.user = user

        return next();
    } catch (error) {
        console.log(error)
        return next(new ErrorHandler("Please login to access this route", 401))
    }
}

export {isAuthenticated, socketAuthenticator}