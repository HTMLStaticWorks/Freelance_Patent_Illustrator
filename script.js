document.addEventListener('DOMContentLoaded', () => {

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const handleScroll = () => {
            if (window.scrollY > 15) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initialize on load
    }

    // Dashboard Header Scroll Effect
    const dashboardHeader = document.querySelector('.dashboard-header');
    if (dashboardHeader) {
        const handleDashboardScroll = () => {
            if (window.scrollY > 10) {
                dashboardHeader.classList.add('scrolled-header');
            } else {
                dashboardHeader.classList.remove('scrolled-header');
            }
        };
        window.addEventListener('scroll', handleDashboardScroll);
        handleDashboardScroll(); // Initialize on load
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

    // --- Custom ScrollSpy & Nav Indicator Logic ---
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const sections = Array.from(navLinks).map(link => document.querySelector(link.getAttribute('href'))).filter(s => s);
    const navIndicator = document.querySelector('.nav-indicator');

    const updateNavIndicator = (activeLink) => {
        if (!navIndicator || !activeLink || window.innerWidth <= 1100) return;

        const linkRect = activeLink.getBoundingClientRect();
        const navRect = activeLink.closest('.navbar-nav').getBoundingClientRect();

        navIndicator.style.width = `${linkRect.width - 20}px`;
        navIndicator.style.left = `${linkRect.left - navRect.left + 10}px`;
        navIndicator.classList.add('active');
    };

    const setActiveLink = (id) => {
        let activeLink = null;
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
                activeLink = link;
            }
        });

        if (activeLink) {
            updateNavIndicator(activeLink);
        } else {
            navIndicator?.classList.remove('active');
        }
    };

    // Intersection Observer Options
    const spyOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px', // Adjusted for better detection
        threshold: 0
    };

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActiveLink(entry.target.id);
            }
        });
    }, spyOptions);

    sections.forEach(section => spyObserver.observe(section));

    // Handle Manual Scroll Updates (for very fast scrolling)
    window.addEventListener('scroll', () => {
        if (window.scrollY < 100) {
            setActiveLink(sections[0]?.id);
        }
    });

    // Handle Resize for indicator position
    window.addEventListener('resize', () => {
        const activeLink = document.querySelector('.navbar-nav .nav-link.active');
        if (activeLink) updateNavIndicator(activeLink);
    });

    // Initial check
    setTimeout(() => {
        const activeLink = document.querySelector('.navbar-nav .nav-link.active');
        if (activeLink) updateNavIndicator(activeLink);
    }, 100);

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
const sidebarClose = document.getElementById('sidebarClose');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const dashboardSidebar = document.querySelector('.dashboard-sidebar');

const toggleSidebar = () => {
    if (dashboardSidebar && sidebarOverlay) {
        dashboardSidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
    }
};

const closeSidebar = () => {
    if (dashboardSidebar && sidebarOverlay) {
        dashboardSidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    }
};

if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
}

if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
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

            // Dynamic Synchronization of tab content on click
            if (targetTabId === 'helpdesk' && typeof renderChatInterface === 'function') {
                renderChatInterface();
            } else if (targetTabId === 'admin-overview' && typeof renderAdminOverview === 'function') {
                renderAdminOverview();
            } else if (targetTabId === 'admin-projects' && typeof renderAdminProjectsDesk === 'function') {
                renderAdminProjectsDesk();
            } else if (targetTabId === 'admin-requests' && typeof renderAdminRequestsInbox === 'function') {
                renderAdminRequestsInbox();
            }

            // Close sidebar on mobile after clicking
            if (window.innerWidth < 992) {
                closeSidebar();
            }
        });
    });
}

// + NEW PROJECT Dropdown Actions
const newProjectDropdownItems = document.querySelectorAll('.dropdown-menu .dropdown-item[data-tab="upload"]');
if (newProjectDropdownItems.length > 0) {
    newProjectDropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 1. Reset upload wizard to step 1 first to start fresh
            document.querySelectorAll('.wizard-pane').forEach(pane => {
                pane.classList.add('d-none');
                pane.classList.remove('active');
            });
            const firstPane = document.getElementById('wizard-step-1');
            if (firstPane) {
                firstPane.classList.remove('d-none');
                firstPane.classList.add('active');
            }
            
            // Reset milestone step indicators
            document.querySelectorAll('.upload-milestone').forEach(m => {
                m.classList.remove('active', 'completed');
                if (parseInt(m.getAttribute('data-step')) === 1) {
                    m.classList.add('active');
                }
            });
            
            // Reset progress bar to 0%
            const progressEl = document.getElementById('wizard-progress-bar');
            if (progressEl) {
                progressEl.style.width = '0%';
            }
            
            // Reset input values
            const wizardInputTitle = document.getElementById('wizard-input-title');
            if (wizardInputTitle) wizardInputTitle.value = '';
            
            // 2. Map and set the dropdown selection to the Category selector in step 1
            const itemText = item.textContent.trim();
            const wizardInputType = document.getElementById('wizard-input-type');
            if (wizardInputType) {
                if (itemText === 'Utility Patent') {
                    wizardInputType.value = 'Utility';
                } else if (itemText === 'Design Patent') {
                    wizardInputType.value = 'Design';
                } else if (itemText === 'Custom Request') {
                    wizardInputType.value = 'Conversion';
                }
            }
            
            // 3. Switch dashboard view to the "Upload & Request" tab programmatically
            const uploadSidebarLink = document.querySelector('.sidebar-nav-link[data-tab="upload"]');
            if (uploadSidebarLink) {
                uploadSidebarLink.click();
            }
        });
    });
}
// ==========================================
// STAGE 2: PORTAL ENGINEER & DASHBOARD ENGINE
// ==========================================

// Global Dashboard Simulated State
const dashboardState = {
    activeProjectId: 'P-9921',
    projects: [
        {
            id: 'P-9921',
            title: 'Turbine Blade Cooling',
            type: 'Utility',
            figuresCount: 4,
            timelineStep: 3,
            turnaround: 'Standard (3-Day Delivery)',
            targetDate: 'May 28, 2026',
            usptoStatus: 'Drafting',
            badgeClass: 'status-progress',
            badgeText: 'Revisions Open'
        },
        {
            id: 'P-9922',
            title: 'Ergonomic Mouse Design',
            type: 'Design',
            figuresCount: 3,
            timelineStep: 4,
            turnaround: 'Express (24-48h Revisions)',
            targetDate: 'May 20, 2026',
            usptoStatus: 'Client Approved',
            badgeClass: 'status-completed',
            badgeText: 'Client Approved'
        }
    ],
    figures: {
        'P-9921': [
            {
                id: 1,
                label: 'Figure 1.1',
                title: 'Isometric Housing View',
                shading: 'Tangential Surface Shading | Lettering size 3.2mm',
                status: 'Approved',
                svgContent: `<rect x="5" y="5" width="90" height="70" fill="none" stroke="#111" stroke-width="0.5" stroke-dasharray="1,1"/>
                             <line x1="50" y1="10" x2="50" y2="70" stroke="#111" stroke-width="0.3" stroke-dasharray="3,2"/>
                             <ellipse cx="50" cy="40" rx="25" ry="12" fill="none" stroke="#111" stroke-width="0.8"/>
                             <ellipse cx="50" cy="40" rx="18" ry="8" fill="none" stroke="#111" stroke-width="0.5"/>
                             <ellipse cx="50" cy="40" rx="6" ry="3" fill="none" stroke="#111" stroke-width="0.8"/>
                             <line x1="25" y1="40" x2="75" y2="40" stroke="#111" stroke-width="0.3"/>
                             <circle cx="28" cy="20" r="3.5" fill="#fff" stroke="#111" stroke-width="0.5"/>
                             <text x="28" y="21.5" font-size="4" font-family="sans-serif" text-anchor="middle" font-weight="bold">10</text>
                             <line x1="28" y1="23.5" x2="40" y2="34" stroke="#111" stroke-width="0.4"/>
                             <circle cx="72" cy="62" r="3.5" fill="#fff" stroke="#111" stroke-width="0.5"/>
                             <text x="72" y="63.5" font-size="4" font-family="sans-serif" text-anchor="middle" font-weight="bold">12</text>
                             <line x1="72" y1="58.5" x2="60" y2="44" stroke="#111" stroke-width="0.4"/>`
            },
            {
                id: 2,
                label: 'Figure 1.2',
                title: 'Cross-Sectional Cutaway',
                shading: 'Section A-A Assembly | Correct Hatching Lines',
                status: 'Awaiting Approval',
                svgContent: `<rect x="5" y="5" width="90" height="70" fill="none" stroke="#111" stroke-width="0.5" stroke-dasharray="1,1"/>
                             <path d="M 25,20 L 75,20 L 75,60 L 25,60 Z" fill="none" stroke="#111" stroke-width="0.8"/>
                             <path d="M 35,20 L 65,20 L 65,40 L 35,40 Z" fill="none" stroke="#111" stroke-width="0.6"/>
                             <line x1="25" y1="20" x2="30" y2="15" stroke="#111" stroke-width="0.3"/>
                             <line x1="30" y1="20" x2="35" y2="15" stroke="#111" stroke-width="0.3"/>
                             <line x1="35" y1="20" x2="40" y2="15" stroke="#111" stroke-width="0.3"/>
                             <line x1="40" y1="20" x2="45" y2="15" stroke="#111" stroke-width="0.3"/>
                             <line x1="45" y1="20" x2="50" y2="15" stroke="#111" stroke-width="0.3"/>
                             <line x1="55" y1="20" x2="60" y2="15" stroke="#111" stroke-width="0.3"/>
                             <line x1="60" y1="20" x2="65" y2="15" stroke="#111" stroke-width="0.3"/>
                             <line x1="65" y1="20" x2="70" y2="15" stroke="#111" stroke-width="0.3"/>
                             <line x1="50" y1="8" x2="50" y2="72" stroke="#111" stroke-width="0.4" stroke-dasharray="6,2,1,2"/>
                             <circle cx="16" cy="18" r="3.5" fill="#fff" stroke="#111" stroke-width="0.5"/>
                             <text x="16" y="19.5" font-size="4" font-family="sans-serif" text-anchor="middle" font-weight="bold">24</text>
                             <line x1="16" y1="21.5" x2="25" y2="35" stroke="#111" stroke-width="0.4"/>`
            },
            {
                id: 3,
                label: 'Figure 1.3',
                title: 'Exploded Assembly Flow',
                shading: 'Operability Axes | Assembly Order 37 CFR § 1.84',
                status: 'Pending Revision',
                svgContent: `<rect x="5" y="5" width="90" height="70" fill="none" stroke="#111" stroke-width="0.5" stroke-dasharray="1,1"/>
                             <rect x="15" y="30" width="12" height="20" fill="none" stroke="#111" stroke-width="0.7"/>
                             <line x1="27" y1="40" x2="43" y2="40" stroke="#111" stroke-width="0.4" stroke-dasharray="3,3"/>
                             <circle cx="48" cy="40" r="5" fill="none" stroke="#111" stroke-width="0.7"/>
                             <line x1="53" y1="40" x2="69" y2="40" stroke="#111" stroke-width="0.4" stroke-dasharray="3,3"/>
                             <polygon points="69,30 83,40 69,50" fill="none" stroke="#111" stroke-width="0.7"/>
                             <line x1="10" y1="40" x2="90" y2="40" stroke="#111" stroke-width="0.2" stroke-dasharray="8,2"/>
                             <circle cx="48" cy="18" r="3.5" fill="#fff" stroke="#111" stroke-width="0.5"/>
                             <text x="48" y="19.5" font-size="4" font-family="sans-serif" text-anchor="middle" font-weight="bold">32</text>
                             <line x1="48" y1="21.5" x2="48" y2="35" stroke="#111" stroke-width="0.4"/>`
            },
            {
                id: 4,
                label: 'Figure 1.4',
                title: 'Detailed Blade Rotor',
                shading: 'Enlarged Fragment Detail | Shading curves',
                status: 'In Drafting',
                svgContent: `<rect x="5" y="5" width="90" height="70" fill="none" stroke="#111" stroke-width="0.5" stroke-dasharray="1,1"/>
                             <path d="M 50,15 C 30,15 20,30 20,50 L 80,50 C 80,30 70,15 50,15 Z" fill="none" stroke="#111" stroke-width="0.8"/>
                             <line x1="28" y1="50" x2="35" y2="35" stroke="#111" stroke-width="0.5"/>
                             <line x1="50" y1="50" x2="50" y2="30" stroke="#111" stroke-width="0.5"/>
                             <line x1="72" y1="50" x2="65" y2="35" stroke="#111" stroke-width="0.5"/>
                             <circle cx="85" cy="20" r="3.5" fill="#fff" stroke="#111" stroke-width="0.5"/>
                             <text x="85" y="21.5" font-size="4" font-family="sans-serif" text-anchor="middle" font-weight="bold">40</text>
                             <line x1="85" y1="23.5" x2="72" y2="36" stroke="#111" stroke-width="0.4"/>`
            }
        ],
        'P-9922': [
            {
                id: 1,
                label: 'Figure 2.1',
                title: 'Top Perspective Orthographic',
                shading: 'Symmetrical Outline | Form Curvatures',
                status: 'Approved',
                svgContent: `<rect x="5" y="5" width="90" height="70" fill="none" stroke="#111" stroke-width="0.5" stroke-dasharray="1,1"/>
                             <path d="M 50,12 C 32,12 28,25 28,45 C 28,62 38,68 50,68 C 62,68 72,62 72,45 C 72,25 68,12 50,12 Z" fill="none" stroke="#111" stroke-width="0.8"/>
                             <path d="M 50,22 C 38,22 36,32 36,44 C 36,54 42,58 50,58 C 58,58 64,54 64,44 C 64,32 62,22 50,22 Z" fill="none" stroke="#111" stroke-width="0.4"/>
                             <circle cx="50" cy="32" r="4" fill="none" stroke="#111" stroke-width="0.6"/>
                             <circle cx="20" cy="20" r="3.5" fill="#fff" stroke="#111" stroke-width="0.5"/>
                             <text x="20" y="21.5" font-size="4" font-family="sans-serif" text-anchor="middle" font-weight="bold">1</text>
                             <line x1="20" y1="23.5" x2="35" y2="35" stroke="#111" stroke-width="0.4"/>`
            },
            {
                id: 2,
                label: 'Figure 2.2',
                title: 'Bottom Cavity Profile',
                shading: 'Tracking Aperture | Contact Pads Spec',
                status: 'Approved',
                svgContent: `<rect x="5" y="5" width="90" height="70" fill="none" stroke="#111" stroke-width="0.5" stroke-dasharray="1,1"/>
                             <path d="M 50,12 C 32,12 28,25 28,45 C 28,62 38,68 50,68 C 62,68 72,62 72,45 C 72,25 68,12 50,12 Z" fill="none" stroke="#111" stroke-width="0.6"/>
                             <rect x="42" y="38" width="16" height="14" fill="none" stroke="#111" stroke-width="0.8"/>
                             <circle cx="50" cy="45" r="3" fill="none" stroke="#111" stroke-width="0.8"/>
                             <line x1="28" y1="45" x2="72" y2="45" stroke="#111" stroke-width="0.3" stroke-dasharray="2,2"/>`
            },
            {
                id: 3,
                label: 'Figure 2.3',
                title: 'Lateral Ergonomic Sweep',
                shading: 'Support Contour | Grip Grooves',
                status: 'Approved',
                svgContent: `<rect x="5" y="5" width="90" height="70" fill="none" stroke="#111" stroke-width="0.5" stroke-dasharray="1,1"/>
                             <path d="M 12,55 C 32,55 38,20 62,20 C 78,20 88,38 88,55 Z" fill="none" stroke="#111" stroke-width="0.9"/>
                             <path d="M 38,32 C 45,35 48,45 52,55" fill="none" stroke="#111" stroke-width="0.4"/>
                             <line x1="12" y1="55" x2="88" y2="55" stroke="#111" stroke-width="0.5"/>`
            }
        ]
    },
    invoices: {
        'INV-2026-004': { amount: 840, status: 'Unpaid' },
        'INV-2026-001': { amount: 400, status: 'Paid' }
    },
    activityLog: {
        'P-9921': [
            { type: 'approve', message: '<strong>Figure 1.1: Isometric Housing View</strong> approved by Client.', date: 'May 16, 2026 - 11:22 AM' },
            { type: 'revision', message: '<strong>Figure 1.3: Exploded Assembly Flow</strong> marked as <em>Pending Revision</em>. Adjusting placement alignment vectors along operational assembly axis 14.', date: 'May 15, 2026 - 02:40 PM' },
            { type: 'draft', message: 'Professional Drafting team uploaded initial drawing set drafts.', date: 'May 15, 2026 - 10:15 AM' }
        ],
        'P-9922': [
            { type: 'approve', message: '<strong>Figure 2.3: Lateral Ergonomic Sweep</strong> approved by Client.', date: 'May 18, 2026 - 09:12 AM' },
            { type: 'approve', message: '<strong>Figure 2.2: Bottom Cavity Profile</strong> approved by Client.', date: 'May 18, 2026 - 09:10 AM' },
            { type: 'approve', message: '<strong>Figure 2.1: Top Perspective Orthographic</strong> approved by Client.', date: 'May 18, 2026 - 09:05 AM' },
            { type: 'status', message: 'Project transitioned to <strong>Client Approved / Ready for filing</strong>.', date: 'May 18, 2026 - 09:12 AM' }
        ]
    }
};

