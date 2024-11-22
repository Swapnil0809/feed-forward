import { User } from "../models/user.model.js";
import { CityAdmin, Donor, Recipient } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import { sendEmail } from "../utils/mailer.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
      state,
      city,
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
      state,
      city,
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
    Please verify the recipient so that they can start using our platform, there details are: <br/>
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
      state,
      city,
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

export { donorSignUp, recipientSignUp, userLogin, createCityAdmin, userLogout };
