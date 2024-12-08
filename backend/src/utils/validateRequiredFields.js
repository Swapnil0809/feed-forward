import { ApiError } from "./ApiError.js";
export const validateRequiredFields = (
  fields,
  errorMessage = "All fields are required"
) => {
  if (
    fields.some(
      (field) => !field || (typeof field === "string" && field.trim() === "")
    )
  ) {
    throw new ApiError(400, errorMessage);
  }
};
