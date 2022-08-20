import rateLimit from "express-rate-limit";
export default rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 1,
	message: {
		status: 429,
		isValid: false,
		data: {
			message: "Too many requests",
			code: "TOOMANYREQUESTS",
		},
	},
	standardHeaders: true,
	statusCode: 429,
});
