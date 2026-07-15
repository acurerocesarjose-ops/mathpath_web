// ===== UTILITY: DEBOUNCE =====
function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

// ===== FADE-IN ANIMATION ON SCROLL =====
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// ===== SMOOTH SCROLL FOR NAVIGATION =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== BUTTON RIPPLE EFFECT =====
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            width: 100px;
            height: 100px;
            left: ${x - 50}px;
            top: ${y - 50}px;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== HEADER SCROLL EFFECT =====
const header = document.querySelector('.header');

window.addEventListener('scroll', debounce(() => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
        header.style.background = 'rgba(15, 23, 42, 0.95)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.background = 'rgba(15, 23, 42, 0.9)';
        header.style.boxShadow = 'none';
    }
}, 10));

// ===== HERO FADE-OUT ON SCROLL (every frame, no debounce) =====
const heroContent = document.querySelector('.hero-content');
const hero = document.querySelector('.hero');

if (heroContent && hero) {
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                const heroHeight = hero.offsetHeight;
                const scrollRatio = Math.min(currentScroll / (heroHeight * 0.6), 1);
                const eased = scrollRatio * scrollRatio;
                heroContent.style.opacity = 1 - eased;
                heroContent.style.transform = `translate(${-eased * 60}px, ${-eased * 80}px) scale(${1 - eased * 0.05})`;
                heroContent.style.pointerEvents = eased > 0.9 ? 'none' : 'auto';
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ===== SCANNER EFFECT FOR HERO TITLE =====
const heroTitlePlain = document.querySelector('.hero-title-plain');
if (heroTitlePlain) {
    const text = heroTitlePlain.textContent;
    heroTitlePlain.innerHTML = '';

    let visibleIndex = 0;
    text.split(' ').forEach((word, wordIndex, words) => {
        if (word === '') return;
        const wordWrapper = document.createElement('span');
        wordWrapper.className = 'scanner-word';

        word.split('').forEach((char) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'scanner-letter';
            span.style.animationDelay = `${visibleIndex * 0.05}s`;
            visibleIndex++;
            wordWrapper.appendChild(span);
        });

        heroTitlePlain.appendChild(wordWrapper);
        if (wordIndex < words.length - 1) {
            heroTitlePlain.appendChild(document.createTextNode(' '));
        }
    });
}

const heroTitleShine = document.querySelector('.hero-title-shine');
if (heroTitleShine) {
    requestAnimationFrame(() => {
        setTimeout(() => heroTitleShine.classList.add('is-visible'), 350);
    });
}

// ===== RANK CARD HOVER EFFECT =====
document.querySelectorAll('.rank-card').forEach(card => {
    const rankColor = card.querySelector('.rank-color');
    const colorValue = rankColor ? getComputedStyle(rankColor).backgroundColor : null;

    card.addEventListener('mouseenter', () => {
        if (colorValue) card.style.borderColor = colorValue;
    });

    card.addEventListener('mouseleave', () => {
        card.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    });
});

// ===== PROGRESS BAR (debounced scroll) =====
const createProgressBar = () => {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-demo';
    progressContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--primary), var(--lila-light));
        z-index: 999;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressContainer);

    window.addEventListener('scroll', debounce(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressContainer.style.width = scrollPercent + '%';
    }, 10));
};

createProgressBar();

// ===== FEATURE CARD TILT EFFECT (cards 2-5 only) =====
document.querySelectorAll('.feature-card').forEach((card, index) => {
    if (index === 0) return;
    card.addEventListener('mousemove', (e) => {
        card.style.transition = 'none';
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 12;
        const rotateY = (centerX - x) / 12;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
    });
});

// ===== LAZY LOADING FOR IMAGES (if any) =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== HERO INTERACTIVE GRADIENT BACKGROUND =====
(() => {
    const hero = document.querySelector('.hero');
    const cursorOrb = document.querySelector('.orb-cursor');
    if (!hero || !cursorOrb) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let hasPointer = false;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        targetX = (e.clientX - rect.left) - rect.width / 2;
        targetY = (e.clientY - rect.top) - rect.height / 2;
        hasPointer = true;
    });

    hero.addEventListener('mouseleave', () => {
        hasPointer = false;
        targetX = 0;
        targetY = 0;
    });

    const animateOrb = () => {
        const ease = hasPointer ? 0.08 : 0.04;
        currentX += (targetX - currentX) * ease;
        currentY += (targetY - currentY) * ease;
        cursorOrb.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        requestAnimationFrame(animateOrb);
    };

    requestAnimationFrame(animateOrb);
})();

