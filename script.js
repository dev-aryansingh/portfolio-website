// ─── Smooth Scroll ───────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});


// ─── Navbar Background Change on Scroll ──────────────────────────────────────
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (!navbar) return;
    navbar.style.backgroundColor =
        window.scrollY > 50 ? 'rgba(10,10,10,0.98)' : '';
});


// ─── Dark / Light Mode Toggle ─────────────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const html        = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
});

function updateThemeIcon(theme) {
    themeIcon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
}


// ─── Hamburger Menu ───────────────────────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
    });
});


// ─── Typing Animation ─────────────────────────────────────────────────────────
const typingPhrases = [
    'Cybersecurity Enthusiast',
    'Full Stack Developer',
    'Builder'
];

let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
const typingEl  = document.getElementById('typingOutput');

function type() {
    const currentPhrase = typingPhrases[phraseIndex];

    if (isDeleting) {
        typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
        speed = 1800;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % typingPhrases.length;
        speed = 400;
    }

    setTimeout(type, speed);
}

type();


// ─── Skeleton Loaders ─────────────────────────────────────────────────────────
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelectorAll('[id^="skillSkeleton"]').forEach(el => el.remove());
        const realSkills = document.getElementById('realSkills');
        if (realSkills) {
            realSkills.style.display    = 'grid';
            realSkills.style.animation = 'fadeIn 0.5s ease';
        }
    }, 1000);

    setTimeout(() => {
        document.querySelectorAll('.skeleton-card').forEach(card => {
            const loader  = card.querySelector('.skeleton-loader');
            const content = card.querySelector('.real-content');
            if (loader)  loader.style.display = 'none';
            if (content) {
                content.style.display   = 'block';
                content.style.animation = 'fadeIn 0.5s ease';
            }
        });
    }, 1200);
});


// ─── Contact Form with Loading Spinner ───────────────────────────────────────
const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const data = {
            name:    document.getElementById("name").value.trim(),
            email:   document.getElementById("email").value.trim(),
            message: document.getElementById("message").value.trim()
        };

        if (!data.name || !data.email || !data.message) {
            alert("Please fill all fields.");
            return;
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');

        // Show spinner
        submitBtn.disabled     = true;
        submitBtn.innerHTML    = `<span class="form-spinner"></span> Sending...`;

        try {
            const res    = await fetch("http://localhost:5000/contact", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(data)
            });

            const result = await res.json();

            // Success state
            submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Sent!`;
            submitBtn.style.background = 'linear-gradient(45deg, #27ae60, #1e8449)';

            setTimeout(() => {
                contactForm.reset();
                submitBtn.disabled         = false;
                submitBtn.innerHTML        = 'Send Message';
                submitBtn.style.background = '';
            }, 3000);

        } catch (err) {
            console.error("Error:", err);
            submitBtn.innerHTML = `<i class="fa-solid fa-xmark"></i> Failed — Try Again`;
            submitBtn.style.background = 'linear-gradient(45deg, #e74c3c, #c0392b)';

            setTimeout(() => {
                submitBtn.disabled         = false;
                submitBtn.innerHTML        = 'Send Message';
                submitBtn.style.background = '';
            }, 3000);
        }
    });
}


// ─── View All Projects Toggle ─────────────────────────────────────────────────
const viewAllBtn    = document.getElementById('viewAllBtn');
const extraProjects = document.querySelectorAll('.extra-project');

if (viewAllBtn && extraProjects.length > 0) {
    viewAllBtn.addEventListener('click', function () {
        const isHidden = [...extraProjects].some(card => card.style.display === 'none');
        extraProjects.forEach(card => {
            card.style.display = isHidden ? 'block' : 'none';
        });
        viewAllBtn.textContent = isHidden ? 'Show Less' : 'View All Projects';
    });
}