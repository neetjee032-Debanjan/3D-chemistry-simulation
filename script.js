/////////////////////////////////////////////////////
// ATOMLAB — FULL SAFE ENGINE (FINAL STABLE BUILD)
/////////////////////////////////////////////////////

// ===============================
// GLOBAL SAFE STATE
// ===============================
window.STATE = window.STATE || { Z: 1, symbol: "H" };

// ===============================
// ELEMENTS (118)
// ===============================
const ELEMENTS = [
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
// SAFE TEXT HELPER
// ===============================
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerText = val;
}

// ===============================
// LOAD ELEMENT (ULTRA SAFE)
// ===============================
function loadElement() {
  const sel = document.getElementById("element-select");
  if (!sel || !window.atomRenderer) return;

  let Z = parseInt(sel.value);

  // safety
  if (isNaN(Z) || Z < 1 || Z > 118) Z = 1;

  const symbol = ELEMENTS[Z - 1];

  window.STATE.Z = Z;
  window.STATE.symbol = symbol;

  // UI sync
  setText("el-symbol", symbol);
  setText("el-z", Z);
  setText("el-protons", Z);
  setText("el-electrons", Z);
  setText("el-mass", (Z * 2.1).toFixed(2));

  window.atomRenderer.update(Z);
}

// ===============================
// NAVIGATION (SAFE - DOES NOT BREAK ANY TAB)
// ===============================
window.showPage = function (id) {
  const pages = document.querySelectorAll("div[id^='page-']");
  pages.forEach(p => (p.style.display = "none"));

  const target = document.getElementById("page-" + id);
  if (target) target.style.display = "flex";

  // re-render atom when returning
  if (id === "atomic") {
    window.atomRenderer?.update(window.STATE.Z);
  }
};

// ===============================
// ⭐ ATOM RENDERER (TRUE 3D + STABLE)
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

    // rotation control
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

  // shell model
  shells() {
    return [2, 8, 18, 32, 50, 72, 98];
  }

  // ===============================
  // BUILD ATOM
  // ===============================
  update(Z) {
    Z = Number(Z);
    if (!Z || isNaN(Z)) Z = 1;

    // clear old
    this.electrons.forEach(e => this.scene.remove(e));
    this.rings.forEach(r => this.scene.remove(r));

    this.electrons = [];
    this.rings = [];

    const shells = this.shells();
    let remaining = Z;
    let base = 2;

    for (let s = 0; s < shells.length; s++) {
      if (remaining <= 0) break;

      const count = Math.min(shells[s], remaining);
      const radius = base + s * 1.6;

      // ORBIT RING (VISIBLE 3D)
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.01, 10, 120),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.25
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
          radius,
          speed: 0.02 + s * 0.002
        };

        this.scene.add(e);
        this.electrons.push(e);
      }

      remaining -= count;
    }
  }

  // ===============================
  // ANIMATION LOOP (REAL 3D MOTION)
  // ===============================
  animate() {
    requestAnimationFrame(() => this.animate());

    this.scene.rotation.x = this.rx;
    this.scene.rotation.y = this.ry;

    for (let e of this.electrons) {
      e.userData.angle += e.userData.speed;

      const r = e.userData.radius;

      e.position.x = Math.cos(e.userData.angle) * r;
      e.position.y = Math.sin(e.userData.angle) * r;
      e.position.z = Math.sin(e.userData.angle * 0.7) * (r * 0.35);
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// ===============================
// INIT (SAFE)
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  const sel = document.getElementById("element-select");

  if (sel) sel.addEventListener("change", loadElement);

  window.atomRenderer = new AtomRenderer("atom-canvas");

  loadElement();
});
