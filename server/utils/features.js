import mongoose from "mongoose";
import { ApiResponce } from "./ApiResponce.js";
import jwt from "jsonwebtoken";
import { cookieOption } from "../constants/cookieOptions.js";


const connectDb = (uri) => {
    mongoose.connect(uri)
        .then((data) => {
            console.log(`connected to DB: ${data.connection.host}`)
        })
        .catch((err) => { throw err })
}

const sendToken = (res, user, code, message) => {

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    return res.status(code).cookie("apna-tele-token", token, cookieOption).json(new ApiResponce(201, "", message))
}


const emitEvent = (req,event,users,data)=>{
    console.log("emitting event", event)
}

const deleteFiles = async(public_ids) =>{

}

export { connectDb, sendToken, emitEvent, deleteFiles }