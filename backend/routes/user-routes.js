import express from "express";
import { deleteUser, getAllUsers, getUserById, login, signup, updateUser } from "../controllers/user-controller.js";
import { getBookingsOfUser } from "../controllers/booking-controller.js";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/signup", signup);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.post("/login", login);
userRouter.get("/bookings/:id", getBookingsOfUser);

export default userRouter;
