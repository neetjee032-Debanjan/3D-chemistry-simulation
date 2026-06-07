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
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(nucleus);

// Electrons
const electrons = [];
for (let i = 0; i < 3; i++) {
  const e = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0x00ffff })
  );

  e.angle = Math.random() * Math.PI * 2;
  e.radius = 2 + i * 0.6;

  scene.add(e);
  electrons.push(e);
}

// Camera position
camera.position.z = 6;

// Animate
function animate() {
  requestAnimationFrame(animate);

  electrons.forEach((e, i) => {
    e.angle += 0.02 + i * 0.005;

    e.position.x = Math.cos(e.angle) * e.radius;
    e.position.z = Math.sin(e.angle) * e.radius;
  });

  renderer.render(scene, camera);
}

animate();

// Resize fix
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