// ===== PARTICLE SYSTEM =====
(() => {
    const hero = document.querySelector('.hero');
    const particlesContainer = document.getElementById('particles');
    if (!hero || !particlesContainer) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 20 : 50;
    const PARTICLE_SIZE_MIN = 14;
    const PARTICLE_SIZE_MAX = 24;
    const REPULSION_RADIUS = 100;
    const REPULSION_FORCE = 30;
    const RETURN_SPEED = 0.05;
    const MOVEMENT_SPEED = 0.3;

    const mathSymbols = ['+', '-', '×', '÷', '=', '≠', '≈', '√', '∞', 'π', '∑', '∫', '∂', 'Δ', 'θ', 'α', 'β', 'γ', 'λ', 'μ', 'σ', 'φ', 'ω', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    const particles = [];
    let mouseX = -1000;
    let mouseY = -1000;

    class Particle {
        constructor() {
            this.element = document.createElement('div');
            this.element.className = 'particle';

            const rect = hero.getBoundingClientRect();
            this.originalX = Math.random() * rect.width;
            this.originalY = Math.random() * rect.height;
            this.x = this.originalX;
            this.y = this.originalY;

            this.vx = (Math.random() - 0.5) * MOVEMENT_SPEED;
            this.vy = (Math.random() - 0.5) * MOVEMENT_SPEED;

            const size = PARTICLE_SIZE_MIN + Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN);
            this.element.style.fontSize = `${size}px`;
            this.element.style.opacity = 0.3 + Math.random() * 0.4;
            this.element.textContent = mathSymbols[Math.floor(Math.random() * mathSymbols.length)];

            this.element.style.left = `${this.originalX}px`;
            this.element.style.top = `${this.originalY}px`;

            particlesContainer.appendChild(this.element);
        }

        update() {
            const rect = hero.getBoundingClientRect();

            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < REPULSION_RADIUS) {
                const force = (REPULSION_RADIUS - distance) / REPULSION_RADIUS;
                const angle = Math.atan2(dy, dx);

                this.x += Math.cos(angle) * force * REPULSION_FORCE * 0.1;
                this.y += Math.sin(angle) * force * REPULSION_FORCE * 0.1;
            } else {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x > rect.width) {
                    this.x = 0;
                    this.originalX = 0;
                }
                if (this.x < 0) {
                    this.x = rect.width;
                    this.originalX = rect.width;
                }
                if (this.y > rect.height) {
                    this.y = 0;
                    this.originalY = 0;
                }
                if (this.y < 0) {
                    this.y = rect.height;
                    this.originalY = rect.height;
                }
            }

            this.element.style.transform = `translate3d(${this.x - this.originalX}px, ${this.y - this.originalY}px, 0)`;
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    hero.addEventListener('mouseleave', () => {
        mouseX = -1000;
        mouseY = -1000;
    });

    const animateParticles = () => {
        particles.forEach(particle => particle.update());
        requestAnimationFrame(animateParticles);
    };

    animateParticles();
})();

// ===== STAGE CARD EXPAND FUNCTIONALITY =====
document.querySelectorAll('.stage-card').forEach(card => {
    card.addEventListener('click', () => {
        const description = card.querySelector('.stage-description');

        if (description) {
            document.querySelectorAll('.stage-card.is-active').forEach(activeCard => {
                if (activeCard !== card) {
                    activeCard.classList.remove('is-active');
                    activeCard.querySelector('.stage-description').classList.remove('is-expanded');
                }
            });

            card.classList.toggle('is-active');
            description.classList.toggle('is-expanded');
        }
    });
});

// ===== ACTIVE NAVIGATION ON SCROLL (debounced) =====
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinksAll.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', debounce(updateActiveNav, 10));
updateActiveNav();

// ===== TECH INFO MODAL =====
const techModal = document.getElementById('tech-modal');
const techInfoBtn = document.getElementById('tech-info-btn');
const closeModalBtn = document.getElementById('close-modal');
let previousFocus = null;

function openModal() {
    previousFocus = document.activeElement;
    techModal.classList.add('is-visible');
    techModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeModalBtn.focus();
}

function closeModal() {
    techModal.classList.remove('is-visible');
    techModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (previousFocus) previousFocus.focus();
}

techInfoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
});

closeModalBtn.addEventListener('click', closeModal);

techModal.addEventListener('click', (e) => {
    if (e.target === techModal) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && techModal.classList.contains('is-visible')) {
        closeModal();
    }
    // Focus trap inside modal
    if (e.key === 'Tab' && techModal.classList.contains('is-visible')) {
        const focusable = techModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
});

// ===== MOBILE MENU TOGGLE (merged into DOMContentLoaded) =====
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.feature-card, .rank-card, .stage-card, .section-header, .cta-content, .about-text, .about-list li, .mv-card'
    );

    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${(index % 6) * 90}ms`;
        observer.observe(el);
    });

    const nav = document.querySelector('.nav');
    const navLinks = document.querySelector('.nav-links');

    if (nav && navLinks) {
        const menuButton = document.createElement('button');
        menuButton.className = 'mobile-menu-btn';
        menuButton.setAttribute('aria-label', 'Menú');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-controls', 'nav-links');
        menuButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        `;

        nav.insertBefore(menuButton, navLinks);

        menuButton.addEventListener('click', () => {
            navLinks.classList.toggle('is-active');
            const expanded = navLinks.classList.contains('is-active');
            menuButton.setAttribute('aria-expanded', expanded);
        });

        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('is-active');
                menuButton.setAttribute('aria-expanded', 'false');
            });
        });
    }
});

// ===== CONSOLE WELCOME MESSAGE =====
console.log('%c🎮 Welcome to MathPath!', 'color: #aa98f9; font-size: 24px; font-weight: bold;');
console.log('%cLevel up your math skills!', 'color: #94A3B8; font-size: 14px;');
