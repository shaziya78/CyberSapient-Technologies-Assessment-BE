import { Router } from "express";
import {
  checkBookmark,
  toggleBookmark,
} from "../controllers/bookMark.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

export const bookMarkRoute = Router();

// private routes
bookMarkRoute.use(protect);
bookMarkRoute.route("/:propertyId").post(toggleBookmark);
bookMarkRoute.route("/check/:propertyId").get(checkBookmark);
