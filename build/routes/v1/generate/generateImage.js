"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jimp_1 = __importDefault(require("jimp"));
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
    if (confession.length === 0)
        return res.status(404).json({
            status: 404,
            isValid: false,
            data: {
                message: "CONFNOTFOUND",
            },
        });
    const confessionText = confession[0].confession;
    const newImage = new jimp_1.default(1080, 1080, "#00E8FF", (err, image) => {
        if (err)
            return undefined;
        return image;
    });
    jimp_1.default.loadFont(jimp_1.default.FONT_SANS_32_WHITE).then((font) => {
        newImage.print(font, 0, 0, {
            text: confessionText,
            alignmentX: jimp_1.default.HORIZONTAL_ALIGN_CENTER,
            alignmentY: jimp_1.default.VERTICAL_ALIGN_MIDDLE,
        }, 1060, 1060);
    });
    newImage.getBuffer(jimp_1.default.MIME_PNG, (err, buffer) => {
        if (err)
            return undefined;
        return res.status(200).sendFile(buffer, "image.png");
    });
};
