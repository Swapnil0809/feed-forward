import axiosInstance from "../utils/axiosInstance";
export const submitSignup = async ({ url, formData }) => {
  const response = await axiosInstance.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const submitLogin = async (formData) => {
  const response = await axiosInstance.post("/users/login", formData);
  return response.data;
};

export const fetchUserProfile = async () => {
  const response = await axiosInstance.get("/users/get-user-profile");
  return response.data.data;
};
