import axiosInstance from "../utils/axiosInstance";

export const fetchDonorFoodPosts = async () => {
  const response = await axiosInstance.get("/foodPost/get-donor-posts");
  return response.data.data;
};

export const addPost = async (formdata) => {
  const response = await axiosInstance.post("/foodPost/add-post", formdata, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
};

export const deletePost = async (id) => {
  const response = await axiosInstance.delete(`/foodPost/delete-post/${id}`);
  return response.data.data;
};

export const updatePost = async ({ id, formData }) => {
  const response = await axiosInstance.patch(
    `/foodPost/update-post/${id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data.data;
};