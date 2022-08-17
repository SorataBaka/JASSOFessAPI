"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const functionrouter_1 = __importDefault(require("./v1/functionrouter"));
const versionRouter = express_1.default.Router();
versionRouter.use("/v1", functionrouter_1.default);
versionRouter.all("/", (_req, res) => {
    return res.json({
        status: 200,
        isValid: true,
        data: {
            versions: ["./v1"],
        },
    });
});
exports.default = versionRouter;
