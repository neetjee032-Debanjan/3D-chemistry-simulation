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

// store ONLY electrons for animation
let electrons = [];

// clear scene safely
function clearScene() {
  electrons.forEach(e => scene.remove(e));
  electrons = [];
}

// create atom
function createAtom(x, color, electronCount) {
  const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 32, 32),
    new THREE.MeshBasicMaterial({ color })
  );

  nucleus.position.x = x;
  scene.add(nucleus);

  for (let i = 0; i < electronCount; i++) {
    const e = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x00ffff })
    );

    e.angle = (Math.PI * 2 * i) / electronCount;
    e.radius = 1.5;

    e.baseX = x;

    scene.add(e);
    electrons.push(e);
  }
}

// input system
function loadModel() {
  const input = document.getElementById("input").value.toLowerCase();

  clearScene();

  if (input === "h" || input === "hydrogen") {
    createAtom(0, 0xff4444, 1);
  }

  else if (input === "o" || input === "oxygen") {
    createAtom(0, 0xff4444, 2);
  }

  else if (input === "h2o") {
    createAtom(-2, 0xff4444, 1);
    createAtom(2, 0xff4444, 1);
  }

  else {
    alert("Try: H, O, H2O");
  }
}

// animation loop
function animate() {
  requestAnimationFrame(animate);

  electrons.forEach((e, i) => {
    e.angle += 0.02;

    e.position.x = e.baseX + Math.cos(e.angle) * e.radius;
    e.position.z = Math.sin(e.angle) * e.radius;
  });

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
