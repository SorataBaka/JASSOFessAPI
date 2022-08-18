import express from "express";
import upload from "./upload/upload";
import list from "./list/listmessages";
import { Request, Response } from "express";
import retrieve from "./generate/retrieve";
import generate from "./generate/generateImage";
const functionRouter = express.Router();

functionRouter.post("/post", upload);
functionRouter.get("/list", list);
functionRouter.get("/generate", (_req: Request, res: Response) => {
	return res.json({
		status: 200,
		isValid: true,
		data: {
			message: "/generate/:id",
		},
	});
});
functionRouter.get("/generate/:id", generate);
functionRouter.get("/retrieve/:id", retrieve);

export default functionRouter;
