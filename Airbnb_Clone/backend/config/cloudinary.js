import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// FIX: Ensure config is called OUTSIDE the function so it runs on startup
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,      // FIX: Added process.env
    api_secret: process.env.CLOUDINARY_API_SECRET // FIX: Added process.env
});

const uploadOnCloudinary = async (filepath) => {
    try {
        if (!filepath) return null;

        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(filepath, {
            resource_type: "auto"
        });

        // FIX: Typo was 'uplinkSync', changed to 'unlinkSync'
        // This deletes the local file after upload
        fs.unlinkSync(filepath);

        // FIX: Return ONLY the URL string, not the whole object
        return uploadResult.secure_url; 

    } catch (error) {
        console.error("Cloudinary Error:", error);
        // Safely delete file if upload fails
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
        return null;
    }
}

export default uploadOnCloudinary;