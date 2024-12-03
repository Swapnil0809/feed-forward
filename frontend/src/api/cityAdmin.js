import axiosInstance from "../utils/axiosInstance";

export const fetchVerificationList = async () => {
  const response = await axiosInstance.get("cityAdmin/get-verification-list");
  return response.data.data;
};

export const verifyRecipient = async (id) => {
  const response = await axiosInstance.patch(
    `cityAdmin/verify-recipient/${id}`
  );
  return response.data.data;
};
