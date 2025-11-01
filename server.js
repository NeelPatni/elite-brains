import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// ✅ CORS setup (frontend allowed)
app.use(
  cors({
    origin: [
      "https://elitebrains.co.in",
      "https://www.elitebrains.co.in",
      "https://elite-brains.onrender.com", // allow backend to call itself
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Configure Nodemailer transporter (Hostinger SMTP)
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Verify SMTP connection at startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP connection failed:", error);
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
    return res
      .status(400)
      .json({ success: false, message: "All fields are required!" });
  }

  const mailOptions = {
    from: `"EliteBrains Appointment" <${process.env.EMAIL_USER}>`,
    to: process.env.TO_EMAIL,
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
    console.error("❌ Appointment email error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send appointment email.",
      error: error.message,
    });
  }
});

// ================================
// 📬 Contact Form Route
// ================================
app.post("/send-contact", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone || req.body.Phone;
  const subject = req.body.subject || req.body.Subject;
  const message = req.body.message;

  console.log("📨 Contact request received:", req.body);

  if (!name || !email || !phone || !subject || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required!" });
  }

  const mailOptions = {
    from: `"EliteBrains Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.TO_EMAIL,
    subject: `New Contact Message: ${subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Subject:</strong> ${subject}</p>
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
    console.error("❌ Contact email error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send contact email.",
      error: error.message,
    });
  }
});

// ================================
// ✅ Root Route
// ================================
app.get("/", (req, res) => {
  res.send("✅ EliteBrains Email API is running perfectly.");
});

// ================================
// 🚀 Server Listen
// ================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running successfully on port ${PORT}`)
);
