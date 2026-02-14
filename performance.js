/**
 * ==================== PERFORMANCE UTILS ====================
 * High-performance utilities for smooth animations
 * Throttling, debouncing, RAF scheduler, object pooling
 */

// ==================== RAF SCHEDULER ====================
const RAFScheduler = {
    tasks: new Map(),
    isRunning: false,

    add(id, callback) {
        this.tasks.set(id, callback);
        if (!this.isRunning) this.start();
    },

    remove(id) {
        this.tasks.delete(id);
        if (this.tasks.size === 0) this.stop();
    },

    start() {
        this.isRunning = true;
        this.loop();
    },

    stop() {
        this.isRunning = false;
    },

    loop() {
        if (!this.isRunning) return;

        const now = performance.now();
        this.tasks.forEach(callback => callback(now));

        requestAnimationFrame(() => this.loop());
    }
};

// ==================== THROTTLE & DEBOUNCE ====================
function throttle(fn, limit) {
    let inThrottle = false;
    let lastFn = null;

    return function (...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
                if (lastFn) {
                    lastFn();
                    lastFn = null;
                }
            }, limit);
        } else {
            lastFn = () => fn.apply(this, args);
        }
    };
}

function debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}

// ==================== OBJECT POOL FOR SHOOTING STARS ====================
class ShootingStarPool {
    constructor(container, maxSize = 10) {
        this.container = container;
        this.maxSize = maxSize;
        this.pool = [];
        this.active = new Set();

        // Pre-create elements
        for (let i = 0; i < maxSize; i++) {
            const star = this.createElement();
            this.pool.push(star);
        }
    }

    createElement() {
        const star = document.createElement('div');
        star.className = 'shooting-star';
        star.style.display = 'none';
        this.container.appendChild(star);
        return star;
    }

    acquire(size = 'normal') {
        let star = this.pool.pop();

        if (!star) {
            if (this.active.size >= this.maxSize) return null;
            star = this.createElement();
        }

        // Reset classes
        star.classList.remove('small', 'large');
        if (size === 'small') star.classList.add('small');
        else if (size === 'large') star.classList.add('large');

        // Random position
        star.style.left = Math.random() * 80 + '%';
        star.style.top = Math.random() * 30 + '%';
        star.style.display = '';

        // Force reflow for animation restart
        void star.offsetWidth;
        star.style.animation = 'none';
        void star.offsetWidth;
        star.style.animation = '';

        this.active.add(star);

        // Auto-release
        const duration = size === 'small' ? 800 : size === 'large' ? 1500 : 1200;
        setTimeout(() => this.release(star), duration);

        return star;
    }

    release(star) {
        if (!this.active.has(star)) return;

        star.style.display = 'none';
        this.active.delete(star);
        this.pool.push(star);
    }
}

// ==================== LAZY IMAGE LOADING ====================
function initLazyImages() {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback: load all images immediately
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        });
    }
}

// ==================== VISIBILITY-BASED ANIMATION PAUSE ====================
let isPageVisible = true;
let pausedAnimations = [];

document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;

    if (!isPageVisible) {
        // Pause heavy animations when tab is hidden
        document.querySelectorAll('.star-layer, .shooting-star').forEach(el => {
            if (el.style.animationPlayState !== 'paused') {
                el.style.animationPlayState = 'paused';
                pausedAnimations.push(el);
            }
        });
    } else {
        // Resume animations
        pausedAnimations.forEach(el => {
            el.style.animationPlayState = 'running';
        });
        pausedAnimations = [];
    }
});

// ==================== PERFORMANCE MONITORING ====================
const PerfMonitor = {
    frameCount: 0,
    lastTime: performance.now(),
    fps: 60,

    update() {
        this.frameCount++;
        const now = performance.now();
        const delta = now - this.lastTime;

        if (delta >= 1000) {
            this.fps = Math.round(this.frameCount * 1000 / delta);
            this.frameCount = 0;
            this.lastTime = now;

            // Auto-reduce quality if FPS drops
            if (this.fps < 30) {
                document.body.classList.add('low-performance');
            } else if (this.fps > 50) {
                document.body.classList.remove('low-performance');
            }
        }
    }
};

