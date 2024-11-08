import nodemailer from "nodemailer";
import { ApiError } from "./ApiError.js";

export const sendEmail = async (receivers, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: receivers.join(", "),
      subject: subject,
      html: message,
    };

    const mail = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully: ", mail);
  } catch (error) {
    throw new ApiError(500, "Error sending email: ", error?.message);
  }
};
