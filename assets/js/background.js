const canvas = document.querySelector('canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let animationId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function animate() {
    // Clear canvas with dark background
    ctx.fillStyle = '#0a1428';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Single light source at top center
    const lightX = canvas.width / 2;
    const lightY = canvas.height * 0.05; // 5% from top
    const maxRadius = canvas.height * 0.6;

    // Create radial gradient for the light glow
    const gradient = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, maxRadius);
    gradient.addColorStop(0, 'rgba(60, 220, 240, 0.15)');
    gradient.addColorStop(0.3, 'rgba(60, 220, 240, 0.08)');
    gradient.addColorStop(1, 'rgba(60, 220, 240, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    animationId = requestAnimationFrame(animate);
  }

  resizeCanvas();
  animate();
  window.addEventListener('resize', resizeCanvas);
}