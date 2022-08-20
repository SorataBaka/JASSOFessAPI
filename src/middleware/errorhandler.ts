import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	if (res.headersSent) {
		return next(err);
	}
	const status = err.status || 500;
	const message = err.message || "Something went wrong";
	const code = err.code || "INTERNALSERVERERROR";

	return res.json({
		status: status,
		isValid: false,
		data: {
			message,
			code,
		},
	});
};

export default errorHandler;
