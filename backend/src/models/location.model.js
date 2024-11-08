// location sub schema
export const locationSchema = {
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: [true, "Co-ordinates are required"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  state: {
    type: String,
    required: [true, "State is required"],
  },
  city: {
    type: String,
    required: [true, "City is required"],
  },
  pincode: {
    type: Number,
    required: [true, "Pincode is required"],
  },
};
