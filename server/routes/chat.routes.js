import express from 'express'
import { isAuthenticated } from '../middlewares/auth.js';
import { newGroupChat,getMyChat, getMyGroups,addMembers, removeMembers, leaveGroup, sendAttachments, getChatDetails, renameGroup, deleteChat, getMessages } from '../controllers/chat.controllers.js';
import { attachmentsMulter } from '../middlewares/multer.js';

const router = express.Router();

//protected routes
router.use(isAuthenticated)
router.route("/new").post(newGroupChat)
router.route("/my").get(getMyChat)
router.route("/my/groups").get(getMyGroups)
router.route("/addmembers").put(addMembers)
router.route("/removemember").delete(removeMembers)
router.route("/leave/:id").delete(leaveGroup);
router.route("/message").post(attachmentsMulter, sendAttachments)
router.route("/message/:id").get(getMessages)


// in case of recieving the id as parameter just after the / we have to put in tha last as all the routes below them will also be taking the parameters
router.route("/:id").get(getChatDetails).put(renameGroup).delete(deleteChat);


export default router