import { Request, Response } from "express";
import { SortOrder } from "mongoose";
import ConfessionSchema from "../../../schemas/confessions";
export default async (req: Request, res: Response) => {
	const page = parseInt(req.query["page"] as string) || 1;
	const limit = parseInt(req.query["limit"] as string) || 10;
	const sort = (req.query["sort"] as string) || "date";
	const order: SortOrder = ((req.query["order"] as string) || -1) as SortOrder;
	if (typeof page !== "number" || typeof limit !== "number")
		return res.json({
			status: 400,
			isValid: false,
			message: "Page and limit must be numbers",
		});
	console.log({
		page,
		limit,
		sort,
		order,
	});
	const confessions = await ConfessionSchema.find({})
		.sort({ [sort]: order })
		.skip(limit * (page - 1))
		.limit(limit);
	return res.json({
		status: 200,
		isValid: true,
		data: {
			confessions,
		},
	});
};
