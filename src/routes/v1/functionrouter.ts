import rateLimiter from "../../middleware/ratelimit";
import generate from "./generate/generateImage";
import { isDevelopment } from "../../index";
import { Request, Response } from "express";
import retrieve from "./generate/retrieve";
import list from "./list/listmessages";
import upload from "./upload/upload";
import express from "express";

const functionRouter = express.Router();

functionRouter.get("/retrieve/:id", retrieve);
functionRouter.get("/generate/:id", generate);

isDevelopment
	? functionRouter.post("/post", upload)
	: functionRouter.post("/post", rateLimiter, upload);

functionRouter.get("/list", list);

functionRouter.get("/generate", (_req: Request, res: Response) => {
	return res.json({
		status: 200,
		isValid: true,
		data: {
			message: "/generate/:id",
			code: "OK",
		},
	});
});

export default functionRouter;
