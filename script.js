/////////////////////////////////////////////////////
// ATOMLAB — FINAL FIXED ENGINE v2 (STABLE + ACCURATE)
/////////////////////////////////////////////////////

window.STATE = { Z: 1, symbol: "H" };

// ===============================
// FULL PERIODIC TABLE
// ===============================
const SYMBOLS = [
"H","He","Li","Be","B","C","N","O","F","Ne",
"Na","Mg","Al","Si","P","S","Cl","Ar",
"K","Ca","Sc","Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn",
"Ga","Ge","As","Se","Br","Kr",
"Rb","Sr","Y","Zr","Nb","Mo","Tc","Ru","Rh","Pd","Ag","Cd",
"In","Sn","Sb","Te","I","Xe",
"Cs","Ba","La","Ce","Pr","Nd","Pm","Sm","Eu","Gd","Tb","Dy","Ho","Er","Tm","Yb","Lu",
"Hf","Ta","W","Re","Os","Ir","Pt","Au","Hg",
"Tl","Pb","Bi","Po","At","Rn",
"Fr","Ra","Ac","Th","Pa","U","Np","Pu","Am","Cm","Bk","Cf","Es","Fm","Md","No","Lr",
"Rf","Db","Sg","Bh","Hs","Mt","Ds","Rg","Cn","Nh","Fl","Mc","Lv","Ts","Og"
];

// ===============================
// SAFE UI UPDATE
// ===============================
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerText = val;
}

// ===============================
// 🔥 FIXED ELEMENT PARSER (CORE FIX)
// ===============================
function getElementFromSelect(sel) {
  let value = sel.value;

  // CASE 1: already number (1–118)
  if (!isNaN(value)) {
    const Z = parseInt(value);
    return { Z, symbol: SYMBOLS[Z - 1] || "H" };
  }

  // CASE 2: symbol (H, C, O...)
  const index = SYMBOLS.indexOf(value);
  if (index !== -1) {
    return { Z: index + 1, symbol: value };
  }

  // fallback
  return { Z: 1, symbol: "H" };
}

// ===============================
// LOAD ELEMENT (FIXED)
// ===============================
function loadElement() {
  const sel = document.getElementById("element-select");
  if (!sel || !window.atomRenderer) return;

  const el = getElementFromSelect(sel);

  window.STATE.Z = el.Z;
  window.STATE.symbol = el.symbol;

  // UI FIXED
  setText("el-symbol", el.symbol);
  setText("el-z", el.Z);
  setText("el-protons", el.Z);
  setText("el-electrons", el.Z);

  // crude but stable mass (you can improve later)
  setText("el-mass", (el.Z * 2.1).toFixed(2));

  // UPDATE SIMULATION
  window.atomRenderer.update(el.Z);
}

// ===============================
// NAVIGATION SAFE
// ===============================
window.showPage = function (id) {
  document.querySelectorAll("div[id^='page-']")
    .forEach(p => p.style.display = "none");

  const target = document.getElementById("page-" + id);
  if (target) target.style.display = "flex";

  if (id === "atomic") {
    window.atomRenderer?.update(window.STATE.Z);
  }
};

// ===============================
// ⭐ ATOM RENDERER (FIXED + 3D ORBITS)
// ===============================
class AtomRenderer {
  constructor(id) {
    const canvas = document.getElementById(id);
    if (!canvas || typeof THREE === "undefined") return;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.z = 12;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });

    this.renderer.setSize(350, 350);

    this.rx = 0;
    this.ry = 0;
    this.drag = false;

    canvas.addEventListener("mousedown", e => {
      this.drag = true;
      this.px = e.clientX;
      this.py = e.clientY;
    });

    window.addEventListener("mouseup", () => this.drag = false);

    window.addEventListener("mousemove", e => {
      if (!this.drag) return;

      this.ry += (e.clientX - this.px) * 0.01;
      this.rx += (e.clientY - this.py) * 0.01;

      this.px = e.clientX;
      this.py = e.clientY;
    });

    // nucleus
    this.nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xff4444 })
    );
    this.scene.add(this.nucleus);

    this.electrons = [];
    this.rings = [];

    this.update(1);
    this.animate();
  }

  shells() {
    return [2, 8, 18, 32, 50, 72, 98];
  }

  update(Z) {
    Z = Math.max(1, Math.min(118, Number(Z) || 1));

    this.electrons.forEach(e => this.scene.remove(e));
    this.rings.forEach(r => this.scene.remove(r));

    this.electrons = [];
    this.rings = [];

    let remaining = Z;
    let base = 2;

    for (let s = 0; s < this.shells().length; s++) {
      if (remaining <= 0) break;

      const capacity = this.shells()[s];
      const count = Math.min(capacity, remaining);
      const radius = base + s * 1.6;

      // ORBIT RING (VISIBLE)
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.01, 10, 120),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.2
        })
      );

      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;

      this.scene.add(ring);
      this.rings.push(ring);

      // ELECTRONS
      for (let i = 0; i < count; i++) {
        const e = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0x00d4ff })
        );

        e.userData = {
          angle: (i / count) * Math.PI * 2,
          radius: radius,
          speed: 0.02 + s * 0.002
        };

        this.scene.add(e);
        this.electrons.push(e);
      }

      remaining -= count;
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.scene.rotation.x = this.rx;
    this.scene.rotation.y = this.ry;

    for (let e of this.electrons) {
      e.userData.angle += e.userData.speed;

      const r = e.userData.radius;

      e.position.x = Math.cos(e.userData.angle) * r;
      e.position.y = Math.sin(e.userData.angle) * r;
      e.position.z = Math.sin(e.userData.angle * 0.7) * r * 0.4;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// ===============================
// INIT
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  const sel = document.getElementById("element-select");

  if (sel) sel.addEventListener("change", loadElement);

  window.atomRenderer = new AtomRenderer("atom-canvas");

  loadElement();
});
