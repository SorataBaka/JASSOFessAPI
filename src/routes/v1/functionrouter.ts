import express from "express";
import upload from "./upload/upload";
const functionRouter = express.Router();

functionRouter.post("/post", upload);

export default functionRouter;
