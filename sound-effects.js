/**
 * ==================== SOUND EFFECTS MANAGER ====================
 * Manages UI sound effects with Web Audio API
 * Synthesized sounds - no external files needed
 */

class SoundFX {
    constructor() {
        this.enabled = true;
        this.volume = 0.3;
        this.audioContext = null;
        this.sounds = {};
        
        // Initialize on first user interaction
        this.initPromise = null;
    }
    
    // Initialize AudioContext (requires user gesture)
    async init() {
        if (this.audioContext) return true;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Resume if suspended (iOS requirement)
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            console.log('🔊 Sound FX initialized');
            return true;
        } catch (e) {
            console.log('🔇 Sound FX not supported');
            return false;
        }
    }
    
    // Ensure init on play
    async ensureInit() {
        if (!this.initPromise) {
            this.initPromise = this.init();
        }
        return this.initPromise;
    }
    
    // Play a synthesized sound
    async play(soundName) {
        if (!this.enabled) return;
        
        await this.ensureInit();
        if (!this.audioContext) return;
        
        switch (soundName) {
            case 'click':
                this.playClick();
                break;
            case 'pop':
                this.playPop();
                break;
            case 'pageFlip':
                this.playPageFlip();
                break;
            case 'success':
                this.playSuccess();
                break;
            case 'whoosh':
                this.playWhoosh();
                break;
            case 'chime':
                this.playChime();
                break;
            case 'heartbeat':
                this.playHeartbeat();
                break;
            case 'sparkle':
                this.playSparkle();
                break;
            default:
                this.playClick();
        }
    }
    
    // Click sound - short tap
    playClick() {
        const ctx = this.audioContext;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
        
        gain.gain.setValueAtTime(this.volume * 0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.05);
    }
    
    // Pop sound - bubble pop
    playPop() {
        const ctx = this.audioContext;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(this.volume * 0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
    }
    
    // Page flip sound - paper rustle
    playPageFlip() {
        const ctx = this.audioContext;
        const bufferSize = ctx.sampleRate * 0.15;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        // White noise with envelope
        for (let i = 0; i < bufferSize; i++) {
            const t = i / bufferSize;
            const envelope = Math.sin(t * Math.PI) * (1 - t * 0.5);
            data[i] = (Math.random() * 2 - 1) * envelope * 0.3;
        }
        
        const source = ctx.createBufferSource();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        source.buffer = buffer;
        filter.type = 'bandpass';
        filter.frequency.value = 2000;
        filter.Q.value = 0.5;
        
        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        gain.gain.value = this.volume;
        source.start();
    }
    
    // Success sound - achievement
    playSuccess() {
        const ctx = this.audioContext;
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
        
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            const startTime = ctx.currentTime + i * 0.1;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.volume * 0.3, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
            
            osc.start(startTime);
            osc.stop(startTime + 0.3);
        });
    }
    
    // Whoosh sound - transition
    playWhoosh() {
        const ctx = this.audioContext;
        const bufferSize = ctx.sampleRate * 0.3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            const t = i / bufferSize;
            const envelope = Math.sin(t * Math.PI);
            data[i] = (Math.random() * 2 - 1) * envelope * 0.2;
        }
        
        const source = ctx.createBufferSource();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        source.buffer = buffer;
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(500, ctx.currentTime);
        filter.frequency.linearRampToValueAtTime(3000, ctx.currentTime + 0.15);
        filter.frequency.linearRampToValueAtTime(500, ctx.currentTime + 0.3);
        
        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        gain.gain.value = this.volume;
        source.start();
    }
    
    // Chime sound - notification
    playChime() {
        const ctx = this.audioContext;
        const freq = 880;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        gain.gain.setValueAtTime(this.volume * 0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    }
    
    // Heartbeat sound
    playHeartbeat() {
        const ctx = this.audioContext;
        
        [0, 0.15].forEach(delay => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(80, ctx.currentTime + delay);
            osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + delay + 0.1);
            
            gain.gain.setValueAtTime(this.volume * 0.5, ctx.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.15);
            
            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + 0.15);
        });
    }
    
    // Sparkle sound - magical
    playSparkle() {
        const ctx = this.audioContext;
        const freqs = [1200, 1500, 1800, 2100];
        
        freqs.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            const startTime = ctx.currentTime + i * 0.05;
            gain.gain.setValueAtTime(this.volume * 0.15, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);
            
            osc.start(startTime);
            osc.stop(startTime + 0.2);
        });
    }
    
    // Toggle on/off
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
    
    // Set volume (0-1)
    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
    }
}

// Create global instance
const sfx = new SoundFX();

// Auto-init on first interaction
['click', 'touchstart', 'keydown'].forEach(event => {
    document.addEventListener(event, () => sfx.ensureInit(), { once: true, passive: true });
});

// Export
window.sfx = sfx;

console.log('🔊 Sound Effects Manager loaded');
