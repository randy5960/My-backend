const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // handle HTML form submissions

// POST route for receiving form data
app.post("/api/check", async (req, res) => {
  const userAgent = req.get("User-Agent");
  const ip =
    req.headers["x-forwarded-for"]?.split(",").shift() ||
    req.socket.remoteAddress;

  console.log("✅ Form data:", req.body);
  console.log("🌍 IP:", ip);
  console.log("🖥 UA:", userAgent);

  try {
    // Create transporter
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
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
      `,
    };

    // Send the email
    let info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent! Message ID:", info.messageId);

    // ✅ Success page
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Submission Successful</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .message-box {
            background: #fff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            text-align: center;
          }
          h2 { color: green; }
          a {
            display: inline-block;
            margin-top: 15px;
            padding: 10px 20px;
            background: green;
            color: white;
            border-radius: 6px;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="message-box">
          <h2>✅ Thank you! Your data has been submitted.</h2>
          <p>We’ve received your form and sent it to our email system.</p>
          <a href="/">Go Back</a>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("❌ Email error details:", error);

    // ❌ Error page
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Submission Failed</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .message-box {
            background: #fff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            text-align: center;
          }
          h2 { color: red; }
          a {
            display: inline-block;
            margin-top: 15px;
            padding: 10px 20px;
            background: red;
            color: white;
            border-radius: 6px;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="message-box">
          <h2>❌ Oops! Something went wrong.</h2>
          <p>${error.message}</p>
          <a href="/">Try Again</a>
        </div>
      </body>
      </html>
    `);
  }
});

// For Render: listen on assigned port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
