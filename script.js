const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);

camera.position.z = 8;

// store objects so we can reset
let objects = [];

// clear scene function
function clearScene() {
  objects.forEach(obj => scene.remove(obj));
  objects = [];
}

// create atom
function createAtom(x, color, electrons = 1) {
  const group = new THREE.Group();

  const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 32, 32),
    new THREE.MeshBasicMaterial({ color })
  );

  group.add(nucleus);

  for (let i = 0; i < electrons; i++) {
    const e = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x00ffff })
    );

    e.angle = (Math.PI * 2 * i) / electrons;
    e.radius = 1.5;

    // ⭐ IMPORTANT FIX: set initial visible position
    e.position.x = Math.cos(e.angle) * e.radius;
    e.position.z = Math.sin(e.angle) * e.radius;

    e.tick = () => {
      e.angle += 0.03;
      e.position.x = Math.cos(e.angle) * e.radius;
      e.position.z = Math.sin(e.angle) * e.radius;
    };

    group.add(e);
    objects.push(e);
  }

  group.position.x = x;

  scene.add(group);
  objects.push(group);

  return group;
}
function loadModel() {
  const input = document.getElementById("input").value.toLowerCase();

  clearScene();

  // HYDROGEN
  if (input === "h" || input === "hydrogen") {
    createAtom(0, 0xff4444, 1);
  }

  // OXYGEN
  else if (input === "o" || input === "oxygen") {
    createAtom(0, 0xff4444, 2);
  }

  // H2O (water)
  else if (input === "h2o") {
    createAtom(-2, 0xff4444, 1);
    createAtom(2, 0xff4444, 1);
  }

  // CO2
  else if (input === "co2") {
    createAtom(-3, 0xff4444, 2);
    createAtom(3, 0xff4444, 2);
  }

  else {
    alert("Model not found. Try H, O, H2O, CO2");
  }
}

// animation loop
function animate() {
  requestAnimationFrame(animate);

  objects.forEach(obj => {
    if (obj.tick) obj.tick();
  });

  renderer.render(scene, camera);
}

animate();

// resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
