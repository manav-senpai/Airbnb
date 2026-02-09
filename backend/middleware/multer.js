import multer from "multer";
import fs from "fs";

// Ensure the directory exists before saving
const uploadDir = "./public/temp";
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Saves to 'public/temp' inside backend
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        // FIX: Correct comma syntax inside the function call
        cb(null, file.originalname); 
    }
});

const upload = multer({ storage });

export default upload;