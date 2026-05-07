document.addEventListener('DOMContentLoaded', () => {

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initialize on load
    }

    // Smooth Scrolling for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbar = document.querySelector('.navbar');
                const navHeight = navbar ? navbar.offsetHeight : 0;
                // Subtracting slightly more to ensure ScrollSpy triggers (match data-bs-offset)
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - (navHeight - 20);

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close offcanvas menu on mobile after clicking
                const offcanvas = document.querySelector('.offcanvas.show');
                if (offcanvas) {
                    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
                    bsOffcanvas.hide();
                }
            }
        });
    });

    // Theme and RTL Logic
    const html = document.documentElement;
    const themeToggles = document.querySelectorAll('#themeToggle, #themeToggleMobile');
    const rtlToggles = document.querySelectorAll('#rtlToggle, #rtlToggleMobile');

    // Theme Logic
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);

    themeToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    });

    // RTL Logic
    const savedDir = localStorage.getItem('dir') || 'ltr';
    html.setAttribute('dir', savedDir);
    updateRTLButtonText(savedDir);

    rtlToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentDir = html.getAttribute('dir');
            const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
            html.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);
            updateRTLButtonText(newDir);
        });
    });

    function updateRTLButtonText(dir) {
        rtlToggles.forEach(btn => {
            btn.textContent = dir === 'ltr' ? 'RTL' : 'LTR';
        });
    }

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-up');
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate on scroll
    const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .pricing-card, .process-card');
    animateElements.forEach(el => {
        el.style.opacity = '0'; // Initial state
        observer.observe(el);
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic animation for feedback
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';

            // Simulate API call
            setTimeout(() => {
                btn.classList.remove('btn-dark');
                btn.classList.add('btn-success');
                btn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Inquiry Sent!';

                contactForm.reset();

                setTimeout(() => {
                    btn.disabled = false;
                    btn.classList.remove('btn-success');
                    btn.classList.add('btn-dark');
                    btn.innerHTML = originalText;
                }, 3000);
            }, 1500);
        });
    }

    // Active Link Highlighting Sync
    const refreshScrollSpy = () => {
        const spyBody = bootstrap.ScrollSpy.getInstance(document.body);
        if (spyBody) {
            spyBody.refresh();
        }
    };

    // Refresh on load and images load
    window.addEventListener('load', () => {
        // Initial refresh
        refreshScrollSpy();
        // Delayed refresh for dynamic content/images
        setTimeout(refreshScrollSpy, 500);
        setTimeout(refreshScrollSpy, 1500); // Secondary safety check
    });

    window.addEventListener('resize', refreshScrollSpy);

    // Password Visibility Toggle
    const eyeButtons = document.querySelectorAll('.btn-eye');
    eyeButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            }
        });
    });

    // Back to Top Button Logic
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        const toggleBackToTop = () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        };

        window.addEventListener('scroll', toggleBackToTop);
        toggleBackToTop(); // Check on load

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});


// Dashboard Sidebar Toggle
const sidebarToggle = document.getElementById('sidebarToggle');
const dashboardSidebar = document.querySelector('.dashboard-sidebar');

if (sidebarToggle && dashboardSidebar) {
    sidebarToggle.addEventListener('click', () => {
        dashboardSidebar.classList.toggle('active');
    });
}

// Dashboard Tab Switching
const dashboardNavLinks = document.querySelectorAll('.sidebar-nav-link[data-tab]');
const dashboardTabs = document.querySelectorAll('.dashboard-tab');

if (dashboardNavLinks.length > 0) {
    dashboardNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTabId = link.getAttribute('data-tab');

            // Update Active Link
            dashboardNavLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Update Active Tab
            dashboardTabs.forEach(tab => {
                tab.classList.add('d-none');
                if (tab.id === targetTabId) {
                    tab.classList.remove('d-none');
                }
            });

            // Close sidebar on mobile after clicking
            if (window.innerWidth < 992) {
                dashboardSidebar.classList.remove('active');
            }
        });
    });
}
