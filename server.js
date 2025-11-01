import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// ✅ Allowed Origins
const allowedOrigins = [
  "https://elitebrains.co.in",
  "https://www.elitebrains.co.in",
  "https://elite-brains.onrender.com",
  "http://localhost:5000",
  "http://127.0.0.1:5500",
];

// ✅ CORS Setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.warn("❌ CORS blocked for origin:", origin);
      return callback(new Error("CORS policy: Not allowed by server"), false);
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Nodemailer Transporter (Hostinger SMTP)
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 587, // Use 587 (STARTTLS)
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // prevent SSL errors on Render
  },
});

// ✅ Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP connection failed:", error.message);
  } else {
    console.log("✅ SMTP server is ready to send emails!");
  }
});

// ✅ Appointment Form Route
app.post("/send-appointment", async (req, res) => {
  const { name, email, phone, service, message } = req.body;

  if (!name || !email || !phone || !service || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required!",
    });
  }

  const mailOptions = {
    from: `"EliteBrains Appointment" <${process.env.EMAIL_USER}>`,
    to: process.env.RECEIVER_EMAIL,
    subject: `New Appointment from ${name}`,
    html: `
      <h2>New Appointment Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Message:</strong><br>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Appointment email sent successfully!");
    res.status(200).json({ success: true, message: "Appointment sent successfully!" });
  } catch (error) {
    console.error("❌ Failed to send appointment email:", error.message);
    res.status(500).json({ success: false, message: "Failed to send appointment email." });
  }
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ EliteBrains Email API (Hostinger SMTP) is running perfectly!");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
