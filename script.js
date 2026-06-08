/////////////////////////////////////////////////////
// ATOMLAB — FINAL 3D ATOM ENGINE (VIDEO MATCH STYLE)
/////////////////////////////////////////////////////

// ===============================
// GLOBAL STATE (SAFE)
// ===============================
window.STATE = { Z: 1, symbol: "H" };

// ===============================
// ELEMENTS
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
// 🔥 ROBUST ELEMENT DETECTOR (FIXES HYDROGEN BUG)
// ===============================
function getCurrentElement() {
  const sel = document.getElementById("element-select");

  if (!sel) return { Z: 1, symbol: "H" };

  const value = sel.value;
  const text = sel.options?.[sel.selectedIndex]?.text || "";

  // CASE 1: numeric Z
  const Z = parseInt(value);
  if (!isNaN(Z) && Z >= 1 && Z <= 118) {
    return { Z, symbol: SYMBOLS[Z - 1] };
  }

  // CASE 2: symbol in value or text
  for (let i = 0; i < SYMBOLS.length; i++) {
    if (value === SYMBOLS[i] || text.includes(SYMBOLS[i])) {
      return { Z: i + 1, symbol: SYMBOLS[i] };
    }
  }

  return { Z: 1, symbol: "H" };
}

// ===============================
// LOAD ELEMENT (SYNC UI + SIMULATION)
// ===============================
function loadElement() {
  const el = getCurrentElement();

  window.STATE.Z = el.Z;
  window.STATE.symbol = el.symbol;

  setText("el-symbol", el.symbol);
  setText("el-z", el.Z);
  setText("el-protons", el.Z);
  setText("el-electrons", el.Z);
  setText("el-mass", (el.Z * 2.1).toFixed(2));

  window.atomEngine?.update(el.Z);
}

// ===============================
// NAV SAFE (DO NOT BREAK YOUR SITE)
// ===============================
window.showPage = function (id) {
  document.querySelectorAll("div[id^='page-']")
    .forEach(p => p.style.display = "none");

  const target = document.getElementById("page-" + id);
  if (target) target.style.display = "flex";

  if (id === "atomic") {
    loadElement();
  }
};

// ===============================
// ⭐ REAL 3D ATOM ENGINE (VIDEO MATCH)
// ===============================
class AtomEngine {
  constructor(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof THREE === "undefined") return;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.z = 14;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });

    this.renderer.setSize(350, 350);

    // ===============================
    // DRAG ROTATION (3D)
    // ===============================
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
      new THREE.SphereGeometry(0.8, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xff4444 })
    );

    this.scene.add(this.nucleus);

    this.electrons = [];
    this.rings = [];

    this.update(1);
    this.animate();
  }

  // shell system
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

      const count = Math.min(this.shells()[s], remaining);
      const radius = base + s * 1.7;

      // ===============================
      // ORBIT RING (VISIBLE + TILTED)
      // ===============================
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.015, 12, 140),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.25
        })
      );

      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;
      ring.rotation.z = Math.random() * Math.PI;

      this.scene.add(ring);
      this.rings.push(ring);

      // ===============================
      // ELECTRONS (TRUE 3D MOTION)
      // ===============================
      for (let i = 0; i < count; i++) {
        const e = new THREE.Mesh(
          new THREE.SphereGeometry(0.13, 14, 14),
          new THREE.MeshBasicMaterial({ color: 0x00d4ff })
        );

        e.userData = {
          angle: (i / count) * Math.PI * 2,
          radius,
          speed: 0.02 + s * 0.002,
          tilt: ring.rotation
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
      e.position.z = Math.sin(e.userData.angle * 0.65) * r * 0.45;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// ===============================
// 🔥 AUTO DETECTION (NO HTML DEPENDENCY BUGS)
// ===============================
function startAutoSync() {
  const sel = document.getElementById("element-select");
  if (!sel) return;

  let last = sel.value;

  setInterval(() => {
    if (sel.value !== last) {
      last = sel.value;
      loadElement();
    }
  }, 200);
}

// ===============================
// INIT
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  window.atomEngine = new AtomEngine("atom-canvas");

  loadElement();
  startAutoSync();
});
