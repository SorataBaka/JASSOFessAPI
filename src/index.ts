import dotenv from "dotenv";
dotenv.config();

export const mongooseConnectionUrl = process.env.MONGO_URL || undefined;
export const isDevelopment = process.env.NODE_ENV === "development";
export const PORT = process.env.PORT || 3000;
export const trueOrigin = process.env.TRUE_ORIGIN || "http://localhost:3000";

isDevelopment
	? console.log("Starting in development mode")
	: console.log("Starting in production mode");

import express, { NextFunction, Request, Response } from "express";
import versionRouter from "./routes/versionrouter";
import errorhandler from "./middleware/errorhandler";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import morgan from "morgan";
import helmet from "helmet";
import csurf from "csurf";
import cors from "cors";
const app = express();

if (mongooseConnectionUrl === undefined)
	throw new Error(
		"SETUP ERROR: MONGO_URL is not set in the environment variables"
	);

app.use(errorhandler);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

app.use(
	cors({
		allowedHeaders: [
			"Origin",
			"X-Requested-With",
			"Content-Type",
			"Accept",
			"X-XSRF-TOKEN",
			"XSRF-TOKEN",
			"Cookie",
		],
		maxAge: 360000,
		origin: trueOrigin,
		methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
		preflightContinue: false,
		credentials: true,
		optionsSuccessStatus: 200,
	})
);
app.use(
	csurf({
		cookie: true,
		value: (req: Request) => {
			return req.cookies["XSRF-TOKEN"];
		},
	})
);
app.use("/api", versionRouter);

app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
	if (err)
		return res.status(403).json({
			status: 403,
			isValid: false,
			data: {
				message: err.message,
			},
		});
	return next();
});

app.all("/", (req: Request, res: Response) => {
	res.cookie("XSRF-TOKEN", req.csrfToken(), {
		maxAge: 64000,
		path: "/",
	});
	return res.json({
		status: 200,
		isValid: true,
		data: {
			message: "Jasso Confession API",
			version: "1.0.0",
		},
	});
});
// app.get("/authorize", (req: Request, res: Response) => {
// 	return res.status(200).json({
// 		status: 200,
// 		isValid: true,
// 		data: {
// 			csrf: req.csrfToken(),
// 			message: "OK",
// 			code: "OK",
// 		},
// 	});
// });
app.listen(PORT, async () => {
	const newConnection = await mongoose.connect(mongooseConnectionUrl);
	if (newConnection.connections.length !== 0)
		console.log("Connected to MongoDB");
	console.log(`Server started on port ${PORT}`);
});
