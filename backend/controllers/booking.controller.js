import Booking from "../model/booking.model.js";
import Listing from "../model/listing.model.js";
import User from "../model/user.model.js";

export const createBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { checkIn, checkOut, totalRent } = req.body;

        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        if (new Date(checkIn) >= new Date(checkOut)) {
            return res.status(400).json({ message: "Check-out date must be after check-in date" });
        }

        if (listing.isBooked) {
            return res.status(400).json({ message: "Listing is already booked" });
        }

        const booking = await Booking.create({
            checkIn,
            checkOut,
            totalRent,
            host: listing.host,
            guest: req.userId,
            listing: listing._id
        });

        await booking.populate("host", "email");

        const user = await User.findByIdAndUpdate(
            req.userId, 
            { $push: { booking: booking._id } }, 
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        listing.isBooked = true; 
        listing.guest = req.userId; 
        
        await listing.save();

        res.status(201).json(booking);

    } catch (error) {
        return res.status(400).json({ message: `Booking error: ${error.message}` });
    }
}

export const getBooking = async (req, res) => {
    try {
        const bookings = await Booking.find({ guest: req.userId })
            .populate("listing")
            .populate("host", "name email");
            
        res.status(200).json(bookings);
    } catch (error) {
        return res.status(500).json({ message: `Get booking error: ${error.message}` });
    }
}

// --- NEW FUNCTION: CANCEL BOOKING ---
export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params; // This is the LISTING ID, not the booking ID (based on your card logic)

        // 1. Find the listing to get the booking info or guest info
        const listing = await Listing.findById(id);
        if (!listing) return res.status(404).json({ message: "Listing not found" });

        // 2. Find the actual Booking document associated with this listing and user
        // We look for a booking for this listing where the guest is the current user
        const booking = await Booking.findOneAndDelete({ 
            listing: id, 
            guest: req.userId 
        });

        if (!booking) {
            // It might be that the listing is marked booked, but the booking record is gone or mismatch
            // We still proceed to free up the listing if the user is indeed the guest
            if(listing.guest?.toString() !== req.userId) {
                 return res.status(404).json({ message: "Booking not found or permission denied" });
            }
        }

        // 3. Update User: Pull the booking ID from their array
        if (booking) {
            await User.findByIdAndUpdate(req.userId, {
                $pull: { booking: booking._id }
            });
        }

        // 4. Update Listing: Mark as available
        listing.isBooked = false;
        listing.guest = null; // Remove guest reference
        await listing.save();

        res.status(200).json({ message: "Booking cancelled successfully" });

    } catch (error) {
        return res.status(500).json({ message: `Cancellation error: ${error.message}` });
    }
};