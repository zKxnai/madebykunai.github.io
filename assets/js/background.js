// background.js - Top Light Source with #5a6975 glow

class TopGlowBackground {
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
    // Dark base background
    this.ctx.fillStyle = '#0b1313';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Light source positioned above viewport
    const centerX = this.canvas.width / 2;
    const lightSourceY = -this.canvas.height * 0.35;  // Higher up
    
    const gradient = this.ctx.createRadialGradient(
      centerX, lightSourceY, 0,
      centerX, lightSourceY,
      this.canvas.height * 1.3
    );
    
    // #5a6975 glow gradient matching your mockup
    gradient.addColorStop(0, 'rgba(90, 105, 117, 0.45)');    // Bright center
    gradient.addColorStop(0.2, 'rgba(90, 105, 117, 0.3)');   
    gradient.addColorStop(0.4, 'rgba(90, 105, 117, 0.18)');  
    gradient.addColorStop(0.65, 'rgba(90, 105, 117, 0.08)'); 
    gradient.addColorStop(0.85, 'rgba(11, 19, 19, 0.02)');   
    gradient.addColorStop(1, 'rgba(11, 19, 19, 0)');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const bgContainer = document.getElementById('background');
  if (bgContainer) {
    new TopGlowBackground('background');
  }
});
