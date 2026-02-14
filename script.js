/**
 * ==================== VALENTINE'S DAY SPA ====================
 * A romantic interactive love story website
 * Tech: Vanilla JS, Three.js, CSS3DRenderer, TWEEN.js
 * Author: With love 💝
 */

// ==================== GLOBAL VARIABLES ====================
const START_DATE = new Date('2021-10-22T21:34:00');
let bgMusic;
let isMusicPlaying = false;

// ==================== FLIPBOOK STATE ====================
let currentPage = 0;
const totalPages = 5;
let isAnimating = false;

// ==================== DOM ELEMENTS ====================
const elements = {
    introScreen: document.getElementById('intro-screen'),
    mainContainer: document.getElementById('main-container'),
    typingText: document.getElementById('typing-text'),
    subText: document.getElementById('sub-text'),
    openBtn: document.getElementById('open-btn'),
    starsContainer: document.getElementById('stars-container'),
    floatingHearts: document.getElementById('floating-hearts'),
    musicToggle: document.getElementById('music-toggle'),
    bgMusic: document.getElementById('bg-music'),
    photoModal: document.getElementById('photo-modal'),
    modalImage: document.getElementById('modal-image'),
    modalClose: document.getElementById('modal-close'),
    threeContainer: document.getElementById('three-container'),

    // Counter elements
    counterYears: document.getElementById('counter-years'),
    counterDays: document.getElementById('counter-days'),
    counterHours: document.getElementById('counter-hours'),
    counterMinutes: document.getElementById('counter-minutes'),
    counterSeconds: document.getElementById('counter-seconds'),
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('💝 Valentine SPA Initialized');

    // Create background effects
    createStars(150);
    createFloatingHearts(15);

    // Start typing animation
    typeWriter("Hé lô You...", elements.typingText, 100);

    // Setup event listeners
    setupEventListeners();

    // Initialize 3D Flipbook
    initializeFlipbook();
});

// ==================== STARS BACKGROUND ====================
function createStars(count) {
    const container = elements.starsContainer;

    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // Random position
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';

        // Random size (1-3px)
        const size = Math.random() * 2 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';

        // Random animation duration and delay
        star.style.setProperty('--duration', (Math.random() * 3 + 2) + 's');
        star.style.setProperty('--delay', Math.random() * 3 + 's');

        container.appendChild(star);
    }
}

// ==================== FLOATING HEARTS ====================
function createFloatingHearts(count) {
    const container = elements.floatingHearts;
    const heartIcons = ['♥', '♡', '❤', '💕', '💗', '💖'];

    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = heartIcons[Math.floor(Math.random() * heartIcons.length)];

        // Random position
        heart.style.left = Math.random() * 100 + '%';

        // Random size
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';

        // Random animation duration and delay
        heart.style.setProperty('--duration', (Math.random() * 10 + 10) + 's');
        heart.style.setProperty('--delay', Math.random() * 15 + 's');

        container.appendChild(heart);
    }
}

// ==================== TYPEWRITER EFFECT ====================
function typeWriter(text, element, speed = 100) {
    let index = 0;
    element.textContent = '';

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        } else {
            // Show sub-text after typing is complete
            setTimeout(() => {
                elements.subText.classList.add('visible');
            }, 500);

            // Show button after sub-text
            setTimeout(() => {
                elements.openBtn.classList.add('visible');
            }, 1500);
        }
    }

    // Start typing after a short delay
    setTimeout(type, 800);
}

// ==================== 3D FLIPBOOK FUNCTIONS ====================

/**
 * Initialize the 3D Flipbook
 */
