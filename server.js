require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

// ─── Debug (remove after confirming connection) ───────────────────────────────
console.log("MONGO_URI:", process.env.MONGO_URI);

// ─── MongoDB Connection ───────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// ─── Contact Schema ───────────────────────────────────────────────────────────
const contactSchema = new mongoose.Schema({
    name:      { type: String, required: true },
    email:     { type: String, required: true },
    message:   { type: String, required: true },
    createdAt: { type: Date,   default: Date.now }
});

const Contact = mongoose.model("Contact", contactSchema);

// ─── POST /contact ────────────────────────────────────────────────────────────
app.post("/contact", async (req, res) => {
    console.log("Incoming request:", req.body);

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // 1. Save to MongoDB
        const newContact = new Contact({ name, email, message });
        await newContact.save();
        console.log("📦 Message saved to DB");

        // 2. Send email via Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from:    process.env.EMAIL_USER,
            to:      process.env.EMAIL_USER,
            subject: `Portfolio Message from ${name}`,
            text:    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        });

        console.log("📧 Email sent!");

        res.json({ message: "Message sent successfully ✅" });

    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).json({ message: "Server error ❌" });
    }
});

// ─── GET /messages ────────────────────────────────────────────────────────────
app.get("/messages", async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).json({ message: "Could not fetch messages ❌" });
    }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});