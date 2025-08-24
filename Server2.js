const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // handle HTML form submissions

// POST route for receiving form data
app.post("/api/check", async (req, res) => {
  const userAgent = req.get("User-Agent");
  const ip =
    req.headers["x-forwarded-for"]?.split(",").shift() || req.socket.remoteAddress;

  console.log("✅ Form data:", req.body);
  console.log("🌍 IP:", ip);
  console.log("🖥 UA:", userAgent);

  console.log("📦 EMAIL_USER set:", !!process.env.EMAIL_USER);
  console.log("📦 EMAIL_PASS set:", !!process.env.EMAIL_PASS);
  console.log("📦 EMAIL_TO set:", !!process.env.EMAIL_TO);

  try {
    // Create transporter
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    console.log("🔄 Attempting to send email...");

    // Mail options
    let mailOptions = {
      from: `"Form Bot" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: "New Form Submission",
      text: `Form Data: ${JSON.stringify(req.body, null, 2)}
IP: ${ip}
User-Agent: ${userAgent}`,
      html: `
        <h2>📩 New Form Submission</h2>
        <pre>${JSON.stringify(req.body, null, 2)}</pre>
        <p><b>🌍 IP:</b> ${ip}</p>
        <p><b>🖥 User-Agent:</b> ${userAgent}</p>
      `
    };

    // Send the email
    let info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent! Message ID:", info.messageId);

    res.json({ status: "ok", message: "Email sent" });
  } catch (error) {
    console.error("❌ Email error details:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to send email",
      error: error.message
    });
  }
});

// For Render: listen on assigned port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
