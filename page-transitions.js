// ==================== PAGE TRANSITIONS - CHUYỂN TRANG MƯỢT ==================== //
// Mobile-first with touch-friendly animations

const PageTransitions = {
    isTransitioning: false,
    transitionType: 'heart', // 'heart', 'fade', 'slide', 'curtain'

    init() {
        // Create transition overlay
        this.createOverlay();
        
        // Bind to all internal links
        this.bindLinks();

        // Handle page load animation
        this.onPageLoad();

        // Preload next pages
        this.preloadPages();
    },

    createOverlay() {
        // Remove existing
        const existing = document.getElementById('page-transition-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'page-transition-overlay';
        overlay.className = 'page-transition-overlay';
        overlay.innerHTML = `
            <div class="transition-content">
                <div class="transition-heart">💝</div>
                <div class="transition-hearts">
                    <span>💕</span><span>💗</span><span>💝</span>
                    <span>💖</span><span>💞</span><span>💕</span>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    },

    bindLinks() {
        document.querySelectorAll('a[href]').forEach(link => {
            // Only internal links
            if (link.hostname === window.location.hostname && 
                !link.hasAttribute('data-no-transition') &&
                !link.target) {
                
                link.addEventListener('click', (e) => {
                    this.navigate(e, link.href);
                });

                // Touch feedback
                link.addEventListener('touchstart', () => {
                    if (window.Haptic) window.Haptic.light();
                }, { passive: true });
            }
        });
    },

    navigate(e, href) {
        if (this.isTransitioning) return;
        e.preventDefault();

        this.isTransitioning = true;

        // Sound
        if (window.sfx) window.sfx.play('whoosh');

        // Haptic
        if (window.Haptic) window.Haptic.medium();

        // Get overlay
        const overlay = document.getElementById('page-transition-overlay');
        if (!overlay) {
            window.location.href = href;
            return;
        }

        // Apply transition type
        overlay.className = `page-transition-overlay transition-${this.transitionType}`;
        
        // Start exit animation
        requestAnimationFrame(() => {
            overlay.classList.add('active');
            document.body.classList.add('page-exiting');
        });

        // Navigate after animation
        setTimeout(() => {
            // Store that we're in transition for next page
            sessionStorage.setItem('pageTransition', 'true');
            sessionStorage.setItem('transitionType', this.transitionType);
            window.location.href = href;
        }, 500);
    },

    onPageLoad() {
        const wasTransition = sessionStorage.getItem('pageTransition');
        
        if (wasTransition) {
            sessionStorage.removeItem('pageTransition');
            const type = sessionStorage.getItem('transitionType') || 'heart';
            
            // Show overlay initially
            const overlay = document.getElementById('page-transition-overlay');
            if (overlay) {
                overlay.className = `page-transition-overlay transition-${type} active entering`;
                
                // Fade out
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        overlay.classList.remove('active');
                        overlay.classList.add('exit');
                        
                        setTimeout(() => {
                            overlay.classList.remove('entering', 'exit');
                            document.body.classList.remove('page-exiting');
                        }, 500);
                    }, 100);
                });
            }
        }

        // Page entrance animation
        document.body.classList.add('page-loaded');
    },

    preloadPages() {
        // Preload common navigation pages
        const pages = ['diary.html', 'timer.html', 'gallery.html', 'finale.html'];
        
        pages.forEach(page => {
            if (!window.location.pathname.includes(page)) {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = page;
                document.head.appendChild(link);
            }
        });
    },

    // Change transition style
    setType(type) {
        this.transitionType = type;
    }
};

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    PageTransitions.init();
});

window.PageTransitions = PageTransitions;
