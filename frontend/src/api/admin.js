import axiosInstance from "../utils/axiosInstance";

export const fetchCityAdmins = async () => {
  const response = await axiosInstance.get("/admin/get-city-admins");
  return response.data.data;
};

export const removeCityAdmin = async (id) => {
    const response = await axiosInstance.delete(`/admin/delete-city-admin/${id}`);
    return response.data.data;
}