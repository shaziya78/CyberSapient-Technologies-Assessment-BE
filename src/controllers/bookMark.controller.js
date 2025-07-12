import User from "../models/user.model.js";


export const toggleBookmark = async (req, res) => {
  const user = req?.user;

  if (!user?._id) {
    return res.status(403).json({
      message: "unauthorized",
    });
  }

  try {
    const { propertyId } = req.params;
    const dbUser = await User.findById(user._id); 

    const alreadyBookmarked = dbUser.bookmarks.includes(propertyId);

    if (alreadyBookmarked) {
      dbUser.bookmarks.pull(propertyId);
    } else {
      dbUser.bookmarks.push(propertyId);
    }

    await dbUser.save();
    res.json({ success: true, bookmarks: dbUser.bookmarks });
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const checkBookmark = async (req, res) => {
  const user = req?.user;
  const { propertyId } = req.params;

  if (!user?._id) {
    return res.status(403).json({
      message: "unauthorized",
    });
  }

  try {
    const userDb = await User.findById(user._id);
    if (!userDb) {
      return res.status(404).json({ error: "User not found" });
    }

    const isBookmarked = userDb.bookmarks.includes(propertyId);
    res.json({ bookmarked: isBookmarked });
  } catch (error) {
    console.error("Error checking bookmark:", error);
    res.status(500).json({ error: "Server error" });
  }
};


