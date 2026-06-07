// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);

// Nucleus
const nucleus = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xff4444 })
);
scene.add(nucleus);

// Shell radii
const shells = [2, 3.5];

// Electron config (Bohr model style)
const electrons = [];

// Shell 1 (max 2 electrons)
for (let i = 0; i < 2; i++) {
  const e = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0x00ffff })
  );

  e.angle = Math.random() * Math.PI * 2;
  e.radius = shells[0];

  scene.add(e);
  electrons.push(e);
}

// Shell 2 (max 2 for demo, can extend to 8 later)
for (let i = 0; i < 2; i++) {
  const e = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0x00ff88 })
  );

  e.angle = Math.random() * Math.PI * 2;
  e.radius = shells[1];

  scene.add(e);
  electrons.push(e);
}

// Camera position
camera.position.z = 7;

// Animation
function animate() {
  requestAnimationFrame(animate);

  electrons.forEach((e, i) => {
    e.angle += 0.02 + i * 0.002;

    e.position.x = Math.cos(e.angle) * e.radius;
    e.position.z = Math.sin(e.angle) * e.radius;
  });

  renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
