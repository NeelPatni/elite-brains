import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer"; // or resend depending on your version

dotenv.config();
const app = express();

// ✅ CORS Configuration (Fixed for Render + Custom Domain)
const allowedOrigins = [
  "https://elitebrains.co.in",
  "https://www.elitebrains.co.in",
  "https://elite-brains.onrender.com",
  "http://localhost:5000",
  "http://127.0.0.1:5500",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman or local tests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS policy: Not allowed by server"), false);
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Temporary route to test CORS
app.get("/", (req, res) => {
  res.send("✅ EliteBrains Email API running perfectly with CORS enabled.");
});