// ==========================================
// MOCK MULTI-CLIENT SESSIONS STATE ENGINE
// ==========================================
const clientMockData = {
    'john-doe': {
        name: 'John Doe',
        role: 'Lead Attorney',
        company: 'Helix Patent Law',
        initials: 'JD',
        avatarBg: 'bg-dark',
        avatarImg: 'assets/img/avatar-john-doe.png',
        activeCount: 12,
        awaitingCount: 8,
        invoices: {
            'INV-2026-004': { amount: 840, status: 'Unpaid', project: 'Ergonomic Mouse Design', date: 'May 6, 2026' },
            'INV-2026-001': { amount: 400, status: 'Paid', project: 'Gear Assembly Draft Set', date: 'May 1, 2026' }
        },
        projects: [
            {
                id: 'P-9921',
                title: 'Turbine Blade Cooling',
                type: 'Utility',
                figuresCount: 4,
                timelineStep: 3,
                turnaround: 'Standard (3-Day Delivery)',
                targetDate: 'May 28, 2026',
                usptoStatus: 'Drafting',
                badgeClass: 'status-progress',
                badgeText: 'Revisions Open'
            },
            {
                id: 'P-9922',
                title: 'Ergonomic Mouse Design',
                type: 'Design',
                figuresCount: 3,
                timelineStep: 4,
                turnaround: 'Express (24-48h Revisions)',
                targetDate: 'May 20, 2026',
                usptoStatus: 'Client Approved',
                badgeClass: 'status-completed',
                badgeText: 'Client Approved'
            }
        ],
        figures: {
            'P-9921': [
                {
                    id: 1,
                    label: 'Figure 1.1',
                    title: 'Isometric Housing View',
                    shading: 'Tangential Surface Shading | Lettering size 3.2mm',
                    status: 'Approved',
                    svgContent: `<rect x="5" y="5" width="90" height="70" fill="none" stroke="#111" stroke-width="0.5" stroke-dasharray="1,1"/>
                                 <line x1="50" y1="10" x2="50" y2="70" stroke="#111" stroke-width="0.3" stroke-dasharray="3,2"/>
                                 <ellipse cx="50" cy="40" rx="25" ry="12" fill="none" stroke="#111" stroke-width="0.8"/>
                                 <ellipse cx="50" cy="40" rx="18" ry="8" fill="none" stroke="#111" stroke-width="0.5"/>
                                 <ellipse cx="50" cy="40" rx="6" ry="3" fill="none" stroke="#111" stroke-width="0.8"/>
                                 <line x1="25" y1="40" x2="75" y2="40" stroke="#111" stroke-width="0.3"/>
                                 <circle cx="28" cy="20" r="3.5" fill="#fff" stroke="#111" stroke-width="0.5"/>
                                 <text x="28" y="21.5" font-size="4" font-family="sans-serif" text-anchor="middle" font-weight="bold">10</text>
                                 <line x1="28" y1="23.5" x2="40" y2="34" stroke="#111" stroke-width="0.4"/>
                                 <circle cx="72" cy="62" r="3.5" fill="#fff" stroke="#111" stroke-width="0.5"/>
                                 <text x="72" y="63.5" font-size="4" font-family="sans-serif" text-anchor="middle" font-weight="bold">12</text>
                                 <line x1="72" y1="58.5" x2="60" y2="44" stroke="#111" stroke-width="0.4"/>`
                },
                {
                    id: 2,
                    label: 'Figure 1.2',
                    title: 'Cross-Sectional Cutaway',
                    shading: 'Section A-A Assembly | Correct Hatching Lines',
                    status: 'Awaiting Approval',
                    svgContent: `<rect x="5" y="5" width="90" height="70" fill="none" stroke="#111" stroke-width="0.5" stroke-dasharray="1,1"/>
                                 <path d="M 25,20 L 75,20 L 75,60 L 25,60 Z" fill="none" stroke="#111" stroke-width="0.8"/>
                                 <path d="M 35,20 L 65,20 L 65,40 L 35,40 Z" fill="none" stroke="#111" stroke-width="0.6"/>
                                 <line x1="25" y1="20" x2="30" y2="15" stroke="#111" stroke-width="0.3"/>
                                 <line x1="30" y1="20" x2="35" y2="15" stroke="#111" stroke-width="0.3"/>
                                 <line x1="35" y1="20" x2="40" y2="15" stroke="#111" stroke-width="0.3"/>
                                 <line x1="40" y1="20" x2="45" y2="15" stroke="#111" stroke-width="0.3"/>
                                 <line x1="45" y1="20" x2="50" y2="15" stroke="#111" stroke-width="0.3"/>
                                 <line x1="55" y1="20" x2="60" y2="15" stroke="#111" stroke-width="0.3"/>
                                 <line x1="60" y1="20" x2="65" y2="15" stroke="#111" stroke-width="0.3"/>
                                 <line x1="65" y1="20" x2="70" y2="15" stroke="#111" stroke-width="0.3"/>
                                 <line x1="50" y1="8" x2="50" y2="72" stroke="#111" stroke-width="0.4" stroke-dasharray="6,2,1,2"/>
                                 <circle cx="16" cy="18" r="3.5" fill="#fff" stroke="#111" stroke-width="0.5"/>
                                 <text x="16" y="19.5" font-size="4" font-family="sans-serif" text-anchor="middle" font-weight="bold">24</text>
                                 <line x1="16" y1="21.5" x2="25" y2="35" stroke="#111" stroke-width="0.4"/>`
                },
                {
                    id: 3,
                    label: 'Figure 1.3',
                    title: 'Exploded Assembly Flow',
                    shading: 'Operability Axes | Assembly Order 37 CFR § 1.84',
                    status: 'Pending Revision',
                    svgContent: `<rect x="5" y="5" width="90" height="70" fill="none" stroke="#111" stroke-width="0.5" stroke-dasharray="1,1"/>
                                 <rect x="15" y="30" width="12" height="20" fill="none" stroke="#111" stroke-width="0.7"/>
                                 <line x1="27" y1="40" x2="43" y2="40" stroke="#111" stroke-width="0.4" stroke-dasharray="3,3"/>
                                 <circle cx="48" cy="40" r="5" fill="none" stroke="#111" stroke-width="0.7"/>
                                 <line x1="53" y1="40" x2="69" y2="40" stroke="#111" stroke-width="0.4" stroke-dasharray="3,3"/>
                                 <polygon points="69,30 83,40 69,50" fill="none" stroke="#111" stroke-width="0.7"/>
                                 <line x1="10" y1="40" x2="90" y2="40" stroke="#111" stroke-width="0.2" stroke-dasharray="8,2"/>
                                 <circle cx="48" cy="18" r="3.5" fill="#fff" stroke="#111" stroke-width="0.5"/>
                                 <text x="48" y="19.5" font-size="4" font-family="sans-serif" text-anchor="middle" font-weight="bold">32</text>
                                 <line x1="48" y1="21.5" x2="48" y2="35" stroke="#111" stroke-width="0.4"/>`
                },
                {
                    id: 4,
                    label: 'Figure 1.4',
                    title: 'Detailed Blade Rotor',
                    shading: 'Enlarged Fragment Detail | Shading curves',
                    status: 'In Drafting',
                    svgContent: `<rect x="5" y="5" width="90" height="70" fill="none" stroke="#111" stroke-width="0.5" stroke-dasharray="1,1"/>
                                 <path d="M 50,15 C 30,15 20,30 20,50 L 80,50 C 80,30 70,15 50,15 Z" fill="none" stroke="#111" stroke-width="0.8"/>
                                 <line x1="28" y1="50" x2="35" y2="35" stroke="#111" stroke-width="0.5"/>
                                 <line x1="50" y1="50" x2="50" y2="30" stroke="#111" stroke-width="0.5"/>
                                 <line x1="72" y1="50" x2="65" y2="35" stroke="#111" stroke-width="0.5"/>
                                 <circle cx="85" cy="20" r="3.5" fill="#fff" stroke="#111" stroke-width="0.5"/>
                                 <text x="85" y="21.5" font-size="4" font-family="sans-serif" text-anchor="middle" font-weight="bold">40</text>
                                 <line x1="85" y1="23.5" x2="72" y2="36" stroke="#111" stroke-width="0.4"/>`
                }
            ],
            'P-9922': [
                {
                    id: 1,
                    label: 'Figure 2.1',
                    title: 'Top Perspective Orthographic',
                    shading: 'Symmetrical Outline | Form Curvatures',
                    status: 'Approved',
                    svgContent: `<rect x="5" y="5" width="90" height="70" fill="none" stroke="#111" stroke-width="0.5" stroke-dasharray="1,1"/>
                                 <path d="M 50,12 C 32,12 28,25 28,45 C 28,62 38,68 50,68 C 62,68 72,62 72,45 C 72,25 68,12 50,12 Z" fill="none" stroke="#111" stroke-width="0.8"/>
                                 <path d="M 50,22 C 38,22 36,32 36,44 C 36,54 42,58 50,58 C 58,58 64,54 64,44 C 64,32 62,22 50,22 Z" fill="none" stroke="#111" stroke-width="0.4"/>
                                 <circle cx="50" cy="32" r="4" fill="none" stroke="#111" stroke-width="0.6"/>
                                 <circle cx="20" cy="20" r="3.5" fill="#fff" stroke="#111" stroke-width="0.5"/>
                                 <text x="20" y="21.5" font-size="4" font-family="sans-serif" text-anchor="middle" font-weight="bold">1</text>
                                 <line x1="20" y1="23.5" x2="35" y2="35" stroke="#111" stroke-width="0.4"/>`
                },
                {
                    id: 2,
                    label: 'Figure 2.2',
                    title: 'Bottom Cavity Profile',
                    shading: 'Tracking Aperture | Contact Pads Spec',
                    status: 'Approved',
                    svgContent: `<rect x="5" y="5" width="90" height="70" fill="none" stroke="#111" stroke-width="0.5" stroke-dasharray="1,1"/>
                                 <path d="M 50,12 C 32,12 28,25 28,45 C 28,62 38,68 50,68 C 62,68 72,62 72,45 C 72,25 68,12 50,12 Z" fill="none" stroke="#111" stroke-width="0.6"/>
                                 <rect x="42" y="38" width="16" height="14" fill="none" stroke="#111" stroke-width="0.8"/>
                                 <circle cx="50" cy="45" r="3" fill="none" stroke="#111" stroke-width="0.8"/>
                                 <line x1="28" y1="45" x2="72" y2="45" stroke="#111" stroke-width="0.3" stroke-dasharray="2,2"/>`
                },
                {
                    id: 3,
                    label: 'Figure 2.3',
                    title: 'Lateral Ergonomic Sweep',
                    shading: 'Support Contour | Grip Grooves',
                    status: 'Approved',
                    svgContent: `<rect x="5" y="5" width="90" height="70" fill="none" stroke="#111" stroke-width="0.5" stroke-dasharray="1,1"/>
                                 <path d="M 12,55 C 32,55 38,20 62,20 C 78,20 88,38 88,55 Z" fill="none" stroke="#111" stroke-width="0.9"/>
                                 <path d="M 38,32 C 45,35 48,45 52,55" fill="none" stroke="#111" stroke-width="0.4"/>
                                 <line x1="12" y1="55" x2="88" y2="55" stroke="#111" stroke-width="0.5"/>`
                }
            ]
        },
        activityLog: {
            'P-9921': [
                { type: 'approve', message: '<strong>Figure 1.1: Isometric Housing View</strong> approved by Client.', date: 'May 16, 2026 - 11:22 AM' },
                { type: 'revision', message: '<strong>Figure 1.3: Exploded Assembly Flow</strong> marked as <em>Pending Revision</em>. Adjusting placement alignment vectors along operational assembly axis 14.', date: 'May 15, 2026 - 02:40 PM' },
                { type: 'draft', message: 'Professional Drafting team uploaded initial drawing set drafts.', date: 'May 15, 2026 - 10:15 AM' }
            ],
            'P-9922': [
                { type: 'approve', message: '<strong>Figure 2.3: Lateral Ergonomic Sweep</strong> approved by Client.', date: 'May 18, 2026 - 09:12 AM' },
                { type: 'approve', message: '<strong>Figure 2.2: Bottom Cavity Profile</strong> approved by Client.', date: 'May 18, 2026 - 09:10 AM' },
                { type: 'approve', message: '<strong>Figure 2.1: Top Perspective Orthographic</strong> approved by Client.', date: 'May 18, 2026 - 09:05 AM' },
                { type: 'status', message: 'Project transitioned to <strong>Client Approved / Ready for filing</strong>.', date: 'May 18, 2026 - 09:12 AM' }
            ]
        }
    },
    'sarah-jenkins': {
        name: 'Sarah Jenkins',
        role: 'VP of R&D',
        company: 'Tesla Motors',
        initials: 'SJ',
        avatarBg: 'bg-primary',
        avatarImg: 'assets/img/avatar-sarah-jenkins.png',
        activeCount: 18,
        awaitingCount: 14,
        invoices: {
            'INV-2026-009': { amount: 1550, status: 'Unpaid', project: 'Battery Cell Thermal Sleeve', date: 'May 10, 2026' },
            'INV-2026-003': { amount: 750, status: 'Paid', project: 'EV Induction Rotor Blade', date: 'May 4, 2026' }
        },
        projects: [
            {
                id: 'P-8841',
                title: 'Battery Cell Thermal Sleeve',
                type: 'Utility',
                figuresCount: 6,
                timelineStep: 3,
                turnaround: 'Express (24-48h Revisions)',
                targetDate: 'June 02, 2026',
                usptoStatus: 'Drafting',
                badgeClass: 'status-progress',
                badgeText: 'Revisions Open'
            },
            {
                id: 'P-8842',
                title: 'EV Induction Rotor Blade',
                type: 'Design',
                figuresCount: 5,
                timelineStep: 4,
                turnaround: 'Standard (3-Day Delivery)',
                targetDate: 'May 25, 2026',
                usptoStatus: 'Client Approved',
                badgeClass: 'status-completed',
                badgeText: 'Client Approved'
            }
        ],
        figures: {
            'P-8841': [
                {
                    id: 1,
                    label: 'Figure 1.1',
                    title: 'Thermal Sleeve Isometric View',
                    shading: 'Tangential Surface Shading | Lettering size 3.2mm',
                    status: 'Approved',
                    svgContent: `<rect x="5" y="5" width="90" height="70" fill="none" stroke="#111" stroke-width="0.5" stroke-dasharray="1,1"/>
                                 <rect x="20" y="15" width="60" height="40" rx="5" fill="none" stroke="#111" stroke-width="0.8"/>
                                 <ellipse cx="50" cy="35" rx="15" ry="10" fill="none" stroke="#111" stroke-width="0.6"/>
                                 <circle cx="28" cy="23" r="3" fill="#fff" stroke="#111" stroke-width="0.5"/>
                                 <text x="28" y="24.5" font-size="3.5" font-family="sans-serif" text-anchor="middle" font-weight="bold">14</text>`
                },
                {
                    id: 2,
                    label: 'Figure 1.2',
                    title: 'Cross-Sectional Assembly',
                    shading: 'Section B-B Hatching Lines',
                    status: 'Awaiting Approval',
                    svgContent: `<rect x="5" y="5" width="90" height="70" fill="none" stroke="#111" stroke-width="0.5" stroke-dasharray="1,1"/>
                                 <line x1="20" y1="35" x2="80" y2="35" stroke="#111" stroke-width="0.8"/>
                                 <line x1="20" y1="20" x2="80" y2="50" stroke="#111" stroke-width="0.5" stroke-dasharray="2,2"/>`
                }
            ],
            'P-8842': [
                {
                    id: 1,
                    label: 'Figure 2.1',
                    title: 'Induction Rotor Perspective',
                    shading: 'Outlines compliance check',
                    status: 'Approved',
                    svgContent: `<rect x="5" y="5" width="90" height="70" fill="none" stroke="#111" stroke-width="0.5" stroke-dasharray="1,1"/>
                                 <circle cx="50" cy="35" r="22" fill="none" stroke="#111" stroke-width="0.8"/>
                                 <circle cx="50" cy="35" r="10" fill="none" stroke="#111" stroke-width="0.5"/>`
                }
            ]
        },
        activityLog: {
            'P-8841': [
                { type: 'approve', message: '<strong>Figure 1.1: Thermal Sleeve Isometric View</strong> approved by Sarah Jenkins.', date: 'May 17, 2026 - 04:15 PM' },
                { type: 'draft', message: 'Professional Drafting team uploaded initial sleeve drawings.', date: 'May 16, 2026 - 10:15 AM' }
            ],
            'P-8842': [
                { type: 'approve', message: '<strong>Figure 2.1: Induction Rotor Perspective</strong> approved by Sarah Jenkins.', date: 'May 15, 2026 - 02:40 PM' }
            ]
        }
    },
    'david-wang': {
        name: 'David Wang',
        role: 'Lead Inventor',
        company: 'BioTech Labs',
        initials: 'DW',
        avatarBg: 'bg-success',
        avatarImg: 'assets/img/avatar-david-wang.png',
        activeCount: 7,
        awaitingCount: 3,
        invoices: {
            'INV-2026-012': { amount: 680, status: 'Unpaid', project: 'Microfluidic Lab-on-a-Chip', date: 'May 12, 2026' }
        },
        projects: [
            {
                id: 'P-7761',
                title: 'Microfluidic Lab-on-a-Chip',
                type: 'Utility',
                figuresCount: 3,
                timelineStep: 3,
                turnaround: 'Standard (3-Day Delivery)',
                targetDate: 'June 10, 2026',
                usptoStatus: 'Drafting',
                badgeClass: 'status-progress',
                badgeText: 'Revisions Open'
            },
            {
                id: 'P-7762',
                title: 'Syringe Plunger Assembly',
                type: 'Design',
                figuresCount: 2,
                timelineStep: 4,
                turnaround: 'Express (24-48h Revisions)',
                targetDate: 'June 01, 2026',
                usptoStatus: 'Client Approved',
                badgeClass: 'status-completed',
                badgeText: 'Client Approved'
            }
        ],
        figures: {
            'P-7761': [
                {
                    id: 1,
                    label: 'Figure 1.1',
                    title: 'Microfluidic Channels Isometric',
                    shading: 'Tangential Surface Shading | Lettering size 3.2mm',
                    status: 'Awaiting Approval',
                    svgContent: `<rect x="5" y="5" width="90" height="70" fill="none" stroke="#111" stroke-width="0.5" stroke-dasharray="1,1"/>
                                 <path d="M 15,35 Q 35,15 50,35 T 85,35" fill="none" stroke="#111" stroke-width="0.8"/>`
                }
            ],
            'P-7762': [
                {
                    id: 1,
                    label: 'Figure 2.1',
                    title: 'Syringe Assembly Detail',
                    shading: 'Outlines compliance check',
                    status: 'Approved',
                    svgContent: `<rect x="5" y="5" width="90" height="70" fill="none" stroke="#111" stroke-width="0.5" stroke-dasharray="1,1"/>
                                 <rect x="35" y="10" width="30" height="50" fill="none" stroke="#111" stroke-width="0.8"/>`
                }
            ]
        },
        activityLog: {
            'P-7761': [
                { type: 'draft', message: 'Professional Drafting team uploaded chip outlines.', date: 'May 14, 2026 - 11:30 AM' }
            ],
            'P-7762': [
                { type: 'approve', message: '<strong>Figure 2.1: Syringe Assembly Detail</strong> approved by David Wang.', date: 'May 16, 2026 - 03:20 PM' }
            ]
        }
    }
};

