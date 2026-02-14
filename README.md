# 💝 Valentine's Day - Interactive Love Story

A romantic Single Page Application (SPA) for Valentine's Day, featuring:

- ✨ Stunning intro screen with twinkling stars and floating hearts
- 📖 Story cards with smooth animations
- ⏱️ Real-time "time together" counter (from October 22, 2021)
- 💖 3D Heart Gallery using Three.js
- 🎵 Background music support
- 📱 Fully responsive (mobile-first design)

## 🚀 Quick Start

1. Add your background music file to `assets/music/bg.mp3`
2. Replace placeholder images with your actual photos
3. Open `index.html` in a browser or serve with a local server

## 🎵 Adding Background Music

Place your romantic background music file at:
```
assets/music/bg.mp3
```

## 📸 Adding Your Photos

To replace placeholder images with your actual photos:

1. Add your images to `assets/images/`
2. In `script.js`, modify the `createPhotoElements` function to use your images:

```javascript
// Replace placeholder with your image paths
const yourImages = [
    'assets/images/photo1.jpg',
    'assets/images/photo2.jpg',
    // ... add more
];
```

## 💕 Customization

### Change Start Date
In `script.js`, modify the `START_DATE` variable:
```javascript
const START_DATE = new Date('2021-10-22T21:34:00');
```

### Change Story Cards
Edit the story cards in `index.html` under `Section 2: The Journey`

### Change Colors
Modify the CSS variables in `style.css`:
```css
:root {
    --pink-light: #FFB6C1;
    --pink-soft: #FF69B4;
    --pink-main: #FF1493;
    /* ... */
}
```

## 📱 Mobile Support

The site is designed mobile-first and works great when scanned via QR code.

## 🛠️ Tech Stack

- HTML5, CSS3, Vanilla JavaScript
- Three.js (3D rendering)
- CSS3DRenderer (DOM elements in 3D)
- TWEEN.js (animations)
- FontAwesome (icons)
- Google Fonts (Mali - Vietnamese handwriting)

---

Made with ❤️ for Valentine's Day 2026