// ==================== OPTIMIZED PARALLAX ====================
function createOptimizedParallax(container, layers) {
    let currentX = 0, currentY = 0;
    let targetX = 0, targetY = 0;
    let isInteracting = false;
    let rafId = null;

    // Use passive listeners
    const throttledMove = throttle((x, y) => {
        targetX = x;
        targetY = y;
    }, 16); // ~60fps

    function animate() {
        if (!isPageVisible) {
            rafId = requestAnimationFrame(animate);
            return;
        }

        if (!isInteracting) {
            targetX *= 0.98;
            targetY *= 0.98;
        }

        // Smooth interpolation with early exit
        const dx = targetX - currentX;
        const dy = targetY - currentY;

        if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
            currentX += dx * 0.08;
            currentY += dy * 0.08;

            // Batch transform updates
            const transforms = layers.map(layer => {
                const depth = parseFloat(layer.dataset.depth);
                return {
                    el: layer,
                    transform: `translate3d(${currentX * depth * 100}px, ${currentY * depth * 100}px, 0) rotateX(${currentY * depth * 10}deg) rotateY(${-currentX * depth * 10}deg)`
                };
            });

            // Apply all transforms in one batch
            requestAnimationFrame(() => {
                transforms.forEach(({ el, transform }) => {
                    el.style.transform = transform;
                });
            });
        }

        PerfMonitor.update();
        rafId = requestAnimationFrame(animate);
    }

    // Start animation
    animate();

    // Event handlers with passive option
    container.addEventListener('mousemove', (e) => {
        isInteracting = true;
        const rect = container.getBoundingClientRect();
        throttledMove(
            (e.clientX - rect.width / 2) / (rect.width / 2),
            (e.clientY - rect.height / 2) / (rect.height / 2)
        );
    }, { passive: true });

    container.addEventListener('mouseleave', () => {
        isInteracting = false;
    }, { passive: true });

    // Touch with passive
    let touchStartX = 0, touchStartY = 0;

    container.addEventListener('touchstart', (e) => {
        isInteracting = true;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const dx = (touch.clientX - touchStartX) / 150;
        const dy = (touch.clientY - touchStartY) / 150;

        throttledMove(
            Math.max(-1, Math.min(1, targetX + dx)),
            Math.max(-1, Math.min(1, targetY + dy))
        );

        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }, { passive: true });

    container.addEventListener('touchend', () => {
        isInteracting = false;
    }, { passive: true });

    // Gyroscope with throttling
    if (window.DeviceOrientationEvent) {
        const throttledGyro = throttle((gamma, beta) => {
            isInteracting = true;
            targetX = Math.max(-1, Math.min(1, gamma / 30));
            targetY = Math.max(-1, Math.min(1, (beta - 45) / 30));

            clearTimeout(container.gyroTimeout);
            container.gyroTimeout = setTimeout(() => {
                isInteracting = false;
            }, 100);
        }, 32); // ~30fps for gyro

        window.addEventListener('deviceorientation', (e) => {
            if (e.gamma !== null && e.beta !== null) {
                throttledGyro(e.gamma, e.beta);
            }
        }, { passive: true });
    }

    return () => {
        if (rafId) cancelAnimationFrame(rafId);
    };
}

// ==================== REDUCED STARS FOR MOBILE ====================
function getOptimalStarCount(baseCount) {
    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hasReducedMotion) return Math.floor(baseCount * 0.2);
    if (isLowEnd) return Math.floor(baseCount * 0.4);
    if (isMobile) return Math.floor(baseCount * 0.6);
    return baseCount;
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize lazy loading
    initLazyImages();

    // Add loading="lazy" to existing images
    document.querySelectorAll('img:not([loading])').forEach(img => {
        if (!img.complete) {
            img.setAttribute('loading', 'lazy');
        }
    });

    console.log('⚡ Performance optimizations loaded');
});

// Export for use in other files
window.PerfUtils = {
    RAFScheduler,
    throttle,
    debounce,
    ShootingStarPool,
    initLazyImages,
    createOptimizedParallax,
    getOptimalStarCount,
    PerfMonitor
};
