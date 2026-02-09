import Listing from "../model/listing.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../model/user.model.js";

export const createListing = async (req, res) => {
    try {
        // FIXED: Using 'description' to match Schema; included new fields from your build
        let { 
            title, 
            description, 
            category, 
            rent, 
            country, 
            city, 
            landmark, 
            guestCapacity, 
            bedroomCount, 
            bathroomCount 
        } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: "Main image is required" });
        }

        const imageUrl = await uploadOnCloudinary(req.file.path);
        
        if (!imageUrl) {
            return res.status(500).json({ message: "Image upload failed" });
        }

        // FIXED: Mapping to image1, image2, image3 as per your Schema
        const listing = await Listing.create({
            title,
            description, 
            category,
            rent,
            country,
            city,
            landmark,
            image1: imageUrl,
            image2: "pending", // Placeholder if your tutorial adds more later
            image3: "pending",
            guestCapacity: guestCapacity || 1,
            bedroomCount: bedroomCount || 1,
            bathroomCount: bathroomCount || 1,
            host: req.userId
        });

        // FIXED: This works now because we updated user.model.js to use Arrays []
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
        const listings = await Listing.find().populate("host", "name email");
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

        if (req.file) {
            const imageUrl = await uploadOnCloudinary(req.file.path);
            if (imageUrl) {
                updateData.image1 = imageUrl; // Updated to match image1 field
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
        const listing = await Listing.findByIdAndDelete(id);
        
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        // Pulling the reference from the user's listing array
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