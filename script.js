document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       THEME TOGGLE
       ========================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const bodyElement = document.body;

    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        bodyElement.setAttribute('data-theme', savedTheme);
        updateThemeToggleIcon(savedTheme);
    } else {
        const initialTheme = systemPrefersDark ? 'dark' : 'light';
        bodyElement.setAttribute('data-theme', initialTheme);
        updateThemeToggleIcon(initialTheme);
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = bodyElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        bodyElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
        updateThemeToggleIcon(newTheme);
    });

    function updateThemeToggleIcon(theme) {
        const icon = themeToggleBtn.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    }

    /* ==========================================
       MOBILE NAVIGATION MENU
       ========================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    /* ==========================================
       STICKY NAVBAR & ACTIVE NAVIGATION LINK
       ========================================== */
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Sticky Header effect
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active navigation link highlighting on scroll
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================
       HERO TYPING EFFECT
       ========================================== */
    const typingTextElement = document.getElementById('typing-text');
    const roles = [
        "Electronics & Communication Engineer",
        "Embedded Systems Specialist",
        "RF & Antenna Designer",
        "Tech Innovator & Problem Solver"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;

    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 50;
        } else {
            typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 120;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typeDelay = 2000; // Pause at full word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeDelay = 500; // Pause before next word
        }

        setTimeout(typeEffect, typeDelay);
    }
    
    if (typingTextElement) {
        setTimeout(typeEffect, 800);
    }

    /* ==========================================
       CARD CORNER CURSOR GLOW EFFECT
       ========================================== */
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    /* ==========================================
       PORTFOLIO PROJECT FILTERING
       ========================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button classes
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hide');
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    /* ==========================================
       CERTIFICATIONS TABS SWITCHING
       ========================================== */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            btn.classList.add('active');
            const targetTabId = btn.getAttribute('data-tab');
            document.getElementById(targetTabId).classList.add('active');
        });
    });

    /* ==========================================
       SCROLL REVEAL ANIMATIONS (IntersectionObserver)
       ========================================== */
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-y');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once it is active, no need to watch it anymore
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    /* ==========================================
       CONTACT FORM VALIDATION & TOAST ALERT
       ========================================== */
    const contactForm = document.getElementById('portfolio-contact-form');
    const toast = document.getElementById('toast');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Perform simple validation
            const nameInput = document.getElementById('form-name').value.trim();
            const emailInput = document.getElementById('form-email').value.trim();
            const subjectInput = document.getElementById('form-subject').value.trim();
            const messageInput = document.getElementById('form-message').value.trim();

            if (nameInput && emailInput && subjectInput && messageInput) {
                // Here we would perform actual submission (e.g. Formspree or custom API)
                // For this portfolio, we simulate success feedback
                showToastNotification();
                contactForm.reset();
            }
        });
    }

    function showToastNotification() {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
});
