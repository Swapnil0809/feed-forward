import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

import {
  User,
  Admin,
  CityAdmin,
  Donor,
  Recipient,
} from "../models/user.model.js";
import { FoodPost } from "../models/foodPost.model.js";
import { FoodRequest } from "../models/foodRequest.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateToken } from "../utils/generateToken.js";
import { sendEmail } from "../utils/mailer.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Donation } from "../models/donation.model.js";

const donorSignUp = asyncHandler(async (req, res) => {
  const {
    username,
    email,
    phoneNo,
    password,
    coordinates,
    address,
    state,
    city,
    pincode,
    donorType,
  } = req.body;

  if (
    [
      username,
      email,
      phoneNo,
      password,
      coordinates,
      address,
      state,
      city,
      pincode,
      donorType,
    ].some(
      (field) => !field || (typeof field === "string" && field.trim() === "")
    )
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  const existingUser = await Donor.findOne({
    $or: [{ username }, { email }, { phoneNo }],
  });

  if (existingUser) {
    throw new ApiError(
      400,
      "User with same username or email or phoneNo already exists"
    );
  }

  // check for avatar file
  const avatarLocalPath = req.file?.path;

  let avatar;
  if (avatarLocalPath) {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar.url) {
      throw new ApiError(400, "Something went wrong while uploading avatar");
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // convert coordinates into number
  const [lon, lat] = coordinates.split(",").map(Number);

  // construct location object
  const location = {
    type: "Point",
    coordinates: [lon, lat],
    properties: {
      address,
      state: state.toLowerCase(),
      city: city.toLowerCase(),
      pincode,
    },
  };

  const user = await Donor.create({
    ...(avatarLocalPath && { avatar: avatar.url }), // optional
    username,
    email,
    phoneNo,
    password: hashedPassword,
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

const recipientSignUp = asyncHandler(async (req, res) => {
  const {
    username,
    email,
    phoneNo,
    password,
    coordinates,
    address,
    state,
    city,
    pincode,
    organizationType,
    registerationNo,
  } = req.body;

  console.log(req.body);

  if (
    [
      username,
      email,
      phoneNo,
      password,
      coordinates,
      address,
      state,
      city,
      pincode,
      organizationType,
    ].some(
      (field) => !field || (typeof field === "string" && field.trim() === "")
    )
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  const existingUser = await Recipient.findOne({
    $or: [{ username }, { email }, { phoneNo }],
  });

  if (existingUser) {
    throw new ApiError(
      400,
      "User with same username or email or phoneNo already exists"
    );
  }

  // check for avatar file
  const avatarLocalPath = req.file?.path;

  let avatar;
  if (avatarLocalPath) {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar.url) {
      throw new ApiError(400, "Something went wrong while uploading avatar");
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // convert coordinates into number
  const [lon, lat] = coordinates.split(",").map(Number);

  // construct location object
  const location = {
    type: "Point",
    coordinates: [lon, lat],
    properties: {
      address,
      state: state.toLowerCase(),
      city: city.toLowerCase(),
      pincode,
    },
  };

  const user = await Recipient.create({
    ...(avatarLocalPath && { avatar: avatar.url }), // optional
    username,
    email,
    phoneNo,
    password: hashedPassword,
    location,
    organizationType,
    ...(registerationNo && { registerationNo }), // optional
  });

  const createdUser = await Recipient.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while signing up");
  }

  console.log("Recipient Signed Up Successfully");

  // get city admins form the same city
  const cityAdminEmails = await CityAdmin.find(
    { "location.properties.city": createdUser.location.properties.city },
    { _id: 0, role: 0, email: 1 }
  );

  let emailList;

  if (cityAdminEmails.length === 0) {
    // if there is no city admin for the city
    emailList = [process.env.ADMIN_EMAIL];
  } else {
    // create an array of city admin emails
    emailList = cityAdminEmails.map((cityAdmin) => cityAdmin.email);
  }

  console.log(emailList);

  const message = `
    <p>New Recipient has registered themselves on our FeedForward Platform <br/>
    Please verify the recipient so that they can start using our platform, their details are: <br/>
    <b>usename</b>:${createdUser.username}<br/>
    <b>email</b>:${createdUser.email}<br/>
    <b>phoneno</b>:${createdUser.phoneNo}<br/>
    <b>organization type</b>:${createdUser.organizationType}<br/>
    <b>address</b>:${createdUser.location.properties.address}
    </p>
  `;

  await sendEmail(
    emailList,
    "New Recipient Registration - Verification Required",
    message
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, createdUser, "Recipient Signed Up Successfully")
    );
});

const userLogin = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Email and password are required!");
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid password");
  }

  const token = generateToken(user._id, user.role);

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

const createCityAdmin = asyncHandler(async (req, res) => {
  const {
    username,
    email,
    phoneNo,
    password,
    coordinates,
    address,
    state,
    city,
    pincode,
  } = req.body;

  if (
    [
      username,
      email,
      phoneNo,
      password,
      coordinates,
      address,
      state,
      city,
      pincode,
    ].some(
      (field) => !field || (typeof field === "string" && field.trim() === "")
    )
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  const existingUser = await CityAdmin.findOne({
    $or: [{ username }, { email }, { phoneNo }],
  });

  if (existingUser) {
    throw new ApiError(401, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // convert coordinates into number
  const [lon, lat] = coordinates.split(",").map(Number);

  // construct location object
  const location = {
    type: "Point",
    coordinates: [lon, lat],
    properties: {
      address,
      state: state.toLowerCase(),
      city: city.toLowerCase(),
      pincode,
    },
  };

  const user = await CityAdmin.create({
    username,
    email,
    phoneNo,
    password: hashedPassword,
    location,
  });

  const createdUser = await CityAdmin.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while signing up");
  }

  console.log("City Admin created successfully");

  const message = `
    <p>This email is to inform you that you have been assigned as <b>City Admin</b> 
    of <b>${createdUser.location.properties.city}</b> city for our FeedForward Platform. 
    Your task as City Admin is to verify newly registered Recipients to ensure the integrity of our platform, your login credentials are <br/> 
    <b>username</b>:${createdUser.username}<br/> 
    <b>password</b>:${password}
    </p>
  `;

  await sendEmail(
    [createdUser.email],
    "City Admin Role and Login Details",
    message
  );

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

const getUserProfile = asyncHandler(async (req, res) => {
  console.log("User profile fetched successfully");

  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User profile fetched successfully"));
});

const getAdminDashboardStats = asyncHandler(async () => {
  const totalCityAdmins = await CityAdmin.countDocuments();
  const totalDonors = await Donor.countDocuments();
  const totalRecipients = await Recipient.countDocuments();
  const totalDonations = await Donation.countDocuments();

  return {
    "City Admins": totalCityAdmins,
    Donors: totalDonors,
    Recipients: totalRecipients,
    Donations: totalDonations,
  };
});

const getCityAdminDashboardStats = asyncHandler(async (city) => {
  const totalDonors = await Donor.countDocuments({
    "location.properties.city": city,
  });
  const totalRecipient = await Recipient.countDocuments({
    "location.properties.city": city,
    isverified: true,
  });
  const totalDonations = await Donation.countDocuments({
    "location.properties.city": city,
  });

  return {
    Donors: totalDonors,
    Recipients: totalRecipient,
    Donations: totalDonations,
  };
});

const getDonorDashboardStats = asyncHandler(async (user) => {
  const activeFoodPosts = await FoodPost.countDocuments({
    postedBy: user._id,
    status: "available",
  });
  const totalDonations = await Donation.countDocuments({ donorId: user._id });

  return {
    "Active Food Posts": activeFoodPosts,
    Donations: totalDonations,
  };
});

const getRecipientDashboardStats = asyncHandler(async (user) => {
  const activeFoodRequests = await FoodRequest.countDocuments({
    requestedBy: user._id,
    status: "unfulfilled",
  });
  const totalDonations = await Donation.countDocuments({
    recipientId: user._id,
  });

  return {
    "Active Food Requests": activeFoodRequests,
    Donations: totalDonations,
  };
});

const getDashboardStats = asyncHandler(async (req, res) => {
  const { role } = req.user;
  let stats = {};
  if (role === "Admin") {
    stats = await getAdminDashboardStats();
  }

  if (role === "CityAdmin") {
    stats = await getCityAdminDashboardStats(req.user.location.properties.city);
  }

  if (role === "Donor") {
    stats = await getDonorDashboardStats(req.user);
  }

  if (role === "Recipient") {
    stats = await getRecipientDashboardStats(req.user);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Stats fetched successfully"));
});

export {
  donorSignUp,
  recipientSignUp,
  userLogin,
  createCityAdmin,
  userLogout,
  getUserProfile,
  getDashboardStats,
};
