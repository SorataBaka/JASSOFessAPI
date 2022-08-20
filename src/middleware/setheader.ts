import { Request, Response, NextFunction } from "express";
export default (_req: Request, res: Response, next: NextFunction) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, OPTIONS, PUT, PATCH, DELETE"
	);
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-Requested-With,content-type,XSRF-TOKEN,Authorization,Origin,Referer"
	);
	res.setHeader("Access-Control-Allow-Credentials", "true");
	next();
};
