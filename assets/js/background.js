// Animated Icon Background
class IconBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.icons = [];
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
    }
    
    init() {
        // Setup canvas
        this.canvas.id = 'iconBackground';
        document.body.insertBefore(this.canvas, document.body.firstChild);
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Track mouse for parallax
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        // Create icons
        this.createIcons();
        
        // Start animation
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = document.body.scrollHeight;
    }
    
    createIcons() {
        const iconCount = Math.floor((window.innerWidth * window.innerHeight) / 15000);
        const colors = [
            '#0a84ff', '#ff9f0a', '#ff453a', '#30d158', 
            '#bf5af2', '#ff375f', '#5ac8fa', '#ffd60a'
        ];
        
        for (let i = 0; i < iconCount; i++) {
            this.icons.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: 40 + Math.random() * 40,
                rotation: Math.random() * 360,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: 0.1 + Math.random() * 0.3,
                rotationSpeed: (Math.random() - 0.5) * 0.5
            });
        }
    }
    
    drawIcon(icon) {
        this.ctx.save();
        this.ctx.translate(icon.x, icon.y);
        this.ctx.rotate((icon.rotation * Math.PI) / 180);
        
        // Draw rounded square (app icon)
        const radius = icon.size * 0.22; // iOS-style corner radius
        this.ctx.fillStyle = icon.color;
        this.ctx.globalAlpha = 0.15;
        
        this.roundRect(-icon.size/2, -icon.size/2, icon.size, icon.size, radius);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const scrollY = window.scrollY;
        const parallaxStrength = 0.05;
        const mouseParallax = 0.02;
        
        this.icons.forEach(icon => {
            // Scroll parallax
            icon.y += icon.speed;
            
            // Apply mouse parallax
            const dx = (this.mouseX - window.innerWidth / 2) * mouseParallax;
            const dy = (this.mouseY - window.innerHeight / 2) * mouseParallax;
            
            // Rotate
            icon.rotation += icon.rotationSpeed;
            
            // Reset if off screen
            if (icon.y - scrollY * parallaxStrength > this.canvas.height + icon.size) {
                icon.y = -icon.size;
                icon.x = Math.random() * this.canvas.width;
            }
            
            // Draw with parallax offset
            const drawIcon = {
                ...icon,
                x: icon.x + dx,
                y: icon.y - scrollY * parallaxStrength + dy
            };
            
            this.drawIcon(drawIcon);
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    new IconBackground();
});
