import Bookings from "../models/Bookings.js";
import Movie from "../models/Movie.js";
import mongoose from "mongoose";
import User from "../models/User.js";

export const newBooking = async (req, res, next) => {
    const { movie, date, seatNumber, user } = req.body;

    // Validate inputs
    if (!movie || !date || !seatNumber || !user) {
        return res.status(400).json({
            message: "All fields (movie, date, seatNumber, and user) are required.",
        });
    }

    // Validate date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
        return res.status(400).json({
            message: "Invalid date format. Please provide a valid date.",
        });
    }

    let existingMovie;
    let existingUser;
    try {
        existingMovie = await Movie.findById(movie);
        existingUser = await User.findById(user);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error finding movie or user." });
    }

    // Check if Movie and User exist
    if (!existingMovie || !existingUser) {
        return res.status(404).json({ message: "Movie or User not found with given ID" });
    }

    // Ensure bookings field is initialized
    existingUser.bookings = existingUser.bookings || [];
    existingMovie.bookings = existingMovie.bookings || [];

    let booking;
    try {
        booking = new Bookings({
            movie,
            date: parsedDate, // Use validated and parsed date
            seatNumber,
            user,
        });

        const session = await mongoose.startSession();
        session.startTransaction();
        existingUser.bookings.push(booking);
        existingMovie.bookings.push(booking);
        await existingUser.save({ session });
        await existingMovie.save({ session });
        await booking.save({ session });
        session.commitTransaction();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to create booking." });
    }

    return res.status(201).json({ booking });
};

export const getBookingById = async (req, res, next) => {
    const id = req.params.id;
    let booking;
    try{
        booking = await Bookings.findById(id);
    }catch(err){
        return console.log(err);
    }
    if(!booking){
        return res.status(500).json({ message: "Unexpected Error" });
    }
    return res.status(200).json({ booking });
};

// export const deleteBooking = async (req, res, next) => {
//     const id = req.params.id;
//     let booking;
//     try{
//         booking = await Bookings.findByIdAndDelete(id).populate("user movie");
//         console.log(booking);
//         const session = await mongoose.startSession();
//         session.startTransaction();
//         await booking.user.bookings.pull(booking);
//         await booking.movie.bookings.pull(booking);
//         await booking.movie.save({ session });
//         await booking.user.save({ session });
//         session.commitTransaction();

//     }catch(err){
//         return console.log(err);
//     }
//     if(!booking){
//         return res.status(500).json({ message: "Unable to Delete" });
//     }
//     return res.status(200).json({ message: "Successfully Deleted" });
// };

export const deleteBooking = async (req, res, next) => {
    const id = req.params.id;
    let booking;

    try {
        booking = await Bookings.findByIdAndDelete(id).populate("user movie");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found or already deleted." });
        }

        console.log(booking);

        const session = await mongoose.startSession();
        session.startTransaction();
        if (booking.user && booking.user.bookings) {
            booking.user.bookings.pull(booking._id);
            await booking.user.save({ session });
        } else {
            console.warn("User or user.bookings not found for this booking.");
        }
        if (booking.movie && booking.movie.bookings) {
            booking.movie.bookings.pull(booking._id);
            await booking.movie.save({ session });
        } else {
            console.warn("Movie or movie.bookings not found for this booking.");
        }

        await session.commitTransaction();
        session.endSession();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to delete booking." });
    }

    return res.status(200).json({ message: "Successfully Deleted" });
};

export const getBookingsOfUser = async (req, res, next) => {
    const id = req.params.id;
    let bookings;
    try{
        bookings = await Bookings.find({ user: id });
    }catch(err){
        return console.log(err);
    }
    if(!bookings){
        return res.status(500).json({ message: "Unable to get Booking" });
    }
    return res.status(200).json({ bookings });
};