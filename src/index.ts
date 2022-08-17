import express, { Request, Response } from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import versionRouter from "./routes/versionrouter";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import cors from "cors";

const app = express();
dotenv.config();

const properOrigin = process.env.TRUE_ORIGIN || "http://localhost:3000";
const mongooseConnectionUrl = process.env.MONGO_URL || undefined;
const isDevelopment = process.env.NODE_ENV === "development";
const PORT = process.env.PORT || 3000;

const rateLimiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 1,
	message: {
		status: 429,
		message: "Too many requests",
	},
	standardHeaders: true,
	statusCode: 429,
	keyGenerator: (req: Request) => {
		return req.ip;
	},
});

if (mongooseConnectionUrl === undefined)
	throw new Error(
		"SETUP ERROR: MONGO_URL is not set in the environment variables"
	);

app.use(
	cors({
		origin: function (origin, callback) {
			if (origin === properOrigin) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
	})
);
if (!isDevelopment) {
	app.use("/api", rateLimiter);
	console.log("Starting in production mode");
} else {
	console.log("Starting in development mode");
}
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", versionRouter);

app.all("/", (req: Request, res: Response) => {
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
