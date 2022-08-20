"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jimp_1 = __importDefault(require("jimp"));
const confessions_1 = __importDefault(require("../../../schemas/confessions"));
const colorArray = [
    "54BAB9",
    "9ED2C6",
    "E9DAC1",
    "F7ECDE",
    "F5E8C7",
    "ECCCB2",
    "DEB6AB",
    "B2C8DF",
    "B2C8DF",
];
exports.default = async (req, res) => {
    const postId = req.params.id;
    if (postId.length < 24)
        return res.json({
            status: 400,
            isValid: false,
            data: {
                message: "Invalid ID",
                code: "INVALID_ID",
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
                message: "Confession not found",
                code: "CONFNOTFOUND",
            },
        });
    const confessionText = confession[0].confession;
    const confessionTime = confession[0].date;
    const confessionDate = confessionTime.toDateString();
    const confessionTimeString = confessionTime.toLocaleTimeString();
    const confessionDateTime = confessionDate + " " + confessionTimeString;
    const randomNumberPicker = Math.floor(Math.random() * colorArray.length + 0);
    const newImage = new jimp_1.default(1080, 1080, "#" + colorArray[randomNumberPicker], (err, image) => {
        if (err)
            return undefined;
        return image;
    });
    const MainFont = await jimp_1.default.loadFont("./assets/DynaPuff.fnt");
    const HeaderFont = await jimp_1.default.loadFont("./assets/Fredoka.fnt");
    const FooterFont = await jimp_1.default.loadFont("./assets/Fredoka.fnt");
    newImage.print(HeaderFont, 50, 50, {
        text: "JASSO Confessions",
        alignmentX: jimp_1.default.HORIZONTAL_ALIGN_CENTER,
        alignmentY: jimp_1.default.VERTICAL_ALIGN_TOP,
    }, 980, 20);
    newImage.print(MainFont, 50, 50, {
        text: confessionText,
        alignmentX: jimp_1.default.HORIZONTAL_ALIGN_CENTER,
        alignmentY: jimp_1.default.VERTICAL_ALIGN_MIDDLE,
    }, 980, 1030);
    newImage.print(FooterFont, 50, 1030, {
        text: confessionDateTime,
        alignmentX: jimp_1.default.HORIZONTAL_ALIGN_RIGHT,
        alignmentY: jimp_1.default.VERTICAL_ALIGN_BOTTOM,
    }, 980, 20);
    newImage.getBuffer(jimp_1.default.MIME_PNG, (err, buffer) => {
        if (err)
            return undefined;
        res.setHeader("Content-Type", "image/png");
        res.end(buffer, "binary");
    });
};
