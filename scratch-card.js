// ==================== SCRATCH CARD - CÀO THẺ BÍ MẬT ==================== //
// Mobile-first design with touch support

const ScratchCard = {
    canvas: null,
    ctx: null,
    isRevealed: false,
    isDrawing: false,
    revealThreshold: 45, // Percent to reveal
    lastX: 0,
    lastY: 0,

    // Default config
    config: {
        width: 280,
        height: 180,
        brushSize: 35,
        coverColor: '#ff1493',
        sparkleCount: 30,
        message: '💝 Anh yêu em! 💝',
        revealImage: null
    },

    init(containerId, customConfig = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Merge config
        this.config = { ...this.config, ...customConfig };

        // Create structure
        container.innerHTML = `
            <div class="scratch-card-wrapper">
                <div class="scratch-card-reveal">
                    ${this.config.revealImage 
                        ? `<img src="${this.config.revealImage}" alt="Secret" class="scratch-reveal-img">`
                        : ''
                    }
                    <p class="scratch-message">${this.config.message}</p>
                </div>
                <canvas class="scratch-canvas" 
                    width="${this.config.width}" 
                    height="${this.config.height}">
                </canvas>
                <p class="scratch-hint">👆 Chạm và kéo để cào</p>
            </div>
        `;

        this.canvas = container.querySelector('.scratch-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.drawCover();
        this.bindEvents();
    },

    drawCover() {
        const { width, height, coverColor, sparkleCount } = this.config;
        
        // Gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#ff1493');
        gradient.addColorStop(0.5, '#ff69b4');
        gradient.addColorStop(1, '#ff1493');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, height);

        // Add border
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(5, 5, width - 10, height - 10);

        // Sparkles
        for (let i = 0; i < sparkleCount; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 4 + 1;
            const alpha = Math.random() * 0.6 + 0.2;

            this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Hearts decoration
        this.ctx.font = '20px serif';
        this.ctx.textAlign = 'center';
        ['💕', '✨', '💖', '✨', '💕'].forEach((emoji, i) => {
            this.ctx.fillText(emoji, (width / 6) * (i + 1), 25);
            this.ctx.fillText(emoji, (width / 6) * (i + 1), height - 10);
        });

        // Main text
        this.ctx.font = 'bold 18px Mali, sans-serif';
        this.ctx.fillStyle = '#fff';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.ctx.shadowBlur = 4;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🎁 Cào để mở quà 🎁', width / 2, height / 2 - 10);
        
        this.ctx.font = '14px Mali, sans-serif';
        this.ctx.fillText('Chạm và kéo nhẹ nhàng', width / 2, height / 2 + 15);
        
        this.ctx.shadowBlur = 0;
    },

    bindEvents() {
        // Touch events (mobile-first)
        this.canvas.addEventListener('touchstart', (e) => this.startDrawing(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => this.draw(e), { passive: false });
        this.canvas.addEventListener('touchend', () => this.stopDrawing());

        // Mouse events (desktop fallback)
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseleave', () => this.stopDrawing());
    },

    getPosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        if (e.touches && e.touches[0]) {
            return {
                x: (e.touches[0].clientX - rect.left) * scaleX,
                y: (e.touches[0].clientY - rect.top) * scaleY
            };
        }
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    },

    startDrawing(e) {
        if (this.isRevealed) return;
        e.preventDefault();
        
        this.isDrawing = true;
        const pos = this.getPosition(e);
        this.lastX = pos.x;
        this.lastY = pos.y;

        // Haptic feedback
        if (window.Haptic) window.Haptic.light();
    },

    draw(e) {
        if (!this.isDrawing || this.isRevealed) return;
        e.preventDefault();

        const pos = this.getPosition(e);
        
        // Erase with smooth line
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.lineWidth = this.config.brushSize;

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();

        this.lastX = pos.x;
        this.lastY = pos.y;

        // Check reveal percentage
        this.checkReveal();
    },

    stopDrawing() {
        this.isDrawing = false;
    },

    checkReveal() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const pixels = imageData.data;
        let transparent = 0;
        const total = this.canvas.width * this.canvas.height;

        // Check alpha channel (every 4th value)
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) transparent++;
        }

        const percent = (transparent / total) * 100;

        if (percent >= this.revealThreshold && !this.isRevealed) {
            this.reveal();
        }
    },

    reveal() {
        this.isRevealed = true;

        // Sound & haptic
        if (window.sfx) window.sfx.play('success');
        if (window.Haptic) window.Haptic.success();

        // Confetti burst
        if (window.Confetti) {
            const rect = this.canvas.getBoundingClientRect();
            Confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }

        // Fade out canvas
        this.canvas.style.transition = 'opacity 0.5s ease';
        this.canvas.style.opacity = '0';

        // Hide hint
        const hint = this.canvas.parentElement.querySelector('.scratch-hint');
        if (hint) hint.style.display = 'none';

        // Show reveal content
        const reveal = this.canvas.parentElement.querySelector('.scratch-card-reveal');
        if (reveal) {
            reveal.classList.add('revealed');
        }

        // Achievement
        if (window.AchievementSystem) {
            AchievementSystem.unlock('secret_finder');
        }

        // Custom callback
        if (this.config.onReveal) {
            this.config.onReveal();
        }
    },

    // Reset for replay
    reset() {
        this.isRevealed = false;
        this.canvas.style.opacity = '1';
        this.ctx.globalCompositeOperation = 'source-over';
        this.drawCover();

        const reveal = this.canvas.parentElement.querySelector('.scratch-card-reveal');
        if (reveal) reveal.classList.remove('revealed');

        const hint = this.canvas.parentElement.querySelector('.scratch-hint');
        if (hint) hint.style.display = 'block';
    }
};

// Auto-init if container exists
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('scratch-card-container');
    if (container) {
        ScratchCard.init('scratch-card-container');
    }
});

window.ScratchCard = ScratchCard;
