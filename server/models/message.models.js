import { Schema, model, models } from "mongoose";

const schema = new Schema({
    sender: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
        
    },
    chat: {
        type: mongoose.Types.ObjectId,
        ref: 'Chat',
        required: true,
        
    },
    content:{
        type: String,
    },
    attachments: [
        {
            publid_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ]
},{timestamps:true})

export const Message = models.Message || model('Message', schema);