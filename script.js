document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        const targetEl = document.querySelector(targetId);

        if (!targetEl) return; // prevents JS crash

        e.preventDefault();
        targetEl.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (!navbar) return;

    navbar.style.backgroundColor =
        window.scrollY > 50
            ? 'rgba(10,10,10,0.98)'
            : 'rgba(10,10,10,0.95)';
});

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (name && email && message) {
            alert("Message sent successfully!");
            contactForm.reset();
        } else {
            alert("Please fill all fields.");
        }
    });
}