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

    const hoverTargets = document.querySelectorAll('a, button, .gallery-card, .narrative-card, .opportunity-block, .capital-card, .associate-item, .theme-block');
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
                const href = link.getAttribute('href');
                // Only close menu immediately for hash links on the same page
                if (href.startsWith('#')) {
                    hamburger.classList.remove('active');
                    fullscreenMenu.classList.remove('open');
                    document.body.classList.remove('menu-open');
                }
                // For page navigation links, menu will close on page load
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

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function setupHorizontalGallery() {
        if (!horizontalGallery || !galleryTrack) return;
        if (isMobile()) {
            horizontalGallery.style.height = '';
            galleryTrack.style.transform = '';
            return;
        }
        const trackWidth = galleryTrack.scrollWidth;
        const viewWidth = window.innerWidth;
        const scrollDistance = trackWidth - viewWidth + 160;
        horizontalGallery.style.height = (window.innerHeight + scrollDistance) + 'px';
    }

    function handleHorizontalScroll() {
        if (!horizontalGallery || !galleryTrack) return;
        if (isMobile()) return;

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

    // ================================
    // PDF Carousel System
    // ================================

    const PDF_URL = '/images/Mind Benderz-Srii Paradiise Studioos Media Deck - 24th Feb 2026.pdf';

    function initPDFCarousel(carouselId, opts) {
        const prefix = opts.prefix;
        const viewport = document.getElementById(prefix + 'Viewport');
        const track = document.getElementById(prefix + 'Track');
        const prevBtn = document.getElementById(prefix + 'Prev');
        const nextBtn = document.getElementById(prefix + 'Next');
        const dotsContainer = document.getElementById(prefix + 'Dots');
        const counter = document.getElementById(prefix + 'Counter');

        if (!viewport || !track) return null;

        // Show loading
        track.innerHTML = '<div class="carousel-loading">Loading presentation</div>';

        let currentPage = 0;
        let totalPages = 0;
        let autoScrollInterval = null;
        let autoScrollActive = opts.autoScroll !== false;
        let touchStartX = 0;
        let touchDiffX = 0;
        let isDragging = false;

        function goToPage(index) {
            if (index < 0) index = totalPages - 1;
            if (index >= totalPages) index = 0;
            currentPage = index;
            track.style.transform = 'translateX(-' + (currentPage * 100) + '%)';

            // Update dots
            if (dotsContainer) {
                dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentPage);
                });
            }

            // Update counter
            if (counter) {
                counter.textContent = (currentPage + 1) + ' / ' + totalPages;
            }
        }

        function startAutoScroll() {
            stopAutoScroll();
            if (!autoScrollActive) return;
            autoScrollInterval = setInterval(() => {
                goToPage(currentPage + 1);
            }, opts.interval || 5000);
        }

        function stopAutoScroll() {
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
                autoScrollInterval = null;
            }
        }

        function renderPDF(pdf) {
            totalPages = pdf.numPages;
            track.innerHTML = '';

            // Create slides
            const renderPromises = [];
            for (let i = 1; i <= totalPages; i++) {
                const slide = document.createElement('div');
                slide.className = 'carousel-slide';
                const canvas = document.createElement('canvas');
                slide.appendChild(canvas);
                track.appendChild(slide);

                renderPromises.push(
                    pdf.getPage(i).then(page => {
                        const baseScale = opts.scale || 2;
                        const pdfViewport = page.getViewport({ scale: baseScale });
                        canvas.width = pdfViewport.width;
                        canvas.height = pdfViewport.height;
                        const ctx = canvas.getContext('2d');
                        return page.render({ canvasContext: ctx, viewport: pdfViewport }).promise;
                    })
                );
            }

            Promise.all(renderPromises).then(() => {
                // Build dots
                if (dotsContainer) {
                    dotsContainer.innerHTML = '';
                    for (let i = 0; i < totalPages; i++) {
                        const dot = document.createElement('button');
                        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
                        dot.setAttribute('aria-label', 'Page ' + (i + 1));
                        dot.addEventListener('click', () => {
                            goToPage(i);
                            stopAutoScroll();
                            startAutoScroll();
                        });
                        dotsContainer.appendChild(dot);
                    }
                }

                // Update counter
                if (counter) {
                    counter.textContent = '1 / ' + totalPages;
                }

                // Start auto-scroll
                startAutoScroll();
            });
        }

        // Nav buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToPage(currentPage - 1);
                stopAutoScroll();
                startAutoScroll();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToPage(currentPage + 1);
                stopAutoScroll();
                startAutoScroll();
            });
        }

        // Touch/swipe support
        viewport.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            isDragging = true;
            stopAutoScroll();
        }, { passive: true });

        viewport.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            touchDiffX = e.touches[0].clientX - touchStartX;
        }, { passive: true });

        viewport.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            if (Math.abs(touchDiffX) > 50) {
                if (touchDiffX < 0) {
                    goToPage(currentPage + 1);
                } else {
                    goToPage(currentPage - 1);
                }
            }
            touchDiffX = 0;
            startAutoScroll();
        });

        // Pause on hover (desktop)
        viewport.addEventListener('mouseenter', stopAutoScroll);
        viewport.addEventListener('mouseleave', () => {
            if (autoScrollActive) startAutoScroll();
        });

        // Load PDF
        if (window.pdfjsLib) {
            pdfjsLib.getDocument(PDF_URL).promise.then(renderPDF).catch(() => {
                track.innerHTML = '<div class="carousel-loading" style="color:var(--amber)">Unable to load presentation</div>';
            });
        } else {
            track.innerHTML = '<div class="carousel-loading" style="color:var(--amber)">PDF viewer unavailable</div>';
        }

        return {
            goToPage,
            startAutoScroll,
            stopAutoScroll,
            toggleAutoScroll: function () {
                autoScrollActive = !autoScrollActive;
                if (autoScrollActive) {
                    startAutoScroll();
                } else {
                    stopAutoScroll();
                }
                return autoScrollActive;
            },
            getContainer: function () {
                return document.getElementById(carouselId);
            }
        };
    }

    function setupFullscreenToggle(btnId, carouselInstance) {
        const btn = document.getElementById(btnId);
        if (!btn || !carouselInstance) return;

        btn.addEventListener('click', () => {
            const container = carouselInstance.getContainer();
            if (!container) return;

            const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
            if (isFullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            } else {
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                } else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                }
            }
        });
    }

    const homeCarousel = initPDFCarousel('productionsCarousel', {
        prefix: 'carousel',
        autoScroll: true,
        interval: 5000,
        scale: 1.5
    });

    const deckCarousel = initPDFCarousel('deckCarousel', {
        prefix: 'deck',
        autoScroll: true,
        interval: 6000,
        scale: 2
    });

    setupFullscreenToggle('carouselFullscreen', homeCarousel);
    setupFullscreenToggle('deckFullscreen', deckCarousel);

    const deckAutoToggle = document.getElementById('deckAutoToggle');
    if (deckAutoToggle && deckCarousel) {
        deckAutoToggle.addEventListener('click', () => {
            const isPlaying = deckCarousel.toggleAutoScroll();
            deckAutoToggle.classList.toggle('paused', !isPlaying);
        });
    }

});
