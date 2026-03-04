document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initLanguageToggle();
    initApplicationTabs();
    initScrollAnimations();
    initCountUp();
    initHeroParticles();
    initMobileMenu();
    initSmoothScroll();
    initSvcPanels();
});

function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        navbar.classList.toggle('scrolled', currentScroll > 50);
        lastScroll = currentScroll;
    });
}

function initLanguageToggle() {
    const toggle = document.getElementById('langToggle');
    const zhSpan = toggle.querySelector('.lang-zh');
    const enSpan = toggle.querySelector('.lang-en');
    let currentLang = 'zh';

    toggle.addEventListener('click', () => {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';

        zhSpan.style.display = currentLang === 'zh' ? '' : 'none';
        enSpan.style.display = currentLang === 'en' ? '' : 'none';

        document.querySelectorAll('[data-zh][data-en]').forEach(el => {
            const text = el.getAttribute(`data-${currentLang}`);
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                el.textContent = text;
            }
        });
    });
}

function initApplicationTabs() {
    const tabs = document.querySelectorAll('.app-tab');
    const panels = document.querySelectorAll('.app-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const target = document.getElementById(tab.dataset.target);
            if (target) target.classList.add('active');
        });
    });
}

function initScrollAnimations() {
    const elements = document.querySelectorAll(
        '.svc-card, .svc-feature-block, .product-card, .contact-card, .supply-step, .section-header, .about-intro-row, .about-bottom-row, .customers-section'
    );

    elements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
}

function initCountUp() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.dataset.count);
                    const duration = 2000;
                    const start = performance.now();

                    function update(now) {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        counter.textContent = Math.floor(eased * target);

                        if (progress < 1) {
                            requestAnimationFrame(update);
                        } else {
                            counter.textContent = target;
                        }
                    }

                    requestAnimationFrame(update);
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) observer.observe(statsSection);
}

function initHeroParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.3 + 0.1
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            ctx.fill();
        });

        const maxDist = 120;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    const alpha = (1 - dist / maxDist) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        animId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });
}

function initMobileMenu() {
    const hamburger = document.getElementById('navHamburger');
    const menu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        menu.classList.toggle('active');
    });

    menu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            menu.classList.remove('active');
        });
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function initSvcPanels() {
    document.querySelectorAll('.svc-card').forEach(card => {
        const bgImgs = card.querySelectorAll('.svc-card-bg');
        const thumbs = card.querySelectorAll('.svc-thumb');
        if (bgImgs.length <= 1) return;

        let current = 0;
        let autoTimer = null;
        const autoDelay = parseInt(card.dataset.autoplay) || 4000;

        function goTo(idx) {
            current = ((idx % bgImgs.length) + bgImgs.length) % bgImgs.length;
            bgImgs.forEach((img, i) => img.classList.toggle('active', i === current));
            thumbs.forEach((th, i) => th.classList.toggle('active', i === current));
        }

        thumbs.forEach((th, i) => {
            th.addEventListener('click', () => { goTo(i); startAuto(); });
        });

        function startAuto() {
            stopAuto();
            autoTimer = setInterval(() => goTo(current + 1), autoDelay);
        }

        function stopAuto() {
            if (autoTimer) clearInterval(autoTimer);
        }

        card.addEventListener('mouseenter', stopAuto);
        card.addEventListener('mouseleave', startAuto);

        startAuto();
    });
}
