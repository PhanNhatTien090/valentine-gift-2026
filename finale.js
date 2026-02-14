// ==================== FINALE.JS - Final Message Page ==================== //
// 3D Starfield background effect

document.addEventListener('DOMContentLoaded', function () {
    // ==================== 3D STARFIELD BACKGROUND ====================
    const starCount = window.PerfUtils ? window.PerfUtils.getOptimalStarCount(200) : 200;
    create3DStarfield(starCount);
    createSparkles();

    // ==================== MUSIC CONTROL ====================
    initMusicControl();

    // ==================== ANIMATIONS ====================
    initMessageAnimations();
    initPromiseAnimations();

    // ==================== CONFETTI ====================
    initConfetti();

    // ==================== REPLAY BUTTON ====================
    initReplayButton();
    
    // ==================== NEW FEATURES ====================
    initSecretMessage();
    
    // Unlock romantic achievement
    if (window.achievements) {
        window.achievements.unlock('romantic');
    }
    
    // Celebrate with confetti and haptic
    setTimeout(() => {
        if (window.Confetti) {
            window.Confetti.celebrate();
        }
        if (window.Haptic) {
            window.Haptic.heartbeat();
        }
    }, 1500);
});

// ==================== 3D STARFIELD BACKGROUND ====================
function create3DStarfield(count) {
    const container = document.getElementById('starfield-3d');
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

// ==================== CREATE SPARKLES ====================
function createSparkles() {
    const container = document.getElementById('sparkles-container');
    if (!container) return;

    setInterval(() => {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.textContent = '✨';
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.fontSize = `${Math.random() * 15 + 10}px`;
        container.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 2000);
    }, 300);
}

// ==================== MUSIC CONTROL ====================
function initMusicControl() {
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');

    if (!bgMusic || !musicToggle) return;

    // Check if music was playing from previous page
    if (sessionStorage.getItem('musicPlaying') === 'true') {
        bgMusic.play().catch(e => console.log('Autoplay prevented'));
        musicToggle.classList.add('playing');
    }

    musicToggle.addEventListener('click', function () {
        if (bgMusic.paused) {
            bgMusic.play();
            this.classList.add('playing');
            sessionStorage.setItem('musicPlaying', 'true');
        } else {
            bgMusic.pause();
            this.classList.remove('playing');
            sessionStorage.setItem('musicPlaying', 'false');
        }
    });
}

// ==================== MESSAGE ANIMATIONS ====================
function initMessageAnimations() {
    const messageLines = document.querySelectorAll('.message-line');

    messageLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transform = 'translateY(20px)';

        setTimeout(() => {
            line.style.transition = 'all 0.8s ease';
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
        }, 500 + index * 800);
    });

    // Signature animation
    const signature = document.querySelector('.finale-signature');
    if (signature) {
        signature.style.opacity = '0';
        signature.style.transform = 'scale(0.8)';

        setTimeout(() => {
            signature.style.transition = 'all 1s ease';
            signature.style.opacity = '1';
            signature.style.transform = 'scale(1)';
        }, 500 + messageLines.length * 800 + 500);
    }
}

// ==================== PROMISE ANIMATIONS ====================
function initPromiseAnimations() {
    const promiseItems = document.querySelectorAll('.promise-item');

    promiseItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';

        setTimeout(() => {
            item.style.transition = 'all 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 4000 + index * 400);
    });
}

// ==================== CONFETTI ====================
function initConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiColors = ['#FF69B4', '#FF1493', '#FFB6C1', '#FF6B6B', '#DDA0DD', '#FFC0CB'];
    const confettiPieces = [];

    class ConfettiPiece {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = -20;
            this.size = Math.random() * 10 + 5;
            this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            this.speedY = Math.random() * 3 + 2;
            this.speedX = Math.random() * 4 - 2;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 10 - 5;
            this.shape = Math.random() > 0.5 ? 'heart' : 'rect';
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;

            if (this.y > canvas.height) {
                this.y = -20;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;

            if (this.shape === 'heart') {
                this.drawHeart();
            } else {
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
            }

            ctx.restore();
        }

        drawHeart() {
            const size = this.size / 2;
            ctx.beginPath();
            ctx.moveTo(0, size / 4);
            ctx.bezierCurveTo(-size / 2, -size / 2, -size, size / 4, 0, size);
            ctx.bezierCurveTo(size, size / 4, size / 2, -size / 2, 0, size / 4);
            ctx.fill();
        }
    }

    // Create confetti pieces
    for (let i = 0; i < 50; i++) {
        confettiPieces.push(new ConfettiPiece());
    }

    // Start confetti after message animations
    setTimeout(() => {
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            confettiPieces.forEach(piece => {
                piece.update();
                piece.draw();
            });

            requestAnimationFrame(animate);
        }

        animate();
    }, 3000);

    // Handle resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ==================== REPLAY BUTTON ====================
