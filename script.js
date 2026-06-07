/////////////////////////////////////////////////////
// ATOMLAB FINAL STABLE ENGINE (CLEAN BUILD)
// Works with your provided HTML structure
/////////////////////////////////////////////////////

// ===============================
// SAFE PAGE NAVIGATION
// ===============================
function showPage(id) {
  const pages = document.querySelectorAll("div[id^='page-']");
  pages.forEach(p => (p.style.display = "none"));

  const target = document.getElementById("page-" + id);
  if (target) target.style.display = "flex";

  // highlight nav safely
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.getAttribute("onclick")?.includes(id)) {
      btn.classList.add("active");
    }
  });

  // init pages safely
  setTimeout(() => {
    if (id === "atomic") initAtomicPage?.();
    if (id === "orbital") initOrbitalPage?.();
    if (id === "bonding") initBondingPage?.();
    if (id === "vsepr") initVSEPRPage?.();
    if (id === "hybrid") initHybridPage?.();
    if (id === "mot") initMOTPage?.();
    if (id === "molecules") initMolPage?.();
  }, 50);
}

// ===============================
// ELEMENT SAFE LOADER
// ===============================
const ELEMENTS = {
  H: { Z: 1, mass: 1.008, config: "1s¹", valence: 1, en: 2.2, radius: 53, ox: "+1", block: "s" },
  C: { Z: 6, mass: 12.01, config: "1s² 2s² 2p²", valence: 4, en: 2.55, radius: 77, ox: "±4", block: "p" },
  N: { Z: 7, mass: 14.01, config: "1s² 2s² 2p³", valence: 5, en: 3.04, radius: 75, ox: "-3,+5", block: "p" },
  O: { Z: 8, mass: 16.00, config: "1s² 2s² 2p⁴", valence: 6, en: 3.44, radius: 73, ox: "-2", block: "p" },
  F: { Z: 9, mass: 18.99, config: "1s² 2s² 2p⁵", valence: 7, en: 3.98, radius: 71, ox: "-1", block: "p" },
  Ne:{ Z:10, mass:20.18, config:"1s² 2s² 2p⁶", valence:8, en:0, radius:69, ox:"0", block:"p"}
};

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerText = val;
}

// ===============================
// LOAD ELEMENT (FIXED FOR YOUR HTML)
// ===============================
function loadElement() {
  const sel = document.getElementById("element-select");
  if (!sel) return;

  const el = ELEMENTS[sel.value];
  if (!el) return;

  setText("el-symbol", sel.value);
  setText("el-z", el.Z);
  setText("el-mass", el.mass);
  setText("el-protons", el.Z);
  setText("el-electrons", el.Z);
  setText("el-config", el.config);
  setText("el-valence", el.valence);
  setText("el-en", el.en);
  setText("el-radius", el.radius + " pm");
  setText("el-ox", el.ox);

  const chip = document.getElementById("atom-name-chip");
  if (chip) chip.innerText = sel.value;

  if (window.atomRenderer?.update) {
    window.atomRenderer.update(el.Z);
  }
}

// ===============================
// THREE JS ATOM (SAFE CORE)
// ===============================
class AtomRenderer {
  constructor(id) {
    const canvas = document.getElementById(id);
    if (!canvas || typeof THREE === "undefined") return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.z = 6;

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    this.renderer.setSize(350, 350);

    this.spin = true;

    this.nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xff4444 })
    );

    this.scene.add(this.nucleus);

    this.electrons = [];
    this.createElectrons(6);

    this.animate();
  }

  createElectrons(Z) {

this.electrons.forEach(e => this.scene.remove(e.mesh));
this.electrons = [];

// REAL SHELL CAPACITY (works for ALL elements up to 118)
const shells = [2, 8, 18, 32, 50, 72];

let remaining = Z;
let baseRadius = 1.5;

for (let s = 0; s < shells.length; s++) {

if (remaining <= 0) break;

let count = Math.min(shells[s], remaining);

// FIXED ANGLE DISTRIBUTION (no randomness = stable visuals)
for (let i = 0; i < count; i++) {

let angle = (i / count) * Math.PI * 2;

let mesh = new THREE.Mesh(
new THREE.SphereGeometry(0.1, 12, 12),
new THREE.MeshBasicMaterial({ color: 0x00d4ff })
);

// each shell has fixed radius spacing
let radius = baseRadius + s * 1.3;

this.electrons.push({
mesh: mesh,
angle: angle,
radius: radius,
speed: 0.015 + s * 0.003
});

this.scene.add(mesh);
}

remaining -= count;
}
}
  update(z) {
    this.createElectrons(z);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.spin) {
      this.electrons.forEach(e => {
        e.angle += 0.02;
        e.mesh.position.x = Math.cos(e.angle) * e.r;
        e.mesh.position.y = Math.sin(e.angle) * e.r;
      });
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// ===============================
// ORBITAL (SAFE)
// ===============================
class OrbitalRenderer {
  constructor(id) {
    const canvas = document.getElementById(id);
    if (!canvas || typeof THREE === "undefined") return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.z = 4;

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    this.renderer.setSize(350, 350);

    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: true })
    );

    this.scene.add(this.mesh);

    this.animate();
  }

  create(type) {
    this.scene.remove(this.mesh);

    const geo =
      type === "s"
        ? new THREE.SphereGeometry(1.2, 24, 24)
        : new THREE.TorusGeometry(1, 0.4, 16, 100);

    this.mesh = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: true })
    );

    this.scene.add(this.mesh);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (this.mesh) this.mesh.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  }
}

// ===============================
// ORBITAL SELECT
// ===============================
function selectOrbital(type, label) {
  document.querySelectorAll(".orbital-item")
    .forEach(i => i.classList.remove("selected"));

  const clicked = [...document.querySelectorAll(".orbital-item")]
    .find(i => i.getAttribute("onclick")?.includes(type));

  if (clicked) clicked.classList.add("selected");

  window.orbitalRenderer?.create(type);

  const chip = document.getElementById("orbital-name-chip");
  if (chip) chip.innerText = label + " orbital";
}

// ===============================
// BOND TAB SAFE FIX
// ===============================
function showBondTab(tab) {
  document.querySelectorAll(".bond-tab-content")
    .forEach(t => (t.style.display = "none"));

  const el = document.getElementById("bond-tab-" + tab);
  if (el) el.style.display = "block";

  document.querySelectorAll(".tab")
    .forEach(t => t.classList.remove("active"));

  const active = [...document.querySelectorAll(".tab")]
    .find(t => t.getAttribute("onclick")?.includes(tab));

  if (active) active.classList.add("active");
}

// ===============================
// INIT ON LOAD
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  try {
    window.atomRenderer = new AtomRenderer("atom-canvas");
    window.orbitalRenderer = new OrbitalRenderer("orbital-canvas");
  } catch (e) {
    console.log("Init error:", e);
  }

  loadElement();
});
