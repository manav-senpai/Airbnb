import Booking from "../model/booking.model.js";
import Listing from "../model/listing.model.js";
import User from "../model/user.model.js";

export const createBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { checkIn, checkOut, totalRent } = req.body;

        // 1. Verify Listing exists
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        // 2. Date Validation
        if (new Date(checkIn) >= new Date(checkOut)) {
            return res.status(400).json({ message: "Check-out date must be after check-in date" });
        }

        // 3. FIXED: Check 'isBooked' (camelCase) to match your updated Listing Schema
        if (listing.isBooked) {
            return res.status(400).json({ message: "Listing is already booked" });
        }

        // 4. Create the Booking
        const booking = await Booking.create({
            checkIn,
            checkOut,
            totalRent,
            host: listing.host,
            guest: req.userId,
            listing: listing._id
        });

        // 5. Populate host details for the response
        await booking.populate("host", "email");

        // 6. FIXED: Push to User's booking array (Matches your updated User Schema)
        const user = await User.findByIdAndUpdate(
            req.userId, 
            { $push: { booking: booking._id } }, 
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 7. FIXED: Update Listing status and record the guest
        listing.isBooked = true; // Use camelCase
        // Note: Your Listing schema has 'guest' field as a single ObjectId, not an array
        listing.guest = req.userId; 
        
        await listing.save();

        res.status(201).json(booking);

    } catch (error) {
        return res.status(400).json({ message: `Booking error: ${error.message}` });
    }
}

export const getBooking = async (req, res) => {
    try {
        // Find all bookings where the current user is the guest
        const bookings = await Booking.find({ guest: req.userId })
            .populate("listing")
            .populate("host", "name email");
            
        res.status(200).json(bookings);
    } catch (error) {
        return res.status(500).json({ message: `Get booking error: ${error.message}` });
    }
} 