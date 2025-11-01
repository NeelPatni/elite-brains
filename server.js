import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { Resend } from "resend";
import cors from "cors";

dotenv.config();
const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Allowed origins (your live + render + local)
const allowedOrigins = [
  "https://elitebrains.co.in",
  "https://www.elitebrains.co.in",
  "https://elite-brains.onrender.com",
  "http://localhost:5000",
  "http://127.0.0.1:5500",
];

// ✅ Configure CORS properly
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn("❌ CORS blocked for origin:", origin);
        return callback(new Error("CORS policy: Not allowed by server"), false);
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// ✅ Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Appointment Route
app.post("/send-appointment", async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    if (!name || !email || !phone || !service || !message) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const emailContent = `
      <h3>New Appointment Request</h3>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>Service:</b> ${service}</p>
      <p><b>Message:</b> ${message}</p>
    `;

    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      subject: `New Appointment from ${name}`,
      html: emailContent,
    });

    console.log("✅ Email sent successfully:", data);
    res.status(200).json({ success: true, message: "Appointment sent successfully!" });
  } catch (error) {
    console.error("❌ Appointment email error:", error);
    res.status(500).json({ success: false, message: "Failed to send email", error });
  }
});

// ✅ Root route to test deployment
app.get("/", (req, res) => {
  res.send("✅ EliteBrains Email API with Resend + CORS is running perfectly!");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
