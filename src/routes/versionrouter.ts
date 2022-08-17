import express from "express";
import { Request, Response } from "express";
import v1Router from "./v1/functionrouter";
const versionRouter = express.Router();

versionRouter.use("/v1", v1Router);
versionRouter.all("/", (_req: Request, res: Response) => {
	return res.json({
		status: 200,
		isValid: true,
		data: {
			versions: ["./v1"],
		},
	});
});
export default versionRouter;
