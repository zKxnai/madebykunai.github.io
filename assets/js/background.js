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
    
    // More gradients with oval shapes (x, y, radiusX, radiusY)
    this.gradients = [
      { x: 0.15, y: 0.15, rx: 520, ry: 400, color: this.colors[0] },
      { x: 0.85, y: 0.1, rx: 480, ry: 420, color: this.colors[2] },
      { x: 0.9, y: 0.8, rx: 540, ry: 380, color: this.colors[3] },
      { x: 0.1, y: 0.85, rx: 500, ry: 410, color: this.colors[4] },
      { x: 0.5, y: 0.5, rx: 460, ry: 400, color: this.colors[1] },
      { x: 0.5, y: 0.15, rx: 520, ry: 390, color: this.colors[5] },
      { x: 0.15, y: 0.5, rx: 480, ry: 420, color: this.colors[3] },
      { x: 0.85, y: 0.5, rx: 510, ry: 400, color: this.colors[4] }
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
  
  drawEllipse(x, y, radiusX, radiusY, color, opacity) {
    // Create radial gradient
    const maxRadius = Math.max(radiusX, radiusY);
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, maxRadius);
    gradient.addColorStop(0, this.hexToRgba(color, opacity));
    gradient.addColorStop(1, this.hexToRgba(color, 0));
    
    // Draw ellipse using proper canvas method
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.scale(radiusX / radiusY, 1);
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, radiusY, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }
  
  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  animate() {
    this.time += 0.005;
    
    // Fill with slightly darkened background
    this.ctx.fillStyle = 'rgba(5, 3, 10, 1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Use additive/screen blending for overlapping gradients
    this.ctx.globalCompositeOperation = 'screen';
    this.ctx.filter = 'blur(100px)';
    
    this.gradients.forEach((grad, index) => {
      // Minimal parallax
      const parallaxX = (this.mouse.x - 0.5) * this.canvas.width * 0.05;
      const parallaxY = (this.mouse.y - 0.5) * this.canvas.height * 0.05;
      
      // Independent floating animation
      const floatX = Math.sin(this.time + index * 0.8) * 60;
      const floatY = Math.cos(this.time * 0.6 + index * 0.8) * 60;
      
      // Position blobs throughout viewport
      const x = (grad.x * this.canvas.width) + parallaxX + floatX;
      const y = (grad.y * this.canvas.height) + parallaxY + floatY;
      
      // Size variation
      const sizeVariation = Math.sin(this.time * 0.3 + index) * 30;
      const radiusY = grad.ry + sizeVariation;
      const radiusX = grad.rx + sizeVariation;
      
      this.drawEllipse(x, y, radiusX, radiusY, grad.color, 0.35);
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
