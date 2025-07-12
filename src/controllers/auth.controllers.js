import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import { cookiesOptions } from "../constant.js";

const sendTokenResponse = (user, statusCode, res) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  };

  res
    .status(statusCode)
    .cookie("accessToken", accessToken, { ...options, maxAge: 15 * 60 * 1000 }) // 15 m
    .cookie("refreshToken", refreshToken, {
      ...options,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }) // 7d
    .json({
      success: true,
      data: user,
    });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(406).json({ message: "Required fields missing!" });
    }

    const userRole = role || "user"; // defualt to user role

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      return res
        .status(400)
        .json({ message: "Name should only contain letters and spaces" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include a letter, number, and special character",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.log("error in register user", error)
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(406).json({ message: "Required fields missing!" });
    }

    const user = await User.findOne({ email, role });

    if (!user) {
      return res.status(404).json({
        message: "user not found!",
      });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    user.refreshToken = generateRefreshToken(user._id);
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req, res) => {

  const userToken = req?.user;

  if (!userToken?._id) {
    return res.status(403).json({
      message: "unauthorized",
    });
  }

  try {
    const userDb = await User.findById(userToken._id);

    if (!userDb) {
      return res.status(404).json({
        message: "user not found!",
      });
    }
    res.status(200).json({
      _id: userDb._id,
      name: userDb.name,
      email: userDb.email,
      role: userDb.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const getCurrentAdmin = async (req, res) => {
  const userToken = req?.user;

  if (!userToken?._id) {
    return res.status(403).json({
      message: "Unauthorized access",
    });
  }

  try {
    const adminUser = await User.findById(userToken._id);

    if (!adminUser) {
      return res.status(404).json({
        message: "Admin not found!",
      });
    }

    if (adminUser.role !== 'admin') {
      return res.status(403).json({
        message: "Access denied. Only admins can access this.",
      });
    }

    res.status(200).json({
      _id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    const newAccessToken = generateAccessToken(user._id);
    res
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 15 * 60 * 1000,
      })
      .json({ message: "Access token refreshed" });
  } catch (err) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = async (req, res) => {
  const userToken = req?.user;

  if (!userToken?._id) {
    return res.status(403).json({
      message: "unauthorized",
    });
  }

  const user = await User.findByIdAndUpdate(userToken._id, {
    $unset: { refreshToken: "" },
  });
  
  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }

  res
    .clearCookie("accessToken", cookiesOptions)
    .clearCookie("refreshToken", cookiesOptions)
    .status(200)
    .json({ message: "Logout successful" });
};

