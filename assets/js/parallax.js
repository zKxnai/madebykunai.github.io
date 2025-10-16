// Parallax Scrolling Effect
function handleParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.05 + (index * 0.02);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
}

// Smooth scroll with parallax
let ticking = false;
window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(function() {
            handleParallax();
            ticking = false;
        });
        ticking = true;
    }
});
