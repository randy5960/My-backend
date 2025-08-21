const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure Nodemailer (use Gmail as example)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS  // your email password or app password
  }
});

// Endpoint to handle form submissions
app.post("/", async (req, res) => {
  console.log("Form Data Received:", req.body);

  // Build email content
  const mailOptions = {
    from: `"Form Bot" <${process.env.EMAIL_USER}>`,
    to: process.env.RECEIVE_EMAIL, // where to send the form
    subject: "New Form Submission",
    text: JSON.stringify(req.body, null, 2)
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
    res.json({ status: "success", message: "Form received and emailed!" });
  } catch (err) {
    console.error("❌ Email failed:", err);
    res.status(500).json({ status: "error", message: "Failed to send email" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
