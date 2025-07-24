import express from "express";
import dotenv from "dotenv";
dotenv.config();
import apiRoutes from "./src/routes/index.js";
import "./src/db/db.config.js";
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors())

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use("/api", apiRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.log("ERROR ---> ", err);
  res
    .status(err.statusCode || 500)
    .json({ status: false, message: err.errorMessage || "Something went wrong" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
