import z from "zod";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
// signup schema
export const signupSchema = z.object({
  username: z.string().nonempty("Username is required"),
  email: z.string().email("Invalid email address"),
  phoneNo: z.string().nonempty("Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  avatarImage: z
    .any()
    .optional()
    .refine(
      (file) => {
        if (!file || file.length === 0) return true;
        return ACCEPTED_IMAGE_TYPES.includes(file.type);
      },
      { message: "Invalid file. Please choose a JPEG, PNG, or WebP image." }
    ),
  address: z.string().nonempty("Address is required"),
  city: z.string().nonempty("City is required"),
  state: z.string().nonempty("State is required"),
  pincode: z.string().nonempty("Pincode is required"),
  donorType: z.string().optional(),
  organizationType: z.string().optional(),
  registrationNo: z.string().optional(),
});

// login schema
export const loginSchema = z.object({
  username: z.string().nonempty("Username is required"),
  password: z.string().nonempty("Password is required"),
});

// add city admin schema
export const cityAdminSchema = z.object({
  username: z.string().nonempty("Username is required"),
  email: z.string().email("Invalid email address"),
  phoneNo: z.string().nonempty("Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  address: z.string().nonempty("Address is required"),
  city: z.string().nonempty("City is required"),
  state: z.string().nonempty("State is required"),
  pincode: z.string().nonempty("Pincode is required"),
});

// food post schema
export const postSchema = z.object({
  images: z
    .any()
    .optional()
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        return files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type));
      },
      {
        message:
          "Invalid file(s). Please choose JPEG, PNG, or WebP images only.",
      }
    ),
  title: z.string().nonempty("Title is required"),
  description: z.string().nonempty("Description is required"),
  quantity: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().min(1, "Quantity must be at least 1")
  ),
  quantityUnit: z.string().nonempty("Quantity unit is required"),
  foodType: z.string().nonempty("Food Type is required"),
  bestBefore: z.preprocess(
    (arg) => {
      return typeof arg === "string" ? new Date(arg) : arg;
    },
    z.date().min(new Date(), "Best Before must be in the future")
  ),
  useUserLocation: z.boolean().default(false),
  address: z.string().optional(),
  pincode: z.string().optional(),
});

// food request schema
export const requestSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().nonempty("Description is required"),
  quantity: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().min(1, "Quantity must be at least 1")
  ),
  quantityUnit: z.string().nonempty("Quantity unit is required"),
  foodType: z.string().nonempty("Food Type is required"),
  requiredBy: z.preprocess(
    (arg) => {
      // Ensure the date is parsed correctly
      return typeof arg === "string" ? new Date(arg) : arg;
    },
    z.date().min(new Date(), "Best Before must be in the future")
  ),
});
