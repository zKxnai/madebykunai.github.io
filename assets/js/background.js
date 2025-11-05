class ProfessionalGradientBackground {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);
    
    // Sophisticated, neutral palette - iOS inspired but timeless
    this.colors = [
      { r: 75, g: 85, b: 115 },    // Slate blue
      { r: 95, g: 75, b: 105 },    // Deep purple-gray
      { r: 70, g: 90, b: 100 },    // Cool teal-gray
      { r: 85, g: 75, b: 95 },     // Muted purple
      { r: 65, g: 80, b: 105 }     // Steel blue
    ];
    
    this.gridSize = 4;
    this.points = [];
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
          offsetX: (Math.random() - 0.5) * 0.12,
          offsetY: (Math.random() - 0.5) * 0.12,
          speedX: (Math.random() - 0.5) * 0.25,
          speedY: (Math.random() - 0.5) * 0.25,
          color: this.colors[index % this.colors.length]
        });
      }
    }
  }
  
  animate() {
    this.time += 0.003;
    
    // Rich, professional dark background
    this.ctx.fillStyle = '#0d0f14';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update positions with subtle, organic movement
    this.points.forEach((point, i) => {
      point.offsetX += Math.sin(this.time + i * 0.5) * 0.0004;
      point.offsetY += Math.cos(this.time * 0.7 + i * 0.5) * 0.0004;
      
      // Keep within bounds
      point.offsetX = Math.max(-0.15, Math.min(0.15, point.offsetX));
      point.offsetY = Math.max(-0.15, Math.min(0.15, point.offsetY));
    });
    
    // Draw sophisticated mesh
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
    
    const cx = (x1 + x2 + x3 + x4) / 4;
    const cy = (y1 + y2 + y3 + y4) / 4;
    
    const avgColor = {
      r: Math.floor((p1.color.r + p2.color.r + p3.color.r + p4.color.r) / 4),
      g: Math.floor((p1.color.g + p2.color.g + p3.color.g + p4.color.g) / 4),
      b: Math.floor((p1.color.b + p2.color.b + p3.color.b + p4.color.b) / 4)
    };
    
    const maxDist = Math.max(
      Math.hypot(x1 - cx, y1 - cy),
      Math.hypot(x2 - cx, y2 - cy),
      Math.hypot(x3 - cx, y3 - cy),
      Math.hypot(x4 - cx, y4 - cy)
    );
    
    const gradient = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, maxDist * 1.4);
    gradient.addColorStop(0, `rgba(${avgColor.r}, ${avgColor.g}, ${avgColor.b}, 0.35)`);
    gradient.addColorStop(1, `rgba(${avgColor.r}, ${avgColor.g}, ${avgColor.b}, 0)`);
    
    this.ctx.fillStyle = gradient;
    this.ctx.filter = 'blur(70px)';
    
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
    new ProfessionalGradientBackground('background');
  }
});
