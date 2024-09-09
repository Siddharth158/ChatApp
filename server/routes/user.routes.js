import express from 'express'
//controllers holds all the functionality for the the routes that is simply then have all the functions which are requires by the routes
import { acceptRequest, getAllFriends, getAllNotifications, getMyProfile, login, logout, register, searchUser, sendRequest } from '../controllers/user.controllers.js';
import { muterUpload } from '../middlewares/multer.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { acceptRequestValidator, loginValidator, registerValidator, sendRequestValidator, validate } from '../lib/validators.js';

const router = express.Router();

router.route("/register").post(muterUpload.single("avatar"), registerValidator(), validate, register)

router.route("/login").post(loginValidator(), validate, login)


//protected routes
router.use(isAuthenticated)
router.route("/me").get(getMyProfile)
router.route("/logout").get(logout)
router.route("/search").get(searchUser)
router.route("/send-request").put(sendRequestValidator(), validate, sendRequest)
router.route("/accept-request").put(acceptRequestValidator(), validate, acceptRequest)
router.route("/notifications").get(getAllNotifications)
router.route("/friends").get(getAllFriends)


export default router