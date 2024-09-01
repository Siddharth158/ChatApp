import express from 'express'
import { isAuthenticated } from '../middlewares/auth.js';
import { newGroupChat,getMyChat, getMyGroups,addMembers, removeMembers, leaveGroup } from '../controllers/chat.controllers.js';

const router = express.Router();

//protected routes
router.use(isAuthenticated)
router.route("/new").post(newGroupChat)
router.route("/my").get(getMyChat)
router.route("/my/groups").get(getMyGroups)
router.route("/addmembers").put(addMembers)
router.route("/removemember").delete(removeMembers)
router.route("/leave/:id").delete(leaveGroup);


export default router