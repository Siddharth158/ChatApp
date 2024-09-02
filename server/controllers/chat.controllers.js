import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { Chat } from '../models/chat.models.js';
import { deleteFiles, emitEvent } from "../utils/features.js";
import { ALERT, NEW_ATTACHMENT, NEW_MESSAGE_ALERT, REFETCH_CHATS } from '../constants/events.js'
import { getOtherMembers } from "../lib/helper.js";
import { User } from "../models/user.models.js";
import { Message } from "../models/message.models.js"

const newGroupChat = asyncHandler(async (req, res, next) => {
    const { name, members } = req.body;
    if (members.length < 2) {
        return next(new ErrorHandler("group chat must have atleast 3 members", 400))
    }

    const allMembers = [...members, req.user["_id"]];
    await Chat.create({
        name,
        groupChat: true,
        creator: req.user["_id"],
        members: allMembers
    })
    emitEvent(req, ALERT, allMembers, `Welcome to ${name}group`);
    emitEvent(req, REFETCH_CHATS, members);
    return res.status(201).json({
        sucess: true,
        message: "Group created"
    })
});

const getMyChat = asyncHandler(async (req, res) => {
    const chats = await Chat.find({ members: req.user["_id"] }).populate("members", "name avatar");

    const transformedChats = chats.map(({ _id, name, groupChat, members }) => {

        const otherMember = getOtherMembers(members, req.user["_id"]);

        return {
            _id,
            name: groupChat ? name : otherMember.name,
            groupChat,
            avatar: groupChat ? members.slice(0, 3).map(({ avatar }) => avatar.url) : [otherMember.avatar.url],
            members: members.reduce((prev, curr) => {
                if (curr._id.toString() !== req.user["_id"].toString()) {
                    prev.push(curr._id);
                }
                returnprev;
            }, [])
        }
    })

    return res.status(201).json({
        success: true,
        chats: transformedChats
    })
})

const getMyGroups = asyncHandler(async (req, res) => {
    const groups = await Chat.find({ creator: req.user['_id'], groupChat: true }).populate("members", "name avatar");

    const transformedGroups = groups.map(({ members, _id, groupChat, name }) => ({
        _id,
        name,
        groupChat,
        avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
    }))
    return res.status(200).json({
        sucess: true,
        message: transformedGroups
    })
})

const addMembers = asyncHandler(async (req, res, next) => {
    const { chatId, members } = req.body;
    const chat = await Chat.findById(chatId)
    if (!chat) {
        return next(new ErrorHandler("chat not found", 400));
    }
    if (!chat.groupChat) {
        return next(new ErrorHandler("cannot add members to a private chat", 400));
    }

    if (!members || members.length < 1) {
        return next(new ErrorHandler("Please provide members to add", 400));
    }

    if (chat.creator.toString() !== req.user['_id'].toString()) return next(new ErrorHandler("you are not the creator of the group", 400));

    const allNewMembersPromise = members.map((member) => User.findById(member, "name"));

    const allNewMember = await Promise.all(allNewMembersPromise);

    const uniqueMembers = allNewMember.filter((member) => !chat.members.includes(member._id.toString())).map((member) => member._id);

    chat.members.push(...uniqueMembers);

    if (chat.members.length > 100) {
        return next(new ErrorHandler("GRoup member limit reached", 400))
    }

    await chat.save();

    const allUserName = allNewMember.map((member) => member.name).join(",");

    emitEvent(req, ALERT, chat.members, `${allUserName} has beed added in the group`);

    emitEvent(req, REFETCH_CHATS, chat.members);

    res.status(200).json({
        success: true,
        message: "Members added successfully"
    });

})

const removeMembers = asyncHandler(async (req, res, next) => {
    const { userId, chatId } = req.body;
    const [chat, userRemoved] = await Promise.all([
        Chat.findById(chatId),
        Chat.findById(userId, "name"),
    ])

    if (!chat) return next(new ErrorHandler("chat not found", 404));
    if (!chat.groupChat) return next(new ErrorHandler("Can not remove member from a private chat"));

    if (chat.creator.toString() !== req.user['_id'].toString()) return next(new ErrorHandler("you are not allowed to remove members", 403));

    if (chat.members.length <= 3) return next(new ErrorHandler("Group must include 3 members atleast", 400));

    if (!userRemoved) return next(new ErrorHandler("can not find the user", 404));

    if (!chat.members.includes(userId.toString())) return next(new ErrorHandler("user is not in the group", 400));

    chat.members = chat.members.filter((member) => member.toString() !== userId.toString())

    await chat.save();

    emitEvent(req, ALERT, chat.members, `${userRemoved} has been removed from the group`);

    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
        success: true,
        message: "member removed successfully"
    })
})

