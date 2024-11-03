import { User } from "../models/user.model.js";
import { CityAdmin, Donor } from "../models/user.model.js";
import { Recipient } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";

const donorSignUp = asyncHandler(async (res, req) => {
  const { username, email, phoneNo, password, role, location, donorType } =
    req.body;

  const existingUser = await Donor.findOne({
    $or: [{ username }, { email }, { phoneNo }],
  });

  if (existingUser) {
    throw new ApiError(
      400,
      "User with same username or email or phoneNo already exists"
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await Donor.create({
    username,
    email,
    phoneNo,
    password: hashedPassword,
    role,
    location,
    donorType,
  });

  const createdUser = await Donor.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while signing up");
  }

  console.log("Donor Signed Up Successfully");
  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "Donor Signed Up Successfully"));
});

const recipientSignUp = asyncHandler(async (rea, req) => {
  const {
    username,
    email,
    phoneNo,
    password,
    role,
    location,
    organizationType,
    registerationNo,
  } = req.body;

  const existingUser = await Recipient.findOne({
    $or: [{ username }, { email }, { phoneNo }, { registerationNo }],
  });

  if (existingUser) {
    throw new ApiError(
      400,
      "User with same username or email or phoneNo already exists"
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await Recipient.create({
    username,
    email,
    phoneNo,
    password: hashedPassword,
    role,
    location,
    organizationType,
    registerationNo,
  });

  const createdUser = await Recipient.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while signing up");
  }

  console.log("Recipient Signed Up Successfully");
  return res
    .status(200)
    .json(
      new ApiResponse(200, createdUser, "Recipient Signed Up Successfully")
    );
});

const userLogin = asyncHandler(async (rea, req) => {
  const { username, email, password } = req.body;
  let token;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASS
  ) {
    token = generateToken(1, "admin");
  } else {
    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ApiError(400, "Invalid password");
    }

    token = generateToken(user._id, user.role);
  }

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  console.log("User logged in successfully");

  return res
    .status(200)
    .cookie("token", token, options)
    .json(new ApiResponse(200, "User logged in successfully"));
});

const creatCityAdmin = asyncHandler(async (req, res) => {
  const { username, email, phoneNo, password, location } = req.body;

  if (!req.isAdmin) {
    throw new ApiError(401, "Unauthorized access to admin");
  }

  const existingUser = await CityAdmin.findOne({
    $or: [{ username }, { email }, { phoneNo }],
  });

  if (existingUser) {
    throw new ApiError(401, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await CityAdmin.create({
    username,
    email,
    phoneNo,
    password: hashedPassword,
    role: "city-admin",
    location,
  });

  const createdUser = await CityAdmin.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while signing up");
  }

  console.log("City Admin created successfully");

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "City Admin created successfully"));
});

const userLogout = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  console.log("User logged out successfully");

  return res
    .status(200)
    .clearCookie("token", options)
    .json(new ApiResponse(200, "User logged out successfully"));
});

export { donorSignUp, recipientSignUp, userLogin, creatCityAdmin, userLogout };
