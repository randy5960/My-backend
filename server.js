const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Gmail address
    pass: process.env.EMAIL_PASS  // App password (not regular password)
  }
});

// ✅ Your API endpoint
app.post("/api/check", async (req, res) => {
  console.log("📩 Form Data:", req.body);

  // Format form data as HTML table
  let htmlContent = `
    <h2>New Form Submission</h2>
    <table border="1" cellpadding="6" cellspacing="0">
      ${Object.entries(req.body)
        .map(([key, value]) => `<tr><td><b>${key}</b></td><td>${value}</td></tr>`)
        .join("")}
    </table>
  `;

  const mailOptions = {
    from: `"Form Bot" <${process.env.EMAIL_USER}>`,
    to: process.env.RECEIVE_EMAIL, // destination inbox
    subject: "New Form Submission",
    html: htmlContent
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
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
