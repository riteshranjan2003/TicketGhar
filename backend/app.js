import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; // Import cors package
import userRouter from "./routes/user-routes.js";
import adminRouter from "./routes/admin-routes.js";
import movieRouter from "./routes/movie-routes.js";
import bookingsRouter from "./routes/booking-routes.js";

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: "https://ticketghar-covl.onrender.com" // The frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, 
}));

app.use(express.json());
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/movie", movieRouter);
app.use("/booking", bookingsRouter);

mongoose
  .connect(
    `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.ur2qk.mongodb.net/`
  )
  .then(() =>
    app.listen(5000, () => console.log("Connected To Database And Server is running"))
  )
  .catch((e) => console.log(e));