function initReplayButton() {
    const replayBtn = document.getElementById('replay-btn');

    if (replayBtn) {
        replayBtn.addEventListener('click', () => {
            sessionStorage.removeItem('musicPlaying');
            window.location.href = 'index.html';
            
            // Sound effect
            if (window.sfx) window.sfx.play('whoosh');
        });
    }
}

// ==================== SECRET MESSAGE ====================
function initSecretMessage() {
    let clickCount = 0;
    const requiredClicks = 7;
    const finaleContent = document.querySelector('.finale-content');
    
    if (!finaleContent) return;
    
    // Add secret trigger area (the heart decoration)
    const heartIcon = finaleContent.querySelector('.heart-decoration') || 
                      finaleContent.querySelector('.finale-title');
    
    if (!heartIcon) return;
    
    heartIcon.style.cursor = 'pointer';
    
    heartIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        clickCount++;
        
        // Haptic feedback
        if (window.Haptic) window.Haptic.light();
        
        // Visual feedback
        heartIcon.style.transform = `scale(${1 + clickCount * 0.05})`;
        
        if (clickCount >= requiredClicks) {
            showSecretMessage();
            clickCount = 0;
            heartIcon.style.transform = '';
            
            // Unlock achievement
            if (window.achievements) {
                window.achievements.unlock('secret_finder');
            }
        }
        
        // Reset after 2 seconds of no clicks
        clearTimeout(heartIcon.secretTimeout);
        heartIcon.secretTimeout = setTimeout(() => {
            clickCount = 0;
            heartIcon.style.transform = '';
        }, 2000);
    });
}

function showSecretMessage() {
    // Check if already showing
    if (document.querySelector('.secret-message-overlay')) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'secret-message-overlay';
    overlay.innerHTML = `
        <div class="secret-message-box glass-card scale-pop">
            <div class="secret-icon">🔮</div>
            <h3>Bí Mật Nhỏ Của Anh</h3>
            <p class="secret-text">
                "Em à, mỗi ngày trôi qua anh đều cảm thấy may mắn vì có em bên cạnh.
                Đây là bí mật nhỏ mà anh giấu ở đây — chỉ em mới tìm thấy được.
                Anh yêu em nhiều lắm! 💕"
            </p>
            <button class="secret-close glow-btn">Đóng 💝</button>
        </div>
    `;
    
    // Styles
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
    `;
    
    const box = overlay.querySelector('.secret-message-box');
    box.style.cssText = `
        max-width: 400px;
        padding: 30px;
        text-align: center;
        color: white;
    `;
    
    overlay.querySelector('.secret-icon').style.cssText = `
        font-size: 50px;
        margin-bottom: 15px;
        animation: float 2s ease-in-out infinite;
    `;
    
    overlay.querySelector('h3').style.cssText = `
        color: #ff69b4;
        margin-bottom: 15px;
        font-size: 1.5rem;
    `;
    
    overlay.querySelector('.secret-text').style.cssText = `
        line-height: 1.8;
        margin-bottom: 20px;
        font-style: italic;
    `;
    
    document.body.appendChild(overlay);
    
    // Sound and haptic
    if (window.sfx) window.sfx.play('sparkle');
    if (window.Haptic) window.Haptic.success();
    if (window.Confetti) window.Confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 40);
    
    // Close button
    overlay.querySelector('.secret-close').addEventListener('click', () => {
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s ease';
        setTimeout(() => overlay.remove(), 300);
    });
    
    // Click outside to close
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.3s ease';
            setTimeout(() => overlay.remove(), 300);
        }
    });
}
