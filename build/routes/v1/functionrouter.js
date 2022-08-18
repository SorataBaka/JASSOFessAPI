"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_1 = __importDefault(require("./upload/upload"));
const listmessages_1 = __importDefault(require("./list/listmessages"));
const retrieve_1 = __importDefault(require("./generate/retrieve"));
const generateImage_1 = __importDefault(require("./generate/generateImage"));
const functionRouter = express_1.default.Router();
functionRouter.post("/post", upload_1.default);
functionRouter.get("/list", listmessages_1.default);
functionRouter.get("/generate", (_req, res) => {
    return res.json({
        status: 200,
        isValid: true,
        data: {
            message: "/generate/:id",
        },
    });
});
functionRouter.get("/generate/:id", generateImage_1.default);
functionRouter.get("/retrieve/:id", retrieve_1.default);
exports.default = functionRouter;
