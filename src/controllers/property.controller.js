import Property from "../models/property.model.js";

export const createProperty = async (req, res) => {
  try {
    const { title, location, price, rating } = req.body;
    const imageUrl = req.file?.path;

    if (!title || !location || !price || !imageUrl) {
      return res.status(406).json({
        message: "required fields missing!",
      });
    }

    const newProperty = await Property.create({
      title,
      location,
      price,
      imageUrl,
      rating: Number(rating) || 3
,
    });
    res.status(201).json({ success: true, property: newProperty });
  } catch (err) {
    console.error("Full Error Object:", {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });

    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.status(200).json(properties);
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Failed to fetch properties." });
  }
};

export const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(property);
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Error retrieving property." });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const { title, location, price, rating } = req.body;
    const imageUrl = req.file?.path;

    const updateData = { title, location, price, rating };
    if (imageUrl) updateData.imageUrl = imageUrl;

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Property not found for update" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res
      .status(400)
      .json({ message: err.message || "Error updating property." });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const deleted = await Property.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Property not found for deletion" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Error deleting property." });
  }
};
