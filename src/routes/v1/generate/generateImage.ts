import { Request, Response } from "express";
import Jimp from "jimp";
import confessions from "../../../schemas/confessions";
export default async (req: Request, res: Response) => {
	const postId = req.params.id;
	if (postId.length < 24)
		return res.json({
			status: 400,
			isValid: false,
			data: {
				message: "Invalid ID",
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
				message: "CONFNOTFOUND",
			},
		});

	const confessionText = confession[0].confession;

	const newImage = new Jimp(1080, 1080, "#00E8FF", (err, image) => {
		if (err) return undefined;
		return image;
	});

	Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then((font) => {
		newImage.print(
			font,
			0,
			0,
			{
				text: confessionText,
				alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
				alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
			},
			1060,
			1060
		);
	});
	newImage.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
		if (err) return undefined;
		return res.status(200).sendFile(buffer, "image.png");
	});
};
