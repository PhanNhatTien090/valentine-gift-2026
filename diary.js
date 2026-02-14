/**
 * ==================== DIARY PAGE JS ====================
 * Multimedia Photobook with 13 pages
 * Centering logic for open spreads
 * 3D Starfield background effect
 */

// ==================== PHOTOBOOK STATE ====================
let currentPage = 0;
const totalPages = 13;
let isAnimating = false;

// ==================== DOM ELEMENTS ====================
const elements = {
    starfield3d: document.getElementById('starfield-3d'),
    photobook: document.getElementById('photobook'),
    photobookWrapper: document.getElementById('photobook-wrapper'),
    leftPage: document.getElementById('left-page'),
    currentPageEl: document.getElementById('current-page'),
    totalPagesEl: document.getElementById('total-pages'),
    continueBtn: document.getElementById('continue-btn'),
    musicToggle: document.getElementById('music-toggle'),
    bgMusic: document.getElementById('bg-music'),
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('💝 Photobook Page Initialized');

    // Create 3D starfield background
    create3DStarfield(150);

    // Initialize photobook
    initializePhotobook();

    // Setup music
    setupMusic();

    // Update total pages display
    if (elements.totalPagesEl) {
        elements.totalPagesEl.textContent = totalPages;
    }
});

// ==================== 3D STARFIELD BACKGROUND ====================
function create3DStarfield(count) {
    const container = elements.starfield3d;
    if (!container) return;

    const layerConfigs = [
        { id: 'layer-far', class: 'star-layer-far', count: Math.floor(count * 0.5), depth: 0.1 },
        { id: 'layer-mid', class: 'star-layer-mid', count: Math.floor(count * 0.35), depth: 0.3 },
        { id: 'layer-near', class: 'star-layer-near', count: Math.floor(count * 0.15), depth: 0.6 }
    ];

    const layerElements = [];

    layerConfigs.forEach(config => {
        const layer = document.createElement('div');
        layer.className = 'star-layer';
        layer.id = config.id;
        layer.dataset.depth = config.depth;

        for (let i = 0; i < config.count; i++) {
            const star = document.createElement('div');
            star.className = `star-3d ${config.class}`;

            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';

            let size;
            if (config.class === 'star-layer-far') {
                size = Math.random() * 1.5 + 0.5;
            } else if (config.class === 'star-layer-mid') {
                size = Math.random() * 2 + 1;
            } else {
                size = Math.random() * 3 + 2;
            }
            star.style.width = size + 'px';
            star.style.height = size + 'px';

            star.style.setProperty('--twinkle-duration', (Math.random() * 4 + 2) + 's');
            star.style.setProperty('--twinkle-delay', Math.random() * 5 + 's');

            layer.appendChild(star);
        }

        container.appendChild(layer);
        layerElements.push(layer);
    });

    setup3DParallax(container, layerElements);
    createShootingStars(container);
}

