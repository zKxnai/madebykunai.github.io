class TopGradientBackground {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);
    
    this.init();
  }
  
  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.draw();
  }
  
  resize() {
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    this.draw();
  }
  
  draw() {
    // Deep dark background
    this.ctx.fillStyle = '#0a0a0f';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Create top-down gradient glow
    const gradient = this.ctx.createRadialGradient(
      this.canvas.width / 2, 0,  // Center top
      0,
      this.canvas.width / 2, this.canvas.height * 0.4,
      this.canvas.width * 0.7
    );
    
    // Subtle, elegant glow
    gradient.addColorStop(0, 'rgba(100, 120, 180, 0.15)');
    gradient.addColorStop(0.4, 'rgba(80, 100, 140, 0.08)');
    gradient.addColorStop(1, 'rgba(60, 80, 120, 0)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const bgContainer = document.getElementById('background');
  if (bgContainer) {
    new TopGradientBackground('background');
  }
});
