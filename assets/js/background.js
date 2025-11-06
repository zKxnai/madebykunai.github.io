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
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.zIndex = '-1';
    this.canvas.style.pointerEvents = 'none';
    
    // Insert into background container
    const bgContainer = document.getElementById('background-container');
    if (bgContainer) {
      bgContainer.appendChild(this.canvas);
    }
    
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
    this.canvas.height = window.innerHeight;
    
    if (this.icons.length > 0) {
      this.createIcons();
    }
  }

  createIcons() {
    this.icons = [];
    const iconCount = Math.floor((window.innerWidth * window.innerHeight) / 25000);
    
    const colors = [
      '#00D851', '#00A751',
      '#C600FF', '#CD1288',
      '#63E3FA', '#2dd4bf'
    ];

    for (let i = 0; i < iconCount; i++) {
      this.icons.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: 25 + Math.random() * 35,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 0.08 + Math.random() * 0.15,
        rotationSpeed: (Math.random() - 0.5) * 0.3
      });
    }
  }

  drawIcon(icon) {
    this.ctx.save();
    this.ctx.translate(icon.x, icon.y);
    this.ctx.rotate((icon.rotation * Math.PI) / 180);
    
    const radius = icon.size * 0.22;
    this.ctx.fillStyle = icon.color;
    this.ctx.globalAlpha = 0.06;
    
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
    
    const mouseParallax = 0.015;
    
    this.icons.forEach(icon => {
      icon.y += icon.speed;
      
      const dx = (this.mouseX - window.innerWidth / 2) * mouseParallax;
      const dy = (this.mouseY - window.innerHeight / 2) * mouseParallax;
      
      icon.rotation += icon.rotationSpeed;
      
      if (icon.y > this.canvas.height + icon.size) {
        icon.y = -icon.size;
        icon.x = Math.random() * this.canvas.width;
      }
      
      const drawIcon = {
        ...icon,
        x: icon.x + dx,
        y: icon.y + dy
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
