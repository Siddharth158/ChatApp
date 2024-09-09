import { body, validationResult, check, param, query } from 'express-validator'
import { ErrorHandler } from '../utils/ErrorHandler.js';

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    const errorMessages = errors.array().map((error) => error.msg).join(", ");
    next(new ErrorHandler(errorMessages, 400))

}

const registerValidator = () => [
    body("name", "Please enter name").notEmpty(),
    body("username", "Please enter username").notEmpty(),
    body("password", "Please enter password").notEmpty(),
    body("bio", "Please enter bio").notEmpty()
];

const loginValidator = () => [
    body("username", "Please enter username").notEmpty(),
    body("password", "Please enter password").notEmpty(),
];

const newGroupValidator = () => [
    body("name", "Please enter a group name").notEmpty(),
    body("members")
        .notEmpty()
        .withMessage("Please select members")
        .isArray({ min: 2, max: 100 })
        .withMessage("Members must be 2-100"),
];

const addMemberValidator = () => [
    body("chatId", "Please enter a chat ID").notEmpty(),
    body("members")
        .notEmpty()
        .withMessage("Please select members")
        .isArray({ min: 1, max: 97 })
        .withMessage("Members must be 1-100"),
];

const removeMemberValidator = () => [
    body("userId", "Please enter user ID").notEmpty(),
    body("chatId", "Please enter chat ID").notEmpty(),
];

const sendAttchmentValidator = () => [
    body("chatId", "Please enter chat ID").notEmpty(),
];

const chatIdValidator = () => [
    param("id", "Please enter chat ID").notEmpty(),
];

const renameValidator = () => [
    param("id", "Please enter chat ID").notEmpty(),
    body("name","Please enter new name").notEmpty()
];

const sendRequestValidator = () => [
    body("userId","Please enter user ID").notEmpty()
];

const acceptRequestValidator = () => [
    body("requestId","Please enter request ID").notEmpty(),
    body("accept","please add accept").notEmpty().isBoolean().withMessage("accept must be boolean")
];

export { validate, registerValidator, loginValidator, newGroupValidator, addMemberValidator, removeMemberValidator, sendAttchmentValidator, chatIdValidator, renameValidator, sendRequestValidator, acceptRequestValidator }