const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

// POST route for receiving form data
app.post("/api/check", async (req, res) => {
    const formData = req.body;
    console.log("✅ Received:", formData);

    try {
        // Create email transporter
        let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email content
        let mailOptions = {
            from: `"Form Bot" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO,
            subject: "New Form Submission",
            text: JSON.stringify(formData, null, 2)
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log("📧 Email sent successfully!");

        res.json({ status: "ok", message: "Email sent" });
    } catch (error) {
        console.error("❌ Email error:", error);
        res.status(500).json({ status: "error", message: "Failed to send email" });
    }
});

// For Render: listen on assigned port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
