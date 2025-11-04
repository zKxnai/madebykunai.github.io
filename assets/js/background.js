class GradientBackground {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;
      
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.container.appendChild(this.canvas);
      
      // Your color palette
      this.colors = [
        '#3aed5e', // Green
        '#21b62d', // Dark green
        '#811e8a', // Purple
        '#c7028f', // Pink
        '#60ebfa', // Cyan
        '#96b894'  // Light gray-green
      ];
      
      // More gradients with oval shapes (x, y, scaleX for width)
      this.gradients = [
        { x: 0.15, y: 0.15, scaleX: 1.3, color: this.colors[0] },
        { x: 0.85, y: 0.1, scaleX: 1.2, color: this.colors[2] },
        { x: 0.9, y: 0.8, scaleX: 1.4, color: this.colors[3] },
        { x: 0.1, y: 0.85, scaleX: 1.3, color: this.colors[4] },
        { x: 0.5, y: 0.5, scaleX: 1.2, color: this.colors[1] },
        { x: 0.5, y: 0.15, scaleX: 1.35, color: this.colors[5] },
        { x: 0.15, y: 0.5, scaleX: 1.25, color: this.colors[3] },
        { x: 0.85, y: 0.5, scaleX: 1.3, color: this.colors[4] }
      ];
      
      this.mouse = { x: 0.5, y: 0.5 };
      this.time = 0;
      this.init();
    }
    
    init() {
      this.resize();
      window.addEventListener('resize', () => this.resize());
      document.addEventListener('mousemove', (e) => this.onMouseMove(e));
      this.animate();
    }
    
    resize() {
      this.canvas.width = this.container.clientWidth;
      this.canvas.height = this.container.clientHeight;
    }
    
    onMouseMove(e) {
      this.mouse.x = e.clientX / window.innerWidth;
      this.mouse.y = e.clientY / window.innerHeight;
    }
    
    drawOval(x, y, sizeX, sizeY, color, opacity) {
      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, Math.max(sizeX, sizeY));
      gradient.addColorStop(0, this.hexToRgba(color, opacity));
      gradient.addColorStop(1, this.hexToRgba(color, 0));
      
      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.scale(sizeX / sizeY, 1);
      this.ctx.translate(-x, -y);
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(x - sizeY, y - sizeY, sizeY * 2, sizeY * 2);
      this.ctx.restore();
    }
    
    hexToRgba(hex, alpha) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    animate() {
      this.time += 0.005; // Slower animation for smoother movement
      
      // Fill with slightly darkened background
      this.ctx.fillStyle = 'rgba(5, 3, 10, 1)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Use additive/screen blending for overlapping gradients
      this.ctx.globalCompositeOperation = 'screen';
      this.ctx.filter = 'blur(100px)';
      
      this.gradients.forEach((grad, index) => {
        // Minimal parallax - only very slight response to mouse (5% of movement)
        const parallaxX = (this.mouse.x - 0.5) * this.canvas.width * 0.05;
        const parallaxY = (this.mouse.y - 0.5) * this.canvas.height * 0.05;
        
        // Independent floating animation for each blob
        const floatX = Math.sin(this.time + index * 0.8) * 60;
        const floatY = Math.cos(this.time * 0.6 + index * 0.8) * 60;
        
        // Position blobs throughout viewport
        const x = (grad.x * this.canvas.width) + parallaxX + floatX;
        const y = (grad.y * this.canvas.height) + parallaxY + floatY;
        
        // Larger size with less variation
        const sizeY = 400 + Math.sin(this.time * 0.3 + index) * 50;
        const sizeX = sizeY * grad.scaleX; // Oval shape
        
        this.drawOval(x, y, sizeX, sizeY, grad.color, 0.35);
      });
      
      this.ctx.filter = 'none';
      this.ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(() => this.animate());
    }
  }
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const bgContainer = document.getElementById('background');
    if (bgContainer) {
      new GradientBackground('background');
    }
  });
  