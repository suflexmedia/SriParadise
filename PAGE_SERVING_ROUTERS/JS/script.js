document.addEventListener('DOMContentLoaded', () => {

    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    const scrollProgress = document.getElementById('scrollProgress');
    const nav = document.getElementById('mainNav');
    const hamburger = document.getElementById('navHamburger');
    const fullscreenMenu = document.getElementById('fullscreenMenu');
    const horizontalGallery = document.getElementById('horizontalGallery');
    const galleryTrack = document.getElementById('galleryTrack');

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 300);

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    document.addEventListener('mousemove', (e) => {
        if (cursorDot) {
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
        }
    });

    function animateCursor() {
        ringX += (mouseX - ringX) * 0.08;
        ringY += (mouseY - ringY) * 0.08;

        if (cursorRing) {
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
        }

        requestAnimationFrame(animateCursor);
    }

    if (window.innerWidth > 768) {
        animateCursor();
    }

    const hoverTargets = document.querySelectorAll('a, button, .gallery-card, .narrative-card, .visionary-card');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursorDot) cursorDot.classList.add('hovering');
            if (cursorRing) cursorRing.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            if (cursorDot) cursorDot.classList.remove('hovering');
            if (cursorRing) cursorRing.classList.remove('hovering');
        });
    });

    let scrollTicking = false;

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                handleScroll();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    function handleScroll() {
        const scrollY = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollY / docHeight) * 100;

        if (scrollProgress) {
            scrollProgress.style.width = scrollPercent + '%';
        }

        if (nav) {
            if (scrollY > 80) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }

        handleHorizontalScroll();
    }

    if (hamburger && fullscreenMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            fullscreenMenu.classList.toggle('open');
            document.body.classList.toggle('menu-open');
        });

        fullscreenMenu.querySelectorAll('.menu-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                fullscreenMenu.classList.remove('open');
                document.body.classList.remove('menu-open');
            });
        });
    }

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('[data-reveal]').forEach(el => {
        revealObserver.observe(el);
    });

    function setupHorizontalGallery() {
        if (!horizontalGallery || !galleryTrack) return;
        const trackWidth = galleryTrack.scrollWidth;
        const viewWidth = window.innerWidth;
        const scrollDistance = trackWidth - viewWidth + 160;
        horizontalGallery.style.height = (window.innerHeight + scrollDistance) + 'px';
    }

    function handleHorizontalScroll() {
        if (!horizontalGallery || !galleryTrack) return;

        const rect = horizontalGallery.getBoundingClientRect();
        const galleryHeight = horizontalGallery.offsetHeight;
        const scrollableDistance = galleryHeight - window.innerHeight;

        if (scrollableDistance <= 0) return;

        const progress = Math.max(0, Math.min(1, -rect.top / scrollableDistance));
        const trackWidth = galleryTrack.scrollWidth;
        const viewWidth = window.innerWidth;
        const maxTranslate = trackWidth - viewWidth + 160;
        const translateX = -progress * maxTranslate;

        galleryTrack.style.transform = `translateX(${translateX}px)`;
    }

    setupHorizontalGallery();

    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                if (!isNaN(target)) {
                    animateCount(el, 0, target, 1800);
                }
                countObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => {
        countObserver.observe(el);
    });

    function animateCount(el, start, end, duration) {
        const startTime = performance.now();
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(start + (end - start) * eased);
            el.textContent = current;
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return;
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -5;
            const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 5;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => {
                card.style.transition = '';
            }, 500);
        });
    });

    const form = document.getElementById('premiereForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('.btn-submit');
            const btnText = btn.querySelector('.btn-text');
            const originalText = btnText.textContent;

            btnText.textContent = 'CONFIRMED ✓';
            btn.style.background = '#1a7a2e';
            btn.style.boxShadow = '0 8px 40px rgba(26, 122, 46, 0.3)';

            setTimeout(() => {
                btnText.textContent = originalText;
                btn.style.background = '';
                btn.style.boxShadow = '';
                form.reset();
            }, 3000);
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    window.addEventListener('resize', () => {
        setupHorizontalGallery();
    });

});