const leaveGroup = asyncHandler(async (req, res, next) => {
    const chatId = req.params.id;
    const chat = await Chat.findById(chatId);
    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    if (!chat.groupChat) return next(new ErrorHandler("this is not a group chat", 400));

    if (chat.members.length <= 3) return next(new ErrorHandler("Group must include 3 members atleast", 400));

    const remainingMembers = chat.members.filter((member) => member.toString() !== req.user['_id'].toString())

    if (chat.creator.toString() === req.user['_id'].toString()) {
        const newCreator = remainingMembers[0];
        chat.creator = newCreator;
    }

    chat.members = remainingMembers;
    await chat.save();

    emitEvent(req, ALERT, chat.member, `user ${req.user.name} has left the group`);

    res.status(200).json({
        success: true,
        message: "group left successfully"
    })

})

const sendAttachments = asyncHandler(async (req, res, next) => {
    const { chatId } = req.body;
    const chat = await Chat.findById(chatId);

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    const files = req.files || []
    if (files.length < 1) return next(new ErrorHandler("Please provide attachments", 400));

    //upload on cloudinary
    const attachments = [];
    const messageOnDb = {
        content: "",
        attachments,
        sender: req.user['_id'],
        chat: chatId
    }

    const messageOnSocket = {
        ...messageOnDb,
        sender: {
            _id: req.user['_id'],
            name: req.user.name
        }
    }

    const message = await Message.create(messageOnDb);
    console.log(message)

    emitEvent(req, NEW_ATTACHMENT, chat.members, {
        message: messageOnSocket,
        chatId
    })

    emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId })

    return res.status(200).json({
        success: true,
        message
    })
})

const getChatDetails = asyncHandler(async (req, res, next) => {
    if (req.query.populate === "true") {
        const chat = await Chat.findById(req.params.id).populate("members", "name avatar").lean();

        if (!chat) return next(new ErrorHandler("Chat not found", 404));

        chat.members = chat.members.map(({ _id, name, avatar }) => (
            {
                _id,
                name,
                avatar: avatar.url,
            }
        ))


        return res.status(200).json({
            success: true,
            chat
        })
    } else {
        const chat = await Chat.findById(req.params.id);
        if (!chat) return next(new ErrorHandler("Chat not found", 404));
        return res.status(200).json({
            success: true,
            chat
        })
    }
})

const renameGroup = asyncHandler(async (req, res, next) => {
    const chatId = req.params.id;
    const { name } = req.body;
    const chat = await Chat.findById(chatId);
    if (!chat) return next(new ErrorHandler("Chat not found", 404));
    if (!chat.groupChat) return next(new ErrorHandler("this is not a group chat", 400));
    if (chat.creator.toString() !== req.user['_id'].toString()) return next(new ErrorHandler("You are not allowed to rename the group", 403));
    chat.name = name;
    await chat.save();
    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
        success: true,
        message: "group name changed successfully"
    })
})

const deleteChat = asyncHandler(async (req, res, next) => {
    const chatId = req.params.id;
    const chat = await Chat.findById(chatId);
    if (!chat) return next(new ErrorHandler("Chat not found", 404));
    if (chat.groupChat && chat.creator.toString() !== req.user['_id'].toString()) {
        return next(new ErrorHandler("You are not allowed to delete the chat", 403));
    }

    if (chat.groupChat && !chat.members.includes(req.user['_id'].toString())) {
        return next(new ErrorHandler("You are not allowed to delete the chat", 403));
    }

    const messageWithAttachments = await Message.find({
        chat: chatId,
        attachments: {
            $exists: true,
            $ne: [],    //ne == not equal to
        }
    })
    const public_ids = [];

    messageWithAttachments.forEach(({ attachments }) => {
        attachments.forEach(({ public_id }) => {
            public_ids.push(public_id);
        })
    })

    await Promise.all([
        deleteFiles(public_ids),
        chat.deleteOne(),
        Message.deleteMany({ chat: chatId })
    ])

    emitEvent(req, REFETCH_CHATS, chat.members);
    return res.status(200).json({
        success: true,
        message: "chat deleted successfully"
    })

})

const getMessages = asyncHandler(async (req, res, next) => {
    const chatId = req.params.id;
    const { page = 1 } = req.query;
    const limit = 20;
    const skip = (page - 1) * limit;

    const [messages, totalMessageCount] = await Promise.all([
        Message.find({ chat: chatId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("sender", "name")
            .lean(),
        Message.countDocuments({ chat: chatId })
    ])

    const totalPages = Math.ceil(totalMessageCount / limit) || 0;

     return res.status(200).json({
        success: true,
        messages: messages.reverse(),
        totalPages
     })

})

export { newGroupChat, getMyChat, getMyGroups, addMembers, removeMembers, leaveGroup, sendAttachments, getChatDetails, renameGroup, deleteChat, getMessages }