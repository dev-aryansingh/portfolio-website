require("dotenv").config();

const express    = require("express");
const cors       = require("cors");
const nodemailer = require("nodemailer");
const mongoose   = require("mongoose");
const crypto     = require("crypto");

const app = express();

app.use(cors());
app.use(express.json());

// ─── MongoDB Connection ───────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// ─── Contact Schema ───────────────────────────────────────────────────────────
const contactSchema = new mongoose.Schema({
    name:      { type: String, required: true },
    email:     { type: String, required: true },
    message:   { type: String, required: true },
    read:      { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model("Contact", contactSchema);

// ─── Session Token Store ──────────────────────────────────────────────────────
const activeSessions = new Set();

// ─── Auth Middleware ──────────────────────────────────────────────────────────
function requireAuth(req, res, next) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token || !activeSessions.has(token)) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
}

// ─── Nodemailer Transporter ───────────────────────────────────────────────────
function createTransporter() {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
}

// ─── POST /admin/login ────────────────────────────────────────────────────────
app.post("/admin/login", (req, res) => {
    const { password } = req.body;
    if (!password || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ message: "Invalid password" });
    }
    const token = crypto.randomBytes(32).toString("hex");
    activeSessions.add(token);
    res.json({ token });
});

// ─── GET /admin/messages ──────────────────────────────────────────────────────
app.get("/admin/messages", requireAuth, async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Could not fetch messages ❌" });
    }
});

// ─── DELETE /admin/messages/:id ───────────────────────────────────────────────
app.delete("/admin/messages/:id", requireAuth, async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: "Message deleted ✅" });
    } catch (error) {
        res.status(500).json({ message: "Could not delete message ❌" });
    }
});

// ─── PATCH /admin/messages/:id/read ──────────────────────────────────────────
app.patch("/admin/messages/:id/read", requireAuth, async (req, res) => {
    try {
        const { read } = req.body;
        await Contact.findByIdAndUpdate(req.params.id, { read });
        res.json({ message: "Updated ✅" });
    } catch (error) {
        res.status(500).json({ message: "Could not update message ❌" });
    }
});

// ─── POST /admin/reply ────────────────────────────────────────────────────────
app.post("/admin/reply", requireAuth, async (req, res) => {
    const { messageId, replyText } = req.body;

    if (!messageId || !replyText) {
        return res.status(400).json({ message: "Missing fields" });
    }

    try {
        const original = await Contact.findById(messageId);
        if (!original) return res.status(404).json({ message: "Message not found" });

        const transporter = createTransporter();

        await transporter.sendMail({
            from:    process.env.EMAIL_USER,
            to:      original.email,
            subject: `Re: Your message to StarkHood`,
            text:    `Hi ${original.name},\n\n${replyText}\n\n---\nOriginal message:\n"${original.message}"\n\n— Aryan Singh | StarkHood`
        });

        // Mark as read after replying
        await Contact.findByIdAndUpdate(messageId, { read: true });

        res.json({ message: "Reply sent ✅" });
    } catch (error) {
        console.error("Reply error:", error);
        res.status(500).json({ message: "Failed to send reply ❌" });
    }
});

// ─── POST /contact ────────────────────────────────────────────────────────────
app.post("/contact", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newContact = new Contact({ name, email, message });
        await newContact.save();
        console.log("📦 Message saved to DB");

        const transporter = createTransporter();

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

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});