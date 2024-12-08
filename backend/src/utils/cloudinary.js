import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // file system

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, folder = null) => {
  try {
    if (!localFilePath) return null;
    //upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: folder,
    });
    console.log("file is uploaded on cloudinary", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    //remove the locally saved temp file as the upload operation failed
    console.error("Error while uploading file on cloudinary", error);
  }
};

const deleteFromCloudinary = async (url) => {
  try {
    const parts = url.split("/");
    const fileWithExtension = parts[parts.length - 1]; // Get the last part (e.g., image.jpg)
    const publicId = fileWithExtension.split(".")[0]; // Remove file extension

    const response = await cloudinary.uploader.destroy(publicId);

    if (response.result === "ok") {
      console.log("File deleted from Cloudinary:", publicId);
    } else {
      console.warn("File not found or already deleted:", publicId);
    }

    return response;
  } catch (error) {
    console.error("Error while deleting file from Cloudinary:", error);
    throw error;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
