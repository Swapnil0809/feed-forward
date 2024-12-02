import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "express-async-handler";
import { CityAdmin } from "../models/user.model.js";

const getCityAdmins = asyncHandler(async (req, res) => {
  const cityAdmins = await CityAdmin.find().select("-password");
  console.log(cityAdmins);
  console.log("City admins fetched successfully");
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        cityAdmins,
        "City admins fetched successfully",
        cityAdmins
      )
    );
});

const removeCityAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cityAdmin = await CityAdmin.findById(id);
  if (!cityAdmin) {
    throw new ApiError(404, "City admin not found");
  }
  await cityAdmin.deleteOne();
  console.log("City admin deleted successfully");
  return res
    .status(200)
    .json(new ApiResponse(200, "City admin deleted successfully"));
});

export { getCityAdmins, removeCityAdmin };
