import express from "express";
// FIX: Import addRating
import { createListing, getAllListing, getListingById, deleteListing, updateListing, getListingByCategory, getMyListing, addRating } from "../controllers/listing.controller.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

const uploadImages = upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 }
]);

router.post("/create", isAuth, uploadImages, createListing);
router.get("/get", getAllListing);
router.get("/get/:id", getListingById);
router.delete("/delete/:id", isAuth, deleteListing);
router.put("/update/:id", isAuth, uploadImages, updateListing);
router.get("/category/:category", getListingByCategory);
router.get("/mylisting", isAuth, getMyListing);

// FIX: Add this route for ratings
router.post("/ratings/:id", isAuth, addRating);

export default router;