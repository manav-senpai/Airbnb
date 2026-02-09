import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,      
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (filepath) => {
    try {
        if (!filepath) return null;

        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(filepath, {
            resource_type: "auto"
        });

        // Delete local file
        fs.unlinkSync(filepath);

        return uploadResult.secure_url; 

    } catch (error) {
        console.error("Cloudinary Error:", error);
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
        return null;
    }
}

// --- NEW FUNCTION: Deletes image from Cloudinary using the URL ---
export const deleteFromCloudinary = async (url) => {
    try {
        if (!url || url === "pending") return;

        // Extract the public ID from the URL
        // Example: .../upload/v123456/sample.jpg -> public_id is "sample"
        // We use Regex to grab everything between 'upload/' (plus versioning) and the file extension
        const regex = /\/upload\/(?:v\d+\/)?([^\.]+)/;
        const match = url.match(regex);
        
        const publicId = match ? match[1] : null;

        if (publicId) {
            await cloudinary.uploader.destroy(publicId);
            console.log(`Deleted image: ${publicId}`);
        }
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
    }
}

export default uploadOnCloudinary;