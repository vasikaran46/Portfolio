// Glowing cricket ball with a seam that follows pointer movement and scroll.
(() => {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || !window.THREE) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const ball = new THREE.Group();
  const leather = new THREE.MeshStandardMaterial({ color: 0x9f071f, emissive: 0x36000a, roughness: 0.32, metalness: 0.08 });
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.65, 48, 32), leather);
  ball.add(sphere);
  const seamMaterial = new THREE.MeshStandardMaterial({ color: 0xffd6bd, emissive: 0x6a1820, roughness: 0.55 });
  const seamPoints = [];
  for (let i = 0; i <= 100; i += 1) {
    const t = (i / 100) * Math.PI * 2;
    seamPoints.push(new THREE.Vector3(1.66 * Math.cos(t), 1.66 * Math.sin(t) * 0.22, 1.66 * Math.sin(t) * 0.97));
  }
  const seam = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(seamPoints), 100, 0.035, 6, false), seamMaterial);
  seam.rotation.z = 0.28;
  ball.add(seam);
  const stitches = new THREE.Group();
  for (let i = 0; i < 17; i += 1) {
    const t = (i / 16 - 0.5) * 1.75;
    const stitch = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 5), seamMaterial);
    stitch.position.set(1.66 * Math.cos(t), 1.66 * Math.sin(t) * 0.22, 1.66 * Math.sin(t) * 0.97);
    stitches.add(stitch);
  }
  stitches.rotation.z = 0.28;
  ball.add(stitches);
  ball.rotation.set(0.22, -0.35, 0.18);
  scene.add(ball);
  const glow = new THREE.PointLight(0xff4029, 18, 9);
  glow.position.set(-2, 2, 4);
  scene.add(glow, new THREE.AmbientLight(0xffffff, 1.4));

  let visible = false;
  let frame = 0;
  let targetX = 0;
  let targetY = 0;
  let pointerX = 0;
  let pointerY = 0;
  let scrollRotation = 0;
  function resize() {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (!visible || reducedMotion.matches) renderer.render(scene, camera);
  }
  function render() {
    frame = 0;
    if (!visible || reducedMotion.matches) return;
    pointerX += (targetX - pointerX) * 0.035;
    pointerY += (targetY - pointerY) * 0.035;
    ball.rotation.x += (pointerY + scrollRotation - ball.rotation.x) * 0.04;
    ball.rotation.y += (pointerX + scrollRotation * 0.6 - ball.rotation.y) * 0.04;
    renderer.render(scene, camera);
    frame = window.requestAnimationFrame(render);
  }
  function update() {
    if (visible && !reducedMotion.matches && !frame) frame = window.requestAnimationFrame(render);
    else if ((!visible || reducedMotion.matches) && frame) {
      window.cancelAnimationFrame(frame);
      frame = 0;
      renderer.render(scene, camera);
    }
  }
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    update();
  });
  observer.observe(canvas);
  window.addEventListener('pointermove', (event) => {
    targetX = (event.clientY / window.innerHeight - 0.5) * 0.8;
    targetY = (event.clientX / window.innerWidth - 0.5) * 1.2;
  }, { passive: true });
  window.addEventListener('scroll', () => {
    scrollRotation = window.scrollY * 0.0015;
    update();
  }, { passive: true });
  reducedMotion.addEventListener?.('change', update);
  window.addEventListener('resize', resize, { passive: true });
  resize();
})();
