import pkg from 'jsonwebtoken';
const { verify } = pkg; // We extract 'verify' here

const isAuth = async (req, res, next) => {
    try {
        let { token } = req.cookies;
        
        if (!token) {
            return res.status(401).json({ message: "User doesn't have a token" });
        }

        // FIX: Removed 'jwt.' prefix. Just use 'verify'
        let verifyToken = verify(token, process.env.JWT_SECRET);
        
        if (!verifyToken) {
            return res.status(401).json({ message: "User doesn't have a valid token" });
        }

        // Safety check for ID
        req.userId = verifyToken.id || verifyToken.userId || verifyToken._id;
        next();

    } catch (error) {
        console.error("isAuth Error:", error);
        res.status(500).json({ message: `isAuth error ${error.message}` });
    }
}

export default isAuth;