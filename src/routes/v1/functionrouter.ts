import express from "express";
import upload from "./upload/upload";
import list from "./list/listmessages";
const functionRouter = express.Router();

functionRouter.post("/post", upload);
functionRouter.get("/list", list);

export default functionRouter;
