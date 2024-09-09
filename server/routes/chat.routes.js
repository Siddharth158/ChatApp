import express from 'express'
import { isAuthenticated } from '../middlewares/auth.js';
import { newGroupChat, getMyChat, getMyGroups, addMembers, removeMembers, leaveGroup, sendAttachments, getChatDetails, renameGroup, deleteChat, getMessages } from '../controllers/chat.controllers.js';
import { attachmentsMulter } from '../middlewares/multer.js';
import { addMemberValidator, chatIdValidator, newGroupValidator, removeMemberValidator, renameValidator, sendAttchmentValidator, validate } from '../lib/validators.js';

const router = express.Router();

//protected routes
router.use(isAuthenticated)
router.route("/new").post(newGroupValidator(), validate, newGroupChat)
router.route("/my").get(getMyChat)
router.route("/my/groups").get(getMyGroups)
router.route("/addmembers").put(addMemberValidator(), validate, addMembers)
router.route("/removemember").delete(removeMemberValidator(), validate, removeMembers)
router.route("/leave/:id").delete(chatIdValidator(), validate, leaveGroup);
router.route("/message").post(sendAttchmentValidator(), validate, attachmentsMulter, sendAttachments)
router.route("/message/:id").get(chatIdValidator(), validate, getMessages)


// in case of recieving the id as parameter just after the / we have to put in tha last as all the routes below them will also be taking the parameters
router.route("/:id")
    .get(chatIdValidator(), validate, getChatDetails)
    .put(renameValidator(), validate, renameGroup)
    .delete(chatIdValidator(), validate, deleteChat);


export default router