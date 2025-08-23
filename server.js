const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

// POST route for receiving form data
app.post("/api/check", async (req, res) => {
    const formData = req.body;
    console.log("✅ Received form data:", formData);

    // Log environment variables status (not actual passwords)
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
            text: JSON.stringify(formData, null, 2)
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
