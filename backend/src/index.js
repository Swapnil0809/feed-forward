import dotenv from "dotenv";
import { app } from "./app";
import connectDB from "./db";

dotenv.config({
  path: "./env",
});

const port = process.env.PORT || 6000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`server is running on http://localhost:${port}`);
    });

    app.on("error", (err) => {
      console.error("listening error: ", err);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error: ", err);
  });
