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
* 📬 Working contact form with email delivery
* 🗄️ MongoDB database for storing contact submissions
* 🛡️ Environment-based credential security
* 🎯 Clean UI with cyber-themed design
* 📱 Fully responsive layout

---

## 🚀 Features

* Smooth scrolling navigation
* Interactive project cards
* Real-time form validation
* Contact form saved to **MongoDB Atlas**
* Email integration using **Node.js + Nodemailer**
* REST API to view all submissions (`GET /messages`)
* Social media integration
* Modern UI/UX design

---

## 🛠️ Tech Stack

### 🎨 Frontend

* HTML5
* CSS3 (Flexbox & Grid)
* JavaScript (DOM manipulation)
* Font Awesome

### ⚙️ Backend

* Node.js
* Express.js
* Nodemailer
* Mongoose

### 🗄️ Database

* MongoDB Atlas (Cloud)

---

## 📂 Project Structure

```bash
portfolio-website/
│
├── index.html
├── styles.css
├── script.js
├── server.js
├── package.json
├── .env              # secrets (not pushed to GitHub)
├── .gitignore
├── profile.jpg
└── projectlogo.jpg
```

---

## 🔐 Security Implementation

* `.env` for storing sensitive credentials
* `.gitignore` to protect secrets from version control
* Gmail App Password authentication
* MongoDB Atlas IP whitelisting
* Basic backend validation on all inputs

---

## 📬 Contact System

Users can send messages directly through the website:

* Form → Express API → MongoDB (saved) + Email (sent)
* All submissions stored in MongoDB Atlas `contacts` collection
* View all messages via `GET http://localhost:5000/messages`

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

3. Create a `.env` file in the root directory
   ```env
   MONGO_URI=your_mongodb_connection_string
   EMAIL_USER=your@gmail.com
   EMAIL_PASS=your_gmail_app_password
   ```

4. Start the server
   ```bash
   npm start
   ```

5. Open `index.html` in your browser

---

## 🧠 Learning Outcomes

This project helped me understand:

* Full-stack development workflow
* MongoDB Atlas setup and Mongoose integration
* REST API design
* Environment variable management
* Debugging real-world Node.js and DNS issues
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