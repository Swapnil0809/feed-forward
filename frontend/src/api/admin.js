import axiosInstance from "../utils/axiosInstance";

export const fetchCityAdmins = async () => {
  const response = await axiosInstance.get("/admin/get-city-admins");
  return response.data.data;
};

export const addCityAdmin = async (formData) => {
  const response = await axiosInstance.post(
    "/users/create-city-admin",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data.data;
};

export const removeCityAdmin = async (id) => {
  const response = await axiosInstance.delete(`/admin/remove-city-admin/${id}`);
  return response.data.data;
};