// Programmatic Client Session Switcher
function switchClient(clientId) {
    const client = clientMockData[clientId];
    if (!client) return;

    // 1. Update active client details in state
    dashboardState.activeProjectId = client.projects[0].id;
    dashboardState.projects = JSON.parse(JSON.stringify(client.projects));
    dashboardState.figures = JSON.parse(JSON.stringify(client.figures));
    dashboardState.activityLog = JSON.parse(JSON.stringify(client.activityLog));
    dashboardState.invoices = JSON.parse(JSON.stringify(client.invoices));

    // 2. Update Profile Switcher display inside sidebar
    const displayName = document.getElementById('profile-display-name');
    const displayRole = document.getElementById('profile-display-role');
    const avatarImgEl = document.getElementById('profile-avatar-img');

    if (displayName) displayName.textContent = client.name;
    if (displayRole) displayRole.innerHTML = `${client.role}<br><span style="font-size: 9px; opacity: 0.85;">@ ${client.company}</span>`;
    if (avatarImgEl) {
        avatarImgEl.src = client.avatarImg || '';
        avatarImgEl.alt = client.initials;
    }

    // Update active style class in selector dropdown menu
    document.querySelectorAll('.client-switch-btn').forEach(btn => {
        if (btn.getAttribute('data-client') === clientId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 3. Update Overview top statistics
    const activeCountEl = document.getElementById('stat-active-projects');
    const awaitingCountEl = document.getElementById('stat-awaiting-uspto');
    const pendingInvoicesEl = document.getElementById('stat-pending-invoices');

    if (activeCountEl) activeCountEl.innerHTML = `${client.activeCount} <span class="d-block x-small text-success mt-1"><i class="bi bi-arrow-up-right me-1"></i>+2 this week</span>`;
    if (awaitingCountEl) awaitingCountEl.textContent = String(client.awaitingCount).padStart(2, '0');

    // Calculate unpaid balance sum for the client
    let unpaidSum = 0;
    let unpaidCount = 0;
    Object.keys(client.invoices).forEach(invId => {
        if (client.invoices[invId].status === 'Unpaid') {
            unpaidSum += client.invoices[invId].amount;
            unpaidCount++;
        }
    });

    if (pendingInvoicesEl) pendingInvoicesEl.textContent = `$${unpaidSum}`;
    const invoiceOverdueWarning = document.getElementById('stat-overdue-warning');
    if (invoiceOverdueWarning) {
        if (unpaidCount > 0) {
            invoiceOverdueWarning.className = 'mt-3 small text-danger';
            invoiceOverdueWarning.innerHTML = `<i class="bi bi-exclamation-circle-fill me-1"></i>${unpaidCount} invoice unpaid`;
        } else {
            invoiceOverdueWarning.className = 'mt-3 small text-success';
            invoiceOverdueWarning.innerHTML = `<i class="bi bi-check-circle-fill me-1"></i>All Invoices Paid`;
        }
    }

    // 4. Rebuild timeline project dropdown select options
    const timelineSelector = document.getElementById('timeline-project-selector');
    if (timelineSelector) {
        timelineSelector.innerHTML = '';
        client.projects.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = `${p.title} (${p.id})`;
            timelineSelector.appendChild(opt);
        });
        timelineSelector.value = dashboardState.activeProjectId;
    }

    // 5. Rebuild "My Projects" portfolio grid DOM
    const gridContainer = document.getElementById('projects-grid-list');
    if (gridContainer) {
        gridContainer.innerHTML = '';
        client.projects.forEach(p => {
            const isFirst = p.id === dashboardState.activeProjectId;
            const cardHTML = `
                <div class="col-md-6 col-xl-4 project-nav-card" data-project-id="${p.id}">
                    <div class="stat-card p-0 overflow-hidden border border-dark border-opacity-10 rounded-0 cursor-pointer ${isFirst ? 'active-project-card' : ''}" id="project-card-${p.id}">
                        <div class="p-3 border-bottom border-dark border-opacity-10">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <span class="x-small text-muted fw-bold">ID: ${p.id}</span>
                                <span class="status-badge ${p.badgeClass}" id="project-badge-${p.id}">${p.badgeText}</span>
                            </div>
                            <h6 class="fw-bold mb-1">${p.title}</h6>
                            <p class="x-small text-secondary mb-0">${p.type} Patent | ${p.figuresCount} Active Figures</p>
                        </div>
                        <div class="p-3 bg-light d-flex justify-content-between align-items-center">
                            <span class="x-small fw-bold"><i class="bi bi-clock me-1"></i>${p.turnaround.split(' ')[0]}</span>
                            <span class="text-dark x-small fw-bold">VIEW WORKSPACE <i class="bi bi-arrow-right ms-1"></i></span>
                        </div>
                    </div>
                </div>
            `;
            gridContainer.insertAdjacentHTML('beforeend', cardHTML);
        });

        // Re-bind click handlers to these project cards
        gridContainer.querySelectorAll('.project-nav-card').forEach(card => {
            card.addEventListener('click', () => {
                const pId = card.getAttribute('data-project-id');
                dashboardState.activeProjectId = pId;

                // Sync timeline selector dropdown
                if (timelineSelector) timelineSelector.value = pId;

                // Highlight active card
                document.querySelectorAll('.project-nav-card .stat-card').forEach(c => {
                    c.classList.remove('active-project-card');
                });
                const gridCardInner = document.getElementById(`project-card-${pId}`);
                if (gridCardInner) gridCardInner.classList.add('active-project-card');

                renderTimeline(pId);
                renderFiguresWorkspace(pId);
            });
        });
    }

    // 6. Rebuild "Invoices" tab list DOM dynamically
    const invoicesGrid = document.querySelector('#invoices .row');
    if (invoicesGrid) {
        invoicesGrid.innerHTML = '';
        Object.keys(client.invoices).forEach(invId => {
            const inv = client.invoices[invId];
            const isUnpaid = inv.status === 'Unpaid';
            const invoiceHTML = `
                <div class="col-md-6 col-lg-4">
                    <div class="stat-card p-0 overflow-hidden border border-dark border-opacity-10 rounded-0" id="${isUnpaid ? 'invoice-card-unpaid' : ''}">
                        <div class="p-3 border-bottom border-dark border-opacity-10">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <span class="x-small text-muted fw-bold">#${invId}</span>
                                <span class="status-badge ${isUnpaid ? 'status-pending' : 'status-completed'}" id="${isUnpaid ? 'invoice-badge-unpaid' : ''}">${inv.status}</span>
                            </div>
                            <h6 class="fw-bold mb-1">${inv.project}</h6>
                            <p class="x-small text-muted mb-0">Issued: ${inv.date}</p>
                        </div>
                        <div class="p-3 bg-light d-flex justify-content-between align-items-center">
                            <div>
                                <span class="x-small text-muted d-block" id="${isUnpaid ? 'invoice-label-amount' : ''}">${isUnpaid ? 'Amount Due' : 'Amount Paid'}</span>
                                <span class="${isUnpaid ? 'fw-bold text-danger' : 'fw-bold text-dark'}" id="${isUnpaid ? 'invoice-text-amount' : ''}">$${inv.amount.toFixed(2)}</span>
                            </div>
                            ${isUnpaid 
                                ? `<button class="btn btn-dark btn-sm rounded-0 fw-bold px-3" id="btn-pay-now-invoice" onclick="openPaymentModal()"><i class="bi bi-credit-card me-1"></i>PAY NOW</button>`
                                : `<button class="btn btn-outline-dark btn-sm rounded-0" title="Download Receipt"><i class="bi bi-download"></i></button>`
                            }
                        </div>
                    </div>
                </div>
            `;
            invoicesGrid.insertAdjacentHTML('beforeend', invoiceHTML);
        });
    }

    // 7. Update secure payment modal cardholder name and checkout buttons amount values dynamically
    const checkoutForm = document.getElementById('checkout-payment-form');
    if (checkoutForm) {
        const nameInput = checkoutForm.querySelector('input[type="text"]');
        if (nameInput) nameInput.value = client.name;
    }
    const payModalAmount = document.getElementById('payment-modal-amount');
    if (payModalAmount) payModalAmount.textContent = `$${unpaidSum.toFixed(2)}`;
    
    const submitPayBtn = document.getElementById('btn-submit-secure-checkout');
    if (submitPayBtn) {
        submitPayBtn.textContent = `SUBMIT SECURE PAYMENT ($${unpaidSum.toFixed(2)})`;
    }

    // 8. Re-render timeline & figures for active project
    renderTimeline(dashboardState.activeProjectId);
    renderFiguresWorkspace(dashboardState.activeProjectId);

    showSuccessToast(`<i class="bi bi-person-workspace text-success h5 mb-0"></i> Switched Session to ${client.name} (${client.company})`);
}

// Initial Dashboard Setup and Binding
document.addEventListener('DOMContentLoaded', () => {
    // Only execute if on dashboard page containing the components
    if (document.getElementById('timeline-project-selector')) {
        initDashboardEngine();
    }
});

function initDashboardEngine() {
    // Render initial views
    renderTimeline(dashboardState.activeProjectId);
    renderFiguresWorkspace(dashboardState.activeProjectId);

    // Client switcher event triggers binding
    document.querySelectorAll('.client-switch-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const clientId = btn.getAttribute('data-client');
            switchClient(clientId);
        });
    });

    // Timeline Switch Selector binding
    const selector = document.getElementById('timeline-project-selector');
    if (selector) {
        selector.addEventListener('change', (e) => {
            const pId = e.target.value;
            dashboardState.activeProjectId = pId;
            
            // Sync quick selector grid selection
            document.querySelectorAll('.project-nav-card .stat-card').forEach(card => {
                card.classList.remove('active-project-card');
            });
            const targetGridCard = document.getElementById(`project-card-${pId}`);
            if (targetGridCard) {
                targetGridCard.classList.add('active-project-card');
            }

            renderTimeline(pId);
            renderFiguresWorkspace(pId);
        });
    }

    // Quick Selector Grid binding
    document.querySelectorAll('.project-nav-card').forEach(card => {
        card.addEventListener('click', () => {
            const pId = card.getAttribute('data-project-id');
            dashboardState.activeProjectId = pId;

            // Sync timeline select dropdown
            const sel = document.getElementById('timeline-project-selector');
            if (sel) sel.value = pId;

            // Highlight card
            document.querySelectorAll('.project-nav-card .stat-card').forEach(c => {
                c.classList.remove('active-project-card');
            });
            const gridCardInner = document.getElementById(`project-card-${pId}`);
            if (gridCardInner) gridCardInner.classList.add('active-project-card');

            renderTimeline(pId);
            renderFiguresWorkspace(pId);
            
            // Scroll down slightly to workspace on mobile
            if (window.innerWidth < 992) {
                const titleEl = document.getElementById('workspace-project-title');
                if (titleEl) {
                    titleEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // Zoom Lightbox range listener
    const zoomRange = document.getElementById('lightbox-zoom-range');
    if (zoomRange) {
        zoomRange.addEventListener('input', (e) => {
            const val = e.target.value;
            const label = document.getElementById('lightbox-zoom-label');
            if (label) label.textContent = `${Math.round(val * 100)}%`;
            
            const drawing = document.getElementById('lightbox-drawing-svg-holder');
            if (drawing) {
                drawing.style.transform = `scale(${val})`;
            }
        });
    }

    // Drag and drop secure upload zone simulation
    const dropzone = document.getElementById('wizard-dropzone');
    const realFile = document.getElementById('wizard-real-file-input');
    const browseTrigger = document.getElementById('wizard-browse-trigger');

    if (dropzone && realFile) {
        // Trigger file input dialog
        if (browseTrigger) {
            browseTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                realFile.click();
            });
        }
        dropzone.addEventListener('click', () => {
            realFile.click();
        });

        // Trigger simulation on file select
        realFile.addEventListener('change', () => {
            if (realFile.files.length > 0) {
                simulateFileAdding(realFile.files[0].name, realFile.files[0].size);
            }
        });

        // Drag and drop event bounds
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.style.borderColor = 'var(--dark-color)';
            dropzone.style.background = 'rgba(0,0,0,0.02)';
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.style.borderColor = 'rgba(0,0,0,0.1)';
            dropzone.style.background = 'transparent';
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.style.borderColor = 'rgba(0,0,0,0.1)';
            dropzone.style.background = 'transparent';
            if (e.dataTransfer.files.length > 0) {
                simulateFileAdding(e.dataTransfer.files[0].name, e.dataTransfer.files[0].size);
            }
        });
    }

    // Global Action Buttons binding
    const btnGlobalApprove = document.getElementById('btn-approve-project-drawings');
    if (btnGlobalApprove) {
        btnGlobalApprove.addEventListener('click', () => {
            approveAllFigures(dashboardState.activeProjectId);
        });
    }

    const btnGlobalRevisions = document.getElementById('btn-request-full-revisions');
    if (btnGlobalRevisions) {
        btnGlobalRevisions.addEventListener('click', () => {
            // Trigger general global revision preloaded
            triggerFigureRevision('global');
        });
    }

    // Search and Filter dynamic matching
    const searchInput = document.getElementById('project-search-input');
    const searchBtn = document.getElementById('project-search-btn');

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            executeProjectSearch(searchInput.value);
        });
    }
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            executeProjectSearch(searchInput.value);
        });
    }
}