function initializeFlipbook() {
    const clickLeft = document.getElementById('click-left');
    const clickRight = document.getElementById('click-right');
    const flipbook = document.getElementById('flipbook');
    const continueBtn = document.getElementById('continue-btn');

    if (!flipbook) return;

    // Click zones for page turning
    clickRight.addEventListener('click', flipToNextPage);
    clickLeft.addEventListener('click', flipToPrevPage);

    // Also allow clicking directly on pages
    flipbook.addEventListener('click', (e) => {
        if (isAnimating) return;
        const rect = flipbook.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const midpoint = rect.width / 2;

        if (clickX > midpoint) {
            flipToNextPage();
        } else {
            flipToPrevPage();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', handleFlipbookKeyboard);

    // Touch/Swipe support
    setupFlipbookTouch();

    // Continue button - triggers Love Timer section
    if (continueBtn) {
        continueBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showLoveTimer();
        });
    }

    // Initialize page counter
    updatePageIndicator();
}

/**
 * Flip to next page
 */
function flipToNextPage() {
    if (isAnimating || currentPage >= totalPages) return;

    isAnimating = true;
    const page = document.getElementById(`page-${currentPage + 1}`);

    if (page) {
        page.classList.add('flipped');
        currentPage++;
        updatePageIndicator();
    }

    setTimeout(() => {
        isAnimating = false;
    }, 600);
}

/**
 * Flip to previous page
 */
function flipToPrevPage() {
    if (isAnimating || currentPage <= 0) return;

    isAnimating = true;
    const page = document.getElementById(`page-${currentPage}`);

    if (page) {
        page.classList.remove('flipped');
        currentPage--;
        updatePageIndicator();
    }

    setTimeout(() => {
        isAnimating = false;
    }, 600);
}

/**
 * Update page indicator display
 */
function updatePageIndicator() {
    const currentPageEl = document.getElementById('current-page');
    const totalPagesEl = document.getElementById('total-pages');

    if (currentPageEl && totalPagesEl) {
        currentPageEl.textContent = currentPage + 1;
        totalPagesEl.textContent = totalPages;
    }
}

/**
 * Handle keyboard navigation for flipbook
 */
function handleFlipbookKeyboard(e) {
    const diarySection = document.getElementById('section-diary');
    if (!diarySection || !isElementInViewport(diarySection)) return;

    if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        flipToNextPage();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        flipToPrevPage();
    }
}

/**
 * Setup touch/swipe for flipbook
 */
function setupFlipbookTouch() {
    const flipbook = document.getElementById('flipbook');
    if (!flipbook) return;

    let touchStartX = 0;
    let touchEndX = 0;

    flipbook.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    flipbook.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const threshold = 50;

        if (touchStartX - touchEndX > threshold) {
            flipToNextPage();
        } else if (touchEndX - touchStartX > threshold) {
            flipToPrevPage();
        }
    }, { passive: true });
}

/**
 * Check if element is in viewport
 */
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom > 0
    );
}

// ==================== SECTION 3: LOVE TIMER ====================
const LOVE_START_DATE = new Date('2021-10-22T21:34:00');
let timerInterval = null;
let statsAnimated = false;

/**
 * Show the Love Timer section
 * Call this function to reveal Section 3
 */
