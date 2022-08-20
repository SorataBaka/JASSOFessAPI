import { Request, Response } from "express";
import ConfessionSchema from "../../../schemas/confessions";
const failedRequest = (res: Response, message: string) => {
	return res.json({
		status: 400,
		isValid: false,
		data: {
			message,
			code: "INVALIDREQUEST",
		},
	});
};
export default async (req: Request, res: Response) => {
	const message = req.body["message"];
	const branch = req.body["branch"];
	if (!message || !branch) return failedRequest(res, "No message provided");
	if (branch.toUpperCase() !== "OSAKA" && branch.toUpperCase() !== "TOKYO")
		return failedRequest(res, "Invalid branch");

	const messageLength = message.length;
	if (messageLength > 400 || messageLength < 10)
		return failedRequest(res, "Message too long or too short");

	const confession = new ConfessionSchema({
		confession: message,
		date: new Date(),
		likes: 0,
		branch,
	});
	const save = await confession.save();
	return res.json({
		status: 200,
		isValid: true,
		data: {
			message: "Success",
			code: "OK",
			save,
		},
	});
};
