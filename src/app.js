import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("Uploads directory:", path.join(__dirname, "../uploads"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

//routes import
import userRouter from "./routes/user.route.js";
import PostRouter from "./routes/posts.route.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", PostRouter);

export { app };
