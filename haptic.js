/**
 * ==================== HAPTIC FEEDBACK ====================
 * Vibration patterns for mobile devices
 * Enhances tactile feedback for interactions
 */

const Haptic = {
    // Check if vibration is supported
    isSupported: 'vibrate' in navigator,
    
    // Enable/disable haptics
    enabled: true,
    
    // Light tap - button press
    light() {
        if (this.enabled && this.isSupported) {
            navigator.vibrate(10);
        }
    },
    
    // Medium tap - page flip
    medium() {
        if (this.enabled && this.isSupported) {
            navigator.vibrate(25);
        }
    },
    
    // Heavy tap - important action
    heavy() {
        if (this.enabled && this.isSupported) {
            navigator.vibrate(50);
        }
    },
    
    // Success pattern - achievement unlocked
    success() {
        if (this.enabled && this.isSupported) {
            navigator.vibrate([10, 50, 10, 50, 10]);
        }
    },
    
    // Error pattern
    error() {
        if (this.enabled && this.isSupported) {
            navigator.vibrate([50, 30, 50]);
        }
    },
    
    // Heartbeat pattern - romantic moments
    heartbeat() {
        if (this.enabled && this.isSupported) {
            navigator.vibrate([100, 100, 100, 300, 100, 100, 100]);
        }
    },
    
    // Double tap
    doubleTap() {
        if (this.enabled && this.isSupported) {
            navigator.vibrate([15, 50, 15]);
        }
    },
    
    // Notification
    notification() {
        if (this.enabled && this.isSupported) {
            navigator.vibrate([50, 100, 50, 100, 50]);
        }
    },
    
    // Toggle haptics on/off
    toggle() {
        this.enabled = !this.enabled;
        if (this.enabled) this.light();
        return this.enabled;
    },
    
    // Custom pattern
    custom(pattern) {
        if (this.enabled && this.isSupported && Array.isArray(pattern)) {
            navigator.vibrate(pattern);
        }
    }
};

// Export
window.Haptic = Haptic;

console.log('📳 Haptic feedback loaded, supported:', Haptic.isSupported);
