import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import combinedRouter from "./routes/combinedRoutes.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/", combinedRouter);

export default app;
