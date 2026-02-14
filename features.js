/**
 * ==================== ADVANCED FEATURES ====================
 * Confetti, Achievements, Love Quotes, Countdown
 * Image Preloader, Page Transitions, Like Animation
 */

// ==================== CONFETTI SYSTEM ====================
class Confetti {
    constructor() {
        this.colors = ['#ff1493', '#ff69b4', '#ffb6c1', '#ffd700', '#ff6b6b', '#ffffff'];
        this.shapes = ['circle', 'square', 'heart'];
    }
    
    // Create a single confetti piece
    createPiece(x, y) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        const shape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
        const size = Math.random() * 10 + 5;
        
        piece.style.left = x + 'px';
        piece.style.top = y + 'px';
        piece.style.width = size + 'px';
        piece.style.height = size + 'px';
        piece.style.background = color;
        
        if (shape === 'circle') {
            piece.style.borderRadius = '50%';
        } else if (shape === 'heart') {
            piece.innerHTML = '❤️';
            piece.style.background = 'transparent';
            piece.style.fontSize = size + 'px';
        }
        
        // Random rotation and position offset
        const angle = Math.random() * 360;
        const spreadX = (Math.random() - 0.5) * 200;
        piece.style.setProperty('--angle', angle + 'deg');
        piece.style.transform = `translateX(${spreadX}px)`;
        piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        document.body.appendChild(piece);
        
        // Remove after animation
        setTimeout(() => piece.remove(), 4000);
    }
    
    // Burst confetti from a point
    burst(x, y, count = 30) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => this.createPiece(x, y), i * 20);
        }
        
        // Play sound and haptic
        if (window.sfx) sfx.play('success');
        if (window.Haptic) Haptic.success();
    }
    
    // Full screen celebration
    celebrate() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 3;
        this.burst(centerX, centerY, 50);
        
        // Multiple bursts
        setTimeout(() => this.burst(centerX - 200, centerY, 30), 200);
        setTimeout(() => this.burst(centerX + 200, centerY, 30), 400);
    }
}

// ==================== ACHIEVEMENTS SYSTEM ====================
class AchievementSystem {
    constructor() {
        this.achievements = {
            'first_visit': { icon: '🎉', title: 'Chào Mừng!', desc: 'Lần đầu ghé thăm' },
            'music_lover': { icon: '🎵', title: 'Melomane', desc: 'Bật nhạc nghe cùng' },
            'page_turner': { icon: '📖', title: 'Đam Mê Sách', desc: 'Lật hết 13 trang' },
            'explorer': { icon: '🗺️', title: 'Nhà Thám Hiểm', desc: 'Ghé thăm tất cả trang' },
            'photo_lover': { icon: '📸', title: 'Nhiếp Ảnh Gia', desc: 'Xem 10 ảnh gallery' },
            'time_keeper': { icon: '⏰', title: 'Thời Gian', desc: 'Xem trang Timer' },
            'romantic': { icon: '💕', title: 'Người Lãng Mạn', desc: 'Đọc hết finale' },
            'milestone_100': { icon: '💯', title: '100 Ngày', desc: 'Yêu nhau 100 ngày' },
            'milestone_365': { icon: '🎂', title: '1 Năm', desc: 'Yêu nhau 1 năm' },
            'milestone_1000': { icon: '🏆', title: '1000 Ngày', desc: 'Yêu nhau 1000 ngày' },
            'secret_finder': { icon: '🔮', title: 'Bí Mật', desc: 'Tìm thấy bí mật' },
            'clicker': { icon: '👆', title: 'Click Master', desc: 'Click 100 lần' }
        };
        
        this.unlocked = JSON.parse(localStorage.getItem('achievements') || '[]');
        this.clickCount = parseInt(localStorage.getItem('clickCount') || '0');
        
        this.trackClicks();
    }
    
    // Track clicks for achievement
    trackClicks() {
        document.addEventListener('click', () => {
            this.clickCount++;
            localStorage.setItem('clickCount', this.clickCount.toString());
            
            if (this.clickCount >= 100) {
                this.unlock('clicker');
            }
        });
    }
    
    // Unlock an achievement
    unlock(id) {
        if (this.unlocked.includes(id)) return;
        if (!this.achievements[id]) return;
        
        this.unlocked.push(id);
        localStorage.setItem('achievements', JSON.stringify(this.unlocked));
        
        // Notification disabled
        // this.showNotification(this.achievements[id]);
    }
    
    // Show achievement notification
    showNotification(achievement) {
        const existing = document.querySelector('.achievement');
        if (existing) existing.remove();
        
        const el = document.createElement('div');
        el.className = 'achievement';
        el.innerHTML = `
            <span class="achievement-icon">${achievement.icon}</span>
            <div class="achievement-text">
                <h4>Achievement Unlocked!</h4>
                <p>${achievement.desc}</p>
            </div>
        `;
        
        document.body.appendChild(el);
        
        // Play effects
        if (window.sfx) sfx.play('success');
        if (window.Haptic) Haptic.notification();
        
        // Remove after animation
        setTimeout(() => el.remove(), 4500);
    }
    
