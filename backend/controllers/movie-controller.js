import jwt from "jsonwebtoken";
import Movie from "../models/Movie.js";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";


// Utility function to verify JWT token
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET_KEY, (err, decrypted) => {
      if (err) {
        reject(err);
      } else {
        resolve(decrypted);
      }
    });
  });
};

export const addMovie = async (req, res, next) => {
  const extractedToken = req.headers.authorization?.split(" ")[1];  // Optional chaining to prevent errors

  if (!extractedToken || extractedToken.trim() === "") {
    return res.status(404).json({ message: "Token Not Found" });
  }

  let adminId;
  try {
    // Verify token and extract admin ID
    const decrypted = await verifyToken(extractedToken);
    adminId = decrypted.id;
  } catch (err) {
    return res.status(400).json({ message: `${err.message}` });
  }

  // Destructure incoming movie data
  const { title, description, releaseDate, posterUrl, featured, actors } = req.body;

  // Validate input
  if (!title?.trim() || !description?.trim() || !posterUrl?.trim()) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  try {
    // Create new movie instance
    const movie = new Movie({
      title,
      description,
      releaseDate: new Date(releaseDate), // Convert to date
      posterUrl,
      featured,
      actors,
      admin: adminId,
    });


    const session = await mongoose.startSession();
    const adminUser = await Admin.findById(adminId);
    session.startTransaction();

    await movie.save({ session });
    adminUser.addedMovies.push(movie);
    await adminUser.save({ session });
    await session.commitTransaction();

    // Save the movie to the database
    // const savedMovie = await movie.save();

    return res.status(201).json({ movie });
  } catch (err) {
    console.error(err); // Log the error to the console
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAllMovies = async(req, res, next) => {
  let movies;

  try{
    movies = await Movie.find();
  }catch(err){
    return console.log(err);
  }

  if(!movies){
    return res.status(500).json({ message: "Request Failed" });
  }
  return res.status(200).json({ movies });
};

export const getMovieById = async (req, res, next) => {
  const id = req.params.id;
  let movie;
  try{
    movie = await Movie.findById(id);
  }catch(err){
    return console.log(err);
  }
  if(!movie){
    return res.status(404).json({ message: "Invalid Movie ID" });
  }
  return res.status(200).json({ movie });
};