function showLoveTimer() {
    const loveTimerSection = document.getElementById('love-timer');
    if (!loveTimerSection) return;

    // Show the section
    loveTimerSection.classList.add('visible');

    // Start the timer
    startLoveTimer();

    // Animate stats after a delay
    setTimeout(() => {
        animateStats();
    }, 500);

    // Scroll to it
    setTimeout(() => {
        loveTimerSection.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    console.log('💝 Love Timer Section revealed!');
}

/**
 * Hide the Love Timer section
 */
function hideLoveTimer() {
    const loveTimerSection = document.getElementById('love-timer');
    if (!loveTimerSection) return;

    loveTimerSection.classList.remove('visible');

    // Stop the timer
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

/**
 * Start the real-time love timer
 */
function startLoveTimer() {
    // Clear any existing interval
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    // Update immediately
    updateLoveTimer();

    // Then update every second
    timerInterval = setInterval(updateLoveTimer, 1000);
}

/**
 * Calculate and update the timer display
 */
function updateLoveTimer() {
    const now = new Date();
    const diff = now - LOVE_START_DATE;

    // Calculate time units
    const totalSeconds = Math.floor(diff / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    const seconds = totalSeconds % 60;
    const minutes = totalMinutes % 60;
    const hours = totalHours % 24;
    const days = totalDays;

    // Update DOM elements
    const daysEl = document.getElementById('timer-days');
    const hoursEl = document.getElementById('timer-hours');
    const minutesEl = document.getElementById('timer-minutes');
    const secondsEl = document.getElementById('timer-seconds');

    if (daysEl) daysEl.textContent = days.toLocaleString();
    if (hoursEl) hoursEl.textContent = padZero(hours);
    if (minutesEl) minutesEl.textContent = padZero(minutes);
    if (secondsEl) {
        // Add tick animation
        secondsEl.textContent = padZero(seconds);
        secondsEl.classList.add('tick');
        setTimeout(() => secondsEl.classList.remove('tick'), 100);
    }
}

/**
 * Animate the stats with CountUp effect
 */
function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;

    const statCards = document.querySelectorAll('.stat-card');

    statCards.forEach((card, index) => {
        // Stagger animation
        setTimeout(() => {
            card.classList.add('animated');

            const target = card.dataset.target;
            const numberEl = card.querySelector('.stat-number');

            if (target === 'infinity' || !numberEl) return;

            const targetNum = parseInt(target);
            animateNumber(numberEl, 0, targetNum, 2000);
        }, index * 150);
    });
}

/**
 * Animate a number from start to end
 */
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const range = end - start;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + range * easeOut);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ==================== TEST COMMANDS (For Development) ====================
// Run these in browser console to test Section 3:
// 
// Show Love Timer:     showLoveTimer()
// Hide Love Timer:     hideLoveTimer()
// 
// Or use this one-liner:
// document.getElementById('love-timer').classList.add('visible'); startLoveTimer(); animateStats();

// Make functions globally accessible for testing
window.showLoveTimer = showLoveTimer;
window.hideLoveTimer = hideLoveTimer;
window.startLoveTimer = startLoveTimer;
window.animateStats = animateStats;

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Open button click - triggers music and reveals main content
    elements.openBtn.addEventListener('click', handleOpenClick);

    // Music toggle
    elements.musicToggle.addEventListener('click', toggleMusic);

    // Modal close
    elements.modalClose.addEventListener('click', closeModal);
    elements.photoModal.addEventListener('click', (e) => {
        if (e.target === elements.photoModal) {
            closeModal();
        }
    });

    // Keyboard escape for modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Scroll animations
    setupScrollAnimations();
}

// ==================== HANDLE OPEN BUTTON CLICK ====================
function handleOpenClick() {
    console.log('💝 Opening the gift...');

    // Try to play background music (user interaction triggers audio unlock)
    playBackgroundMusic();

    // Fade out intro screen
    elements.introScreen.classList.add('fade-out');

    // Show main container
    setTimeout(() => {
        elements.mainContainer.classList.add('visible');

        // Show music toggle button
        elements.musicToggle.classList.add('visible');

        // Start the time counter
        startTimeCounter();

        // Initialize 3D Heart after a delay
        setTimeout(() => {
            init3DHeartGallery();
        }, 1000);

        // Trigger initial scroll animations
        checkScrollAnimations();
    }, 500);
}

// ==================== BACKGROUND MUSIC ====================
function playBackgroundMusic() {
    bgMusic = elements.bgMusic;

    // Try to play
    const playPromise = bgMusic.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log('🎵 Music playing!');
            isMusicPlaying = true;
            elements.musicToggle.classList.add('playing');
        }).catch((error) => {
            console.log('🎵 Music autoplay blocked:', error);
            isMusicPlaying = false;
        });
    }
}

