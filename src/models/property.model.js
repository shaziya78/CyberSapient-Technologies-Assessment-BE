// models/Property.js
import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: String, required: true },
    imageUrl: { type: String },
    rating: {
      type: Number,
      default: 3,
    },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);
export default Property;
