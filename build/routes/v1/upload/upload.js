"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const confessions_1 = __importDefault(require("../../../schemas/confessions"));
const failedRequest = (res, message) => {
    return res.json({
        status: 400,
        isValid: false,
        data: {
            message,
            code: "INVALIDREQUEST",
        },
    });
};
exports.default = async (req, res) => {
    const message = req.body["message"];
    if (!message)
        return failedRequest(res, "No message provided");
    const messageLength = message.length;
    if (messageLength > 400 || messageLength < 10)
        return failedRequest(res, "Message too long or too short");
    const confession = new confessions_1.default({
        confession: message,
        date: new Date(),
        likes: 0,
    });
    const save = await confession.save();
    return res.json({
        status: 200,
        isValid: true,
        data: {
            message: "Success",
            code: "OK",
            save,
        },
    });
};
