/**
 * ==================== TIMER PAGE JS ====================
 * Love Timer with count-up and animated stats
 * 3D Starfield background effect
 */

// ==================== CONSTANTS ====================
const LOVE_START_DATE = new Date('2019-10-22T21:34:00');
let timerInterval = null;
let statsAnimated = false;

// ==================== DOM ELEMENTS ====================
const elements = {
    starfield3d: document.getElementById('starfield-3d'),
    timerDays: document.getElementById('timer-days'),
    timerHours: document.getElementById('timer-hours'),
    timerMinutes: document.getElementById('timer-minutes'),
    timerSeconds: document.getElementById('timer-seconds'),
    musicToggle: document.getElementById('music-toggle'),
    bgMusic: document.getElementById('bg-music'),
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('💝 Timer Page Initialized');

    // Create 3D starfield background (use optimized count)
    const starCount = window.PerfUtils ? window.PerfUtils.getOptimalStarCount(200) : 200;
    create3DStarfield(starCount);

    // Start the timer
    startLoveTimer();

    // Animate stats
    setTimeout(() => {
        animateStats();
    }, 500);

    // Setup music
    setupMusic();
    
    // Initialize new features
    initLoveQuote();
    initValentineCountdown();
    
    // Unlock time_keeper achievement
    if (window.achievements) {
        window.achievements.unlock('time_keeper');
    }
});

// ==================== 3D STARFIELD BACKGROUND ====================
function create3DStarfield(count) {
    const container = elements.starfield3d;
    if (!container) return;

    // Create layer containers for parallax effect
    const layerConfigs = [
        { id: 'layer-far', class: 'star-layer-far', count: Math.floor(count * 0.5), depth: 0.1 },
        { id: 'layer-mid', class: 'star-layer-mid', count: Math.floor(count * 0.35), depth: 0.3 },
        { id: 'layer-near', class: 'star-layer-near', count: Math.floor(count * 0.15), depth: 0.6 }
    ];

    const layerElements = [];

    layerConfigs.forEach(config => {
        // Create layer container
        const layer = document.createElement('div');
        layer.className = 'star-layer';
        layer.id = config.id;
        layer.dataset.depth = config.depth;

        // Create stars in this layer
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

    // Setup 3D parallax interaction
    setup3DParallax(container, layerElements);

    // Add shooting stars periodically
    createShootingStars(container);
}

// ==================== 3D PARALLAX INTERACTION ====================
function setup3DParallax(container, layers) {
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let isInteracting = false;

    // Smooth animation loop
    function animate() {
        if (!isInteracting) {
            // Slowly return to center
            targetX *= 0.98;
            targetY *= 0.98;
        }

        // Smooth interpolation
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;

        // Apply parallax to each layer
        layers.forEach(layer => {
            const depth = parseFloat(layer.dataset.depth);
            const moveX = currentX * depth * 100; // Increased from 50
            const moveY = currentY * depth * 100; // Increased from 50
            const rotateX = currentY * depth * 10; // Increased from 5
            const rotateY = -currentX * depth * 10; // Increased from 5

            layer.style.transform = `
                translate3d(${moveX}px, ${moveY}px, 0)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
            `;
        });

        requestAnimationFrame(animate);
    }
    animate();

    // Mouse movement
    container.addEventListener('mousemove', (e) => {
        isInteracting = true;
        const rect = container.getBoundingClientRect();
        targetX = (e.clientX - rect.width / 2) / (rect.width / 2);
        targetY = (e.clientY - rect.height / 2) / (rect.height / 2);
    });

    container.addEventListener('mouseleave', () => {
        isInteracting = false;
    });

    // Touch movement
    let touchStartX = 0;
    let touchStartY = 0;

    container.addEventListener('touchstart', (e) => {
        isInteracting = true;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const deltaX = (touch.clientX - touchStartX) / 50; // More sensitive
        const deltaY = (touch.clientY - touchStartY) / 50; // More sensitive

        targetX = Math.max(-1, Math.min(1, targetX + deltaX * 0.3)); // Increased from 0.1
        targetY = Math.max(-1, Math.min(1, targetY + deltaY * 0.3)); // Increased from 0.1

        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }, { passive: true });

    container.addEventListener('touchend', () => {
        isInteracting = false;
    }, { passive: true });

    // Device orientation (gyroscope)
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (e) => {
            if (e.gamma !== null && e.beta !== null) {
                isInteracting = true;
                // gamma: left/right tilt (-90 to 90)
                // beta: front/back tilt (-180 to 180)
                targetX = Math.max(-1, Math.min(1, e.gamma / 30));
                targetY = Math.max(-1, Math.min(1, (e.beta - 45) / 30));

                // Auto-release after a moment
                clearTimeout(container.gyroTimeout);
                container.gyroTimeout = setTimeout(() => {
                    isInteracting = false;
                }, 100);
            }
        }, { passive: true });
    }
}

