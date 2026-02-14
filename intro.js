/**
 * ==================== INTRO PAGE JS ====================
 * Handles the intro screen with typing animation
 * and redirects to diary.html
 * 3D Starfield background effect
 */

// ==================== DOM ELEMENTS ====================
const elements = {
    introScreen: document.getElementById('intro-screen'),
    typingText: document.getElementById('typing-text'),
    subText: document.getElementById('sub-text'),
    openBtn: document.getElementById('open-btn'),
    starfield3d: document.getElementById('starfield-3d'),
    bgMusic: document.getElementById('bg-music'),
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('💝 Valentine Intro Initialized');

    // Create 3D starfield background (use optimized count)
    const starCount = window.PerfUtils ? window.PerfUtils.getOptimalStarCount(200) : 200;
    create3DStarfield(starCount);

    // Start typing animation
    typeWriter("Hé lô You...", elements.typingText, 100);

    // Setup button click
    elements.openBtn.addEventListener('click', handleOpenClick);
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
    // Use object pool for better performance
    if (window.PerfUtils && window.PerfUtils.ShootingStarPool) {
        const pool = new window.PerfUtils.ShootingStarPool(container, 8);

        setTimeout(() => {
            const sizeRoll = Math.random();
            const size = sizeRoll < 0.25 ? 'small' : sizeRoll > 0.85 ? 'large' : 'normal';
            pool.acquire(size);
        }, 1000);

        setInterval(() => {
            const sizeRoll = Math.random();
            const size = sizeRoll < 0.25 ? 'small' : sizeRoll > 0.85 ? 'large' : 'normal';
            pool.acquire(size);

            if (Math.random() > 0.8) {
                setTimeout(() => pool.acquire('small'), 300);
            }
        }, 2500);

        return;
    }

    // Fallback
    function addShootingStar() {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';

        const sizeRoll = Math.random();
        if (sizeRoll < 0.25) {
            shootingStar.classList.add('small');
        } else if (sizeRoll > 0.85) {
            shootingStar.classList.add('large');
        }

        shootingStar.style.left = Math.random() * 80 + '%';
        shootingStar.style.top = Math.random() * 30 + '%';

        container.appendChild(shootingStar);

        const duration = shootingStar.classList.contains('small') ? 800 :
            shootingStar.classList.contains('large') ? 1500 : 1200;
        setTimeout(() => shootingStar.remove(), duration);
    }

    setTimeout(addShootingStar, 1000);
    setInterval(() => {
        addShootingStar();
        if (Math.random() > 0.7) setTimeout(addShootingStar, 300);
    }, 2000);
}

// ==================== TYPEWRITER EFFECT ====================
function typeWriter(text, element, speed = 100) {
    if (!element) return;

    let index = 0;
    element.textContent = '';

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        } else {
            // Show sub-text after typing
            setTimeout(() => {
                elements.subText.classList.add('visible');
            }, 500);

            // Show button after sub-text
            setTimeout(() => {
                elements.openBtn.classList.add('visible');
            }, 1500);
        }
    }

    setTimeout(type, 800);
}

// ==================== OPEN BUTTON HANDLER ====================
function handleOpenClick() {
    // Play sound effect and haptic
    if (typeof sfx !== 'undefined') sfx.play('success');
    if (typeof Haptic !== 'undefined') Haptic.success();
    
    // Confetti burst on open
    if (typeof Confetti !== 'undefined') {
        Confetti.burst(window.innerWidth / 2, window.innerHeight / 2);
    }
    
    // Try to play music
    if (elements.bgMusic) {
        elements.bgMusic.volume = 0.5;
        elements.bgMusic.play().then(() => {
            // Unlock music_lover achievement
            if (typeof AchievementSystem !== 'undefined') {
                AchievementSystem.unlock('music_lover');
            }
        }).catch(e => console.log('Music autoplay blocked'));

        // Store music state in sessionStorage
        sessionStorage.setItem('musicPlaying', 'true');
    }

    // Fade out intro
    elements.introScreen.classList.add('fade-out');

    // Redirect to diary page after fade
    setTimeout(() => {
        window.location.href = 'diary.html';
    }, 1500);
}

// ==================== EASTER EGG ====================
console.log(`
💝💝💝💝💝💝💝💝💝💝💝💝💝💝💝💝💝
💝                               💝
💝   Happy Valentine's Day!     💝
💝   Made with ❤️ for You       💝
💝                               💝
💝💝💝💝💝💝💝💝💝💝💝💝💝💝💝💝💝
`);