function setup3DParallax(container, layers) {
    let currentX = 0, currentY = 0, targetX = 0, targetY = 0, isInteracting = false;

    function animate() {
        if (!isInteracting) { targetX *= 0.98; targetY *= 0.98; }
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;

        layers.forEach(layer => {
            const depth = parseFloat(layer.dataset.depth);
            const moveX = currentX * depth * 100;
            const moveY = currentY * depth * 100;
            layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotateX(${currentY * depth * 10}deg) rotateY(${-currentX * depth * 10}deg)`;
        });
        requestAnimationFrame(animate);
    }
    animate();

    container.addEventListener('mousemove', (e) => {
        isInteracting = true;
        const rect = container.getBoundingClientRect();
        targetX = (e.clientX - rect.width / 2) / (rect.width / 2);
        targetY = (e.clientY - rect.height / 2) / (rect.height / 2);
    });
    container.addEventListener('mouseleave', () => { isInteracting = false; });

    let touchStartX = 0, touchStartY = 0;
    container.addEventListener('touchstart', (e) => { isInteracting = true; touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; }, { passive: true });
    container.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        targetX = Math.max(-1, Math.min(1, targetX + (touch.clientX - touchStartX) / 150));
        targetY = Math.max(-1, Math.min(1, targetY + (touch.clientY - touchStartY) / 150));
        touchStartX = touch.clientX; touchStartY = touch.clientY;
    }, { passive: true });
    container.addEventListener('touchend', () => { isInteracting = false; }, { passive: true });

    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (e) => {
            if (e.gamma !== null && e.beta !== null) {
                isInteracting = true;
                targetX = Math.max(-1, Math.min(1, e.gamma / 30));
                targetY = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
                clearTimeout(container.gyroTimeout);
                container.gyroTimeout = setTimeout(() => { isInteracting = false; }, 100);
            }
        }, { passive: true });
    }
}

function createShootingStars(container) {
    function addShootingStar() {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';

        // Random size: 60% normal, 25% small, 15% large
        const sizeRoll = Math.random();
        if (sizeRoll < 0.25) {
            shootingStar.classList.add('small');
        } else if (sizeRoll > 0.85) {
            shootingStar.classList.add('large');
        }

        // Random starting position (top area)
        shootingStar.style.left = Math.random() * 80 + '%';
        shootingStar.style.top = Math.random() * 30 + '%';

        container.appendChild(shootingStar);

        // Remove after animation
        const duration = shootingStar.classList.contains('small') ? 800 :
            shootingStar.classList.contains('large') ? 1500 : 1200;
        setTimeout(() => {
            shootingStar.remove();
        }, duration);
    }

    // Add first shooting star quickly
    setTimeout(addShootingStar, 1000);

    // Add shooting stars more frequently (every 1.5-3 seconds)
    setInterval(() => {
        addShootingStar();
        // Sometimes add a second one for a "shower" effect
        if (Math.random() > 0.7) {
            setTimeout(addShootingStar, 300);
        }
    }, 2000);
}

// ==================== PHOTOBOOK FUNCTIONS ====================
function initializePhotobook() {
    // Click on photobook for navigation
    if (elements.photobook) {
        elements.photobook.addEventListener('click', (e) => {
            if (isAnimating) return;

            const rect = elements.photobook.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const pageWidth = rect.width;

            if (currentPage === 0) {
                // Book closed - click anywhere to open
                flipToNextPage();
            } else {
                // Book open - spread is 2x width
                // Left page (0 to pageWidth) = go back
                // Right page (pageWidth to 2*pageWidth) = go next
                // Since spread extends beyond the book container, use relative position
                if (clickX < pageWidth * 0.4) {
                    flipToPrevPage();
                } else {
                    flipToNextPage();
                }
            }
        });

        // Also handle clicks on the spread area (right side)
        document.addEventListener('click', (e) => {
            if (isAnimating || currentPage === 0) return;
            if (!elements.photobook) return;

            const rect = elements.photobook.getBoundingClientRect();
            const clickX = e.clientX;

            // If click is to the right of the book (on the spread)
            if (clickX > rect.right && clickX < rect.right + rect.width) {
                flipToNextPage();
            }
        });
    }

    // Click on left page to go back
    if (elements.leftPage) {
        elements.leftPage.addEventListener('click', (e) => {
            if (isAnimating || currentPage === 0) return;
            flipToPrevPage();
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            flipToNextPage();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            flipToPrevPage();
        }
    });

    // Touch/Swipe support
    setupTouchSupport();

    // Update indicator
    updatePageIndicator();

    // Update book centering
    updateBookCentering();
}

// Update book position based on open/closed state
function updateBookCentering() {
    if (!elements.photobookWrapper) return;

    if (currentPage > 0) {
        elements.photobookWrapper.classList.add('book-open');
    } else {
        elements.photobookWrapper.classList.remove('book-open');
    }

    // Update left page content
    updateLeftPage();
}

// Update left page content based on current page
function updateLeftPage() {
    const allLeftContents = document.querySelectorAll('.left-content');

    // Hide all left contents
    allLeftContents.forEach(content => {
        content.classList.remove('active');
    });

    // Show the correct left content based on current page
    // When on page N (after flipping), show left-content for page N
    if (currentPage > 0) {
        const activeContent = document.querySelector(`.left-content[data-for-page="${currentPage}"]`);
        if (activeContent) {
            activeContent.classList.add('active');
        }
    }
}

function flipToNextPage() {
    if (currentPage >= totalPages - 1) {
        showEndToast();
        return;
    }

    if (isAnimating) return;

    isAnimating = true;
    const page = document.getElementById(`page-${currentPage + 1}`);

    if (page) {
        page.classList.add('flipped');
        currentPage++;
        updatePageIndicator();
        updateBookCentering();
    }

    setTimeout(() => {
        isAnimating = false;
    }, 800);
}

// Show "Hết òii" toast message
function showEndToast() {
    let toast = document.getElementById('end-toast');

    // Create toast if doesn't exist
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'end-toast';
        toast.className = 'end-toast';
        toast.innerHTML = `
            <span class="toast-icon">💕</span>
            <span class="toast-text">Hết òii~</span>
        `;
        document.body.appendChild(toast);
    }

    // Show toast
    toast.classList.add('show');

    // Hide after 2 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

function flipToPrevPage() {
    // If already at first page, show start message
    if (currentPage <= 0) {
        showStartToast();
        return;
    }

    if (isAnimating) return;

    isAnimating = true;
    const page = document.getElementById(`page-${currentPage}`);

    if (page) {
        page.classList.remove('flipped');
        currentPage--;
        updatePageIndicator();
        updateBookCentering();
    }

    setTimeout(() => {
        isAnimating = false;
    }, 800);
}

// Show "Đầu rồi" toast message
function showStartToast() {
    let toast = document.getElementById('start-toast');

    // Create toast if doesn't exist
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'start-toast';
        toast.className = 'end-toast'; // Reuse same styling
        toast.innerHTML = `
            <span class="toast-icon">📖</span>
            <span class="toast-text">Đầu sách rồi!</span>
        `;
        document.body.appendChild(toast);
    }

    // Show toast
    toast.classList.add('show');

    // Hide after 1.5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 1500);
}

function updatePageIndicator() {
    if (elements.currentPageEl) {
        elements.currentPageEl.textContent = currentPage + 1;
    }
    if (elements.totalPagesEl) {
        elements.totalPagesEl.textContent = totalPages;
    }
}

function setupTouchSupport() {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
        touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const threshold = 50;

        if (touchStartX - touchEndX > threshold) {
            flipToNextPage();
        } else if (touchEndX - touchStartX > threshold) {
            flipToPrevPage();
        }
    };

    // Touch support for photobook (right page)
    if (elements.photobook) {
        elements.photobook.addEventListener('touchstart', handleTouchStart, { passive: true });
        elements.photobook.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    // Touch support for left page
    if (elements.leftPage) {
        elements.leftPage.addEventListener('touchstart', handleTouchStart, { passive: true });
        elements.leftPage.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
}

// ==================== MUSIC FUNCTIONS ====================
function setupMusic() {
    // Check if music was playing from intro
    const wasPlaying = sessionStorage.getItem('musicPlaying') === 'true';

    if (wasPlaying && elements.bgMusic) {
        elements.bgMusic.volume = 0.5;
        elements.bgMusic.play().catch(e => console.log('Music autoplay blocked'));

        if (elements.musicToggle) {
            elements.musicToggle.classList.add('playing');
        }
    }

    // Music toggle button
    if (elements.musicToggle) {
        elements.musicToggle.addEventListener('click', toggleMusic);
    }
}

function toggleMusic() {
    if (!elements.bgMusic) return;

    if (elements.bgMusic.paused) {
        elements.bgMusic.play();
        elements.musicToggle.classList.add('playing');
        sessionStorage.setItem('musicPlaying', 'true');
    } else {
        elements.bgMusic.pause();
        elements.musicToggle.classList.remove('playing');
        sessionStorage.setItem('musicPlaying', 'false');
    }
}
