import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// ✅ CORS setup
app.use(
  cors({
    origin: [
      "https://elitebrains.co.in",
      "https://www.elitebrains.co.in",
      "https://elite-brains.onrender.com",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Configure Nodemailer transporter (Render-safe + Hostinger SMTP)
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 587, // ✅ Render blocks 465; 587 works with STARTTLS
  secure: false, // STARTTLS (not SSL)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // avoids SSL verification issues
  },
});

// ✅ Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP connection failed:", error.message);
  } else {
    console.log("✅ SMTP server ready to send emails!");
  }
});

// ================================
// 📩 Appointment Form Route
// ================================
app.post("/send-appointment", async (req, res) => {
  const { name, phone, Phone, email, message, service } = req.body;
  const finalPhone = phone || Phone;

  console.log("📨 Appointment request received:", req.body);

  if (!name || !finalPhone || !email || !service || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required!",
    });
  }

  const mailOptions = {
    from: `"EliteBrains Appointment" <${process.env.EMAIL_USER}>`,
    to: process.env.TO_EMAIL || process.env.EMAIL_USER,
    subject: `New Appointment from ${name}`,
    html: `
      <h2>New Appointment Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${finalPhone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Message:</strong><br>${message}</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Appointment mail sent:", info.response);
    res.status(200).json({
      success: true,
      message: "Appointment email sent successfully!",
    });
  } catch (error) {
    console.error("❌ Appointment email error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to send appointment email.",
    });
  }
});

// ================================
// 📬 Contact Form Route
// ================================
app.post("/send-contact", async (req, res) => {
  const { name, email, phone, Phone, subject, Subject, message } = req.body;
  const finalPhone = phone || Phone;
  const finalSubject = subject || Subject;

  console.log("📨 Contact request received:", req.body);

  if (!name || !email || !finalPhone || !finalSubject || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required!",
    });
  }

  const mailOptions = {
    from: `"EliteBrains Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.TO_EMAIL || process.env.EMAIL_USER,
    subject: `New Contact Message: ${finalSubject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${finalPhone}</p>
      <p><strong>Subject:</strong> ${finalSubject}</p>
      <p><strong>Message:</strong><br>${message}</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Contact mail sent:", info.response);
    res.status(200).json({
      success: true,
      message: "Contact email sent successfully!",
    });
  } catch (error) {
    console.error("❌ Contact email error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to send contact email.",
    });
  }
});

// ================================
// ✅ Root Route
// ================================
app.get("/", (req, res) => {
  res.send("✅ EliteBrains Email API is running perfectly on Render.");
});

// ================================
// 🚀 Server Listen
// ================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running successfully on port ${PORT}`)
);
