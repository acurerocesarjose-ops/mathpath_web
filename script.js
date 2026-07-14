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

// Add fade-in class to elements and observe them
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.feature-card, .stat-card, .rank-card, .stage-card, .section-header, .cta-content, .about-text, .about-list li'
    );
    
    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${(index % 6) * 90}ms`;
        observer.observe(el);
    });
});

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
    button.addEventListener('click', function(e) {
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

// ===== PARALLAX EFFECT FOR HERO CARDS =====
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.floating-card');
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    cards.forEach((card, index) => {
        const speed = (index + 1) * 10;
        const x = mouseX * speed;
        const y = mouseY * speed;
        card.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// ===== COUNTER ANIMATION FOR STATS =====
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString() + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString() + '+';
        }
    };
    
    updateCounter();
};

// Observe stats section for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/[^0-9]/g, ''));
                if (number > 0) {
                    animateCounter(stat, number);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ===== HEADER SCROLL EFFECT =====
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.background = 'rgba(15, 23, 42, 0.95)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.background = 'rgba(15, 23, 42, 0.9)';
        header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ===== RANK CARD HOVER SOUND EFFECT (Visual Feedback) =====
document.querySelectorAll('.rank-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.borderColor = getComputedStyle(card).querySelector('.rank-color').background;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    });
});

// ===== SCANNER EFFECT FOR HERO TITLE =====
// El contraste se resuelve con mix-blend-mode: difference en CSS: la letra
// se invierte automáticamente según lo que tenga detrás (fondo oscuro o blob lila).
// Las letras de cada palabra se agrupan en un span "inline-block" para que el
// navegador nunca corte una palabra a la mitad al hacer wrap (ej. "mat/emático").
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

// La frase con efecto de brillo se revela con una transition de opacidad,
// desacoplada del keyframe infinito del barrido (así nunca se corta ni reinicia).
const heroTitleShine = document.querySelector('.hero-title-shine');
if (heroTitleShine) {
    requestAnimationFrame(() => {
        setTimeout(() => heroTitleShine.classList.add('is-visible'), 350);
    });
}

// ===== PROGRESS BAR ANIMATION (Demo) =====
const createProgressBar = () => {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-demo';
    progressContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--primary), var(--lila-light));
        z-index: 1000;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressContainer);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressContainer.style.width = scrollPercent + '%';
    });
};

createProgressBar();

// ===== FEATURE CARD TILT EFFECT =====
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// ===== MOBILE MENU TOGGLE =====
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelector('.nav-links');
    
    if (nav && navLinks) {
        // Create hamburger menu button once
        const menuButton = document.createElement('button');
        menuButton.className = 'mobile-menu-btn';
        menuButton.setAttribute('aria-label', 'Menú');
        menuButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        `;
        
        nav.insertBefore(menuButton, navLinks);
        
        // Toggle mobile menu active class
        menuButton.addEventListener('click', () => {
            navLinks.classList.toggle('is-active');
        });

        // Close menu when clicking on any nav link
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('is-active');
            });
        });
    }
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
// El blob "orb-cursor" sigue al mouse con una interpolación suave (lerp),
// mientras que los demás "orbes" flotan de forma autónoma vía CSS.
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
        // Posición relativa al centro del hero, para animar con translate3d
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
        // Inercia: el blob "persigue" al cursor suavizando el movimiento
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

    const PARTICLE_COUNT = 50;
    const PARTICLE_SIZE_MIN = 14;
    const PARTICLE_SIZE_MAX = 24;
    const REPULSION_RADIUS = 100;
    const REPULSION_FORCE = 30;
    const RETURN_SPEED = 0.05;
    const MOVEMENT_SPEED = 0.3;

    // Math symbols and numbers
    const mathSymbols = ['+', '-', '×', '÷', '=', '≠', '≈', '√', '∞', 'π', '∑', '∫', '∂', 'Δ', 'θ', 'α', 'β', 'γ', 'λ', 'μ', 'σ', 'φ', 'ω', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    const particles = [];
    let mouseX = -1000;
    let mouseY = -1000;

    class Particle {
        constructor() {
            this.element = document.createElement('div');
            this.element.className = 'particle';
            
            // Random position within hero (in pixels for smoother movement)
            const rect = hero.getBoundingClientRect();
            this.originalX = Math.random() * rect.width;
            this.originalY = Math.random() * rect.height;
            this.x = this.originalX;
            this.y = this.originalY;
            
            // Random velocity for continuous movement
            this.vx = (Math.random() - 0.5) * MOVEMENT_SPEED;
            this.vy = (Math.random() - 0.5) * MOVEMENT_SPEED;
            
            // Random size
            const size = PARTICLE_SIZE_MIN + Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN);
            this.element.style.fontSize = `${size}px`;
            
            // Random opacity
            this.element.style.opacity = 0.3 + Math.random() * 0.4;
            
            // Random math symbol or number
            this.element.textContent = mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
            
            // Initial position
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
                // Repel from cursor
                const force = (REPULSION_RADIUS - distance) / REPULSION_RADIUS;
                const angle = Math.atan2(dy, dx);
                
                this.x += Math.cos(angle) * force * REPULSION_FORCE * 0.1;
                this.y += Math.sin(angle) * force * REPULSION_FORCE * 0.1;
            } else {
                // Continuous slow movement
                this.x += this.vx;
                this.y += this.vy;
                
                // Wrap around boundaries and update original position to prevent jumps
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
            
            // Update position using transform for smoother animation
            this.element.style.transform = `translate3d(${this.x - this.originalX}px, ${this.y - this.originalY}px, 0)`;
        }
    }

    // Create particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    // Track mouse position
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    hero.addEventListener('mouseleave', () => {
        mouseX = -1000;
        mouseY = -1000;
    });

    // Animation loop
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
            const isExpanded = description.classList.contains('is-expanded');
            
            // Close all other descriptions and remove active state
            document.querySelectorAll('.stage-card.is-active').forEach(activeCard => {
                if (activeCard !== card) {
                    activeCard.classList.remove('is-active');
                    activeCard.querySelector('.stage-description').classList.remove('is-expanded');
                }
            });
            
            // Toggle current description and active state
            card.classList.toggle('is-active');
            description.classList.toggle('is-expanded');
        }
    });
});

// ===== ACTIVE NAVIGATION ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
updateActiveNav(); // Initial call

// ===== TECH INFO MODAL =====
const techModal = document.getElementById('tech-modal');
const techInfoBtn = document.getElementById('tech-info-btn');
const closeModalBtn = document.getElementById('close-modal');

techInfoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    techModal.classList.add('is-visible');
});

closeModalBtn.addEventListener('click', () => {
    techModal.classList.remove('is-visible');
});

techModal.addEventListener('click', (e) => {
    if (e.target === techModal) {
        techModal.classList.remove('is-visible');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && techModal.classList.contains('is-visible')) {
        techModal.classList.remove('is-visible');
    }
});

// ===== CONSOLE WELCOME MESSAGE =====
console.log('%c🎮 Welcome to MathPath!', 'color: #aa98f9; font-size: 24px; font-weight: bold;');
console.log('%cLevel up your math skills!', 'color: #94A3B8; font-size: 14px;');

// ===== BACKGROUND DOWNLOAD HANDLE =====
document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            // Evitar la navegación por defecto del enlace
            e.preventDefault();
            
            // Crear un iframe invisible para realizar la descarga
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = downloadBtn.getAttribute('href');
            document.body.appendChild(iframe);
            
            // Remover el iframe después de 5 segundos
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 5000);
        });
    }
});
