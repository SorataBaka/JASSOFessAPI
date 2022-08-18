"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const confessions_1 = __importDefault(require("../../../schemas/confessions"));
exports.default = async (req, res) => {
    const postId = req.params.id;
    if (postId.length < 24)
        return res.json({
            status: 400,
            isValid: false,
            data: {
                message: "Invalid ID",
            },
        });
    const confession = await confessions_1.default.find({ _id: postId }).catch(() => {
        return [];
    });
    return res.json({
        status: 200,
        isValid: true,
        data: {
            confessions: confession,
            length: confession.length,
            message: "OK",
        },
    });
};
