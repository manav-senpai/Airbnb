import mongoose from "mongoose"

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    image1: {
        type: String,
        required: true
    },
    image2: {
        type: String,
        required: true
    },
    image3: {
        type: String,
        required: true
    },
    rent: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    landmark: { 
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    ratings:{
        type:Number,
        min:0,
        max:5,
        default:0
    },
    
    // --- NEW FIELDS ADDED ---
    guestCapacity: {
        type: Number,
        required: true,
        default: 1
    },
    bedroomCount: {
        type: Number,
        required: true,
        default: 1
    },
    bathroomCount: {
        type: Number,
        required: true,
        default: 1
    },
    // ------------------------
    isBooked: {
        type: Boolean,
        default: false
    },
    reviews: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            rating: { type: Number, required: true },
            comment: { type: String, default: "" }
        }
    ],
    averageRating: {
        type: Number,
        default: 0
    }

}, { timestamps: true })

const Listing = mongoose.model("Listing", listingSchema)

export default Listing