function toggleMusic() {
    if (!bgMusic) {
        bgMusic = elements.bgMusic;
    }

    if (isMusicPlaying) {
        bgMusic.pause();
        isMusicPlaying = false;
        elements.musicToggle.classList.remove('playing');
        elements.musicToggle.classList.add('muted');
    } else {
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            elements.musicToggle.classList.add('playing');
            elements.musicToggle.classList.remove('muted');
        }).catch(console.error);
    }
}

// ==================== TIME COUNTER ====================
function startTimeCounter() {
    updateTimeCounter(); // Initial update
    setInterval(updateTimeCounter, 1000); // Update every second
}

function updateTimeCounter() {
    const now = new Date();
    const diff = now - START_DATE;

    // Calculate time components
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);

    // Calculate remaining values
    const remainingDays = days % 365;
    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;

    // Update DOM with animation
    animateCounter(elements.counterYears, years);
    animateCounter(elements.counterDays, remainingDays);
    animateCounter(elements.counterHours, remainingHours);
    animateCounter(elements.counterMinutes, remainingMinutes);
    animateCounter(elements.counterSeconds, remainingSeconds);
}

function animateCounter(element, value) {
    const currentValue = parseInt(element.textContent) || 0;
    if (currentValue !== value) {
        element.textContent = value;
        element.style.transform = 'scale(1.1)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 150);
    }
}

// ==================== SCROLL ANIMATIONS ====================
function setupScrollAnimations() {
    // Use Intersection Observer for better performance
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Elements to observe
    const animatedElements = document.querySelectorAll(
        '.section-title, .section-subtitle, .story-card, .counter-item, .stat-item, .final-content'
    );

    animatedElements.forEach(el => observer.observe(el));
}

function checkScrollAnimations() {
    // Force check for elements in viewport
    const scrollEvent = new Event('scroll');
    window.dispatchEvent(scrollEvent);
}

// ==================== PHOTO MODAL ====================
function openModal(imageSrc) {
    elements.modalImage.src = imageSrc;
    elements.photoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    elements.photoModal.classList.remove('active');
    document.body.style.overflow = '';
}

// ==================== 3D HEART GALLERY (THREE.JS) ====================
let scene, camera, renderer, controls;
let CSS3DObjects = [];
let isHeartInitialized = false;

function init3DHeartGallery() {
    if (isHeartInitialized) return;
    isHeartInitialized = true;

    const container = elements.threeContainer;
    if (!container) return;

    console.log('💖 Initializing 3D Heart Gallery...');

    // Scene setup
    scene = new THREE.Scene();

    // Camera setup
    const aspect = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(40, aspect, 1, 10000);
    camera.position.z = 3000;

    // CSS3D Renderer
    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Orbit Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = true;
    controls.minDistance = 1000;
    controls.maxDistance = 5000;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Create photo elements
    createPhotoElements(80);

    // Transform to heart shape
    transformToHeart();

    // Handle resize
    window.addEventListener('resize', onWindowResize);

    // Start animation loop
    animate();
}

