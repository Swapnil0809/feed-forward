import axiosInstance from "../utils/axiosInstance";
export const registerUser = async ({ url, formData }) => {
  const response = await axiosInstance.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const loginUser = async (formData) => {
  const response = await axiosInstance.post("/users/login", formData);
  return response.data;
};

export const logoutUser = async () => {
  const reponse = await axiosInstance.post("/users/logout");
  return reponse.data;
};

export const fetchUserProfile = async () => {
  const response = await axiosInstance.get("/users/get-user-profile");
  return response.data.data;
};

export const fetchDashboardStats = async () => {
  const response = await axiosInstance.get(`/users/get-dashboard-stats`);
  return response.data.data;
};
