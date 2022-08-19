import express from "express";
import upload from "./upload/upload";
import list from "./list/listmessages";
import { Request, Response, NextFunction } from "express";
import retrieve from "./generate/retrieve";
import generate from "./generate/generateImage";
import csrf from "csurf";
const csrfProtection = csrf({
	cookie: true,
	value: function (req: Request) {
		const token = req.cookies["XSRF-TOKEN"];
		return token;
	},
});
const functionRouter = express.Router();

functionRouter.post("/post", csrfProtection, upload);
functionRouter.use(function (
	// eslint-disable-next-line
	err: any,
	_req: Request,
	res: Response,
	next: NextFunction
) {
	if (!err) return next(err);
	return res.status(403).json({
		status: 403,
		isValid: false,
		data: {
			message: err.code,
		},
	});
});
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
