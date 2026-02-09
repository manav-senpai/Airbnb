import express from "express";
import { createListing, getAllListing, getListingById, deleteListing, updateListing, getListingByCategory, getMyListing } from "../controllers/listing.controller.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/create", isAuth, upload.single("image"), createListing);
router.get("/get", getAllListing);
router.get("/get/:id", getListingById);
router.delete("/delete/:id", isAuth, deleteListing);
router.put("/update/:id", isAuth, upload.single("image"), updateListing);
router.get("/category/:category", getListingByCategory);
router.get("/mylisting", isAuth, getMyListing);

export default router;