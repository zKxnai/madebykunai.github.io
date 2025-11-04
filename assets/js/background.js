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
      
      // More gradients, distributed across the entire viewport
      this.gradients = [
        { x: 0.15, y: 0.15, color: this.colors[0] },    // Green - top left
        { x: 0.85, y: 0.1, color: this.colors[2] },     // Purple - top right
        { x: 0.9, y: 0.8, color: this.colors[3] },      // Pink - bottom right
        { x: 0.1, y: 0.85, color: this.colors[4] },     // Cyan - bottom left
        { x: 0.5, y: 0.5, color: this.colors[1] },      // Dark green - center
        { x: 0.5, y: 0.15, color: this.colors[5] },     // Light gray - top center
        { x: 0.15, y: 0.5, color: this.colors[3] },     // Pink - left center
        { x: 0.85, y: 0.5, color: this.colors[4] }      // Cyan - right center
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
      
      // Fill with slightly darkened background (instead of pure black)
      this.ctx.fillStyle = 'rgba(5, 3, 10, 1)'; // Very dark purple-gray
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Use additive/screen blending for overlapping gradients
      this.ctx.globalCompositeOperation = 'screen';
      this.ctx.filter = 'blur(100px)'; // More blur for softer blending
      
      this.gradients.forEach((grad, index) => {
        // Parallax - cursor pulls gradients toward it
        const parallaxX = (this.mouse.x - 0.5) * this.canvas.width * 0.25;
        const parallaxY = (this.mouse.y - 0.5) * this.canvas.height * 0.25;
        
        // Gentle floating animation
        const floatX = Math.sin(this.time + index * 0.5) * 40;
        const floatY = Math.cos(this.time * 0.7 + index * 0.5) * 40;
        
        // Position blobs throughout viewport
        const x = (grad.x * this.canvas.width) + parallaxX + floatX;
        const y = (grad.y * this.canvas.height) + parallaxY + floatY;
        const size = 350 + Math.sin(this.time * 0.5 + index) * 100;
        
        this.drawBlob(x, y, size, grad.color, 0.4);
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
  