import express from "express";
import { getUser } from "../controllers/user.controller.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

// FIX: Renamed "/get" to "/currentuser" to match UserContext.jsx
router.get("/currentuser", isAuth, getUser);

export default router;