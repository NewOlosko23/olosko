/**
 * Lightweight Snowfall Effect
 * Uses HTML5 Canvas for performance.
 * Theme-aware: Adjusts snow color based on 'data-theme' attribute.
 */
(function () {
    // Configuration
    const CONFIG = {
        particleCount: 50, // Number of snowflakes
        speed: 1, // Base speed
        wind: 0.5, // Horizontal drift
        colors: {
            light: '#94A3B8', // Slate 400 - Visible on white
            dark: '#FFFFFF'   // White - Visible on dark
        }
    };

    let canvas, ctx;
    let particles = [];
    let w, h;
    let animationId;

    function init() {
        // Create canvas
        canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none'; // Click-through
        canvas.style.zIndex = '9999'; // On top of everything
        document.body.appendChild(canvas);

        ctx = canvas.getContext('2d');

        // Initial size
        resize();

        // Create particles
        createParticles();

        // Event listeners
        window.addEventListener('resize', resize);

        // Start loop
        loop();
    }

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < CONFIG.particleCount; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 2 + 1, // Radius 1-3px
                d: Math.random() * CONFIG.particleCount, // Density factor
                vx: (Math.random() - 0.5) * CONFIG.wind,
                vy: Math.random() * CONFIG.speed + 1
            });
        }
    }

    function getSnowColor() {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === 'dark' ? CONFIG.colors.dark : CONFIG.colors.light;
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);

        ctx.fillStyle = getSnowColor();
        ctx.font = '20px serif'; // Base font size

        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];

            // Dynamic size based on radius (smaller scaling)
            ctx.font = `${p.r * 5}px sans-serif`;

            ctx.fillText('❄', p.x, p.y);
        }

        update();
    }

    function update() {
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];

            p.y += p.vy;
            p.x += p.vx;

            // Reset when off screen
            if (p.y > h) {
                particles[i] = {
                    x: Math.random() * w,
                    y: -10,
                    r: p.r,
                    d: p.d,
                    vx: p.vx,
                    vy: p.vy
                };
            }

            // Wrap horizontal
            if (p.x > w + 5 || p.x < -5) {
                if (p.x > w + 5) {
                    p.x = -5;
                } else {
                    p.x = w + 5;
                }
            }
        }
    }

    function loop() {
        draw();
        animationId = requestAnimationFrame(loop);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
