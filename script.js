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

// Atoms (2 Hydrogen atoms)
function createHydrogen(x) {
  const group = new THREE.Group();

  // nucleus
  const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xff4444 })
  );
  group.add(nucleus);

  // electron
  const electron = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0x00ffff })
  );

  electron.angle = Math.random() * Math.PI * 2;
  electron.radius = 1.2;

  group.add(electron);

  group.electron = electron;
  group.position.x = x;

  return group;
}

// Create two hydrogen atoms
const atom1 = createHydrogen(-4);
const atom2 = createHydrogen(4);

scene.add(atom1);
scene.add(atom2);

// Bond line (covalent bond)
const bondMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const bondGeometry = new THREE.BufferGeometry();
const bondPoints = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 0, 0)
];
bondGeometry.setFromPoints(bondPoints);
const bond = new THREE.Line(bondGeometry, bondMaterial);
scene.add(bond);

// Camera position
camera.position.z = 8;

// Animation state
let t = 0;

// Animate
function animate() {
  requestAnimationFrame(animate);

  t += 0.01;

  // Move atoms towards each other
  atom1.position.x += 0.02;
  atom2.position.x -= 0.02;

  // Rotate electrons
  [atom1, atom2].forEach(atom => {
    atom.electron.angle += 0.05;

    atom.electron.position.x = Math.cos(atom.electron.angle) * atom.electron.radius;
    atom.electron.position.z = Math.sin(atom.electron.angle) * atom.electron.radius;
  });

  // Update bond line between atoms
  bond.geometry.setFromPoints([
    atom1.position,
    atom2.position
  ]);

  renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
