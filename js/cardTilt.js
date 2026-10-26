// cardTilt.js - Simple mouse‑move tilt effect for elements with class 'tilt-card'
// Applies a subtle 3D rotation based on cursor position within the element.

(() => {
  const maxTilt = 15; // maximum degrees of rotation
  const elements = document.querySelectorAll('.tilt-card');

  elements.forEach(el => {
    el.style.transition = 'transform 0.2s ease-out';
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const dx = (cx / rect.width) - 0.5; // -0.5 .. 0.5
      const dy = (cy / rect.height) - 0.5;
      const tiltX = dy * maxTilt * 2; // invert Y for natural tilt
      const tiltY = -dx * maxTilt * 2;
      el.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });
})();
