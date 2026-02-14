// ==================== GALLERY.JS - 3D Photo Sphere with Three.js ==================== //

document.addEventListener('DOMContentLoaded', function () {
    // ==================== 3D STARFIELD BACKGROUND ====================
    create3DStarfield(100);

    // ==================== MUSIC CONTROL ====================
    initMusicControl();

    // ==================== 3D PHOTO SPHERE ====================
    init3DPhotoSphere();

    // ==================== LIGHTBOX ====================
    initLightbox();
});

// ==================== 3D STARFIELD BACKGROUND ====================
function create3DStarfield(count) {
    const container = document.getElementById('starfield-3d');
    if (!container) return;

    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star-3d';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        const size = Math.random() * 2 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.setProperty('--twinkle-duration', (Math.random() * 4 + 2) + 's');
        star.style.setProperty('--twinkle-delay', Math.random() * 5 + 's');
        container.appendChild(star);
    }
}

// ==================== MUSIC CONTROL ====================
function initMusicControl() {
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');

    if (!bgMusic || !musicToggle) return;

    if (sessionStorage.getItem('musicPlaying') === 'true') {
        bgMusic.play().catch(() => { });
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

// ==================== 3D PHOTO SPHERE WITH THREE.JS ====================
function init3DPhotoSphere() {
    const canvas = document.getElementById('sphere-canvas');
    const wrapper = document.getElementById('sphere-wrapper');

    if (!canvas || !wrapper) return;

    // Image list
    const images = [
        'att.kVVuj3LUBliqxbsw1c0ExtYU_K3Ow1UVSZ8yLinTOYY.jpg',
        'DSCF4601.JPG', 'DSCF8926.JPG', 'DSCF8962.JPG',
        'IMG_0324.JPG', 'IMG_0784.JPG', 'IMG_0785.JPG', 'IMG_0797.JPG',
        'IMG_1779.JPG', 'IMG_1965.JPG', 'IMG_2143.jpg', 'IMG_2200.JPG',
        'IMG_2267.JPG', 'IMG_2785.JPG', 'IMG_4110.JPG', 'IMG_4434.JPG',
        'IMG_4468.JPG', 'IMG_4549.jpg', 'IMG_4968.jpg', 'IMG_5818.JPG',
        'IMG_5822.JPG', 'IMG_6534.JPG', 'IMG_6932.jpg', 'IMG_8064.JPG',
        'IMG_8160.JPG', 'IMG_8515.JPG', 'IMG_8755.JPG', 'IMG_9524.JPG',
        'IMG_5809.PNG', 'IMG_8467.PNG', 'IMG_8552.PNG'
    ];

    window.sphereImages = images;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
        55,
        wrapper.clientWidth / wrapper.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 4.5;

    // Renderer - optimized
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: false, // Disable for performance
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(wrapper.clientWidth, wrapper.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Limit pixel ratio
    renderer.setClearColor(0x000000, 0);

    // Sphere group
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // Core glow sphere
    const coreGeo = new THREE.SphereGeometry(1.1, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({
        color: 0xff1493,
        transparent: true,
        opacity: 0.06
    });
    sphereGroup.add(new THREE.Mesh(coreGeo, coreMat));

    // Wireframe
    const wireGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const wireMat = new THREE.MeshBasicMaterial({
        color: 0xff69b4,
        wireframe: true,
        transparent: true,
        opacity: 0.12
    });
    const wireframe = new THREE.Mesh(wireGeo, wireMat);
    sphereGroup.add(wireframe);

    // ==================== FLOATING LOVE MESSAGES ====================
    const loveMessages = [
        'Yêu em 💕', 'Nhớ em', 'Cưng quá', 'Dễ thương', 'Xinh đẹp',
        'Hoàn hảo', 'Tuyệt vời', 'Đáng yêu', 'Hạnh phúc', 'Mãi bên em',
        'Thương em', 'Em là số 1', 'Ngọt ngào', 'Ấm áp', 'My love',
        'Forever', 'Đẹp quá', 'Cute', 'Angel', 'Pretty', '♥', '✨', '💖'
    ];

    const floatingTexts = [];
    const textRadius = 2.8; // Orbit radius around sphere

    // Create text sprite function
    function createTextSprite(text) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 32;

        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = 'bold 16px Mali, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Glow effect
        ctx.shadowColor = '#ff69b4';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        // Second pass for brightness
        ctx.shadowBlur = 4;
        ctx.fillStyle = '#ffb6c1';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;

        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 0.9
        });

        const sprite = new THREE.Sprite(material);
        sprite.scale.set(0.5, 0.125, 1);

        return sprite;
    }

    // Create floating texts with random orbits
    for (let i = 0; i < 15; i++) {
        const text = loveMessages[Math.floor(Math.random() * loveMessages.length)];
        const sprite = createTextSprite(text);

        // Random orbit parameters
        sprite.userData = {
            angle: Math.random() * Math.PI * 2,
            speed: 0.003 + Math.random() * 0.004,
            radiusOffset: (Math.random() - 0.5) * 0.6,
            yOffset: (Math.random() - 0.5) * 2.5,
            tiltX: (Math.random() - 0.5) * 0.5,
            tiltZ: (Math.random() - 0.5) * 0.5,
            floatSpeed: 0.5 + Math.random() * 0.5,
            floatOffset: Math.random() * Math.PI * 2
        };

        scene.add(sprite);
        floatingTexts.push(sprite);
    }

    // Photo cards
    const photoCards = [];
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Fibonacci sphere distribution
    function fibonacciSphere(n, radius) {
        const points = [];
        const phi = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < n; i++) {
            const y = 1 - (i / (n - 1)) * 2;
            const r = Math.sqrt(1 - y * y);
            const theta = phi * i;
            points.push(new THREE.Vector3(
                Math.cos(theta) * r * radius,
                y * radius,
                Math.sin(theta) * r * radius
            ));
        }
        return points;
    }

    // Create placeholder cards first (instant)
    const sphereRadius = 2;
    const positions = fibonacciSphere(images.length, sphereRadius);
    const cardWidth = 0.35;
    const cardHeight = 0.45;

    // Placeholder material
    const placeholderMat = new THREE.MeshBasicMaterial({
        color: 0x332233,
        transparent: true,
        opacity: 0.5
    });

    const cardGeometry = new THREE.PlaneGeometry(cardWidth, cardHeight);
    const borderGeometry = new THREE.PlaneGeometry(cardWidth + 0.015, cardHeight + 0.015);
    const glowGeometry = new THREE.PlaneGeometry(cardWidth + 0.06, cardHeight + 0.06);

    // Border material (reused)
    const borderMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.85
    });

    // Glow material (reused)
    const glowMat = new THREE.MeshBasicMaterial({
        color: 0xff69b4,
        transparent: true,
        opacity: 0.25
    });

    // Create all cards with placeholders
    positions.forEach((pos, index) => {
        const card = new THREE.Mesh(cardGeometry, placeholderMat.clone());
        card.userData = { index: index };
        card.position.copy(pos);
        card.lookAt(pos.clone().multiplyScalar(2));

        // Border
        const border = new THREE.Mesh(borderGeometry, borderMat);
        border.position.z = -0.001;
        card.add(border);

        // Glow
        const glow = new THREE.Mesh(glowGeometry, glowMat);
        glow.position.z = -0.002;
        card.add(glow);

        sphereGroup.add(card);
        photoCards.push(card);
    });

    // Load textures progressively (in batches)
    const textureLoader = new THREE.TextureLoader();
    const batchSize = 4;
    let currentBatch = 0;

    function loadBatch() {
        const start = currentBatch * batchSize;
        const end = Math.min(start + batchSize, images.length);

        for (let i = start; i < end; i++) {
            loadImage(i);
        }

        currentBatch++;
        if (currentBatch * batchSize < images.length) {
            setTimeout(loadBatch, 100); // Load next batch after 100ms
        }
    }

    function loadImage(index) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function () {
            // Create smaller canvas for texture
            const maxSize = 256;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            let w = img.width;
            let h = img.height;

            if (w > h) {
                if (w > maxSize) { h = h * maxSize / w; w = maxSize; }
            } else {
                if (h > maxSize) { w = w * maxSize / h; h = maxSize; }
            }

            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(img, 0, 0, w, h);

            const texture = new THREE.CanvasTexture(canvas);
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.generateMipmaps = false;

            const mat = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true
            });

            photoCards[index].material.dispose();
            photoCards[index].material = mat;
        };
        img.src = `assets/images/ttu/${images[index]}`;
    }

    // Start loading
    loadBatch();

    // Interaction state
    let isAutoRotating = true;
    let isDragging = false;
    let prevPos = { x: 0, y: 0 };
    let velocity = { x: 0, y: 0 };
    let hoveredCard = null;

    // Animation
    function animate() {
        requestAnimationFrame(animate);

        const time = Date.now() * 0.001;

        if (isAutoRotating && !isDragging) {
            sphereGroup.rotation.y += 0.003;
        }

        if (!isDragging) {
            sphereGroup.rotation.y += velocity.y;
            sphereGroup.rotation.x += velocity.x;
            velocity.x *= 0.95;
            velocity.y *= 0.95;
        }

        wireframe.rotation.y += 0.0008;
        wireframe.rotation.x += 0.0004;

        // Animate floating texts
        floatingTexts.forEach(sprite => {
            const data = sprite.userData;
            data.angle += data.speed;

            const r = textRadius + data.radiusOffset;
            const floatY = Math.sin(time * data.floatSpeed + data.floatOffset) * 0.15;

            sprite.position.x = Math.cos(data.angle + data.tiltX) * r;
            sprite.position.z = Math.sin(data.angle + data.tiltZ) * r;
            sprite.position.y = data.yOffset + floatY;

            // Fade based on z position (closer = more visible)
            const zNorm = (sprite.position.z + r) / (r * 2);
            sprite.material.opacity = 0.3 + zNorm * 0.6;
        });

        renderer.render(scene, camera);
    }
    animate();

    // Pointer events
    function getPos(e) {
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    }

    function onDown(e) {
        isDragging = true;
        isAutoRotating = false;
        prevPos = getPos(e);
        wrapper.style.cursor = 'grabbing';
    }

    function onMove(e) {
        const pos = getPos(e);

        if (isDragging) {
            const dx = pos.x - prevPos.x;
            const dy = pos.y - prevPos.y;

            velocity.y = dx * 0.004;
            velocity.x = dy * 0.002;

            sphereGroup.rotation.y += dx * 0.004;
            sphereGroup.rotation.x += dy * 0.002;
            sphereGroup.rotation.x = Math.max(-1, Math.min(1, sphereGroup.rotation.x));

            prevPos = pos;
        }

        // Hover check
        const rect = wrapper.getBoundingClientRect();
        const cx = e.touches ? e.touches[0].clientX : e.clientX;
        const cy = e.touches ? e.touches[0].clientY : e.clientY;
        mouse.x = ((cx - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((cy - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(photoCards);

        if (hoveredCard) {
            hoveredCard.scale.set(1, 1, 1);
            hoveredCard = null;
        }

        if (hits.length > 0) {
            hoveredCard = hits[0].object;
            hoveredCard.scale.set(1.25, 1.25, 1.25);
            wrapper.style.cursor = 'pointer';
        } else if (!isDragging) {
            wrapper.style.cursor = 'grab';
        }
    }

    function onUp() {
        if (isDragging) {
            isDragging = false;
            wrapper.style.cursor = 'grab';
            setTimeout(() => { if (!isDragging) isAutoRotating = true; }, 3000);
        }
    }

    // Click
    let clickStart = 0;
    let clickPos = { x: 0, y: 0 };

    function onClickStart(e) {
        clickStart = Date.now();
        clickPos = getPos(e);
    }

    function onClick(e) {
        const dt = Date.now() - clickStart;
        const pos = getPos(e);
        const dist = Math.hypot(pos.x - clickPos.x, pos.y - clickPos.y);

        if (dt < 250 && dist < 15) {
            const rect = wrapper.getBoundingClientRect();
            const cx = pos.x;
            const cy = pos.y;
            mouse.x = ((cx - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((cy - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const hits = raycaster.intersectObjects(photoCards);

            if (hits.length > 0 && window.openSphereLightbox) {
                window.openSphereLightbox(hits[0].object.userData.index);
            }
        }
    }

    // Pinch zoom
    let pinchDist = 0;
    let initZ = camera.position.z;

    function getPinchDist(e) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        return Math.hypot(dx, dy);
    }

    function onTouchStart(e) {
        if (e.touches.length === 2) {
            pinchDist = getPinchDist(e);
            initZ = camera.position.z;
            isDragging = false;
        } else if (e.touches.length === 1) {
            onDown(e);
            onClickStart(e);
        }
    }

    function onTouchMove(e) {
        if (e.touches.length === 2) {
            e.preventDefault();
            const d = getPinchDist(e);
            const scale = pinchDist / d;
            camera.position.z = Math.max(2.5, Math.min(7, initZ * scale));
        } else if (e.touches.length === 1 && isDragging) {
            onMove(e);
        }
    }

    // Event listeners
    wrapper.addEventListener('mousedown', (e) => { onDown(e); onClickStart(e); });
    wrapper.addEventListener('mousemove', onMove);
    wrapper.addEventListener('mouseup', (e) => { onClick(e); onUp(); });
    wrapper.addEventListener('mouseleave', onUp);

    wrapper.addEventListener('touchstart', onTouchStart, { passive: false });
    wrapper.addEventListener('touchmove', onTouchMove, { passive: false });
    wrapper.addEventListener('touchend', (e) => { onClick(e); onUp(); });

    // Wheel zoom
    wrapper.addEventListener('wheel', (e) => {
        e.preventDefault();
        camera.position.z = Math.max(2.5, Math.min(7, camera.position.z + e.deltaY * 0.005));
    }, { passive: false });

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = wrapper.clientWidth / wrapper.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(wrapper.clientWidth, wrapper.clientHeight);
    });

    wrapper.style.cursor = 'grab';
}

// ==================== LIGHTBOX ====================
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    if (!lightbox) return;

    let currentIndex = 0;

    window.openSphereLightbox = function (index) {
        currentIndex = index;
        const images = window.sphereImages || [];
        if (!images.length) return;

        lightboxImg.src = `assets/images/ttu/${images[currentIndex]}`;
        lightboxCaption.textContent = `${currentIndex + 1} / ${images.length}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    function close() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function prev() {
        const images = window.sphereImages || [];
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        lightboxImg.src = `assets/images/ttu/${images[currentIndex]}`;
        lightboxCaption.textContent = `${currentIndex + 1} / ${images.length}`;
    }

    function next() {
        const images = window.sphereImages || [];
        currentIndex = (currentIndex + 1) % images.length;
        lightboxImg.src = `assets/images/ttu/${images[currentIndex]}`;
        lightboxCaption.textContent = `${currentIndex + 1} / ${images.length}`;
    }

    lightboxClose.addEventListener('click', close);
    lightboxPrev.addEventListener('click', prev);
    lightboxNext.addEventListener('click', next);

    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
    });

    let touchX = 0;
    lightbox.addEventListener('touchstart', (e) => { touchX = e.changedTouches[0].screenX; });
    lightbox.addEventListener('touchend', (e) => {
        const diff = touchX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    });
}
