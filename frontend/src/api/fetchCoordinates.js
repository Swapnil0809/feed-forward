import axiosInstance from "../utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export const fetchCoordinates = async (pincode) => {
  const apiUrl = `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&format=json&limit=1`;
  const { data } = await axiosInstance.get(apiUrl, { withCredentials: false });
  if (data.length === 0) throw new Error("Coordinates not found");
  const { lon, lat } = data[0];
  return [lon, lat];
};
