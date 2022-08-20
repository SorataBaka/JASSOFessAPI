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
const alphanumericCheck = (input: string) => {
	return /^[a-zA-Z0-9]+$/.test(input);
};
export default async (req: Request, res: Response) => {
	const message = req.body["message"];
	const branch = req.body["branch"];

	if (!message || !branch) return failedRequest(res, "No message provided");
	if (!alphanumericCheck(message))
		return failedRequest(res, "Message contains invalid characters");

	if (message.length > 400 || message.length < 10)
		return failedRequest(res, "Message too long or too short");
	if (branch.toUpperCase() !== "OSAKA" && branch.toUpperCase() !== "TOKYO")
		return failedRequest(res, "Invalid branch");

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
