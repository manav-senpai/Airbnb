import express from "express";
import { createBooking, getBooking , cancelBooking} from "../controllers/booking.controller.js";
import isAuth from "../middleware/isAuth.js";
const router = express.Router();

router.post("/create/:id", isAuth, createBooking);
router.get("/get", isAuth, getBooking);
router.delete("/cancel/:id", isAuth, cancelBooking);

export default router;