function createPhotoElements(count) {
    // Placeholder images with different colors
    const colors = [
        '#FF69B4', '#FF1493', '#FFB6C1', '#FFC0CB', '#DB7093',
        '#FF6B6B', '#DDA0DD', '#EE82EE', '#DA70D6', '#BA55D3'
    ];

    for (let i = 0; i < count; i++) {
        // Create element div
        const element = document.createElement('div');
        element.className = 'element';

        // Random color gradient background or placeholder image
        const useImage = Math.random() > 0.3; // 70% chance to use placeholder image

        if (useImage) {
            const img = document.createElement('img');
            // Using placehold.co for placeholder images
            const hue = Math.floor(Math.random() * 60) + 320; // Pink/red hues
            img.src = `https://placehold.co/120x160/${colors[i % colors.length].replace('#', '')}/${colors[(i + 5) % colors.length].replace('#', '')}?text=💕`;
            img.alt = `Memory ${i + 1}`;
            img.loading = 'lazy';
            element.appendChild(img);
        } else {
            const colorIndex = i % colors.length;
            element.style.background = `linear-gradient(135deg, ${colors[colorIndex]}, ${colors[(colorIndex + 3) % colors.length]})`;

            const text = document.createElement('span');
            text.className = 'placeholder-text';
            text.innerHTML = ['💕', '💖', '💗', '💝', '❤️'][Math.floor(Math.random() * 5)];
            element.appendChild(text);
        }

        // Click handler for zoom
        element.addEventListener('click', () => {
            const imgSrc = element.querySelector('img')?.src ||
                `https://placehold.co/600x800/FF69B4/ffffff?text=Memory+${i + 1}`;
            openModal(imgSrc);
        });

        // Create CSS3D Object
        const objectCSS = new THREE.CSS3DObject(element);

        // Random initial position (scattered)
        objectCSS.position.x = Math.random() * 4000 - 2000;
        objectCSS.position.y = Math.random() * 4000 - 2000;
        objectCSS.position.z = Math.random() * 4000 - 2000;

        scene.add(objectCSS);
        CSS3DObjects.push(objectCSS);
    }
}

/**
 * Heart Shape Parametric Equation
 * Uses the 3D heart surface equation to position elements
 */
function getHeartPosition(t, s, scale = 500) {
    // Parametric heart equation
    // t: angle around the heart (0 to 2π)
    // s: position along the heart depth (-1 to 1)

    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const z = s * 5 * (1 - Math.abs(Math.sin(t))); // Add depth variation

    return {
        x: x * scale / 16,
        y: -y * scale / 16, // Flip Y to orient heart correctly
        z: z * scale / 5
    };
}

function transformToHeart() {
    const targets = [];
    const count = CSS3DObjects.length;

    // Distribute elements on heart surface
    for (let i = 0; i < count; i++) {
        // Calculate position on heart
        const t = (i / count) * Math.PI * 2; // Angle around heart
        const s = (Math.random() - 0.5) * 2; // Random depth (-1 to 1)

        // Add some randomness to make it look more natural
        const jitter = 50;
        const heartPos = getHeartPosition(t, s, 600);

        targets.push({
            x: heartPos.x + (Math.random() - 0.5) * jitter,
            y: heartPos.y + (Math.random() - 0.5) * jitter,
            z: heartPos.z + (Math.random() - 0.5) * jitter,
            rotationY: Math.random() * Math.PI * 0.5 - Math.PI * 0.25
        });
    }

    // Animate each object to its target position
    CSS3DObjects.forEach((object, index) => {
        const target = targets[index];

        // Position tween
        new TWEEN.Tween(object.position)
            .to({
                x: target.x,
                y: target.y,
                z: target.z
            }, 2000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .delay(index * 20) // Stagger animation
            .start();

        // Rotation tween (face outward)
        new TWEEN.Tween(object.rotation)
            .to({
                x: 0,
                y: target.rotationY,
                z: 0
            }, 2000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .delay(index * 20)
            .start();
    });
}

function onWindowResize() {
    const container = elements.threeContainer;
    if (!container || !camera || !renderer) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function animate() {
    requestAnimationFrame(animate);

    // Update TWEEN animations
    TWEEN.update();

    // Update controls
    if (controls) {
        controls.update();
    }

    // Render
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Format number with leading zero
 */
function padZero(num) {
    return num.toString().padStart(2, '0');
}

/**
 * Debounce function for performance
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==================== EASTER EGG ====================
console.log(`
💝💝💝💝💝💝💝💝💝💝💝💝💝💝💝💝💝
💝                               💝
💝   Happy Valentine's Day!     💝
💝   Made with ❤️ for You       💝
💝                               💝
💝💝💝💝💝💝💝💝💝💝💝💝💝💝💝💝💝

Started: October 22, 2021 at 21:34
Still going strong! 💪💕
`);
