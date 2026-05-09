# 💼 Personal Portfolio Website 🚀

![HTML](https://img.shields.io/badge/HTML-5-orange?style=for-the-badge&logo=html5)
![CSS](https://img.shields.io/badge/CSS-3-blue?style=for-the-badge&logo=css3)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow?style=for-the-badge&logo=javascript)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Server-black?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen?style=for-the-badge&logo=mongodb)

A modern, responsive **full-stack portfolio website** showcasing my work in **web development and cybersecurity**.

---

## ⚡ Highlights

* 🔥 Full-stack portfolio (Frontend + Backend)
* 📬 Working contact form with email delivery + loading spinner
* 🗄️ MongoDB Atlas for storing all contact submissions
* 🛡️ Password-protected Admin Dashboard
* 🌙 Dark / Light mode toggle (saved in localStorage)
* 📱 Fully responsive with hamburger menu on mobile
* 🎯 Cyber-themed UI with typing animation & skeleton loaders

---

## 🚀 Features

### 🌐 Frontend
* Smooth scrolling navigation
* Typing animation in hero section
* Skeleton loaders on skills and project cards
* Dark / Light mode toggle
* Hamburger menu for mobile
* Contact form with loading spinner + success/error feedback
* Interactive project cards with View All toggle
* Social media integration

### 🔧 Backend
* Contact form → saves to MongoDB + sends email notification
* Token-based Admin authentication
* Full REST API for admin operations

### 🛡️ Admin Dashboard (`admin.html`)
* Password-protected login page
* Overview with 4 stat cards (Total, Unread, Today, Unique Senders)
* Messages per day bar chart (last 14 days)
* Messages per hour line chart (all time)
* Full messages table with search
* Filter by All / Unread
* Mark messages as Read / Unread
* Reply to messages directly from dashboard (sends email to sender)
* Delete messages with confirmation popup
* Export messages to CSV
* Unread badge on sidebar
* Session persists on page refresh

---

## 🛠️ Tech Stack

### 🎨 Frontend
* HTML5, CSS3 (Flexbox & Grid)
* JavaScript (DOM manipulation)
* Font Awesome Icons
* Bootstrap 5
* Chart.js (admin dashboard)

### ⚙️ Backend
* Node.js
* Express.js
* Nodemailer
* Mongoose
* crypto (session token generation)

### 🗄️ Database
* MongoDB Atlas (Cloud)

---

## 📂 Project Structure

```bash
portfolio-website/
│
├── index.html          # Main portfolio page
├── styles.css          # Portfolio styles (dark/light mode, animations)
├── script.js           # Portfolio JS (typing, hamburger, skeleton, form spinner)
│
├── admin.html          # Admin dashboard (login + overview + messages)
├── admin.css           # Admin styles
├── admin.js            # Admin JS (charts, table, CRUD, CSV export)
│
├── server.js           # Express backend
├── package.json        # Dependencies
├── package-lock.json   # Lock file
│
├── profile.jpg         # Profile photo
├── projectlogo.jpg     # Project card logo
│
├── .env                # Secrets — NOT on GitHub
├── .gitignore
└── README.md
```

---

## 🔐 Security Implementation

* `.env` for all sensitive credentials
* `.gitignore` protecting secrets from version control
* Gmail App Password authentication
* MongoDB Atlas IP whitelisting
* Token-based admin session (crypto random token)
* Basic input validation on all API routes
* Admin routes protected by `requireAuth` middleware

---

## 📬 Contact System

* Form → Express API → MongoDB saved + email notification sent
* All submissions stored in `contacts` collection with `read` status
* Admin can reply directly → email sent to the original sender
* Admin can mark read/unread, delete, and export to CSV

---

## 🖥️ Admin Dashboard

Access at `admin.html` → enter your `ADMIN_PASSWORD` from `.env`

| Feature | Details |
|---|---|
| Login | Password protected, token-based session |
| Stats | Total, Unread, Today, Unique Senders |
| Charts | Messages/day (bar) + Messages/hour (line) |
| Table | Search, filter, paginated |
| Actions | Reply, Mark Read, Delete, Export CSV |

---

## ⚙️ Setup & Run Locally

1. Clone the repo
   ```bash
   git clone https://github.com/dev-aryansingh/portfolio-website.git
   cd portfolio-website
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root
   ```env
   MONGO_URI=your_mongodb_direct_connection_string
   EMAIL_USER=your@gmail.com
   EMAIL_PASS=your_gmail_app_password
   ADMIN_PASSWORD=your_secret_admin_password
   ```

4. Start the server
   ```bash
   npm start
   ```

5. Open `index.html` in your browser (or use Live Server)
6. Access admin at `admin.html`

---

## 🧠 Learning Outcomes

* Full-stack development workflow
* MongoDB Atlas setup, Mongoose schemas, CRUD operations
* REST API design with protected routes
* Environment variable management and security
* Debugging Node.js DNS and connection issues
* Chart.js for data visualization
* Dark/light theming with CSS variables
* Git & GitHub version control

---

## 👨‍💻 About Me

I am a **BCA Cybersecurity student** passionate about:

* 🔐 Secure system design
* 🌐 Web application security
* 💡 Problem solving
* 🎨 Modern web interfaces

---

## 📄 License

Open-source project for learning and inspiration.

---

## ⭐ Support

If you like this project, consider giving it a **star ⭐**