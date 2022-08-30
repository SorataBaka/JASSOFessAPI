import dotenv from "dotenv";
dotenv.config();

export const mongooseConnectionUrl = process.env.MONGO_URL || undefined;
export const isDevelopment = process.env.NODE_ENV === "development";
export const PORT = process.env.PORT || 3000;
export const trueOrigin = process.env.TRUE_ORIGIN || "http://localhost:3000";

isDevelopment
	? console.log("Starting in development mode")
	: console.log("Starting in production mode");

import express, { Request, Response } from "express";
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

const csurfProtection = csurf({
	cookie: true,
	value: (req: Request) => {
		return req.cookies["XSRF-TOKEN"];
	},
});

app.use(bodyParser.json());
app.use(express.json());
app.use(errorhandler);
app.use(
	cors({
		allowedHeaders: [
			"Origin",
			"X-Requested-With",
			"Content-Type",
			"Accept",
			"X-CSRF-TOKEN",
			"XSRF-TOKEN",
		],
		credentials: true,
		maxAge: 360000,
		origin: trueOrigin,
		methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
		preflightContinue: false,
		optionsSuccessStatus: 200,
	})
);
app.use(helmet());
app.use(cookieParser());
app.use(csurfProtection);

app.use(morgan("dev"));
app.use(helmet());
app.use("/api", versionRouter);

app.all("/", csurfProtection, (req: Request, res: Response) => {
	res.cookie("XSRF-TOKEN", req.csrfToken(), {
		maxAge: 36000,
		path: "/",
		httpOnly: false,
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

app.listen(PORT, async () => {
	const newConnection = await mongoose.connect(mongooseConnectionUrl);
	if (newConnection.connections.length !== 0)
		console.log("Connected to MongoDB");
	console.log(`Server started on port ${PORT}`);
});
