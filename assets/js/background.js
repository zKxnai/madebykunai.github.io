class MeshGradientBackground {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);
    
    // Mesh gradient configuration - Apple style
    this.gridSize = 4; // 4x4 grid = 16 control points
    this.points = [];
    this.colors = [
      { r: 58, g: 237, b: 94 },   // #3aed5e green
      { r: 96, g: 235, b: 250 },  // #60ebfa cyan
      { r: 199, g: 2, b: 143 },   // #c7028f pink
      { r: 129, g: 30, b: 138 },  // #811e8a purple
      { r: 33, g: 182, b: 45 }    // #21b62d dark green
    ];
    
    this.time = 0;
    this.init();
  }
  
  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.createMeshPoints();
    this.animate();
  }
  
  resize() {
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
  }
  
  createMeshPoints() {
    this.points = [];
    const spacing = 1 / (this.gridSize - 1);
    
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        const index = y * this.gridSize + x;
        this.points.push({
          baseX: x * spacing,
          baseY: y * spacing,
          offsetX: (Math.random() - 0.5) * 0.15,
          offsetY: (Math.random() - 0.5) * 0.15,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          color: this.colors[index % this.colors.length]
        });
      }
    }
  }
  
  animate() {
    this.time += 0.004;
    
    // Deep, rich black background
    this.ctx.fillStyle = '#0a0812';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update point positions
    this.points.forEach((point, i) => {
      point.offsetX += Math.sin(this.time + i) * 0.0005;
      point.offsetY += Math.cos(this.time * 0.8 + i) * 0.0005;
    });
    
    // Draw mesh gradient
    this.ctx.globalCompositeOperation = 'lighter';
    
    for (let y = 0; y < this.gridSize - 1; y++) {
      for (let x = 0; x < this.gridSize - 1; x++) {
        const i1 = y * this.gridSize + x;
        const i2 = y * this.gridSize + (x + 1);
        const i3 = (y + 1) * this.gridSize + x;
        const i4 = (y + 1) * this.gridSize + (x + 1);
        
        this.drawQuad(
          this.points[i1],
          this.points[i2],
          this.points[i3],
          this.points[i4]
        );
      }
    }
    
    this.ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(() => this.animate());
  }
  
  drawQuad(p1, p2, p3, p4) {
    const x1 = (p1.baseX + p1.offsetX) * this.canvas.width;
    const y1 = (p1.baseY + p1.offsetY) * this.canvas.height;
    const x2 = (p2.baseX + p2.offsetX) * this.canvas.width;
    const y2 = (p2.baseY + p2.offsetY) * this.canvas.height;
    const x3 = (p3.baseX + p3.offsetX) * this.canvas.width;
    const y3 = (p3.baseY + p3.offsetY) * this.canvas.height;
    const x4 = (p4.baseX + p4.offsetX) * this.canvas.width;
    const y4 = (p4.baseY + p4.offsetY) * this.canvas.height;
    
    // Center point
    const cx = (x1 + x2 + x3 + x4) / 4;
    const cy = (y1 + y2 + y3 + y4) / 4;
    
    // Average color
    const avgColor = {
      r: Math.floor((p1.color.r + p2.color.r + p3.color.r + p4.color.r) / 4),
      g: Math.floor((p1.color.g + p2.color.g + p3.color.g + p4.color.g) / 4),
      b: Math.floor((p1.color.b + p2.color.b + p3.color.b + p4.color.b) / 4)
    };
    
    // Create radial gradient from center
    const maxDist = Math.max(
      Math.hypot(x1 - cx, y1 - cy),
      Math.hypot(x2 - cx, y2 - cy),
      Math.hypot(x3 - cx, y3 - cy),
      Math.hypot(x4 - cx, y4 - cy)
    );
    
    const gradient = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, maxDist * 1.5);
    gradient.addColorStop(0, `rgba(${avgColor.r}, ${avgColor.g}, ${avgColor.b}, 0.25)`);
    gradient.addColorStop(1, `rgba(${avgColor.r}, ${avgColor.g}, ${avgColor.b}, 0)`);
    
    this.ctx.fillStyle = gradient;
    this.ctx.filter = 'blur(60px)';
    
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineTo(x4, y4);
    this.ctx.lineTo(x3, y3);
    this.ctx.closePath();
    this.ctx.fill();
    
    this.ctx.filter = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const bgContainer = document.getElementById('background');
  if (bgContainer) {
    new MeshGradientBackground('background');
  }
});
