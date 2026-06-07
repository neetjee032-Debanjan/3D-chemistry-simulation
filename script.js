// =============================
// PAGE NAVIGATION
// =============================
function showPage(page) {
  const pages = document.querySelectorAll('[id^="page-"]');
  pages.forEach(p => p.style.display = "none");

  const target = document.getElementById("page-" + page);
  if (target) target.style.display = "flex";

  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  event?.target?.classList.add("active");
}

// =============================
// ELEMENT DATABASE (core set)
// =============================
const ELEMENTS = {
  H:  {z:1, mass:1.008, config:"1s¹", valence:1, en:2.20, radius:53, ox:"+1"},
  He: {z:2, mass:4.0026, config:"1s²", valence:2, en:0, radius:31, ox:"0"},
  C:  {z:6, mass:12.011, config:"1s² 2s² 2p²", valence:4, en:2.55, radius:77, ox:"±4"},
  N:  {z:7, mass:14.007, config:"1s² 2s² 2p³", valence:5, en:3.04, radius:75, ox:"-3,+3,+5"},
  O:  {z:8, mass:15.999, config:"1s² 2s² 2p⁴", valence:6, en:3.44, radius:73, ox:"-2"},
  F:  {z:9, mass:18.998, config:"1s² 2s² 2p⁵", valence:7, en:3.98, radius:71, ox:"-1"},
  Ne: {z:10, mass:20.180, config:"1s² 2s² 2p⁶", valence:8, en:0, radius:69, ox:"0"}
};

// =============================
// LOAD ELEMENT
// =============================
function loadElement() {
  const symbol = document.getElementById("element-select").value;
  const el = ELEMENTS[symbol];
  if (!el) return;

  document.getElementById("el-symbol").innerText = symbol;
  document.getElementById("el-z").innerText = el.z;
  document.getElementById("el-mass").innerText = el.mass;
  document.getElementById("el-protons").innerText = el.z;
  document.getElementById("el-electrons").innerText = el.z;
  document.getElementById("el-config").innerText = el.config;
  document.getElementById("el-valence").innerText = el.valence;
  document.getElementById("el-en").innerText = el.en;
  document.getElementById("el-radius").innerText = el.radius + " pm";
  document.getElementById("el-ox").innerText = el.ox;

  document.getElementById("atom-z-badge").innerText = "Z = " + el.z;
  document.getElementById("atom-name-chip").innerText = symbol;

  if (atomRenderer) atomRenderer.update(el.z);
}

// =============================
// THREE.JS ATOM RENDERER
// =============================
class AtomRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.z = 6;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true });
    this.renderer.setSize(400, 400);

    this.electrons = [];
    this.spin = true;

    this.createNucleus();
    this.createElectrons(6);
    this.animate();
  }

  createNucleus() {
    const geo = new THREE.SphereGeometry(0.6, 32, 32);
    const mat = new THREE.MeshBasicMaterial({ color: 0xff4444 });
    this.nucleus = new THREE.Mesh(geo, mat);
    this.scene.add(this.nucleus);
  }

  createElectrons(n) {
    this.electrons.forEach(e => this.scene.remove(e.mesh));
    this.electrons = [];

    for (let i = 0; i < n; i++) {
      const geo = new THREE.SphereGeometry(0.1, 16, 16);
      const mat = new THREE.MeshBasicMaterial({ color: 0x00d4ff });
      const mesh = new THREE.Mesh(geo, mat);

      this.electrons.push({
        mesh,
        angle: Math.random() * Math.PI * 2,
        radius: 2 + Math.floor(i / 2)
      });

      this.scene.add(mesh);
    }
  }

  update(z) {
    this.createElectrons(z);
  }

  toggleSpin() {
    this.spin = !this.spin;
  }

  toggleNucleus() {
    this.nucleus.visible = !this.nucleus.visible;
  }

  setView() {
    this.camera.position.set(0, 0, 6);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.spin) {
      this.electrons.forEach(e => {
        e.angle += 0.02;
        e.mesh.position.x = Math.cos(e.angle) * e.radius;
        e.mesh.position.y = Math.sin(e.angle) * e.radius;
      });
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// =============================
// ORBITAL RENDERER (simplified)
// =============================
class OrbitalRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.z = 4;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true });
    this.renderer.setSize(400, 400);

    this.spin = true;
    this.createOrbital("s");
    this.animate();
  }

  createOrbital(type) {
    this.scene.clear();

    let geo;
    if (type === "s") geo = new THREE.SphereGeometry(1.2, 32, 32);
    else geo = new THREE.TorusGeometry(1, 0.4, 16, 100);

    const mat = new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      wireframe: true
    });

    this.mesh = new THREE.Mesh(geo, mat);
    this.scene.add(this.mesh);
  }

  toggleSpin() {
    this.spin = !this.spin;
  }

  toggleNodes() {}

  animate() {
    requestAnimationFrame(() => this.animate());
    if (this.spin && this.mesh) this.mesh.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  }
}

// =============================
// GLOBAL INSTANCES
// =============================
let atomRenderer;
let orbitalRenderer;

// init after load
window.addEventListener("DOMContentLoaded", () => {
  atomRenderer = new AtomRenderer("atom-canvas");
  orbitalRenderer = new OrbitalRenderer("orbital-canvas");
  loadElement();
});

// =============================
// ORBITAL SELECT
// =============================
function selectOrbital(type, label) {
  document.querySelectorAll(".orbital-item").forEach(i => i.classList.remove("selected"));
  event.target.closest(".orbital-item")?.classList.add("selected");

  orbitalRenderer.createOrbital(type);

  document.getElementById("orbital-name-chip").innerText = label + " orbital";
}

// =============================
// ORBITAL OPACITY
// =============================
function updateOrbitalOpacity(v) {
  if (orbitalRenderer?.mesh) {
    orbitalRenderer.mesh.material.opacity = v / 100;
    orbitalRenderer.mesh.material.transparent = true;
  }
}

// =============================
// BOND TABS
// =============================
function showBondTab(tab) {
  document.querySelectorAll(".bond-tab-content").forEach(t => t.style.display = "none");
  document.getElementById("bond-tab-" + tab).style.display = "block";

  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  event.target.classList.add("active");
}

// =============================
// PLACEHOLDER FUNCTIONS (safe)
// =============================
function loadIonicLattice() {}
function loadCovalent() {}
function loadMetallic() {}
