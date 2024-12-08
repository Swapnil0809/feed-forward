import axiosInstance from "../utils/axiosInstance";

export const fetchFoodRequests = async () => {
  const response = await axiosInstance.get("/foodRequest/get-requests");
  return response.data.data;
};

export const fetchRecipientFoodRequests = async () => {
  const response = await axiosInstance.get(
    "/foodRequest/get-recipient-requests"
  );
  return response.data.data;
};

export const addFoodRequest = async (formData) => {
  const response = await axiosInstance.post(
    "/foodRequest/add-request",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data.data;
};

export const updateFoodRequest = async ({ id, formData }) => {
  const response = await axiosInstance.patch(
    `/foodRequest/update-request/${id}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data.data;
};

export const deleteFoodRequest = async (id) => {
  const response = await axiosInstance.delete(
    `/foodRequest/delete-request/${id}`
  );
  return response.data.data;
};

export const fulfillFoodRequest = async (id) => {
  const response = await axiosInstance.patch(
    `/foodRequest/fulfill-request/${id}`
  );
  return response.data.data;
};
