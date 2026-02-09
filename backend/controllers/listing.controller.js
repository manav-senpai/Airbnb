import Listing from "../model/listing.model.js";
// FIX: Import the delete function
import uploadOnCloudinary, { deleteFromCloudinary } from "../config/cloudinary.js";
import User from "../model/user.model.js";

export const createListing = async (req, res) => {
    try {
        let { 
            title, description, category, rent, country, city, landmark, 
            guestCapacity, bedroomCount, bathroomCount 
        } = req.body;
        
        if (!req.files || !req.files['image1']) {
            return res.status(400).json({ message: "Main image (Image 1) is required" });
        }

        const image1Url = await uploadOnCloudinary(req.files['image1'][0].path);
        
        let image2Url = "pending";
        if (req.files['image2']) {
            image2Url = await uploadOnCloudinary(req.files['image2'][0].path);
        }

        let image3Url = "pending";
        if (req.files['image3']) {
            image3Url = await uploadOnCloudinary(req.files['image3'][0].path);
        }

        if (!image1Url) {
            return res.status(500).json({ message: "Image upload failed" });
        }

        const listing = await Listing.create({
            title, description, category, rent, country, city, landmark,
            image1: image1Url,
            image2: image2Url,
            image3: image3Url,
            guestCapacity: guestCapacity || 1,
            bedroomCount: bedroomCount || 1,
            bathroomCount: bathroomCount || 1,
            host: req.userId
        });

        const user = await User.findByIdAndUpdate(
            req.userId,
            { $push: { listing: listing._id } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(201).json(listing);

    } catch (error) {
        return res.status(500).json({ message: `create listing error: ${error.message}` });
    }
};

export const getAllListing = async (req, res) => {
    try {
        // FIX: Added .sort({ createdAt: -1 }) to show newest listings first
        const listings = await Listing.find()
            .populate("host", "name email")
            .sort({ createdAt: -1 });
            
        res.status(200).json(listings);
    } catch (error) {
        return res.status(500).json({ message: `get all listing error: ${error.message}` });
    }
};

export const getListingById = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id).populate("host", "name email");
        
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }
        
        res.status(200).json(listing);
    } catch (error) {
        return res.status(500).json({ message: `get listing error: ${error.message}` });
    }
};

export const updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = { ...req.body };

        // Handle updates for specific images
        if (req.files) {
            if (req.files['image1']) {
                const url = await uploadOnCloudinary(req.files['image1'][0].path);
                if (url) updateData.image1 = url;
            }
            if (req.files['image2']) {
                const url = await uploadOnCloudinary(req.files['image2'][0].path);
                if (url) updateData.image2 = url;
            }
            if (req.files['image3']) {
                const url = await uploadOnCloudinary(req.files['image3'][0].path);
                if (url) updateData.image3 = url;
            }
        }

        const listing = await Listing.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }
        
        res.status(200).json(listing);
    } catch (error) {
        return res.status(500).json({ message: `update listing error: ${error.message}` });
    }
};

export const deleteListing = async (req, res) => {
    try {
        const { id } = req.params;
        
        // 1. Find the listing first (so we can get the image URLs)
        const listing = await Listing.findById(id);
        
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        // 2. Delete images from Cloudinary
        const imagesToDelete = [listing.image1, listing.image2, listing.image3];
        
        // Run deletions in parallel for speed
        await Promise.all(
            imagesToDelete.map(imgUrl => {
                if(imgUrl && imgUrl !== "pending") {
                    return deleteFromCloudinary(imgUrl);
                }
            })
        );

        // 3. Now delete from Database
        await Listing.findByIdAndDelete(id);

        await User.findByIdAndUpdate(
            listing.host,
            { $pull: { listing: listing._id } }
        );

        res.status(200).json({ message: "Listing deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: `delete listing error: ${error.message}` });
    }
};

export const getListingByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const listings = await Listing.find({ category });
        res.status(200).json(listings);
    } catch (error) {
        return res.status(500).json({ message: `get category listing error: ${error.message}` });
    }
};

export const getMyListing = async (req, res) => {
    try {
        const listings = await Listing.find({ host: req.userId });
        res.status(200).json(listings);
    } catch (error) {
        return res.status(500).json({ message: `get my listing error: ${error.message}` });
    }
};

export const addRating = async (req, res) => {
    try {
        const { id } = req.params;
        const { ratings } = req.body; 

        if (!ratings) {
            return res.status(400).json({ message: "Rating value is required" });
        }

        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        const newReview = {
            user: req.userId,
            rating: Number(ratings),
            comment: "" 
        };
        
        listing.reviews.push(newReview);

        const totalStars = listing.reviews.reduce((acc, item) => acc + item.rating, 0);
        const avg = totalStars / listing.reviews.length;
        
        listing.averageRating = Math.round(avg * 10) / 10; 

        await listing.save();

        res.status(200).json({ message: "Rating added successfully", listing });

    } catch (error) {
        return res.status(500).json({ message: `Rating error: ${error.message}` });
    }
};