import express from "express";
import { getUser } from "../controllers/user.controller.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.get("/get", isAuth, getUser);

export default router;