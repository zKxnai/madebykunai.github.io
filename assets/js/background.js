class DynamicBackground {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);
    
    // Ultra-refined gradient with subtle movement
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
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
    
    if (this.particles.length === 0) {
      this.particles = this.createParticles();
    }
  }
  
  createParticles() {
    const particles = [];
    const colors = ['#3aed5e', '#60ebfa', '#c7028f', '#21b62d', '#811e8a'];
    
    for (let i = 0; i < 5; i++) {
      particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: 150 + Math.random() * 250,
        color: colors[i],
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        angle: Math.random() * Math.PI * 2
      });
    }
    
    return particles;
  }
  
  onMouseMove(e) {
    this.mouse.x = e.clientX / window.innerWidth;
    this.mouse.y = e.clientY / window.innerHeight;
  }
  
  animate() {
    this.time += 0.01;
    
    // Dark background
    this.ctx.fillStyle = 'rgba(8, 5, 15, 1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw particles
    this.ctx.globalCompositeOperation = 'screen';
    this.ctx.filter = 'blur(120px)';
    
    this.particles.forEach((p, i) => {
      // Subtle movement
      p.x += p.vx * (Math.sin(this.time + i) * 0.3 + 0.7);
      p.y += p.vy * (Math.cos(this.time * 0.7 + i) * 0.3 + 0.7);
      
      // Boundary wrapping
      if (p.x < -p.size) p.x = this.canvas.width + p.size;
      if (p.x > this.canvas.width + p.size) p.x = -p.size;
      if (p.y < -p.size) p.y = this.canvas.height + p.size;
      if (p.y > this.canvas.height + p.size) p.y = -p.size;
      
      // Mouse attraction (subtle)
      const dx = this.mouse.x * this.canvas.width - p.x;
      const dy = this.mouse.y * this.canvas.height - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 300) {
        p.x += (dx / dist) * 0.02;
        p.y += (dy / dist) * 0.02;
      }
      
      // Draw particle
      const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      gradient.addColorStop(0, this.hexToRgba(p.color, 0.4));
      gradient.addColorStop(1, this.hexToRgba(p.color, 0));
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.filter = 'none';
    
    requestAnimationFrame(() => this.animate());
  }
  
  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const bgContainer = document.getElementById('background');
  if (bgContainer) {
    new DynamicBackground('background');
  }
});