    // Check and unlock based on milestone
    checkMilestone(days) {
        if (days >= 100) this.unlock('milestone_100');
        if (days >= 365) this.unlock('milestone_365');
        if (days >= 1000) this.unlock('milestone_1000');
    }
    
    // Get all unlocked
    getUnlocked() {
        return this.unlocked.map(id => ({
            id,
            ...this.achievements[id]
        }));
    }
    
    // Get progress
    getProgress() {
        return {
            unlocked: this.unlocked.length,
            total: Object.keys(this.achievements).length,
            percent: Math.round(this.unlocked.length / Object.keys(this.achievements).length * 100)
        };
    }
}

// ==================== LOVE QUOTES ====================
const LoveQuotes = {
    quotes: [
        { text: "Em là điều tuyệt vời nhất đến với anh.", author: "Anh" },
        { text: "Mỗi khoảnh khắc bên em đều là kỷ niệm đẹp.", author: "💕" },
        { text: "Yêu em không cần lý do.", author: "❤️" },
        { text: "Bên em, thời gian như ngừng trôi.", author: "Anh" },
        { text: "Em là nơi bình yên của anh.", author: "💗" },
        { text: "Cảm ơn em đã đến bên anh.", author: "Anh" },
        { text: "Mãi mãi là bao lâu? Là khi nào anh còn yêu em.", author: "💖" },
        { text: "Em khiến mỗi ngày của anh đều đặc biệt.", author: "Anh" },
        { text: "Hạnh phúc là được bên em.", author: "💕" },
        { text: "Anh yêu em, hôm qua, hôm nay và mãi mãi.", author: "❤️" },
        { text: "Em là câu trả lời cho mọi câu hỏi của anh.", author: "Anh" },
        { text: "Trái tim anh chỉ đập vì em.", author: "💗" },
        { text: "Em là giấc mơ đẹp nhất mà anh không muốn tỉnh.", author: "Anh" },
        { text: "Yêu em là hành trình đẹp nhất.", author: "💖" },
        { text: "Em là điều kỳ diệu.", author: "Anh" }
    ],
    
    // Get random quote
    random() {
        return this.quotes[Math.floor(Math.random() * this.quotes.length)];
    },
    
    // Get quote of the day (same quote for the whole day)
    ofTheDay() {
        const today = new Date().toDateString();
        const storedDate = localStorage.getItem('quoteDate');
        const storedIndex = localStorage.getItem('quoteIndex');
        
        if (storedDate === today && storedIndex) {
            return this.quotes[parseInt(storedIndex)];
        }
        
        const index = Math.floor(Math.random() * this.quotes.length);
        localStorage.setItem('quoteDate', today);
        localStorage.setItem('quoteIndex', index.toString());
        
        return this.quotes[index];
    },
    
    // Create quote element
    createElement() {
        const quote = this.ofTheDay();
        const el = document.createElement('div');
        el.className = 'quote-box blur-in';
        el.innerHTML = `
            <p>${quote.text}</p>
            <footer>— ${quote.author}</footer>
        `;
        return el;
    }
};

// ==================== COUNTDOWN TIMER ====================
class CountdownTimer {
    constructor(targetDate) {
        this.targetDate = new Date(targetDate);
        this.callbacks = [];
    }
    
    // Calculate time remaining
    getRemaining() {
        const now = new Date();
        const diff = this.targetDate - now;
        
        if (diff <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
        }
        
        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60),
            isComplete: false
        };
    }
    
    // Start countdown
    start(callback) {
        if (callback) this.callbacks.push(callback);
        
        const update = () => {
            const remaining = this.getRemaining();
            this.callbacks.forEach(cb => cb(remaining));
            
            if (!remaining.isComplete) {
                setTimeout(update, 1000);
            }
        };
        
        update();
    }
    
    // Create countdown element
    createElement() {
        const el = document.createElement('div');
        el.className = 'countdown-container';
        el.style.display = 'flex';
        el.style.gap = '15px';
        el.style.justifyContent = 'center';
        el.style.marginTop = '20px';
        
        el.innerHTML = `
            <div class="countdown-unit glass-card">
                <span class="countdown-value" id="cd-days">--</span>
                <span class="countdown-label">Ngày</span>
            </div>
            <div class="countdown-unit glass-card">
                <span class="countdown-value" id="cd-hours">--</span>
                <span class="countdown-label">Giờ</span>
            </div>
            <div class="countdown-unit glass-card">
                <span class="countdown-value" id="cd-minutes">--</span>
                <span class="countdown-label">Phút</span>
            </div>
            <div class="countdown-unit glass-card">
                <span class="countdown-value" id="cd-seconds">--</span>
                <span class="countdown-label">Giây</span>
            </div>
        `;
        
        // Start updating
        this.start((remaining) => {
            el.querySelector('#cd-days').textContent = remaining.days;
            el.querySelector('#cd-hours').textContent = String(remaining.hours).padStart(2, '0');
            el.querySelector('#cd-minutes').textContent = String(remaining.minutes).padStart(2, '0');
            el.querySelector('#cd-seconds').textContent = String(remaining.seconds).padStart(2, '0');
        });
        
        return el;
    }
    
    // Get next Valentine's Day
    static getNextValentine() {
        const now = new Date();
        let year = now.getFullYear();
        let valentine = new Date(year, 1, 14); // Feb 14
        
        if (now > valentine) {
            valentine = new Date(year + 1, 1, 14);
        }
        
        return valentine;
    }
    
    // Get next anniversary (based on start date)
    static getNextAnniversary(startDate) {
        const start = new Date(startDate);
        const now = new Date();
        let year = now.getFullYear();
        
        let anniversary = new Date(year, start.getMonth(), start.getDate());
        
        if (now > anniversary) {
            anniversary = new Date(year + 1, start.getMonth(), start.getDate());
        }
        
        return anniversary;
    }
}

