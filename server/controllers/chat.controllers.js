import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { Chat } from '../models/chat.models.js';
import { emitEvent } from "../utils/features.js";
import { ALERT, REFETCH_CHATS } from '../constants/events.js'
import { getOtherMembers } from "../lib/helper.js";
import { User } from "../models/user.models.js";

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

    if(!userRemoved) return next(new ErrorHandler("can not find the user",404));

    if(!chat.members.includes(userId.toString())) return next(new ErrorHandler("user is not in the group",400));

    chat.members = chat.members.filter((member) => member.toString() !== userId.toString())

    await chat.save();

    emitEvent(req,ALERT,chat.members,`${userRemoved} has been removed from the group`);

    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
        success:true,
        message:"member removed successfully"
    })
})

const leaveGroup = asyncHandler(async (req,res,next)=>{
    const chatId = req.params.id;
    const chat = await Chat.findById(chatId);
    if(!chat) return next(new ErrorHandler("Chat not found",404));

    if(!chat.groupChat) return next(new ErrorHandler("this is not a group chat",400));
    
    if (chat.members.length <= 3) return next(new ErrorHandler("Group must include 3 members atleast", 400));

    const remainingMembers = chat.members.filter((member)=>member.toString() !== req.user['_id'].toString())

    if(chat.creator.toString() === req.user['_id'].toString()){
        const newCreator = remainingMembers[0];
        chat.creator = newCreator;
    }

    chat.members = remainingMembers;
    await chat.save();

    emitEvent(req, ALERT, chat.member,`user ${req.user.name} has left the group`);

    res.status(200).json({
        success: true,
        message:"group left successfully"
    })

})

export { newGroupChat, getMyChat, getMyGroups, addMembers, removeMembers, leaveGroup }