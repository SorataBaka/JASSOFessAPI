import express from "express"
import auth from "./auth/authrouter"
const functionRouter = express.Router();

functionRouter.use("/auth", auth);

export default functionRouter;