import express from 'express'
//controllers holds all the functionality for the the routes that is simply then have all the functions which are requires by the routes
import { getMyProfile, login,logout,register, searchUser } from '../controllers/user.controllers.js';
import { muterUpload } from '../middlewares/multer.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.route("/register").post(muterUpload.single("avatar"), register)
router.route("/login").post(login)


//protected routes
router.use(isAuthenticated)
router.route("/me").get(getMyProfile)
router.route("/logout").get(logout)
router.route("/search").get(searchUser)


export default router