// Create shooting stars effect
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

// ==================== TIMER FUNCTIONS ====================
let daysAnimated = false;

function startLoveTimer() {
    // Clear any existing interval
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    // Calculate target days first
    const now = new Date();
    const diff = now - LOVE_START_DATE;
    const targetDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    // Animate days from 0 to current
    if (!daysAnimated && elements.timerDays) {
        daysAnimated = true;
        animateDaysCounter(0, targetDays, 2500);
    }

    // Update hours/minutes/seconds immediately
    updateLoveTimer();

    // Update every second
    timerInterval = setInterval(updateLoveTimer, 1000);
}

// Animate days counter from start to end
function animateDaysCounter(start, end, duration) {
    const startTime = performance.now();
    const range = end - start;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + range * easeOut);

        if (elements.timerDays) {
            elements.timerDays.textContent = current.toLocaleString();
            // Add pulse effect during animation
            if (progress < 1) {
                elements.timerDays.style.transform = `scale(${1 + Math.sin(elapsed * 0.02) * 0.05})`;
            } else {
                elements.timerDays.style.transform = 'scale(1)';
            }
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

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

    // Update DOM
    if (elements.timerDays) {
        elements.timerDays.textContent = days.toLocaleString();
    }
    if (elements.timerHours) {
        elements.timerHours.textContent = padZero(hours);
    }
    if (elements.timerMinutes) {
        elements.timerMinutes.textContent = padZero(minutes);
    }
    if (elements.timerSeconds) {
        elements.timerSeconds.textContent = padZero(seconds);
        elements.timerSeconds.classList.add('tick');
        setTimeout(() => elements.timerSeconds.classList.remove('tick'), 100);
    }
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}

// ==================== STATS ANIMATION ====================
function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;

    const statCards = document.querySelectorAll('.stat-card');

    statCards.forEach((card, index) => {
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

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const range = end - start;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + range * easeOut);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ==================== MUSIC FUNCTIONS ====================
function setupMusic() {
    const wasPlaying = sessionStorage.getItem('musicPlaying') === 'true';

    if (wasPlaying && elements.bgMusic) {
        elements.bgMusic.volume = 0.5;
        elements.bgMusic.play().catch(e => console.log('Music autoplay blocked'));

        if (elements.musicToggle) {
            elements.musicToggle.classList.add('playing');
        }
    }

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

// ==================== GAMIFICATION FEATURES ====================

// Love messages for Card 1
const loveMessages = [
    "Yêu bé nhất 💕",
    "Nhớ ăn uống đầy đủ nha 🍜",
    "Hôm nay em xinh lắm 😍",
    "Nhớ em nhiều lắm 🥺",
    "Em là tất cả của anh 💗",
    "Cảm ơn em đã ở bên anh 🌸",
    "Anh yêu em mỗi ngày 💝",
    "Em ngủ ngon nha 🌙",
    "Mãi bên nhau em nhé 💑",
    "Em là điều tuyệt vời nhất ✨"
];

// Drink messages for Card 3 (Milk Tea)
const drinkMessages = [
    "em thèm trà sữa 🧋",
    "Anh ơi em thèm matcha latte nhật 🍵",
    "Anh em thèm trà nhãn 🫖",
    "Anh em muốn uống ngô gia 🌽",
    "Em không muốn uống sinh tố đâu 🙅‍♀️",
    "Em muốn uống gì đó ghê 🤔",
    "Em đặt trà sữa nhaa 📱",
    "Anh xuống lấy nước cho em 💕",
    "Anh mua koi thé cho em 🥤"
];

// Photo message for Card 4
const photoMessage = "Dung lượng điện thoại để dành cho em không thôi đó tiểu thư à 📸💕";

// Sulking game state
let sulkClickCount = 0;
let sulkTimeout = null;

// Initialize gamification
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initGamification, 1000);
});

