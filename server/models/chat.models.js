import mongoose, { Schema, model, models } from "mongoose";

const schema = new Schema({
    name:{
        type: String,
        required: true,
    },
    groupChat: {
        type: Boolean,
        default: false,
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
        
    },
    members: [
        {
            types: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ]
},{timestamps:true})

export const Chat = models.Chat || model('Chat', schema);