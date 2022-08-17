"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const confessions_1 = __importDefault(require("../../../schemas/confessions"));
exports.default = async (req, res) => {
    const page = parseInt(req.query["page"]) || 1;
    const limit = parseInt(req.query["limit"]) || 10;
    const sort = req.query["sort"] || "date";
    const order = (req.query["order"] || -1);
    if (typeof page !== "number" || typeof limit !== "number")
        return res.json({
            status: 400,
            isValid: false,
            message: "Page and limit must be numbers",
        });
    console.log({
        page,
        limit,
        sort,
        order,
    });
    const confessions = await confessions_1.default.find({})
        .sort({ [sort]: order })
        .skip(limit * (page - 1))
        .limit(limit);
    return res.json({
        status: 200,
        isValid: true,
        data: {
            confessions,
        },
    });
};
