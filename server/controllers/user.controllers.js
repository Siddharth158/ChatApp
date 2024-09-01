import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from '../models/user.models.js'
import { sendToken } from '../utils/features.js';
import { compare } from 'bcrypt';
import { ErrorHandler } from '../utils/ErrorHandler.js';
import { ApiResponce } from '../utils/ApiResponce.js';
import { cookieOption } from '../constants/cookieOptions.js';

const login = asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;
    // console.log(req.body)
    if (!username) {
        return next(new ErrorHandler("Invalid username", 404));
    }
    const user = await User.findOne({ username }).select("+password");
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
        return next(new ErrorHandler("Invalid password", 404));
    }
    sendToken(res, user, 200, "user found")
})

const register = asyncHandler(async (req, res) => {
    const avatar = {
        public_id: "slkdf",
        url: 'skdjhf'
    }

    const { name, username, password, bio } = req.body
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

const getMyProfile = asyncHandler(async (req, res, next) => {
    // console.log(req.user);
    res.status(200).json(new ApiResponce(200,req.user,"user profile found succesfully"))
})

const logout = asyncHandler(async (req, res, next) => {
    return res.status(200).cookie("apna-tele-token", "", { ...cookieOption, maxAge: 0 }).json(new ApiResponce(200, "", "logged out successfully"))
})

const searchUser = asyncHandler(async (req, res,next) => {
    const {name} = req.query;
    res.send(name)
})


export {
    login,
    register,
    getMyProfile,
    logout,
    searchUser
}