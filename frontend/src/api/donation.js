import axiosInstance from "../utils/axiosInstance";

export const updateDonationStatus = async (id) => {
  const response = await axiosInstance.patch(`/donation/update-status/${id}`);
  return response.data.data;
};
