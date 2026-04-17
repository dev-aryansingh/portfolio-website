// 🔹 Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        const targetEl = document.querySelector(targetId);

        if (!targetEl) return;

        e.preventDefault();
        targetEl.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});


// 🔹 Navbar Background Change on Scroll
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (!navbar) return;

    navbar.style.backgroundColor =
        window.scrollY > 50
            ? 'rgba(10,10,10,0.98)'
            : 'rgba(10,10,10,0.95)';
});


// 🔹 Contact Form (Backend Connected)
const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const data = {
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            message: document.getElementById("message").value.trim()
        };

        // Basic validation
        if (!data.name || !data.email || !data.message) {
            alert("Please fill all fields.");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            alert(result.message);
            contactForm.reset();

        } catch (err) {
            console.error("Error:", err);
            alert("Failed to send message ❌");
        }
    });
}


// 🔹 View All Projects Toggle (Fixed)
const viewAllBtn = document.getElementById('viewAllBtn');
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