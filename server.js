console.log("EMAIL:", process.env.EMAIL_USER);
console.log("PASS:", process.env.EMAIL_PASS);



require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/contact", async (req, res) => {
    console.log("Incoming request:", req.body);

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        console.log("Validation failed");
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        console.log("Creating transporter...");

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        console.log("Sending email...");

        await transporter.sendMail({
            from: process.env.EMAIL_USER,   // ✅ FIXED (IMPORTANT)
            to: process.env.EMAIL_USER,
            subject: `Portfolio Message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        });

        console.log("Email sent!");

        res.json({ message: "Message sent successfully ✅" });

    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).json({ message: "Server error ❌" });
    }
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});