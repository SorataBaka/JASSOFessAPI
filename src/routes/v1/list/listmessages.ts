import { Request, Response } from "express";
import { SortOrder } from "mongoose";
import ConfessionSchema from "../../../schemas/confessions";
const validateNumber = (input: string) => {
	const regexValue = new RegExp(/^[0-9]*$/);
	return regexValue.test(input);
};
export default async (req: Request, res: Response) => {
	const { page, limit, sort, order } = req.query;
	const pageNumber = validateNumber(page as string)
		? parseInt(page as string)
		: 1;
	const limitNumber = validateNumber(limit as string)
		? parseInt(limit as string)
		: 10;
	const sortOrder = (order || "desc") as SortOrder;
	const sortField = (sort as string) || "createdAt";
	const confessions = await ConfessionSchema.find({})
		.sort({ [sortField]: sortOrder })
		.skip(limitNumber * (pageNumber - 1))
		.limit(limitNumber);
	return res.json({
		status: 200,
		isValid: true,
		data: {
			confessions,
			length: confessions.length,
			message: "OK",
			code: "OK",
		},
	});
};
