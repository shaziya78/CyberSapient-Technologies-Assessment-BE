import { Router } from "express";
import {
  getMe,
  getUserById,
  login,
  logoutUser,
  refreshToken,
  register,
  getCurrentAdmin
} from "../controllers/auth.controllers.js";
import { protect } from "../middlewares/auth.middleware.js";

export const authRoute = Router();

// public routes
authRoute.route("/signup").post(register);
authRoute.route("/login").post(login);
authRoute.route("/refresh").get(refreshToken);

// private routes
authRoute.use(protect);
authRoute.route("/user").get(getMe);
authRoute.route("/getadmin").get(getCurrentAdmin);
authRoute.route("/user/:id").get(getUserById);
authRoute.route("/logout").get(logoutUser);
