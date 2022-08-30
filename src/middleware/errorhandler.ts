import { Request, Response, NextFunction } from "express";

export default (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!err) {
		next();
	}
	res.status(500).json({
		status: 500,
		isValid: false,
		data: {
			message: err.message || "Internal server error",
		},
	});
};
