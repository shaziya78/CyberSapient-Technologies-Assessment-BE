import { Router } from "express";
import {
  createProperty,
  deleteProperty,
  getAllProperties,
  getProperty,
  updateProperty,
} from "../controllers/property.controller.js";
import { isAdmin, protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

export const propertiesRoute = Router();

// public routes
propertiesRoute.route("/get").get(getAllProperties);
propertiesRoute.route("/:id/property").get(getProperty);

// admin only
propertiesRoute.use(protect);
propertiesRoute.use(isAdmin);
propertiesRoute.route("/create").post(upload.single("image"), createProperty);
propertiesRoute
  .route("/:id/property-update")
  .put(upload.single("image"), updateProperty);
propertiesRoute.route("/:id/property-delete").delete(deleteProperty);