// ==================== LIKE ANIMATION ====================
function createLikeHeart(x, y) {
    const heart = document.createElement('span');
    heart.className = 'like-heart';
    heart.textContent = '❤️';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    
    document.body.appendChild(heart);
    
    if (window.sfx) sfx.play('pop');
    if (window.Haptic) Haptic.light();
    
    setTimeout(() => heart.remove(), 800);
}

// ==================== PAGE TRANSITIONS ====================
const PageTransition = {
    // Fade out current page and navigate
    navigateTo(url) {
        document.body.classList.add('page-exit');
        
        if (window.sfx) sfx.play('whoosh');
        
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    },
    
    // Initialize page enter animation
    init() {
        document.body.classList.add('page-enter');
        
        // Track page visits for achievement
        const pages = JSON.parse(sessionStorage.getItem('visitedPages') || '[]');
        const currentPage = window.location.pathname;
        
        if (!pages.includes(currentPage)) {
            pages.push(currentPage);
            sessionStorage.setItem('visitedPages', JSON.stringify(pages));
            
            // Check explorer achievement
            if (pages.length >= 5 && window.achievements) {
                window.achievements.unlock('explorer');
            }
        }
    }
};

// ==================== IMAGE PRELOADER ====================
class ImagePreloader {
    constructor() {
        this.queue = [];
        this.loading = 0;
        this.maxConcurrent = 3;
        this.loaded = new Set();
    }
    
    // Add image to queue
    add(src, priority = 0) {
        if (this.loaded.has(src)) return Promise.resolve();
        
        return new Promise((resolve, reject) => {
            this.queue.push({ src, priority, resolve, reject });
            this.queue.sort((a, b) => b.priority - a.priority);
            this.processQueue();
        });
    }
    
    // Add multiple images
    addAll(sources, priority = 0) {
        return Promise.all(sources.map(src => this.add(src, priority)));
    }
    
    // Process queue
    processQueue() {
        while (this.loading < this.maxConcurrent && this.queue.length > 0) {
            const item = this.queue.shift();
            this.loading++;
            
            const img = new Image();
            
            img.onload = () => {
                this.loading--;
                this.loaded.add(item.src);
                item.resolve(img);
                this.processQueue();
            };
            
            img.onerror = () => {
                this.loading--;
                item.reject(new Error(`Failed to load: ${item.src}`));
                this.processQueue();
            };
            
            img.src = item.src;
        }
    }
}

// ==================== TYPING EFFECT ====================
function typeWriter(element, text, speed = 50, callback) {
    element.textContent = '';
    element.classList.add('typing-cursor');
    
    let index = 0;
    
    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            
            // Play subtle sound occasionally
            if (index % 3 === 0 && window.sfx) {
                // sfx.play('click'); // Can be too noisy
            }
            
            setTimeout(type, speed);
        } else {
            element.classList.remove('typing-cursor');
            if (callback) callback();
        }
    }
    
    type();
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize page transition
    PageTransition.init();
    
    // First visit achievement
    if (!localStorage.getItem('hasVisited')) {
        localStorage.setItem('hasVisited', 'true');
        setTimeout(() => {
            if (window.achievements) achievements.unlock('first_visit');
        }, 1000);
    }
    
    console.log('✨ Advanced features loaded');
});

// ==================== EXPORTS ====================
window.Confetti = new Confetti();
window.achievements = new AchievementSystem();
window.LoveQuotes = LoveQuotes;
window.CountdownTimer = CountdownTimer;
window.createLikeHeart = createLikeHeart;
window.PageTransition = PageTransition;
window.ImagePreloader = new ImagePreloader();
window.typeWriter = typeWriter;

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('✅ Service Worker registered'))
        .catch(err => console.log('⚠️ SW registration failed:', err));
}
