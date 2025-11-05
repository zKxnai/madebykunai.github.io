// background.js - Enhanced Top Gradient Glow (CORRECTED)
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
    this.ctx.fillStyle = '#080a0f';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Large, powerful top-center glow (primary)
    const gradient1 = this.ctx.createRadialGradient(
      this.canvas.width / 2, -150,
      0,
      this.canvas.width / 2, this.canvas.height * 0.5,
      this.canvas.width * 1.2
    );
    
    gradient1.addColorStop(0, 'rgba(130, 150, 200, 0.4)');
    gradient1.addColorStop(0.2, 'rgba(100, 130, 180, 0.25)');
    gradient1.addColorStop(0.5, 'rgba(70, 100, 150, 0.12)');
    gradient1.addColorStop(1, 'rgba(50, 80, 120, 0)');
    
    this.ctx.filter = 'blur(120px)';
    this.ctx.fillStyle = gradient1;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Secondary glow layer for more intensity
    const gradient2 = this.ctx.createRadialGradient(
      this.canvas.width / 2, -100,
      0,
      this.canvas.width / 2, this.canvas.height * 0.6,
      this.canvas.width * 0.9
    );
    
    gradient2.addColorStop(0, 'rgba(110, 140, 190, 0.25)');
    gradient2.addColorStop(0.3, 'rgba(90, 120, 170, 0.15)');
    gradient2.addColorStop(0.7, 'rgba(70, 100, 150, 0.05)');
    gradient2.addColorStop(1, 'rgba(50, 80, 120, 0)');
    
    this.ctx.fillStyle = gradient2;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.filter = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const bgContainer = document.getElementById('background');
  if (bgContainer) {
    new TopGradientBackground('background');
  }
});
