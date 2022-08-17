import { Request, Response } from "express";
import ConfessionSchema from "../../../schemas/confessions";
const failedRequest = (res: Response, message: string) => {
	return res.json({
		status: 400,
		isValid: false,
		message: message,
	});
};
export default async (req: Request, res: Response) => {
	const message = req.body["message"];
	if (!message) return failedRequest(res, "No message provided");
	const messageLength = message.length;
	if (messageLength > 140 || messageLength < 10)
		return failedRequest(res, "Message too long or too short");

	const confession = new ConfessionSchema({
		confession: message,
		date: new Date(),
	});
	const save = await confession.save();
	console.log(save);

	return res.json({
		status: 200,
		isValid: true,
		data: {
			message: "Success",
			save,
		},
	});
};
