import express from "express"
import register from "./register/register"
const authRouter = express.Router();
authRouter.post("/register", register);
export default authRouter;