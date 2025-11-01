import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { Resend } from "resend";
import cors from "cors";

dotenv.config();
const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/send-appointment", async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

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

app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
