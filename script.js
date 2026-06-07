// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Atom nucleus
const nucleusGeometry = new THREE.SphereGeometry(1, 32, 32);
const nucleusMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
scene.add(nucleus);

// Electron
const electronGeometry = new THREE.SphereGeometry(0.2, 16, 16);
const electronMaterial = new THREE.MeshBasicMaterial({color: 0x00ffff});
const electron = new THREE.Mesh(electronGeometry, electronMaterial);
scene.add(electron);

// Orbit radius
let angle = 0;

// Camera position
camera.position.z = 5;

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  angle += 0.02;

  electron.position.x = Math.cos(angle) * 2;
  electron.position.z = Math.sin(angle) * 2;

  renderer.render(scene, camera);
}

animate();

// Resize handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
