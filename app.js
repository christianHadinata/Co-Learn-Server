// Express
import express from "express";
const app = express();

// Morgan
import morgan from "morgan";

// Cors
import cors from "cors";

//Setting up cors
app.use(cors());

// Serve static from public folder
app.use(express.static("public"));

// // Express async errors
// import "express-async-errors";

// Error handler
import { errorHandler } from "./middleware/errorHandler.js";

// dotenv
import dotenv from "dotenv";
dotenv.config();

// Model import
import cookieParser from "cookie-parser";

// Cookie parse
app.use(cookieParser());

// Parse json
app.use(express.json());

// Morgan
app.use(morgan("dev"));

// Routes import
import userRoute from "./routes/user.js";
import spaceRoute from "./routes/space.js";
// Routes
// localhost:5000/api/v1/users/register
app.use("/api/v1/users", userRoute);
app.use("/api/v1/spaces", spaceRoute);

//Error handling
app.use(errorHandler);

// Run the server
const PORT = 5000;
const HOST = "0.0.0.0";
app.listen(PORT, HOST, async () => {
  try {
    console.log(`Server is running on port ${PORT}`);
  } catch (err) {
    console.log("Failed");
  }
});