// -------------------------------------------------------------
// RENDERING & STATE UPDATES ENGINE
// -------------------------------------------------------------

// Render Horizontal Timeline Stepper
function renderTimeline(projectId) {
    const project = dashboardState.projects.find(p => p.id === projectId);
    if (!project) return;

    // Update active metadata texts
    const idText = document.getElementById('active-project-id');
    if (idText) idText.textContent = project.id;

    // Setup active timeline steps percentage progress
    const progressLine = document.getElementById('workflow-progress-line');
    let progressPct = 0;
    
    if (project.timelineStep === 1) progressPct = 0;
    else if (project.timelineStep === 2) progressPct = 25;
    else if (project.timelineStep === 3) progressPct = 50;
    else if (project.timelineStep === 4) progressPct = 75;
    else if (project.timelineStep === 5) progressPct = 100;

    if (progressLine) {
        progressLine.style.width = `${progressPct}%`;
    }

    // Update specific nodes elements
    const steps = document.querySelectorAll('.workflow-steps .workflow-step');
    steps.forEach((step, idx) => {
        const stepNum = idx + 1;
        step.classList.remove('completed', 'active');

        if (stepNum < project.timelineStep) {
            step.classList.add('completed');
            // Inject checkmark
            const numEl = step.querySelector('.step-num');
            if (numEl) numEl.innerHTML = '<i class="bi bi-check-lg"></i>';
        } else if (stepNum === project.timelineStep) {
            step.classList.add('active');
            const numEl = step.querySelector('.step-num');
            if (numEl) numEl.textContent = stepNum;
        } else {
            const numEl = step.querySelector('.step-num');
            if (numEl) numEl.textContent = stepNum;
        }
    });

    // Special customization overrides for mouse design (Step 4 completed approved)
    const step3Label = document.getElementById('timeline-step-label-3');
    const step3Date = document.getElementById('timeline-step-date-3');
    const step4Date = document.querySelector('#timeline-step-4 .step-date');

    if (projectId === 'P-9922') {
        if (step3Label) step3Label.textContent = 'Review & Revisions';
        if (step3Date) step3Date.textContent = 'Completed May 16';
        if (step4Date) step4Date.textContent = 'Approved Today';
    } else {
        if (step3Label) step3Label.textContent = 'Review & Revisions';
        if (step3Date) step3Date.textContent = 'Active (24-48h window)';
        if (step4Date) step4Date.textContent = 'Awaiting final sign-off';
    }
}

