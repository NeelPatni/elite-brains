// import express from "express";
// import nodemailer from "nodemailer";
// import bodyParser from "body-parser";
// import cors from "cors";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();


// app.use(
//   cors({
//     origin: [
//       "https://elitebrains.co.in",
//       "https://www.elitebrains.co.in"
//     ],
//     methods: ["GET", "POST"],
//     credentials: true,
//   })
// );


// // Middleware

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // 🔹 Common mail transporter (Hostinger SMTP)
// const transporter = nodemailer.createTransport({
//   host: "smtp.hostinger.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // ================================
// // 📩 Appointment Form Route
// // ================================
// app.post("/send-appointment", async (req, res) => {
//   const { name, Phone, email, message, service } = req.body;

//   if (!name || !Phone || !email || !service || !message) {
//     return res
//       .status(400)
//       .json({ success: false, message: "All fields are required!" });
//   }

//   const mailOptions = {
//     from: `"Appointment Form" <${process.env.EMAIL_USER}>`,
//     to: process.env.TO_EMAIL,
//     subject: "New Appointment Form Submission",
//     html: `
//       <h2>New Appointment Request</h2>
//       <p><strong>Name:</strong> ${name}</p>
//       <p><strong>Phone:</strong> ${Phone}</p>
//       <p><strong>Email:</strong> ${email}</p>
//       <p><strong>Service:</strong> ${service}</p>
//       <p><strong>Message:</strong> ${message}</p>
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res
//       .status(200)
//       .json({ success: true, message: "Appointment email sent successfully!" });
//   } catch (error) {
//     console.error("❌ Appointment email error:", error);
//     res.status(500).json({ success: false, message: "Failed to send email." });
//   }
// });

// // ================================
// // 📬 Contact Form Route
// // ================================
// app.post("/send-contact", async (req, res) => {
//   // Accept both lowercase and uppercase field names (frontend safe)
//   const name = req.body.name;
//   const email = req.body.email;
//   const phone = req.body.phone || req.body.Phone;
//   const subject = req.body.subject || req.body.Subject;
//   const message = req.body.message;

//   console.log("📩 Received contact data:", req.body);

//   if (!name || !email || !phone || !subject || !message) {
//     return res
//       .status(400)
//       .json({ success: false, message: "All fields are required!" });
//   }

//   const transporter = nodemailer.createTransport({
//     host: "smtp.hostinger.com",
//     port: 465,
//     secure: true,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const mailOptions = {
//     from: `"Contact Form" <${process.env.EMAIL_USER}>`,
//     to: process.env.TO_EMAIL,
//     subject: `New Contact Message: ${subject}`,
//     html: `
//       <h2>New Contact Form Submission</h2>
//       <p><strong>Name:</strong> ${name}</p>
//       <p><strong>Email:</strong> ${email}</p>
//       <p><strong>Phone:</strong> ${phone}</p>
//       <p><strong>Subject:</strong> ${subject}</p>
//       <p><strong>Message:</strong><br>${message}</p>
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ success: true, message: "Contact email sent successfully!" });
//   } catch (error) {
//     console.error("❌ Error sending contact email:", error);
//     res.status(500).json({ success: false, message: "Failed to send message." });
//   }
// });

// // ================================
// // Root Route
// // ================================
// app.get("/", (req, res) => {
//   res.send("✅ Email API (Appointment + Contact) is running");
// });

// // ================================
// // Server Listen
// // ================================
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () =>
//   console.log(`🚀 Server running successfully on port ${PORT}`)
// );

import express from "express";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ Enable CORS only for your domains
app.use(
  cors({
    origin: [
      "https://elitebrains.co.in",
      "https://www.elitebrains.co.in"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// ✅ Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Email Transporter (Hostinger)
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true, // use true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ============================
// 📩 Appointment Form Route
// ============================
app.post("/send-appointment", async (req, res) => {
  try {
    const { name, Phone, email, service, message } = req.body;

    // ✅ Field validation
    if (!name || !Phone || !email || !service || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    // ✅ Email content
    const mailOptions = {
      from: `"Appointment Form" <${process.env.EMAIL_USER}>`,
      to: process.env.TO_EMAIL,
      subject: "New Appointment Form Submission",
      html: `
        <h2>📅 New Appointment Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${Phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong> ${message}</p>
        <hr>
        <p>✅ Sent from EliteBrains Appointment Form</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Appointment email sent successfully");
    res.status(200).json({ success: true, message: "Appointment email sent successfully!" });

  } catch (error) {
    console.error("❌ Appointment email error:", error.message);
    res.status(500).json({ success: false, message: "Failed to send appointment email." });
  }
});

// ============================
// 📬 Contact Form Route
// ============================
app.post("/send-contact", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // ✅ Field validation
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    // ✅ Email content
    const mailOptions = {
      from: `"Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.TO_EMAIL,
      subject: `New Contact Message: ${subject}`,
      html: `
        <h2>📩 New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p>✅ Sent from EliteBrains Contact Form</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Contact email sent successfully");
    res.status(200).json({ success: true, message: "Contact email sent successfully!" });

  } catch (error) {
    console.error("❌ Contact email error:", error.message);
    res.status(500).json({ success: false, message: "Failed to send contact email." });
  }
});

// ============================
// 🌐 Root Route
// ============================
app.get("/", (req, res) => {
  res.send("✅ EliteBrains Email API (Appointment + Contact) is running successfully!");
});

// ✅ Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
