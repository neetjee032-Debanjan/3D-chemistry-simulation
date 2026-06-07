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
document.body.appendChild(renderer.domElement);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Nucleus (3D sphere)
const nucleusGeometry = new THREE.SphereGeometry(1, 32, 32);
const nucleusMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
scene.add(nucleus);

// Electrons
const electrons = [];
const electronCount = 3;

for (let i = 0; i < electronCount; i++) {
  const geometry = new THREE.SphereGeometry(0.2, 16, 16);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
  const electron = new THREE.Mesh(geometry, material);

  electron.angle = Math.random() * Math.PI * 2;
  electron.radius = 2 + i * 0.5;

  scene.add(electron);
  electrons.push(electron);
}

// Camera position
camera.position.z = 6;

// Animation
function animate() {
  requestAnimationFrame(animate);

  electrons.forEach((e, index) => {
    e.angle += 0.02 + index * 0.002;

    e.position.x = Math.cos(e.angle) * e.radius;
    e.position.z = Math.sin(e.angle) * e.radius;
  });

  controls.update();
  renderer.render(scene, camera);
}

animate();

// Resize fix
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
