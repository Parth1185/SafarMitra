import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import routes
import authRoutes from "./routes/auth.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import { router as trainRoutes } from "./routes/apiRoutes.js";

// Fix for fetch not found in Node.js
import { fetch } from "undici";
global.fetch = fetch;

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'https://safar-mitra-8a97.vercel.app',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// ===== Test Route =====
app.get("/", (req, res) => {
  res.send("Backend is running successsfully...");
});


// ===== API Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/train", trainRoutes);
app.use("/api/tickets", ticketRoutes);

// ===== MongoDB Connection =====
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
