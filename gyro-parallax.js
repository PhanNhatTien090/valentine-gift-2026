// ==================== GYRO PARALLAX - DEVICE TILT INTERACTION ==================== //
// Optimized for landscape mode on iOS and Android
// No touch gestures - only device orientation

const GyroParallax = {
    isSupported: false,
    isPermissionGranted: false,
    isLandscape: false,
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    layers: [],
    rafId: null,
    sensitivity: 25, // Lower = more sensitive

    init(container, layerElements) {
        if (!container || !layerElements.length) return;

        this.container = container;
        this.layers = layerElements;
        this.checkOrientation();

        // Start animation loop
        this.startAnimation();

        // Check device orientation support
        if (window.DeviceOrientationEvent) {
            this.isSupported = true;

            // iOS 13+ requires permission
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                this.setupIOSPermission();
            } else {
                // Android and older iOS - just add listener
                this.addOrientationListener();
                this.isPermissionGranted = true;
            }
        }

        // Listen for orientation changes
        window.addEventListener('orientationchange', () => this.checkOrientation());
        window.addEventListener('resize', () => this.checkOrientation());

        // Fallback: Mouse for desktop
        this.setupMouseFallback();

        console.log('📱 Gyro Parallax initialized');
    },

    checkOrientation() {
        // Check if landscape
        const isLandscapeNow = window.innerWidth > window.innerHeight;
        
        // Also check screen orientation API
        if (screen.orientation) {
            this.isLandscape = screen.orientation.type.includes('landscape');
        } else {
            this.isLandscape = isLandscapeNow;
        }

        // For iOS window.orientation
        if (typeof window.orientation !== 'undefined') {
            this.isLandscape = Math.abs(window.orientation) === 90;
            this.orientationAngle = window.orientation; // 90 or -90
        } else {
            this.orientationAngle = this.isLandscape ? 90 : 0;
        }
    },

    setupIOSPermission() {
        // Create permission request button (one-time)
        const existingBtn = document.getElementById('gyro-permission-btn');
        if (existingBtn) return;

        // Auto-request on first tap anywhere
        const requestOnTap = async (e) => {
            try {
                const permission = await DeviceOrientationEvent.requestPermission();
                if (permission === 'granted') {
                    this.isPermissionGranted = true;
                    this.addOrientationListener();
                    console.log('✅ Gyro permission granted');
                }
            } catch (err) {
                console.log('⚠️ Gyro permission error:', err);
            }
            document.removeEventListener('touchstart', requestOnTap);
            document.removeEventListener('click', requestOnTap);
        };

        document.addEventListener('touchstart', requestOnTap, { once: true, passive: true });
        document.addEventListener('click', requestOnTap, { once: true });
    },

    addOrientationListener() {
        window.addEventListener('deviceorientation', (e) => this.handleOrientation(e), { passive: true });
    },

    handleOrientation(e) {
        if (e.gamma === null || e.beta === null) return;

        let x, y;

        if (this.isLandscape) {
            // Landscape mode - swap and adjust axes based on rotation direction
            if (this.orientationAngle === 90 || this.orientationAngle === -90) {
                // Landscape left (home button on right) or landscape right
                if (this.orientationAngle === 90) {
                    // Landscape left - rotate clockwise
                    x = e.beta / this.sensitivity;
                    y = -e.gamma / this.sensitivity;
                } else {
                    // Landscape right - rotate counter-clockwise
                    x = -e.beta / this.sensitivity;
                    y = e.gamma / this.sensitivity;
                }
            } else {
                // Fallback based on window dimensions
                x = e.beta / this.sensitivity;
                y = -e.gamma / this.sensitivity;
            }
        } else {
            // Portrait mode (standard)
            x = e.gamma / this.sensitivity;
            y = (e.beta - 45) / this.sensitivity;
        }

        // Clamp values
        this.targetX = Math.max(-1, Math.min(1, x));
        this.targetY = Math.max(-1, Math.min(1, y));
    },

    setupMouseFallback() {
        // Desktop mouse fallback
        if (!('ontouchstart' in window)) {
            this.container.addEventListener('mousemove', (e) => {
                const rect = this.container.getBoundingClientRect();
                this.targetX = (e.clientX - rect.width / 2) / (rect.width / 2);
                this.targetY = (e.clientY - rect.height / 2) / (rect.height / 2);
            });

            this.container.addEventListener('mouseleave', () => {
                // Slowly return to center
                this.targetX *= 0.5;
                this.targetY *= 0.5;
            });
        }
    },

    startAnimation() {
        const animate = () => {
            // Smooth interpolation
            this.currentX += (this.targetX - this.currentX) * 0.06;
            this.currentY += (this.targetY - this.currentY) * 0.06;

            // Apply to layers
            this.layers.forEach(layer => {
                const depth = parseFloat(layer.dataset.depth) || 0.1;
                const moveX = this.currentX * depth * 80;
                const moveY = this.currentY * depth * 80;
                const rotateX = this.currentY * depth * 8;
                const rotateY = -this.currentX * depth * 8;

                layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            this.rafId = requestAnimationFrame(animate);
        };

        animate();
    },

    // Pause when not visible
    pause() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    },

    // Resume
    resume() {
        if (!this.rafId) {
            this.startAnimation();
        }
    },

    // Destroy
    destroy() {
        this.pause();
        this.layers = [];
    }
};

window.GyroParallax = GyroParallax;
