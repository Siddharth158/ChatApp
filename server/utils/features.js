import mongoose from "mongoose";
import { ApiResponce } from "./ApiResponce.js";
import jwt from "jsonwebtoken";
import { cookieOption } from "../constants/cookieOptions.js";
import {v2 as cloudinary} from 'cloudinary'
import { v4 as uuid } from 'uuid'
import { getBase64 } from "../lib/helper.js";


const connectDb = (uri) => {
    mongoose.connect(uri)
        .then((data) => {
            console.log(`connected to DB: ${data.connection.host}`)
        })
        .catch((err) => { throw err })
}

const sendToken = (res, user, code, message) => {

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    return res.status(code).cookie("apna-tele-token", token, cookieOption).json({
        success: true,
        message
    })
}


const emitEvent = (req, event, users, data) => {
    console.log("emitting event", event)
}

const uploadFiles = async (files = []) => {
    const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(getBase64(file), {
                resource_type: "auto",
                public_id: uuid()
            }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            })
        })
    })

    try {
        const results = await Promise.all(uploadPromises);
        const formattedResults = results.map(result=>({
            public_id: result.public_id,
            url: result.secure_url
        }))
        return formattedResults;
    } catch (error) {
        throw new Error("Error uploading files to cloudinary",error);
    }
}

const deleteFiles = async (public_ids) => {

}

export { connectDb, sendToken, emitEvent, deleteFiles, uploadFiles }