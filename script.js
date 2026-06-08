/////////////////////////////////////////////////////
// ATOMLAB FINAL FIXED ENGINE v3 (STABLE + ORBITALS FIX)
/////////////////////////////////////////////////////

// ===============================
// SAFE PAGE NAVIGATION
// ===============================
function showPage(id) {
  const pages = document.querySelectorAll("div[id^='page-']");
  pages.forEach(p => (p.style.display = "none"));

  const target = document.getElementById("page-" + id);
  if (target) target.style.display = "flex";

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.getAttribute("onclick")?.includes(id)) {
      btn.classList.add("active");
    }
  });

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
// ELEMENT DATABASE (SAFE SHORT)
// ===============================
const ELEMENTS = {
  H: { Z: 1, mass: 1.008, config: "1s¹", valence: 1, en: 2.2, radius: 53, ox: "+1" },
  He:{ Z: 2, mass: 4.002, config: "1s²", valence: 2, en: 0 },
  C: { Z: 6, mass: 12.01, config: "1s² 2s² 2p²", valence: 4, en: 2.55 },
  N: { Z: 7, mass: 14.01, config: "1s² 2s² 2p³", valence: 5, en: 3.04 },
  O: { Z: 8, mass: 16.00, config: "1s² 2s² 2p⁴", valence: 6, en: 3.44 },
  F: { Z: 9, mass: 18.99, config: "1s² 2s² 2p⁵", valence: 7, en: 3.98 },
  Ne:{ Z:10, mass:20.18, config:"1s² 2s² 2p⁶", valence:8, en:0 }
};

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerText = val;
}

// ===============================
// LOAD ELEMENT (SAFE)
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
  setText("el-valence", el.valence || "-");
  setText("el-en", el.en || "-");

  const chip = document.getElementById("atom-name-chip");
  if (chip) chip.innerText = sel.value;

  window.atomRenderer?.update(el.Z);
}

// ===============================
// ATOM RENDERER (STABLE FIX)
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

    this.nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xff4444 })
    );

    this.scene.add(this.nucleus);

    this.electrons = [];
    this.update(6);
    this.animate();
  }

  createElectrons(Z) {
    this.electrons.forEach(e => this.scene.remove(e.mesh));
    this.electrons = [];

    const shells = [2, 8, 18, 32];

    let remaining = Z;
    let base = 1.5;

    for (let s = 0; s < shells.length && remaining > 0; s++) {
      const count = Math.min(shells[s], remaining);

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;

        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0x00d4ff })
        );

        this.electrons.push({
          mesh,
          angle,
          radius: base + s * 1.3,
          speed: 0.02
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

    this.electrons.forEach(e => {
      e.angle += e.speed;
      e.mesh.position.x = Math.cos(e.angle) * e.radius;
      e.mesh.position.y = Math.sin(e.angle) * e.radius;
    });

    this.renderer.render(this.scene, this.camera);
  }
}

// ===============================
// ORBITAL RENDERER (FIXED SCIENTIFIC MODELS)
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

    this.meshes = [];
    this.create("s");

    this.animate();
  }

  clear() {
    this.meshes.forEach(m => this.scene.remove(m));
    this.meshes = [];
  }

  // ===============================
  // SCIENTIFIC ORBITAL APPROXIMATIONS
  // ===============================
  create(type) {
    this.clear();

    // ---------- S ORBITAL (SPHERE) ----------
    if (type === "s") {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(1.2, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: true })
      );
      this.scene.add(mesh);
      this.meshes.push(mesh);
    }

    // ---------- P ORBITAL (DUMBELL) ----------
    if (type === "p") {
      const mat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true });

      const geo = new THREE.SphereGeometry(0.6, 32, 32);

      const lobe1 = new THREE.Mesh(geo, mat);
      const lobe2 = new THREE.Mesh(geo, mat);

      lobe1.position.x = 0.8;
      lobe2.position.x = -0.8;

      this.scene.add(lobe1);
      this.scene.add(lobe2);

      this.meshes.push(lobe1, lobe2);
    }

    // ---------- D ORBITAL (CLOVER) ----------
    if (type === "d") {
      const mat = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });
      const geo = new THREE.SphereGeometry(0.45, 24, 24);

      const positions = [
        [1, 1, 0],
        [-1, 1, 0],
        [1, -1, 0],
        [-1, -1, 0]
      ];

      positions.forEach(p => {
        const m = new THREE.Mesh(geo, mat);
        m.position.set(p[0], p[1], p[2]);
        this.scene.add(m);
        this.meshes.push(m);
      });
    }

    // ---------- F ORBITAL (COMPLEX MULTI LOBE) ----------
    if (type === "f") {
      const mat = new THREE.MeshBasicMaterial({ color: 0xff8800, wireframe: true });
      const geo = new THREE.SphereGeometry(0.35, 20, 20);

      for (let i = 0; i < 6; i++) {
        const m = new THREE.Mesh(geo, mat);
        const a = (i / 6) * Math.PI * 2;

        m.position.set(
          Math.cos(a) * 1.2,
          Math.sin(a) * 1.2,
          (i % 2 === 0 ? 0.5 : -0.5)
        );

        this.scene.add(m);
        this.meshes.push(m);
      }
    }

    // ---------- HYBRID ORBITALS ----------
    if (type === "sp3") {
      const mat = new THREE.MeshBasicMaterial({ color: 0x00ff88, wireframe: true });
      const geo = new THREE.SphereGeometry(0.4, 24, 24);

      const dirs = [
        [1,1,1], [-1,1,-1], [1,-1,-1], [-1,-1,1]
      ];

      dirs.forEach(d => {
        const m = new THREE.Mesh(geo, mat);
        m.position.set(d[0], d[1], d[2]);
        this.scene.add(m);
        this.meshes.push(m);
      });
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.meshes.forEach(m => m.rotation.y += 0.01);
    this.renderer.render(this.scene, this.camera);
  }
}

// ===============================
// ORBITAL SELECT
// ===============================
function selectOrbital(type, label) {
  window.orbitalRenderer?.create(type);

  const chip = document.getElementById("orbital-name-chip");
  if (chip) chip.innerText = label + " orbital";
}

// ===============================
// THEORY PANEL FIX (IMPORTANT)
// ===============================
function setOrbitalTheory(type) {
  const theory = document.getElementById("orbital-theory");
  const energy = document.getElementById("energy-levels");

  const data = {
    s: "S orbital is spherical symmetry electron probability distribution.",
    p: "P orbital has two lobes with a nodal plane at nucleus.",
    d: "D orbitals have 4-lobed clover shape with complex nodal structure.",
    f: "F orbitals are multi-lobed complex wavefunctions.",
    sp3: "sp³ hybridization forms tetrahedral geometry with 109.5° angles."
  };

  if (theory) theory.innerText = data[type] || "Select orbital type";
  if (energy) energy.innerText = "Energy increases with angular momentum (s < p < d < f)";
}

// ===============================
// INIT
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  try {
    window.atomRenderer = new AtomRenderer("atom-canvas");
    window.orbitalRenderer = new OrbitalRenderer("orbital-canvas");
  } catch (e) {
    console.log(e);
  }

  loadElement();
});
