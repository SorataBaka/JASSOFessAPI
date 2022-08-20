"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const confessions_1 = __importDefault(require("../../../schemas/confessions"));
const validateNumber = (input) => {
    const regexValue = new RegExp(/^[0-9]*$/);
    return regexValue.test(input);
};
exports.default = async (req, res) => {
    const { page, limit, sort, order } = req.query;
    const pageNumber = validateNumber(page)
        ? parseInt(page)
        : 1;
    const limitNumber = validateNumber(limit)
        ? parseInt(limit)
        : 10;
    const sortOrder = (order || "desc");
    const sortField = sort || "createdAt";
    const confessions = await confessions_1.default.find({})
        .sort({ [sortField]: sortOrder })
        .skip(limitNumber * (pageNumber - 1))
        .limit(limitNumber);
    return res.json({
        status: 200,
        isValid: true,
        data: {
            confessions,
            length: confessions.length,
            message: "OK",
            code: "OK",
        },
    });
};
