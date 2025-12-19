/*
 * Portfolio 2.0 - Main JS
 */

document.addEventListener('DOMContentLoaded', () => {
    // Scroll Reveal Animation using Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Fade in elements
    const fadeElements = document.querySelectorAll('.fade-in, .timeline-item, .project-card, .skill-category');
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add visible class styling dynamically
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);


    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Last Modified Date
    const lastModDate = new Date(document.lastModified);
    const dateElement = document.getElementById('last-modified');
    if (dateElement) {
        dateElement.textContent = `Last active: ${lastModDate.toLocaleDateString()}`; // "Last active" sounds better for a dev portfolio
    }

    // Dynamic Copyright Year
    const yearSpan = document.getElementById('copyright-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    /* Contact Widget Logic */
    const contactToggle = document.getElementById('contact-toggle');
    const contactClose = document.getElementById('contact-close');
    const contactModal = document.getElementById('contact-modal');
    const contactForm = document.getElementById('contact-form');

    function toggleContact() {
        contactModal.classList.toggle('active');
        const icon = contactToggle.querySelector('i');
        if (contactModal.classList.contains('active')) {
            icon.classList.remove('fa-comment-dots');
            icon.classList.remove('fa-envelope'); // Fallback if changed
            icon.classList.add('fa-times');
            contactToggle.style.background = '#666'; // Dim button when open
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-comment-dots');
            contactToggle.style.background = 'var(--accent-primary)';
        }
    }

    if (contactToggle) {
        contactToggle.addEventListener('click', toggleContact);
    }

    if (contactClose) {
        contactClose.addEventListener('click', toggleContact);
    }

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (contactModal.classList.contains('active') &&
            !contactModal.contains(e.target) &&
            !contactToggle.contains(e.target)) {
            toggleContact();
        }
    });

    // Handle Form Submission with EmailJS
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.disabled = true;

            // These IDs from the user's EmailJS dashboard
            const serviceID = 'YOUR_SERVICE_ID';
            const templateID = 'YOUR_TEMPLATE_ID';

            emailjs.sendForm(serviceID, templateID, this)
                .then(() => {
                    btn.innerText = 'Sent!';
                    btn.style.background = '#42b983';
                    contactForm.reset();
                    setTimeout(() => {
                        toggleContact();
                        btn.innerText = originalBtnText;
                        btn.disabled = false;
                        btn.style.background = ''; // Reset to default
                    }, 2000);
                }, (err) => {
                    btn.innerText = 'Error!';
                    btn.style.background = '#ff4444';
                    alert(JSON.stringify(err));
                    console.error('EmailJS Error:', err);
                    setTimeout(() => {
                        btn.innerText = originalBtnText;
                        btn.disabled = false;
                        btn.style.background = '';
                    }, 3000);
                });
        });
    }

    /* Auto-Scroll Recommendations */
    const recContainer = document.getElementById('rec-scroll-container');
    if (recContainer) {
        // Clone children for infinite loop effect
        const cards = Array.from(recContainer.children);
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            recContainer.appendChild(clone);
        });

        let scrollPos = 0;
        let isPaused = false;
        const speed = 0.5; // Pixels per frame

        function autoScroll() {
            if (!isPaused) {
                scrollPos += speed;
                // If scrolled past the first set of cards (halfway), reset to 0
                if (scrollPos >= recContainer.scrollWidth / 2) {
                    scrollPos = 0;
                }
                recContainer.scrollLeft = scrollPos;
            }
            requestAnimationFrame(autoScroll);
        }

        // Pause on hover
        recContainer.addEventListener('mouseenter', () => isPaused = true);
        recContainer.addEventListener('mouseleave', () => isPaused = false);

        // Touch interaction
        recContainer.addEventListener('touchstart', () => isPaused = true);
        recContainer.addEventListener('touchend', () => {
            isPaused = false;
            // Update scrollPos to current position after manual scroll
            scrollPos = recContainer.scrollLeft;
        });

        // Start scrolling
        // requestAnimationFrame(autoScroll); // Disabled for now as it fights with user scroll. 
        // Better implementation: CSS Animation or careful JS. 
        // Let's stick to CSS Keyframes for smoother marquee if user wants "automatic".
        // But for swiping + clicking links, JS is safer.

        autoScroll();
    }
});

/* GitHub Widget Logic */
function switchGhYear(year) {
    const img = document.getElementById('gh-img');
    const link = document.getElementById('gh-link');
    const tabs = document.querySelectorAll('.gh-tab');

    // Update Tabs
    tabs.forEach(tab => {
        if (tab.getAttribute('data-year') === year) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Animate Change
    img.style.opacity = '0.5';

    setTimeout(() => {
        // Update Content
        img.src = `img/gh-rai-${year}.png`;

        switch (year) {
            case '2025':
                link.href = "https://github.com/ajith-natarajan-rai?tab=overview&from=2025-01-01&to=2025-12-31";
                break;
            case '2024':
                link.href = "https://github.com/ajith-natarajan-rai?tab=overview&from=2024-01-01&to=2024-12-31";
                break;
            case '2023':
                link.href = "https://github.com/ajith-natarajan-rai?tab=overview&from=2023-01-01&to=2023-12-31";
                break;
        }

        img.style.opacity = '1';
    }, 150);
}
// Export to window so inline onclick works
window.switchGhYear = switchGhYear;

/* About Section Carousel */
function startAboutCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const caption = document.querySelector('.caption-text');
    let current = 0;
    const intervalTime = 3000; // 3 seconds per slide

    if (slides.length === 0) return;

    setInterval(() => {
        // Remove active from current
        slides[current].classList.remove('active');

        // Move to next
        current = (current + 1) % slides.length;

        // Add active to next
        slides[current].classList.add('active');

        // Update Caption (Optional)
        if (caption) {
            caption.innerText = slides[current].alt;
        }

    }, intervalTime);
}

// Start when loaded
startAboutCarousel();

/* Scroll to Top Logic */
const scrollTopBtn = document.getElementById("scroll-to-top");

window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (scrollTopBtn) {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            scrollTopBtn.classList.add("visible");
        } else {
            scrollTopBtn.classList.remove("visible");
        }
    }
}

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
