import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import { router as trainRoutes } from "./routes/apiRoutes.js";


import { fetch } from "undici";
global.fetch = fetch;

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'https://safar-mitra-8a97.vercel.app',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res) => {
  res.send("Backend is running successsfully...");
});



app.use("/api/auth", authRoutes);
app.use("/api/train", trainRoutes);
app.use("/api/tickets", ticketRoutes);


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
