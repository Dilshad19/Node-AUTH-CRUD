import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./src/app.js";

dotenv.config();

const PORT = parseInt(process.env.PORT || "3000", 10);
const MONGOURL = process.env.MONGO_URL;

if (!MONGOURL) {
  throw new Error("MONGO_URL is not defined in the environment variables");
}

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("DB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((error) => console.error("Database connection error:", error));


  // run 'node index.js' or 'npm start'
