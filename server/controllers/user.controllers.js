import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from '../models/user.models.js'
import { emitEvent, sendToken } from '../utils/features.js';
import { compare } from 'bcrypt';
import { ErrorHandler } from '../utils/ErrorHandler.js';
import { ApiResponce } from '../utils/ApiResponce.js';
import { cookieOption } from '../constants/cookieOptions.js';
import { Chat } from '../models/chat.models.js'
import { Request } from '../models/request.models.js'
import { NEW_REQUEST, REFETCH_CHATS } from '../constants/events.js';
import { getOtherMembers } from '../lib/helper.js';
import {uploadFiles, deleteFiles} from '../utils/features.js'

const login = asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;
    // console.log(req.body)
    if (!username) {
        return next(new ErrorHandler("Invalid username", 404));
    }
    const user = await User.findOne({ username }).select("+password");
    if(!user){
        return next(new ErrorHandler("User does not exist",404))
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
        return next(new ErrorHandler("Invalid password", 404));
    }
    sendToken(res, user, 200, "user found")
})

const register = asyncHandler(async (req, res, next) => {
    
    const file = req.file;
    // console.log(file)

    const { name, username, password, bio } = req.body

     if(!file || file.length == 0){
        return next(new ErrorHandler("please upload avatar",400))
     }

     const result = await uploadFiles([file])
     const avatar = {
        public_id: result[0].public_id,
        url: result[0].url
    }
     
    const user = await User.create({
        name,
        username,
        password,
        bio,
        avatar,
    })
    const createdUser = await User.findById(user._id).select("-password");
    sendToken(res, createdUser, 201, "User created")
})

const getMyProfile = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    })
})

const logout = asyncHandler(async (req, res, next) => {
    return res.status(200).cookie("apna-tele-token", "", { ...cookieOption, maxAge: 0 }).json({
        success: true,
        message: "Logged out successfully"
    })
})

const searchUser = asyncHandler(async (req, res, next) => {
    const { name ="" } = req.query;
    const mychats = await Chat.find({
        groupChat: false,
        members: req.user['_id']
    })

    const allUsersMyChat = mychats.flatMap((chat) => chat.members)

    const otherUsers = await User.find({
        _id: { $nin: allUsersMyChat },
        name: { $regex: name, $options: "i" }
    })

    const users = otherUsers.map(({ _id, name, avatar }) => ({ _id, name, avatar: avatar.url }))

    return res.status(200).json({
        success: true,
        users,
    })
})

const sendRequest = asyncHandler(async (req, res, next) => {
    const { userId } = req.body;
    // console.log(userId)

    const oldRequest = await Request.findOne({
        $or: [
            { sender: req.user['_id'], receiver: userId },
            { sender: userId, receiver: req.user['_id'] },
        ]
    });
    if (oldRequest) return next(new ErrorHandler("Request already sent"));

    const newRequest = await Request.create({
        sender: req.user['_id'],
        receiver: userId
    })

    emitEvent(req, NEW_REQUEST, [userId])

    return res.status(200).json({
        success: true,
        message: "request sent"
    })

})

const acceptRequest = asyncHandler(async (req, res, next) => {
    const { requestId, accept } = req.body;
    // console.log(req.body)
    const request = await Request.findById(requestId).populate("sender", "name").populate("receiver", "name")

    if (!request) return next(new ErrorHandler("Request not found", 404));

    if (request.receiver['_id'].toString() !== req.user['_id'].toString()) return next(new ErrorHandler("not are not authorized to accept the request", 401));

    if (!accept) {
        await request.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Friend Request Rejected"
        })
    }

    const members = [request.sender._id, request.receiver._id]

    await Promise.all([
        Chat.create({
            members,
            name: `${request.sender.name} - ${request.receiver.name}`
        }),
        request.deleteOne(),
    ])

    emitEvent(req, REFETCH_CHATS, members)
    return res.status(200).json({
        success: true,
        message: "Frined Request Accepted",
        senderId: request.sender._id
    })
})

const getAllNotifications = asyncHandler(async (req, res, next) => {
    const requests = await Request.find({ receiver: req.user['_id'] }).populate("sender", "avatar name")
    const allRequests = requests.map(({ _id, sender }) => ({
        _id,
        sender: {
            _id: sender._id,
            name: sender.name,
            avatar: sender.avatar.url,
        }
    }))

    return res.status(200).json({
        success: true,
        allRequests,
    })
})

const getAllFriends = asyncHandler(async (req, res, next) => {
    const chatId = req.query.chatId;
    const chats = await Chat.find({
        members: req.user['_id'],
        groupChat: false,
    }).populate("members", "name avatar");

    const friends = chats.map(({members})=>{
        const otherUser = getOtherMembers(members,req.user['_id']);
        return {
            _id: otherUser._id,
            name: otherUser.name,
            avatar: otherUser.avatar
        }
    })

    if(chatId){
        const chat = await Chat.findById(chatId);
        const availableFriends = friends.filter((friend)=> !chat.members.includes(friend._id));
        return res.status(200).json({
            success: true,
            friends: availableFriends
        })

    } else{
        return res.status(200).json({
            success: true,
            friends
        })
    }

})




export {
    login,
    register,
    getMyProfile,
    logout,
    searchUser,
    sendRequest,
    acceptRequest,
    getAllNotifications,
    getAllFriends
}