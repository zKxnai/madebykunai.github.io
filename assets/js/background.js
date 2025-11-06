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
    // Base dark background (#0b1313)
    this.ctx.fillStyle = '#0b1313';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Light source positioned above viewport
    const centerX = this.canvas.width / 2;
    const lightSourceY = -this.canvas.height * 0.3;
    
    const gradient = this.ctx.createRadialGradient(
      centerX, lightSourceY, 0,
      centerX, lightSourceY,
      this.canvas.height * 1.2
    );
    
    // Teal/cyan glow gradient
    gradient.addColorStop(0, 'rgba(20, 45, 58, 0.5)');      // #142d3a bright center
    gradient.addColorStop(0.25, 'rgba(20, 45, 58, 0.3)');   
    gradient.addColorStop(0.5, 'rgba(15, 35, 45, 0.12)');   
    gradient.addColorStop(0.75, 'rgba(11, 19, 19, 0.03)');  
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
