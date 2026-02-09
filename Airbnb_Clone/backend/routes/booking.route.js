import express from "express";
import { createBooking, getBooking } from "../controllers/booking.controller.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.post("/create/:id", isAuth, createBooking);
router.get("/get", isAuth, getBooking);

export default router;