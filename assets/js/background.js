class GradientBackground {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;
  
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.container.appendChild(this.canvas);
  
      // Your color palette from tiles
      this.colors = [
        '#3aed5e', // Green
        '#21b62d', // Dark green
        '#811e8a', // Purple
        '#c7028f', // Pink
        '#60ebfa', // Cyan
        '#96b894'  // Light gray-green
      ];
  
      // Animated gradient positions
      this.gradients = [
        { x: -0.3, y: -0.3, color: this.colors[0], targetX: -0.3, targetY: -0.3 },
        { x: 0.5, y: -0.2, color: this.colors[2], targetX: 0.5, targetY: -0.2 },
        { x: 1.2, y: 0.8, color: this.colors[3], targetX: 1.2, targetY: 0.8 },
        { x: 0, y: 1.5, color: this.colors[4], targetX: 0, targetY: 1.5 },
        { x: -0.5, y: 0.5, color: this.colors[1], targetX: -0.5, targetY: 0.5 },
        { x: 0.8, y: -0.8, color: this.colors[5], targetX: 0.8, targetY: -0.8 }
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
  
    drawBlob(x, y, size, color, opacity) {
      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, this.hexToRgba(color, opacity));
      gradient.addColorStop(1, this.hexToRgba(color, 0));
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(x - size, y - size, size * 2, size * 2);
    }
  
    hexToRgba(hex, alpha) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  
    animate() {
      this.time += 0.01;
  
      // Clear canvas
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  
      // Enable blending for smooth gradients
      this.ctx.globalCompositeOperation = 'screen';
      this.ctx.filter = 'blur(80px)';
  
      // Update and draw gradients with parallax
      this.gradients.forEach((grad, index) => {
        // Parallax offset based on mouse position
        const parallaxX = (this.mouse.x - 0.5) * 100;
        const parallaxY = (this.mouse.y - 0.5) * 100;
  
        // Gentle floating animation
        const floatX = Math.sin(this.time + index) * 50;
        const floatY = Math.cos(this.time * 0.7 + index) * 50;
  
        const x = (grad.x * this.canvas.width) + parallaxX + floatX;
        const y = (grad.y * this.canvas.height) + parallaxY + floatY;
        const size = 300 + Math.sin(this.time * 0.5 + index) * 100;
  
        this.drawBlob(x, y, size, grad.color, 0.6);
      });
  
      // Reset filter and composite
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
  