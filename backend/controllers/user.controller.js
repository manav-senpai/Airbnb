import User from "../model/user.model.js";

export const getUser = async (req, res) => {
    try {
        // FIX: Deep populate: Get User -> Get Bookings -> Get Listing details inside Booking
        let user = await User.findById(req.userId)
            .select("-password")
            .populate({
                path: "booking",
                populate: {
                    path: "listing" // This fills the listing details inside the booking object
                }
            });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: `get user error: ${error.message}` });
    }
};