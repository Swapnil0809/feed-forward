import jwt from "jsonwebtoken";

export const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
};