function initGamification() {
    // 1. Heart explosion on background click
    const timerSection = document.getElementById('love-timer');
    if (timerSection) {
        timerSection.addEventListener('click', (e) => {
            // Only trigger on background, not on interactive elements
            if (e.target.closest('.stat-card, .nav-link, .timer-container button, a')) return;
            createHeartExplosion(e.clientX, e.clientY);
        });
    }

    // 2. Setup stat cards interactions
    setupStatCardInteractions();
}

// ==================== HEART EXPLOSION EFFECT ====================
function createHeartExplosion(x, y) {
    const hearts = ['💕', '💗', '💖', '💝', '❤️', '💓', '💞', '✨', '🌸'];
    const count = 8 + Math.floor(Math.random() * 5);

    for (let i = 0; i < count; i++) {
        const heart = document.createElement('span');
        heart.className = 'explosion-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

        // Random direction
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const distance = 50 + Math.random() * 100;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance - 50; // Bias upward

        heart.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: ${16 + Math.random() * 16}px;
            pointer-events: none;
            z-index: 9999;
            --tx: ${tx}px;
            --ty: ${ty}px;
            animation: heartExplode 1s ease-out forwards;
        `;

        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
    }
}

// ==================== STAT CARDS INTERACTIONS ====================
function setupStatCardInteractions() {
    const statCards = document.querySelectorAll('.stat-card');

    statCards.forEach((card, index) => {
        card.style.cursor = 'pointer';

        switch (index) {
            case 0: // Messages - Show random love note
                setupMessagesCard(card);
                break;
            case 1: // Sulking - Make up mini-game
                setupSulkingCard(card);
                break;
            case 2: // Milk tea - Fill animation
                setupMilkTeaCard(card);
                break;
            case 3: // Photos - Sparkle effect
                setupPhotosCard(card);
                break;
        }
    });
}

// Card 1: Random love note toast
function setupMessagesCard(card) {
    card.addEventListener('click', (e) => {
        e.stopPropagation();
        const message = loveMessages[Math.floor(Math.random() * loveMessages.length)];
        showToast(card, message);

        // Bounce animation
        card.style.animation = 'none';
        card.offsetHeight; // Trigger reflow
        card.style.animation = 'cardBounce 0.5s ease';
    });
}

function showToast(card, message) {
    // Remove existing toast
    const existingToast = document.querySelector('.love-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'love-toast';
    toast.textContent = message;

    const rect = card.getBoundingClientRect();
    toast.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top - 10}px;
        transform: translate(-50%, -100%);
        background: linear-gradient(135deg, #ff6b95, #ff4d6d);
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        font-family: 'Mali', sans-serif;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 5px 20px rgba(255, 77, 109, 0.4);
        z-index: 10000;
        animation: toastIn 0.3s ease, toastOut 0.3s ease 2s forwards;
        white-space: normal;
        max-width: 280px;
        text-align: center;
    `;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

// Card 2: Sulking mini-game
function setupSulkingCard(card) {
    const icon = card.querySelector('i');
    const label = card.querySelector('.stat-label');
    const numberEl = card.querySelector('.stat-number');

    // Add shake on hover
    card.addEventListener('mouseenter', () => {
        if (!card.classList.contains('happy')) {
            icon.classList.add('shake-angry');
        }
    });

    card.addEventListener('mouseleave', () => {
        icon.classList.remove('shake-angry');
    });

    card.addEventListener('click', (e) => {
        e.stopPropagation();

        if (card.classList.contains('happy')) return;

        sulkClickCount++;

        // Visual feedback
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = 'cardShake 0.3s ease';

        // Show progress
        if (numberEl) {
            numberEl.textContent = `${5 - sulkClickCount}`;
        }

        // Clear existing timeout
        if (sulkTimeout) clearTimeout(sulkTimeout);

        // Check win condition
        if (sulkClickCount >= 5) {
            // Success! Make happy
            card.classList.add('happy');
            icon.className = 'fas fa-face-kiss-wink-heart';
            icon.classList.remove('shake-angry');
            if (label) label.textContent = 'Hết dỗi gòy ❤️';
            if (numberEl) numberEl.textContent = '💕';

            // Celebration effect
            const rect = card.getBoundingClientRect();
            createHeartExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);

            // Reset after 4 seconds
            setTimeout(() => {
                card.classList.remove('happy');
                icon.className = 'fas fa-face-angry';
                if (label) label.textContent = 'Số lần dỗi';
                if (numberEl) numberEl.textContent = '∞';
                sulkClickCount = 0;
            }, 4000);
        } else {
            // Reset if no clicks for 2 seconds
            sulkTimeout = setTimeout(() => {
                sulkClickCount = 0;
                if (numberEl) numberEl.textContent = '∞';
            }, 2000);
        }
    });
}

// Card 3: Milk tea fill animation
function setupMilkTeaCard(card) {
    const icon = card.querySelector('i');
    let isFilling = false;

    card.addEventListener('click', (e) => {
        e.stopPropagation();

        if (isFilling) return;
        isFilling = true;

        // Show random drink message
        const message = drinkMessages[Math.floor(Math.random() * drinkMessages.length)];
        showToast(card, message);

        // Add fill effect
        card.classList.add('filling');
        icon.style.animation = 'teaFill 1.5s ease forwards';

        // Create bubble effects
        for (let i = 0; i < 5; i++) {
            setTimeout(() => createBubble(card), i * 200);
        }

        // Reset after animation
        setTimeout(() => {
            card.classList.remove('filling');
            icon.style.animation = '';
            isFilling = false;
        }, 2000);
    });
}

function createBubble(card) {
    const bubble = document.createElement('span');
    bubble.className = 'tea-bubble';
    bubble.textContent = '🧋';

    const rect = card.getBoundingClientRect();
    bubble.style.cssText = `
        position: fixed;
        left: ${rect.left + Math.random() * rect.width}px;
        top: ${rect.bottom}px;
        font-size: 20px;
        pointer-events: none;
        z-index: 9999;
        animation: bubbleFloat 1s ease-out forwards;
    `;

    document.body.appendChild(bubble);
    setTimeout(() => bubble.remove(), 1000);
}

// Card 4: Photos sparkle effect
function setupPhotosCard(card) {
    card.addEventListener('click', (e) => {
        e.stopPropagation();

        // Show photo message
        showToast(card, photoMessage);

        // Sparkle effect
        const rect = card.getBoundingClientRect();
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                createSparkle(
                    rect.left + Math.random() * rect.width,
                    rect.top + Math.random() * rect.height
                );
            }, i * 50);
        }

        // Bounce
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = 'cardBounce 0.5s ease';
    });
}

function createSparkle(x, y) {
    const sparkle = document.createElement('span');
    sparkle.textContent = '✨';
    sparkle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: ${12 + Math.random() * 12}px;
        pointer-events: none;
        z-index: 9999;
        animation: sparkleEffect 0.8s ease-out forwards;
    `;

    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
}

// ==================== LOVE QUOTE OF THE DAY ====================
function initLoveQuote() {
    const container = document.getElementById('love-quote-container');
    if (!container || !window.LoveQuotes) return;
    
    const quoteEl = window.LoveQuotes.createElement();
    container.appendChild(quoteEl);
}

// ==================== VALENTINE COUNTDOWN ====================
function initValentineCountdown() {
    const container = document.getElementById('valentine-countdown');
    if (!container || !window.CountdownTimer) return;
    
    const nextValentine = window.CountdownTimer.getNextValentine();
    const countdown = new window.CountdownTimer(nextValentine);
    const countdownEl = countdown.createElement();
    container.appendChild(countdownEl);
}