// Render Figures Workspace & Cards Grid
function renderFiguresWorkspace(projectId) {
    const project = dashboardState.projects.find(p => p.id === projectId);
    const container = document.getElementById('figures-grid-container');
    
    if (!project || !container) return;

    // Set Workspace main titles
    const titleEl = document.getElementById('workspace-project-title');
    if (titleEl) {
        titleEl.textContent = `${project.title} (${project.id})`;
    }

    // Clean container and render list
    container.innerHTML = '';

    const projectFigs = dashboardState.figures[projectId] || [];

    projectFigs.forEach((fig) => {
        // Build figure-level badge class
        let badgeClass = 'status-progress';
        if (fig.status === 'Approved') badgeClass = 'status-completed';
        if (fig.status === 'Pending Revision') badgeClass = 'status-pending';
        if (fig.status === 'In Drafting') badgeClass = 'status-drafting'; // Custom layout helper status style

        const cardHTML = `
            <div class="col-md-6 col-xl-3" id="figure-card-${fig.id}">
                <div class="figure-review-card border border-dark border-opacity-10 bg-light p-3 position-relative transition-all h-100">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="fw-bold text-dark small text-nowrap">${fig.label}</span>
                        <span class="status-badge ${badgeClass} x-small px-2 py-0" id="figure-badge-${fig.id}">${fig.status}</span>
                    </div>
                    <div class="figure-thumbnail bg-white border border-dark border-opacity-10 p-3 text-center mb-3 cursor-pointer" onclick="openLightbox('${projectId}-${fig.id}')">
                        <svg viewBox="0 0 100 80" class="img-fluid" style="max-height: 140px;">
                            ${fig.svgContent}
                        </svg>
                    </div>
                    <h6 class="fw-bold text-dark mb-1 small text-truncate">${fig.title}</h6>
                    <p class="x-small text-secondary mb-3">${fig.shading}</p>
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-dark btn-xs w-100 rounded-0 x-small py-1" onclick="openLightbox('${projectId}-${fig.id}')"><i class="bi bi-zoom-in me-1"></i>Zoom</button>
                        <button class="btn btn-outline-dark btn-xs w-100 rounded-0 x-small py-1" onclick="triggerFigureRevision(${fig.id})"><i class="bi bi-pencil-square me-1"></i>Revise</button>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });

    // Render historical logs panel
    renderActivityLog(projectId);
}

// Render dynamic project logs
function renderActivityLog(projectId) {
    const logTimeline = document.getElementById('workspace-log-timeline');
    if (!logTimeline) return;

    logTimeline.innerHTML = '';
    const logs = dashboardState.activityLog[projectId] || [];

    if (logs.length === 0) {
        logTimeline.innerHTML = `<div class="text-center py-3 text-secondary small">No logs recorded for this workspace.</div>`;
        return;
    }

    logs.forEach((log) => {
        let iconHTML = '<i class="bi bi-info-circle"></i>';
        let iconClass = 'text-secondary';
        
        if (log.type === 'approve') {
            iconHTML = '<i class="bi bi-check-circle-fill"></i>';
            iconClass = 'text-success';
        } else if (log.type === 'revision') {
            iconHTML = '<i class="bi bi-arrow-repeat"></i>';
            iconClass = 'text-warning';
        } else if (log.type === 'draft') {
            iconHTML = '<i class="bi bi-pencil-fill"></i>';
            iconClass = 'text-dark';
        } else if (log.type === 'status') {
            iconHTML = '<i class="bi bi-shield-check"></i>';
            iconClass = 'text-primary';
        }

        const logHTML = `
            <div class="log-entry d-flex gap-3 mb-3 border-bottom border-dark border-opacity-5 pb-2">
                <div class="log-icon ${iconClass}">${iconHTML}</div>
                <div>
                    <p class="mb-0 text-dark small">${log.message}</p>
                    <span class="x-small text-muted">${log.date}</span>
                </div>
            </div>
        `;
        logTimeline.insertAdjacentHTML('beforeend', logHTML);
    });
}

// -------------------------------------------------------------
// INTERACTIVE PORTAL ACTIONS HANDLERS
// -------------------------------------------------------------

// Open High-Fidelity Lightbox modal
function openLightbox(figCompositeId) {
    // figCompositeId represents e.g. "P-9921-2"
    let pId = dashboardState.activeProjectId;
    let figId = parseInt(figCompositeId);

    if (figCompositeId.includes('-')) {
        const parts = figCompositeId.split('-');
        pId = parts[0] + '-' + parts[1];
        figId = parseInt(parts[2]);
    }

    const projectFigs = dashboardState.figures[pId] || [];
    const figure = projectFigs.find(f => f.id === figId);
    
    if (!figure) return;

    // Load elements to inject modal info
    const modalTitle = document.getElementById('lightboxModalLabel');
    const modalSubtitle = document.getElementById('lightbox-subtitle');
    const svgHolder = document.getElementById('lightbox-drawing-svg-holder');
    const btnApprove = document.getElementById('btn-lightbox-approve');

    if (modalTitle) modalTitle.textContent = figure.title;
    if (modalSubtitle) modalSubtitle.textContent = `${figure.label} WORKSPACE | ${figure.status.toUpperCase()}`;
    
    if (svgHolder) {
        // Reset scale zoom to 100%
        svgHolder.style.transform = 'scale(1.0)';
        const zoomRange = document.getElementById('lightbox-zoom-range');
        if (zoomRange) zoomRange.value = 1.0;
        const zoomLabel = document.getElementById('lightbox-zoom-label');
        if (zoomLabel) zoomLabel.textContent = '100%';

        svgHolder.innerHTML = `<svg viewBox="0 0 100 80" class="img-fluid" style="width: 100%; height: auto;">${figure.svgContent}</svg>`;
    }

    // Set approval bindings
    if (btnApprove) {
        // Clear previous event listeners
        const newBtn = btnApprove.cloneNode(true);
        btnApprove.parentNode.replaceChild(newBtn, btnApprove);
        
        if (figure.status === 'Approved') {
            newBtn.classList.remove('btn-dark');
            newBtn.classList.add('btn-success', 'disabled');
            newBtn.innerHTML = '<i class="bi bi-shield-fill-check me-2"></i>Drawing Approved';
        } else {
            newBtn.classList.remove('btn-success', 'disabled');
            newBtn.classList.add('btn-dark');
            newBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Approve Drawing';
            newBtn.addEventListener('click', () => {
                approveSingleFigure(pId, figId);
            });
        }
    }

    // Show using bootstrap native triggers
    const modalEl = document.getElementById('lightboxModal');
    if (modalEl) {
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInstance.show();
    }
}

// Slider Zoom bounds adjustment handler
function adjustLightboxZoom(amount) {
    const zoomRange = document.getElementById('lightbox-zoom-range');
    if (zoomRange) {
        let cur = parseFloat(zoomRange.value);
        cur += amount;
        if (cur < 0.6) cur = 0.6;
        if (cur > 2.0) cur = 2.0;

        zoomRange.value = cur;
        zoomRange.dispatchEvent(new Event('input'));
    }
}

// Approve Single Figure
function approveSingleFigure(projectId, figId) {
    const projectFigs = dashboardState.figures[projectId] || [];
    const figure = projectFigs.find(f => f.id === figId);
    
    if (!figure) return;

    figure.status = 'Approved';
    
    // Log Activity
    const dateStr = getFormattedTimestamp();
    dashboardState.activityLog[projectId].unshift({
        type: 'approve',
        message: `<strong>${figure.label}: ${figure.title}</strong> approved by Client.`,
        date: dateStr
    });

    // Check if all figures in the project are now approved
    checkProjectCompletionState(projectId);

    // Refresh views
    renderFiguresWorkspace(projectId);
    renderTimeline(projectId);

    // Fire custom Toast Alert
    showSuccessToast(`<i class="bi bi-shield-check-fill text-success h5 mb-0"></i> Drawing ${figure.label} Approved Successfully!`);
}

// Approve All Figures
function approveAllFigures(projectId) {
    const projectFigs = dashboardState.figures[projectId] || [];
    let updatedCount = 0;

    projectFigs.forEach(fig => {
        if (fig.status !== 'Approved') {
            fig.status = 'Approved';
            updatedCount++;
        }
    });

    if (updatedCount === 0) {
        showSuccessToast('All figures are already approved.');
        return;
    }

    // Log Activity
    const dateStr = getFormattedTimestamp();
    dashboardState.activityLog[projectId].unshift({
        type: 'approve',
        message: `<strong>All figures approved</strong> in bulk by Client.`,
        date: dateStr
    });

    // Trigger completion checks
    checkProjectCompletionState(projectId);

    // Refresh views
    renderFiguresWorkspace(projectId);
    renderTimeline(projectId);

    // Trigger visual confetti and alerts
    showSuccessToast('<i class="bi bi-check-circle-fill text-success h5 mb-0"></i> All Figures Approved Successfully! Ready for USPTO filing.');
    fireConfettiParticles();
}

// Check if all figures are approved to advance project states
function checkProjectCompletionState(projectId) {
    const projectFigs = dashboardState.figures[projectId] || [];
    const allApproved = projectFigs.every(f => f.status === 'Approved');
    const project = dashboardState.projects.find(p => p.id === projectId);

    if (allApproved && project) {
        project.timelineStep = 4; // Advanced to step 4 "Client Approved"
        project.badgeClass = 'status-completed';
        project.badgeText = 'Client Approved';

        // Update badge DOM if exists
        const badgeEl = document.getElementById(`project-badge-${projectId}`);
        if (badgeEl) {
            badgeEl.className = 'status-badge status-completed';
            badgeEl.textContent = 'Client Approved';
        }

        // Add Status transition log
        const dateStr = getFormattedTimestamp();
        dashboardState.activityLog[projectId].unshift({
            type: 'status',
            message: `Project transitioned to <strong>Client Approved / Ready for filing</strong>.`,
            date: dateStr
        });

        // Update stat counts
        const statActive = document.getElementById('stat-active-projects');
        const statAwaiting = document.getElementById('stat-awaiting-uspto');

        if (projectId === 'P-9921') {
            // Turbine cooling project completes
            const overviewBadge = document.getElementById('activity-badge-turbine');
            const overviewUspto = document.getElementById('activity-uspto-turbine');
            
            if (overviewBadge) {
                overviewBadge.className = 'status-badge status-completed';
                overviewBadge.textContent = 'Completed';
            }
            if (overviewUspto) {
                overviewUspto.className = 'text-success x-small fw-bold';
                overviewUspto.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i>Approved';
            }
        }
    }
}

// Trigger specific figure revision preloaded form
function triggerFigureRevision(figId) {
    const pId = dashboardState.activeProjectId;
    const modalEl = document.getElementById('revisionModal');
    
    if (!modalEl) return;

    const modalInputFigId = document.getElementById('revision-target-fig-id');
    const modalInputLabel = document.getElementById('revision-target-label');
    const modalDesc = document.getElementById('revision-description');

    if (figId === 'global') {
        if (modalInputFigId) modalInputFigId.value = 'global';
        if (modalInputLabel) modalInputLabel.value = 'Entire Project Workspace - Global';
    } else {
        const projectFigs = dashboardState.figures[pId] || [];
        const figure = projectFigs.find(f => f.id === figId);
        if (figure) {
            if (modalInputFigId) modalInputFigId.value = figId;
            if (modalInputLabel) modalInputLabel.value = `${figure.label} - ${figure.title}`;
        }
    }

    if (modalDesc) modalDesc.value = '';

    // Show using bootstrap native instance
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
    modalInstance.show();
}

// Submit Figure Revision form
function submitFigureRevision() {
    const pId = dashboardState.activeProjectId;
    const targetVal = document.getElementById('revision-target-fig-id').value;
    const priority = document.getElementById('revision-priority').value;
    const desc = document.getElementById('revision-description').value;

    if (!desc.trim()) {
        alert('Please describe your revision request details.');
        return;
    }

    const dateStr = getFormattedTimestamp();

    if (targetVal === 'global') {
        // Mark all non-approved figures as pending revision
        const projectFigs = dashboardState.figures[pId] || [];
        projectFigs.forEach(fig => {
            if (fig.status !== 'Approved') {
                fig.status = 'Pending Revision';
            }
        });

        dashboardState.activityLog[pId].unshift({
            type: 'revision',
            message: `<strong>Global Revisions Requested</strong>: ${desc} [Priority: ${priority}]`,
            date: dateStr
        });
    } else {
        const figId = parseInt(targetVal);
        const projectFigs = dashboardState.figures[pId] || [];
        const figure = projectFigs.find(f => f.id === figId);
        
        if (figure) {
            figure.status = 'Pending Revision';
            
            dashboardState.activityLog[pId].unshift({
                type: 'revision',
                message: `<strong>${figure.label} Revision Requested</strong>: ${desc} [Priority: ${priority}]`,
                date: dateStr
            });
        }
    }

    // Set timeline step back to revisions step (Step 3) if advanced
    const project = dashboardState.projects.find(p => p.id === pId);
    if (project) {
        project.timelineStep = 3;
        project.badgeClass = 'status-progress';
        project.badgeText = 'Revisions Open';
        
        const badgeEl = document.getElementById(`project-badge-${pId}`);
        if (badgeEl) {
            badgeEl.className = 'status-badge status-progress';
            badgeEl.textContent = 'Revisions Open';
        }
    }

    // Close Modal
    const modalEl = document.getElementById('revisionModal');
    if (modalEl) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
    }

    // Re-render
    renderFiguresWorkspace(pId);
    renderTimeline(pId);

    // Fire Toast
    showSuccessToast('<i class="bi bi-arrow-repeat text-warning h5 mb-0"></i> Revision Request Dispatched to Drafting Desk!');
}

// -------------------------------------------------------------
// SECURE BILLING CHECKOUT PAYMENTS HANDLERS
// -------------------------------------------------------------

// Open Secure Payment modal
function openPaymentModal() {
    const modalEl = document.getElementById('paymentModal');
    if (!modalEl) return;

    // Reset checkout form and visual queue state
    const formFields = document.getElementById('checkout-payment-form');
    const successTick = document.getElementById('payment-success-tick');
    const submitBtn = document.getElementById('btn-submit-secure-checkout');

    if (formFields) formFields.classList.remove('d-none');
    if (successTick) successTick.classList.add('d-none');
    if (submitBtn) {
        submitBtn.classList.remove('d-none');
        submitBtn.textContent = 'SUBMIT SECURE PAYMENT ($840.00)';
    }

    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
    modalInstance.show();
}

// Submit Secure Checkout
function submitSecureCheckout() {
    const btn = document.getElementById('btn-submit-secure-checkout');
    if (btn) {
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>VALIDATING PORTAL ENCRYPTION...';
        btn.disabled = true;
    }

    // Simulate standard credit card bank transaction delay
    setTimeout(() => {
        // Complete state changes
        dashboardState.invoices['INV-2026-004'].status = 'Paid';
        
        // Update statistic total display card
        const statInvoices = document.getElementById('stat-pending-invoices');
        if (statInvoices) {
            statInvoices.textContent = '$0';
            // Subtract overdue notice style alert
            const overdueEl = document.getElementById('stat-overdue-warning');
            if (overdueEl) {
                overdueEl.className = 'mt-3 small text-success';
                overdueEl.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i>All Invoices Paid';
            }
        }

        // Update invoices tab list cards layout
        const badgeUnpaid = document.getElementById('invoice-badge-unpaid');
        const textAmount = document.getElementById('invoice-text-amount');
        const labelAmount = document.getElementById('invoice-label-amount');
        const payBtn = document.getElementById('btn-pay-now-invoice');

        if (badgeUnpaid) {
            badgeUnpaid.className = 'status-badge status-completed';
            badgeUnpaid.textContent = 'Paid';
        }
        if (textAmount) {
            textAmount.className = 'fw-bold text-dark';
            textAmount.textContent = '$840.00';
        }
        if (labelAmount) {
            labelAmount.textContent = 'Amount Paid';
        }
        if (payBtn) {
            payBtn.className = 'btn btn-outline-dark btn-sm rounded-0';
            payBtn.innerHTML = '<i class="bi bi-download"></i>';
            payBtn.removeAttribute('onclick');
            payBtn.title = 'Download Receipt';
        }

        // Hide inputs and trigger checkmark ticks sequence
        const successTick = document.getElementById('payment-success-tick');
        const formFields = document.getElementById('checkout-payment-form');
        
        if (formFields) {
            // Hide standard fields
            const fieldsToHide = formFields.querySelectorAll('.mb-3, .row, button');
            fieldsToHide.forEach(el => el.classList.add('d-none'));
        }
        if (successTick) successTick.classList.remove('d-none');

        // Confetti particles
        fireConfettiParticles();

        // Close entire popup modal after delay
        setTimeout(() => {
            const modalEl = document.getElementById('paymentModal');
            if (modalEl) {
                const modalInstance = bootstrap.Modal.getInstance(modalEl);
                if (modalInstance) modalInstance.hide();
            }
            showSuccessToast('<i class="bi bi-shield-fill-check text-success h5 mb-0"></i> Checkout Completed! Balance paid in full.');
        }, 2200);

    }, 1500);
}

// -------------------------------------------------------------
// MULTI-STEP UPLOAD WIZARD ENGINE HANDLERS
// -------------------------------------------------------------

// Wizard Panes Transitions controls
function transitionWizard(fromStep, toStep) {
    // Validate inputs step 1
    if (fromStep === 1 && toStep === 2) {
        const title = document.getElementById('wizard-input-title').value;
        if (!title.trim()) {
            alert('Please provide a descriptive patent project title.');
            return;
        }
    }

    // Hide all panes
    document.querySelectorAll('.wizard-pane').forEach(pane => {
        pane.classList.add('d-none');
        pane.classList.remove('active');
    });

    // Show target pane
    const targetPane = document.getElementById(`wizard-step-${toStep}`);
    if (targetPane) {
        targetPane.classList.remove('d-none');
        targetPane.classList.add('active');
    }

    // Update milestones styling
    document.querySelectorAll('.upload-milestone').forEach(m => {
        m.classList.remove('active', 'completed');
        const stepNum = parseInt(m.getAttribute('data-step'));
        
        if (stepNum < toStep) m.classList.add('completed');
        else if (stepNum === toStep) m.classList.add('active');
    });

    // Update progress bar
    const progressEl = document.getElementById('wizard-progress-bar');
    if (progressEl) {
        let pct = 0;
        if (toStep === 2) pct = 50;
        if (toStep === 3) pct = 100;
        progressEl.style.width = `${pct}%`;
    }
}

// Simulator queue uploading list
function simulateFileAdding(fileName, fileSize) {
    const queue = document.getElementById('wizard-file-queue');
    const nameEl = document.getElementById('uploaded-filename');
    const sizeEl = document.getElementById('uploaded-filesize');

    if (!queue) return;

    // Convert file size to standard MB representation
    const sizeMB = fileSize ? (fileSize / (1024 * 1024)).toFixed(1) + ' MB' : '4.8 MB';
    
    if (nameEl) nameEl.textContent = fileName || 'turbine_assembly_sketch_v1.pdf';
    if (sizeEl) sizeEl.textContent = sizeMB;

    // Reveal files queue list
    queue.classList.remove('d-none');
    
    showSuccessToast('<i class="bi bi-cloud-check text-success h5 mb-0"></i> File Securely Encrypted & Uploaded to Sandbox Storage!');
}

// Submit Wizard and initiate Drafting state
function submitWizardForm() {
    const title = document.getElementById('wizard-input-title').value;
    const type = document.getElementById('wizard-input-type').value;
    const figures = parseInt(document.getElementById('wizard-input-figures').value) || 4;
    const priority = document.getElementById('wizard-input-priority').value;
    const date = document.getElementById('wizard-input-date').value;

    const attest1 = document.getElementById('check-attest-1').checked;
    const attest2 = document.getElementById('check-attest-2').checked;

    if (!attest1 || !attest2) {
        alert('Please attest to the Compliance Standards and decodability requirements before submitting.');
        return;
    }

    const btn = document.getElementById('btn-submit-wizard-project');
    if (btn) {
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>REGISTERING INTELLECTUAL VAULT...';
        btn.disabled = true;
    }

    setTimeout(() => {
        // Create custom New Project
        const newProjId = 'P-' + Math.floor(1000 + Math.random() * 9000);
        
        const newProject = {
            id: newProjId,
            title: title,
            type: type,
            figuresCount: figures,
            timelineStep: 2, // Starts at step 2 (Drafting Phase)
            turnaround: priority,
            targetDate: date,
            usptoStatus: 'Drafting',
            badgeClass: 'status-progress',
            badgeText: 'Drafting Phase'
        };

        // Create standard mock figures for this project based on standard utility or design
        const mockFigs = [];
        for (let i = 1; i <= figures; i++) {
            mockFigs.push({
                id: i,
                label: `Figure ${i}.1`,
                title: `Isometric View Component ${i}`,
                shading: 'Shading Integrity Check Pending',
                status: 'In Drafting',
                svgContent: `<rect x="5" y="5" width="90" height="70" fill="none" stroke="#111" stroke-width="0.5" stroke-dasharray="1,1"/>
                             <circle cx="50" cy="40" r="15" fill="none" stroke="#111" stroke-width="0.8"/>
                             <circle cx="50" cy="40" r="8" fill="none" stroke="#111" stroke-width="0.5"/>
                             <line x1="15" y1="40" x2="85" y2="40" stroke="#111" stroke-width="0.3" stroke-dasharray="2,2"/>`
            });
        }

        // Push state
        dashboardState.projects.unshift(newProject);
        dashboardState.figures[newProjId] = mockFigs;
        dashboardState.activityLog[newProjId] = [
            { type: 'draft', message: `Illustration Drafting process initiated. Scope set for ${figures} vector drawings.`, date: getFormattedTimestamp() },
            { type: 'status', message: `Concept files uploaded under secure PGP envelope. USPTO Compliance verification queued.`, date: getFormattedTimestamp() }
        ];

        // Increment active project count stat
        const activeCountEl = document.getElementById('stat-active-projects');
        if (activeCountEl) {
            let curVal = parseInt(activeCountEl.textContent) || 12;
            activeCountEl.textContent = curVal + 1;
        }

        // Update Project portfolio grid DOM dynamically!
        const gridContainer = document.getElementById('projects-grid-list');
        if (gridContainer) {
            const cardHTML = `
                <div class="col-md-6 col-xl-4 project-nav-card" data-project-id="${newProjId}">
                    <div class="stat-card p-0 overflow-hidden border border-dark border-opacity-10 rounded-0 cursor-pointer" id="project-card-${newProjId}">
                        <div class="p-3 border-bottom border-dark border-opacity-10">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <span class="x-small text-muted fw-bold">ID: ${newProjId}</span>
                                <span class="status-badge status-progress" id="project-badge-${newProjId}">Drafting Phase</span>
                            </div>
                            <h6 class="fw-bold mb-1">${title}</h6>
                            <p class="x-small text-secondary mb-0">${type} Patent | ${figures} Active Figures</p>
                        </div>
                        <div class="p-3 bg-light d-flex justify-content-between align-items-center">
                            <span class="x-small fw-bold"><i class="bi bi-clock me-1"></i>${priority.split(' ')[0]}</span>
                            <span class="text-dark x-small fw-bold">VIEW WORKSPACE <i class="bi bi-arrow-right ms-1"></i></span>
                        </div>
                    </div>
                </div>
            `;
            gridContainer.insertAdjacentHTML('afterbegin', cardHTML);
            
            // Re-bind click event to new card
            const newCardEl = gridContainer.querySelector(`[data-project-id="${newProjId}"]`);
            if (newCardEl) {
                newCardEl.addEventListener('click', () => {
                    dashboardState.activeProjectId = newProjId;
                    
                    const selector = document.getElementById('timeline-project-selector');
                    if (selector) {
                        // Append dynamically to select element options
                        const opt = document.createElement('option');
                        opt.value = newProjId;
                        opt.textContent = `${title} (${newProjId})`;
                        selector.appendChild(opt);
                        selector.value = newProjId;
                    }

                    // Toggle select style highlight classes
                    document.querySelectorAll('.project-nav-card .stat-card').forEach(c => {
                        c.classList.remove('active-project-card');
                    });
                    const gridInner = document.getElementById(`project-card-${newProjId}`);
                    if (gridInner) gridInner.classList.add('active-project-card');

                    renderTimeline(newProjId);
                    renderFiguresWorkspace(newProjId);
                });
            }
        }

        // Add Option to dropdown selector
        const selector = document.getElementById('timeline-project-selector');
        if (selector) {
            const opt = document.createElement('option');
            opt.value = newProjId;
            opt.textContent = `${title} (${newProjId})`;
            selector.appendChild(opt);
        }

        // Reset wizard forms
        document.getElementById('project-upload-wizard').reset();
        const queue = document.getElementById('wizard-file-queue');
        if (queue) queue.classList.add('d-none');
        btn.disabled = false;
        btn.innerHTML = 'INITIATE DRAFTING REQUEST <i class="bi bi-cloud-arrow-up ms-2"></i>';
        
        // Go back to step 1
        transitionWizard(3, 1);

        // Switch active workspace to new project
        dashboardState.activeProjectId = newProjId;
        if (selector) selector.value = newProjId;

        // Simulate active selection on card
        document.querySelectorAll('.project-nav-card .stat-card').forEach(c => {
            c.classList.remove('active-project-card');
        });
        const gridInner = document.getElementById(`project-card-${newProjId}`);
        if (gridInner) gridInner.classList.add('active-project-card');

        renderTimeline(newProjId);
        renderFiguresWorkspace(newProjId);

        // Success feedbacks alerts
        showSuccessToast(`<i class="bi bi-folder-check text-success h5 mb-0"></i> Project ${newProjId} Initialized Successfully!`);
        fireConfettiParticles();

        // Navigate automatically to Projects Tab!
        const projectsNavLink = document.querySelector('.sidebar-nav-link[data-tab="projects"]');
        if (projectsNavLink) {
            projectsNavLink.click();
        }

    }, 2000);
}

// -------------------------------------------------------------
// SEARCH FILTERING MECHANISMS
// -------------------------------------------------------------

function executeProjectSearch(query) {
    const val = query.toLowerCase().trim();
    const cards = document.querySelectorAll('.project-nav-card');

    cards.forEach(card => {
        const id = card.getAttribute('data-project-id').toLowerCase();
        const pCard = dashboardState.projects.find(p => p.id.toLowerCase() === id);
        
        if (pCard) {
            const title = pCard.title.toLowerCase();
            const type = pCard.type.toLowerCase();
            
            if (id.includes(val) || title.includes(val) || type.includes(val)) {
                card.classList.remove('d-none');
            } else {
                card.classList.add('d-none');
            }
        }
    });
}

// -------------------------------------------------------------
// HELPER UTILITIES
// -------------------------------------------------------------

// Formatted Timestamp creator
function getFormattedTimestamp() {
    const options = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
    return new Date().toLocaleDateString('en-US', options).replace(',', ' -');
}

// Show dynamic alert toast
function showSuccessToast(messageHTML) {
    // Check if toast container already exists
    let toast = document.getElementById('custom-toast-alert');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'custom-toast-alert';
        toast.className = 'custom-toast custom-toast-success';
        document.body.appendChild(toast);
    }

    toast.innerHTML = messageHTML;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4500);
}

// Confetti effects simulation
function fireConfettiParticles() {
    // Generate beautiful colored absolute-positioned visual nodes exploding upwards
    const colors = ['#2b2b2b', '#198754', '#ffc107', '#0dcaf0', '#6f42c1'];
    
    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.style.position = 'fixed';
        p.style.zIndex = '99999';
        p.style.width = `${Math.random() * 8 + 4}px`;
        p.style.height = `${Math.random() * 8 + 4}px`;
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.left = `${Math.random() * 60 + 20}%`;
        p.style.top = '100%';
        p.style.opacity = '0.9';
        p.style.borderRadius = '50%';
        p.style.transition = 'all 2.5s cubic-bezier(0.1, 0.8, 0.3, 1)';
        document.body.appendChild(p);

        // Force browser layout repaint
        p.offsetHeight;

        const targetX = (Math.random() - 0.5) * 300;
        const targetY = -(Math.random() * 400 + 350);

        p.style.transform = `translate(${targetX}px, ${targetY}px) rotate(${Math.random() * 360}deg)`;
        p.style.opacity = '0';

        setTimeout(() => {
            p.remove();
        }, 2600);
    }
}

// -------------------------------------------------------------
// STAGE 3: ROLE SEPARATION & ADMIN PORTAL ENGINE
// -------------------------------------------------------------

// Active Demo States
let currentWorkspaceMode = 'client'; // 'client' or 'admin'
let activeChatClientId = 'john-doe'; // default selected chat in admin
let adminSelectedClientId = 'john-doe'; // default selected client at Admin Drafting Desk

// Chat History Database
const chatHistory = {
    'john-doe': [
        { sender: 'illustrator', text: 'Hi John, I\'ve finalized Figure 1.1 and 1.2 according to 37 CFR guidelines. Can you confirm the lettering sizes look correct?', time: 'May 16 - 10:30 AM' },
        { sender: 'client', text: 'Yes, Alex. Helix Law confirmed the standard 3.2mm font size is perfect for filing. Let\'s check Figure 1.3.', time: 'May 16 - 11:15 AM' },
        { sender: 'illustrator', text: 'Noted. For Figure 1.3, I noticed some overlaps on the assembly arrows. I\'ll adjust the offset vectors.', time: 'May 16 - 11:45 AM' }
    ],
    'sarah-jenkins': [
        { sender: 'client', text: 'Alex, we need these thermal sleeve drawings to have absolute dark line thickness consistency. High priority!', time: 'May 17 - 02:15 PM' },
        { sender: 'illustrator', text: 'Hi Sarah. Understood. I\'ve set the line weights to exactly 0.8mm for main contours and 0.4mm for shading lines. Safe for USPTO scanning.', time: 'May 17 - 03:00 PM' }
    ],
    'david-wang': [
        { sender: 'illustrator', text: 'Hi David, I\'ve received the valve specifications. Beginning rendering on the microchannels today.', time: 'May 17 - 09:00 AM' },
        { sender: 'client', text: 'Great. Let me know when the first utility draft is ready in the sandbox.', time: 'May 17 - 09:45 AM' }
    ]
};

// Mock Incoming Requests
let incomingRequests = [
    { id: 'REQ-101', client: 'sarah-jenkins', clientName: 'Sarah Jenkins', company: 'Tesla Motors', title: 'Solid State Anode Matrix', figures: 5, priority: 'Express (24h)', date: 'May 18, 2026', sketchFile: 'anode_matrix_lines.pdf' },
    { id: 'REQ-102', client: 'david-wang', clientName: 'David Wang', company: 'BioTech Labs', title: 'Centrifugal Flow Separator', figures: 3, priority: 'Standard', date: 'May 18, 2026', sketchFile: 'separator_design_v2.png' },
    { id: 'REQ-103', client: 'john-doe', clientName: 'John Doe', company: 'Helix Patent Law', title: 'Orthogonal Rotary Gearbox', figures: 4, priority: 'Standard', date: 'May 18, 2026', sketchFile: 'gearbox_handsketch.pdf' }
];

// Initialize and Bind Workspace Switching
document.addEventListener('DOMContentLoaded', () => {
    const clientRadio = document.getElementById('modeClient');
    const adminRadio = document.getElementById('modeAdmin');

    if (clientRadio && adminRadio) {
        clientRadio.addEventListener('change', () => {
            if (clientRadio.checked) setWorkspaceMode('client');
        });
        adminRadio.addEventListener('change', () => {
            if (adminRadio.checked) setWorkspaceMode('admin');
        });
    }

    // Connect chat thread input attachments
    const chatInputForm = document.getElementById('chat-input-form');
    if (chatInputForm) {
        chatInputForm.removeAttribute('onsubmit'); // Remove inline submit to avoid double execution
        chatInputForm.addEventListener('submit', handleChatSubmit);
    }
});

// Set Workspace Portal Mode
function setWorkspaceMode(mode) {
    currentWorkspaceMode = mode;
    
    const clientWrapper = document.getElementById('client-switcher-wrapper');
    const adminWrapper = document.getElementById('admin-profile-wrapper');
    const clientNavs = document.querySelectorAll('.client-nav-item');
    const adminNavs = document.querySelectorAll('.admin-nav-item');
    const headerBadge = document.getElementById('demo-mode-badge');
    const badgeText = document.getElementById('demo-mode-text');
    const badgePulse = document.getElementById('demo-mode-pulse');
    const colHeader = document.getElementById('collaboration-nav-header');

    if (mode === 'client') {
        // Toggle Sidebar Profiles
        if (clientWrapper) clientWrapper.classList.remove('d-none');
        if (adminWrapper) adminWrapper.classList.add('d-none');

        // Toggle Sidebar Navs
        clientNavs.forEach(el => el.classList.remove('d-none'));
        adminNavs.forEach(el => el.classList.add('d-none'));

        // Reset badge styles to green client mode
        if (headerBadge) {
            headerBadge.className = 'badge bg-dark border border-dark rounded-pill px-3 py-2 fw-bold text-white d-flex align-items-center gap-2';
        }
        if (badgeText) badgeText.textContent = 'CLIENT PORTAL';
        if (badgePulse) {
            badgePulse.className = 'pulse-dot';
        }
        if (colHeader) colHeader.textContent = 'Support';

        // Re-sync client state
        let currentClient = 'john-doe';
        const activeBtn = document.querySelector('.client-switch-btn.active');
        if (activeBtn) {
            currentClient = activeBtn.getAttribute('data-client');
        }
        
        // Go back to Client Overview
        const overviewNavLink = document.querySelector('.sidebar-nav-link[data-tab="overview"]');
        if (overviewNavLink) overviewNavLink.click();

        switchClient(currentClient);
        showSuccessToast('<i class="bi bi-person-circle text-success h5 mb-0"></i> Switched back to Client Collaboration Portal!');
    } else {
        // Toggle Sidebar Profiles
        if (clientWrapper) clientWrapper.classList.add('d-none');
        if (adminWrapper) adminWrapper.classList.remove('d-none');

        // Toggle Sidebar Navs
        clientNavs.forEach(el => el.classList.add('d-none'));
        adminNavs.forEach(el => el.classList.remove('d-none'));

        // Change badge styles to purple admin mode
        if (headerBadge) {
            headerBadge.className = 'badge bg-dark border border-dark rounded-pill px-3 py-2 fw-bold text-white d-flex align-items-center gap-2';
        }
        if (badgeText) badgeText.textContent = 'ADMIN PORTAL';
        if (badgePulse) {
            badgePulse.className = 'pulse-dot admin';
        }
        if (colHeader) colHeader.textContent = 'Collaboration Hub';

        // Switch automatically to Admin Overview Tab
        const adminOverviewLink = document.querySelector('.sidebar-nav-link[data-tab="admin-overview"]');
        if (adminOverviewLink) adminOverviewLink.click();

        // Render admin structures
        renderAdminOverview();
        renderAdminProjectsDesk();
        renderAdminRequestsInbox();
        renderChatInterface();

        showSuccessToast('<i class="bi bi-shield-check text-primary h5 mb-0"></i> Welcome to the Freelance Patent Illustrator Admin Desk!');
    }
}

// -------------------------------------------------------------
// ADMIN VIEW RENDERERS
// -------------------------------------------------------------

// Render Admin Dashboard Overview Details
function renderAdminOverview() {
    const activeCount = document.getElementById('admin-stat-active-count');
    const revisionsCount = document.getElementById('admin-stat-revisions-count');
    const requestsBadge = document.getElementById('admin-incoming-badge');

    let totalActiveProjects = 0;
    let totalPendingRevisions = 0;

    Object.keys(clientMockData).forEach(clientId => {
        const client = clientMockData[clientId];
        client.projects.forEach(p => {
            totalActiveProjects++;
            // Check figures inside this client's project
            const figs = client.figures[p.id] || [];
            figs.forEach(fig => {
                if (fig.status === 'Pending Revision') totalPendingRevisions++;
            });
        });
    });

    if (activeCount) activeCount.textContent = totalActiveProjects;
    if (revisionsCount) revisionsCount.textContent = totalPendingRevisions;
    if (requestsBadge) requestsBadge.textContent = incomingRequests.length;

    // Populate Workload Queue
    const workQueueBody = document.getElementById('admin-dashboard-work-queue');
    if (workQueueBody) {
        workQueueBody.innerHTML = '';
        Object.keys(clientMockData).forEach(clientId => {
            const client = clientMockData[clientId];
            client.projects.forEach(p => {
                const statusBadgeHTML = `<span class="status-badge ${p.badgeClass}">${p.badgeText}</span>`;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td data-label="Client">
                        <div class="d-flex align-items-center gap-2 justify-content-end justify-content-md-start">
                            <img src="${client.avatarImg}" alt="${client.initials}" class="avatar rounded-0 border border-dark border-opacity-10" style="width:24px; height:24px; object-fit:cover;">
                            <div class="text-end text-md-start">
                                <strong class="d-block x-small text-dark mb-0">${client.name}</strong>
                                <span class="x-small text-muted" style="font-size: 9px;">${client.company}</span>
                            </div>
                        </div>
                    </td>
                    <td data-label="Project">
                        <strong class="d-block small text-dark">${p.title}</strong>
                        <span class="x-small text-muted">ID: ${p.id} | ${p.type} Patent</span>
                    </td>
                    <td data-label="Status">${statusBadgeHTML}</td>
                    <td data-label="Figures"><span class="badge bg-secondary rounded-0 px-2 py-1 x-small fw-bold text-dark">${p.figuresCount} Figures</span></td>
                    <td data-label="Deadline"><span class="x-small fw-bold text-dark">${p.targetDate}</span></td>
                `;
                workQueueBody.appendChild(row);
            });
        });
    }

    // Render Audit logs
    const auditLogsUl = document.getElementById('admin-recent-logs');
    if (auditLogsUl) {
        auditLogsUl.innerHTML = '';
        const logs = [
            { text: '<strong>Sarah Jenkins</strong> paid Invoice #INV-2026-003.', time: '2 hours ago' },
            { text: '<strong>John Doe</strong> submitted technical revisions for Fig 1.3.', time: '4 hours ago' },
            { text: 'New drafting request received from <strong>David Wang</strong>.', time: 'Yesterday' },
            { text: 'Published updated Vector set for Battery Sleeve P-8841.', time: '2 days ago' }
        ];

        logs.forEach(log => {
            const li = document.createElement('li');
            li.className = 'mb-2 pb-2 border-bottom border-dark border-opacity-5';
            li.innerHTML = `
                <div>${log.text}</div>
                <span class="x-small text-muted"><i class="bi bi-clock me-1"></i>${log.time}</span>
            `;
            auditLogsUl.appendChild(li);
        });
    }
}

