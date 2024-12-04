import axiosInstance from "../utils/axiosInstance";

export const fetchFoodRequests = async () => {
  const response = await axiosInstance.get("/foodRequest/get-requests");
  return response.data.data;
};
