import { Request, Response } from "express";
import Jimp from "jimp";
import confessions from "../../../schemas/confessions";

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
export default async (req: Request, res: Response) => {
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
	const confession = await confessions.find({ _id: postId }).catch(() => {
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
	const confessionDate = confessionTime.toLocaleString("ja-JP");
	const confessionSource = confession[0].branch;

	const newtext = confessionText.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, ".");
	const randomNumberPicker = Math.floor(Math.random() * colorArray.length + 0);
	const newImage = new Jimp(
		1080,
		1080,
		"#" + colorArray[randomNumberPicker],
		(err, image) => {
			if (err) return undefined;
			return image;
		}
	);
	const MainFont = await Jimp.loadFont("./assets/DynaPuff.fnt");
	const HeaderFont = await Jimp.loadFont("./assets/Fredoka.fnt");
	const FooterFont = await Jimp.loadFont("./assets/Fredoka.fnt");
	newImage.print(
		HeaderFont,
		50,
		50,
		{
			text: "JASSO Confessions",
			alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
			alignmentY: Jimp.VERTICAL_ALIGN_TOP,
		},
		980,
		20
	);
	newImage.print(
		MainFont,
		50,
		50,
		{
			text: newtext,
			alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
			alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
		},
		980,
		1030
	);
	newImage.print(
		FooterFont,
		50,
		1030,
		{
			text: "Posted On: " + confessionDate,
			alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT,
			alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM,
		},
		980,
		20
	);
	newImage.print(
		FooterFont,
		50,
		1030,
		{
			text: "Branch: " + confessionSource,
			alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
			alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM,
		},
		980,
		20
	);
	newImage.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
		if (err) return undefined;
		res.setHeader("Content-Type", "image/png");
		res.end(buffer, "binary");
	});
};
