import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// const allowedOrigin = process.env.CORS_ORIGIN.split(",");
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigin.includes(origin)) {
//         return callback(null, true);
//       }
//     },
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: process.env.CORS_ORIGIN, //allowed to access to the server
    credentials: true, //allows credentails such as cookies to be sent
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.routes.js";

// routes declarations
app.use("/api/v1/users", userRouter);

export { app };
