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
    // Solid dark background
    this.ctx.fillStyle = '#0a1428';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Top light source that fades with distance
    const gradient = this.ctx.createRadialGradient(
      this.canvas.width / 2, -100,
      0,
      this.canvas.width / 2, this.canvas.height * 0.5,  // Fade extends lower
      this.canvas.width * 0.8
    );
    
    gradient.addColorStop(0, 'rgba(100, 150, 220, 0.55)');      // Bright at source
    gradient.addColorStop(0.25, 'rgba(80, 130, 200, 0.35)');    // Still visible
    gradient.addColorStop(0.5, 'rgba(60, 100, 170, 0.15)');     // Fading
    gradient.addColorStop(0.75, 'rgba(40, 70, 130, 0.05)');     // Nearly transparent
    gradient.addColorStop(1, 'rgba(30, 50, 100, 0)');           // Completely transparent

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