// Render Admin Drafting Workspace
function renderAdminProjectsDesk() {
    // Populate Client list
    const clientListGroup = document.getElementById('admin-desk-client-list');
    if (clientListGroup) {
        clientListGroup.innerHTML = '';
        Object.keys(clientMockData).forEach(clientId => {
            const client = clientMockData[clientId];
            const isActive = clientId === adminSelectedClientId;
            const item = document.createElement('a');
            item.href = '#';
            item.className = `list-group-item list-group-item-action rounded-0 border-dark border-opacity-10 py-2 px-3 ${isActive ? 'bg-admin-card border-left border-purple fw-bold' : ''}`;
            item.style.fontSize = '0.8rem';
            item.innerHTML = `
                <div class="d-flex align-items-center gap-2">
                    <img src="${client.avatarImg}" alt="${client.initials}" class="avatar rounded-0 border" style="width:24px; height:24px; object-fit:cover;">
                    <div class="text-truncate">
                        <strong class="d-block text-dark text-truncate">${client.name}</strong>
                        <span class="x-small text-muted d-block text-truncate" style="font-size:9px;">${client.company}</span>
                    </div>
                </div>
            `;
            item.addEventListener('click', (e) => {
                e.preventDefault();
                adminSelectedClientId = clientId;
                renderAdminProjectsDesk();
            });
            clientListGroup.appendChild(item);
        });
    }

    // Render Active Project Figures (Illustrator Mode)
    const client = clientMockData[adminSelectedClientId];
    if (!client) return;

    const project = client.projects[0]; // Active main project
    
    const titleEl = document.getElementById('admin-desk-project-title');
    const metaEl = document.getElementById('admin-desk-project-meta');
    const badgeEl = document.getElementById('admin-desk-project-badge');

    if (titleEl) titleEl.textContent = `Project: ${project.title}`;
    if (metaEl) metaEl.textContent = `Client: ${client.name} (${client.company}) | ID: ${project.id} | Turnaround: ${project.turnaround}`;
    if (badgeEl) {
        badgeEl.className = `status-badge ${project.badgeClass}`;
        badgeEl.textContent = project.badgeText;
    }

    const grid = document.getElementById('admin-desk-figures-grid');
    if (grid) {
        grid.innerHTML = '';
        const projectFigs = client.figures[project.id] || [];

        projectFigs.forEach(fig => {
            const isPendingRevision = fig.status === 'Pending Revision';
            const isInDrafting = fig.status === 'In Drafting';

            const card = document.createElement('div');
            card.className = 'col-md-4';
            card.innerHTML = `
                <div class="stat-card p-0 border border-dark border-opacity-10 rounded-0 h-100 flex-column d-flex">
                    <div class="p-3 border-bottom border-dark border-opacity-10 d-flex justify-content-between align-items-center">
                        <strong class="text-dark small">${fig.label}</strong>
                        <span class="status-badge ${fig.status === 'Approved' ? 'status-completed' : fig.status === 'Pending Revision' ? 'status-pending' : 'status-progress'}" style="font-size:9px; padding:2px 6px;">${fig.status}</span>
                    </div>
                    <!-- Vector Drawing Area -->
                    <div class="bg-white border-bottom border-dark border-opacity-10 p-3 text-center d-flex align-items-center justify-content-center" style="height: 180px;">
                        <svg class="w-100 h-100" viewBox="0 0 100 80">
                            ${fig.svgContent}
                        </svg>
                    </div>
                    <div class="p-3 flex-grow-1 d-flex flex-column justify-content-between">
                        <div>
                            <h6 class="fw-bold mb-1 small">${fig.title}</h6>
                            <p class="x-small text-muted mb-2">${fig.shading}</p>
                            ${isPendingRevision 
                                ? `<div class="p-2 bg-warning bg-opacity-10 border border-warning border-opacity-20 mb-3 small text-dark" style="font-size:10px; line-height:1.3;">
                                    <strong><i class="bi bi-exclamation-triangle-fill text-warning me-1"></i>Client Revision Note:</strong> Adjust arrows along operability lines.
                                   </div>`
                                : ''
                            }
                        </div>
                        <div class="d-flex gap-2">
                            ${isInDrafting || isPendingRevision
                                ? `<button class="btn btn-dark btn-xs rounded-0 fw-bold w-100 py-2 text-uppercase" onclick="resolveAdminRevision('${client.projects[0].id}', ${fig.id})">
                                    <i class="bi bi-check-lg me-1"></i>Publish Vector V2
                                   </button>`
                                : `<button class="btn btn-outline-dark btn-xs rounded-0 w-100 py-2" disabled>
                                    <i class="bi bi-shield-check me-1"></i>Approved & Filed
                                   </button>`
                            }
                        </div>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }
}

// Admin Action: Resolve a revision or publish V2 drawing directly
function resolveAdminRevision(projectId, figureId) {
    const client = clientMockData[adminSelectedClientId];
    if (!client) return;

    const projectFigs = client.figures[projectId] || [];
    const figure = projectFigs.find(f => f.id === figureId);

    if (figure) {
        figure.status = 'Awaiting Approval';
        figure.shading = 'Vector Layers Updated | Tangential Shading Verified [Alex Mercer]';
        
        // Add log
        client.activityLog[projectId].unshift({
            type: 'draft',
            message: `<strong>${figure.label} Vector Version 2 Uploaded</strong>: technical shading marks adjusted, alignment vectors closed.`,
            date: getFormattedTimestamp()
        });

        // Set timeline status
        const proj = client.projects.find(p => p.id === projectId);
        if (proj) {
            proj.badgeText = 'Awaiting Approval';
            proj.badgeClass = 'status-progress';
            proj.timelineStep = 4;
        }

        // Re-render dashboard
        renderAdminOverview();
        renderAdminProjectsDesk();
        renderChatInterface();

        showSuccessToast(`<i class="bi bi-cloud-arrow-up-fill text-success h5 mb-0"></i> Published Vector lines for ${figure.label}! State updated.`);
        fireConfettiParticles();
    }
}

// Render Admin Upload Requests Inbox
function renderAdminRequestsInbox() {
    const grid = document.getElementById('admin-incoming-requests-grid');
    if (!grid) return;

    if (incomingRequests.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-inbox display-4 text-muted d-block mb-3"></i>
                <h6 class="fw-bold text-secondary">Upload Requests Inbox Empty</h6>
                <p class="x-small text-muted">All incoming drafts and PGP sketches have been registered successfully.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = '';
    incomingRequests.forEach((req, idx) => {
        const card = document.createElement('div');
        card.className = 'col-md-4';
        card.innerHTML = `
            <div class="stat-card p-0 border border-dark border-opacity-10 rounded-0 h-100 d-flex flex-column justify-content-between">
                <div class="p-3 border-bottom border-dark border-opacity-10">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge badge-admin-purple rounded-0 px-2 py-1 x-small fw-bold">${req.id}</span>
                        <span class="badge bg-warning rounded-0 px-2 py-1 text-dark x-small fw-bold">${req.priority}</span>
                    </div>
                    <h6 class="fw-bold mb-1 text-dark">${req.title}</h6>
                    <p class="x-small text-muted mb-0">Submitted by: <strong>${req.clientName}</strong> (${req.company})</p>
                </div>
                <div class="p-3 bg-light border-bottom border-dark border-opacity-5">
                    <span class="x-small text-muted d-block mb-1">Attached Rough Concept Sheet</span>
                    <div class="d-flex align-items-center gap-2 border border-dark border-opacity-10 p-2 bg-white cursor-pointer" style="font-size:0.75rem;">
                        <i class="bi bi-file-earmark-pdf text-danger h5 mb-0"></i>
                        <div class="text-truncate">
                            <span class="fw-bold text-dark text-truncate d-block">${req.sketchFile}</span>
                            <span class="x-small text-muted">Scope: ${req.figures} vector figures</span>
                        </div>
                    </div>
                </div>
                <div class="p-3 d-flex gap-2">
                    <button class="btn btn-outline-dark btn-xs rounded-0 fw-bold w-50 py-2" onclick="dismissIncomingRequest(${idx})">DECLINE</button>
                    <button class="btn btn-dark btn-xs rounded-0 fw-bold w-50 py-2 text-uppercase" onclick="acceptIncomingRequest(${idx})">Accept & Start</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Admin Request Interactions Dismiss/Accept
function dismissIncomingRequest(index) {
    if (confirm('Decline this patent drafting request from attorney?')) {
        incomingRequests.splice(index, 1);
        renderAdminOverview();
        renderAdminRequestsInbox();
        showSuccessToast('<i class="bi bi-trash text-danger h5 mb-0"></i> Request dismissed successfully.');
    }
}

function acceptIncomingRequest(index) {
    const req = incomingRequests[index];
    if (!req) return;

    const targetClient = clientMockData[req.client];
    if (targetClient) {
        const newProjId = 'P-' + Math.floor(1000 + Math.random() * 9000);
        
        const projectObj = {
            id: newProjId,
            title: req.title,
            type: 'Utility',
            figuresCount: req.figures,
            timelineStep: 2, 
            turnaround: req.priority,
            targetDate: 'June 20, 2026',
            usptoStatus: 'Drafting',
            badgeClass: 'status-progress',
            badgeText: 'Drafting Phase'
        };

        const figs = [];
        for (let i = 1; i <= req.figures; i++) {
            figs.push({
                id: i,
                label: `Figure ${i}.1`,
                title: `Isometric View Component ${i}`,
                shading: 'Outlines verification pending',
                status: 'In Drafting',
                svgContent: `<rect x="5" y="5" width="90" height="70" fill="none" stroke="#111" stroke-width="0.5" stroke-dasharray="1,1"/>
                             <circle cx="50" cy="40" r="12" fill="none" stroke="#111" stroke-width="0.8"/>`
            });
        }

        targetClient.projects.unshift(projectObj);
        targetClient.figures[newProjId] = figs;
        targetClient.activityLog[newProjId] = [
            { type: 'draft', message: `Illustration Drafting process initiated. Scope set for ${req.figures} vector drawings.`, date: getFormattedTimestamp() }
        ];

        const invId = 'INV-2026-' + Math.floor(100 + Math.random() * 900);
        targetClient.invoices[invId] = {
            amount: req.figures * 85, 
            status: 'Unpaid',
            project: req.title,
            date: req.date
        };

        incomingRequests.splice(index, 1);

        renderAdminOverview();
        renderAdminProjectsDesk();
        renderAdminRequestsInbox();
        renderChatInterface();

        showSuccessToast(`<i class="bi bi-folder-check text-success h5 mb-0"></i> Registered Project ${newProjId} for ${req.clientName}!`);
        fireConfettiParticles();
    }
}

// -------------------------------------------------------------
// SECURE COLLABORATIVE CHAT SYSTEM
// -------------------------------------------------------------

// Render chat sidebar threads list & message window bubbles
function renderChatInterface() {
    const list = document.getElementById('chat-threads-list');
    const container = document.getElementById('chat-messages-container');
    const titleEl = document.getElementById('chat-tab-title');
    const descEl = document.getElementById('chat-tab-desc');
    const sidebarHeader = document.getElementById('chat-sidebar-header');

    if (!list || !container) return;

    if (currentWorkspaceMode === 'client') {
        if (titleEl) titleEl.innerHTML = '<i class="bi bi-chat-dots-fill me-2"></i>Secure Drafting Support Desk';
        if (descEl) descEl.textContent = 'Active encrypted support line with Senior Patent Illustrator Alex Mercer.';
        if (sidebarHeader) sidebarHeader.textContent = 'Active Support';

        list.innerHTML = `
            <div class="chat-channel-item active d-flex align-items-center gap-2">
                <div class="avatar rounded-0 flex-shrink-0 bg-dark text-white d-flex align-items-center justify-content-center fw-bold" style="width:36px; height:36px;">
                    AM
                </div>
                <div class="text-truncate">
                    <strong class="d-block text-dark small text-truncate">Alex Mercer</strong>
                    <span class="x-small text-muted text-truncate d-block" style="font-size:9px;">Drafting Desk Room</span>
                </div>
            </div>
        `;

        let currentClient = 'john-doe';
        const activeBtn = document.querySelector('.client-switch-btn.active');
        if (activeBtn) {
            currentClient = activeBtn.getAttribute('data-client');
        }

        const activeAvatar = document.getElementById('chat-active-avatar');
        const activeTitle = document.getElementById('chat-active-title');
        const activePulse = document.getElementById('chat-active-pulse');

        if (activeAvatar) activeAvatar.innerHTML = 'AM';
        if (activeTitle) activeTitle.textContent = 'Alex Mercer (Illustrator)';
        if (activePulse) activePulse.className = 'pulse-dot text-success';

        renderChatBubbles(currentClient);

    } else {
        if (titleEl) titleEl.innerHTML = '<i class="bi bi-shield-fill-check me-2"></i>Illustrator Customer Desk';
        if (descEl) descEl.textContent = 'Manage technical revision chats and attachment logs with active attorneys and inventors.';
        if (sidebarHeader) sidebarHeader.textContent = 'Customer Threads';

        list.innerHTML = '';
        Object.keys(clientMockData).forEach(clientId => {
            const client = clientMockData[clientId];
            const isActive = clientId === activeChatClientId;
            const item = document.createElement('div');
            item.className = `chat-channel-item d-flex align-items-center gap-2 ${isActive ? 'active' : ''}`;
            item.innerHTML = `
                <img src="${client.avatarImg}" alt="${client.initials}" class="avatar rounded-0 border" style="width:36px; height:36px; object-fit:cover;">
                <div class="text-truncate flex-grow-1">
                    <strong class="d-block text-dark small text-truncate mb-0">${client.name}</strong>
                    <span class="x-small text-muted text-truncate d-block" style="font-size:9px;">${client.company}</span>
                </div>
            `;
            item.addEventListener('click', () => {
                activeChatClientId = clientId;
                renderChatInterface();
            });
            list.appendChild(item);
        });

        const activeClient = clientMockData[activeChatClientId];
        if (activeClient) {
            const activeAvatar = document.getElementById('chat-active-avatar');
            const activeTitle = document.getElementById('chat-active-title');
            const activePulse = document.getElementById('chat-active-pulse');

            if (activeAvatar) activeAvatar.innerHTML = activeClient.initials;
            if (activeTitle) activeTitle.textContent = `${activeClient.name} (${activeClient.company})`;
            if (activePulse) activePulse.className = 'pulse-dot text-success';

            renderChatBubbles(activeChatClientId);
        }
    }
}

// Generate bubbles within the container
function renderChatBubbles(clientId) {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    container.innerHTML = '';
    const chats = chatHistory[clientId] || [];

    chats.forEach(chat => {
        const isSentByMe = (currentWorkspaceMode === 'client' && chat.sender === 'client') || 
                           (currentWorkspaceMode === 'admin' && chat.sender === 'illustrator');

        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${isSentByMe ? 'sent' : 'received'}`;
        bubble.innerHTML = `
            <div>${chat.text}</div>
            <span class="x-small mt-1 d-block text-end opacity-60" style="font-size: 8px;">${chat.time}</span>
        `;
        container.appendChild(bubble);
    });

    setTimeout(() => {
        container.scrollTop = container.scrollHeight;
    }, 50);
}

// Chat Send Submission Handler
function handleChatSubmit(event) {
    event.preventDefault();

    const input = document.getElementById('chat-message-input');
    if (!input || !input.value.trim()) return;

    const messageText = input.value.trim();
    const timeStr = getFormattedTimestamp();

    let targetClient = 'john-doe';
    if (currentWorkspaceMode === 'client') {
        const activeBtn = document.querySelector('.client-switch-btn.active');
        if (activeBtn) targetClient = activeBtn.getAttribute('data-client');
    } else {
        targetClient = activeChatClientId;
    }

    const senderRole = currentWorkspaceMode === 'client' ? 'client' : 'illustrator';

    if (!chatHistory[targetClient]) chatHistory[targetClient] = [];
    chatHistory[targetClient].push({
        sender: senderRole,
        text: messageText,
        time: timeStr
    });

    renderChatBubbles(targetClient);
    input.value = '';

    // Dynamic AI Support Chat Simulation
    if (currentWorkspaceMode === 'client') {
        const typingIndicator = document.getElementById('chat-typing-indicator');
        const typingText = document.getElementById('chat-typing-text');
        
        if (typingIndicator && typingText) {
            typingIndicator.classList.remove('d-none');
            typingText.textContent = 'Alex Mercer is analyzing drawing vectors...';
        }

        setTimeout(() => {
            if (typingIndicator) typingIndicator.classList.add('d-none');

            let responseText = "Got your request. I am locking this into the vector board to run USPTO margins inspections right away. I'll post updates shortly!";
            if (messageText.toLowerCase().includes('figure') || messageText.toLowerCase().includes('fig')) {
                responseText = "Acknowledged. I'll open up the technical layering vectors and verify all reference lines are fully closed and meet 37 CFR guidelines. Expect an updated set published in your Drafting Desk sandbox.";
            } else if (messageText.toLowerCase().includes('revision') || messageText.toLowerCase().includes('change')) {
                responseText = "Revision notes documented. I will adjust the hatch patterns, contour shading weight, and vector anchors in Figure 1.3 and publish Version 2 shortly.";
            } else if (messageText.toLowerCase().includes('invoice') || messageText.toLowerCase().includes('pay')) {
                responseText = "Thank you for the notification. Our secure ledger will automatically clear your active balance on receipt validation.";
            }

            chatHistory[targetClient].push({
                sender: 'illustrator',
                text: responseText,
                time: getFormattedTimestamp()
            });

            renderChatBubbles(targetClient);
            showSuccessToast('<i class="bi bi-chat-left-dots text-primary h5 mb-0"></i> New secure message from Illustrator Drafting Desk!');
        }, 3000);
    }
}

// Chat File Attachment Simulation
function triggerChatFileSelect() {
    const input = document.getElementById('chat-attachment-input');
    if (input) input.click();
}

function handleChatAttachment(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const timeStr = getFormattedTimestamp();
        
        let targetClient = 'john-doe';
        if (currentWorkspaceMode === 'client') {
            const activeBtn = document.querySelector('.client-switch-btn.active');
            if (activeBtn) targetClient = activeBtn.getAttribute('data-client');
        } else {
            targetClient = activeChatClientId;
        }

        const senderRole = currentWorkspaceMode === 'client' ? 'client' : 'illustrator';

        chatHistory[targetClient].push({
            sender: senderRole,
            text: `<div class="d-flex align-items-center gap-2 border border-dark border-opacity-10 p-2 bg-light text-dark" style="font-size:0.75rem; text-decoration:none;">
                    <i class="bi bi-paperclip h5 mb-0"></i>
                    <div>
                        <strong class="text-truncate d-block">${file.name}</strong>
                        <span class="x-small text-muted">${(file.size / 1024).toFixed(1)} KB | Encrypted Doc</span>
                    </div>
                   </div>`,
            time: timeStr
        });

        renderChatBubbles(targetClient);
        showSuccessToast('<i class="bi bi-paperclip text-success h5 mb-0"></i> File Securely Uploaded to Chat thread.');
    }
}

