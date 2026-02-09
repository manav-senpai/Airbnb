import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
import cors from "cors" // 1. Import CORS
import userRouter from "./routes/user.route.js"
import listingRouter from "./routes/listing.route.js"
import bookingRouter from "./routes/booking.route.js"

dotenv.config()

let port = process.env.PORT || 8000 // Ensure this matches your frontend serverUrl

let app = express()

// 2. Configure CORS before your routes
app.use(cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true                // Required for cookies/sessions
}))

app.use(express.json())
app.use(cookieParser())

// Routes
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/listing", listingRouter)
app.use("/api/booking", bookingRouter)

// Error handling middleware (Good to have so it doesn't just hang on errors)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

app.listen(port, () => {
    connectDb()
    console.log(`Server started on port ${port}`)
})