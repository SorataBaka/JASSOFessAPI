import { Request, Response } from "express";
import confessions from "../../../schemas/confessions";
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

	return res.json({
		status: 200,
		isValid: true,
		data: {
			confessions: confession,
			length: confession.length,
			message: "OK",
			code: "OK",
		},
	});
};
