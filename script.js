/////////////////////////////////////////////////////
// ATOMLAB CLEAN STABLE ENGINE (FULL RESTORE BUILD)
/////////////////////////////////////////////////////

// ===============================
// GLOBAL STATE
// ===============================
window.STATE = {
  Z: 6,
  symbol: "C"
};

// ===============================
// ELEMENT LIST
// ===============================
const ELEMENT_SYMBOLS = [
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
// SAFE HELPERS
// ===============================
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerText = val;
}

function safe(v, fallback = 0) {
  const n = Number(v);
  return isNaN(n) ? fallback : n;
}

// ===============================
// PAGE NAVIGATION
// ===============================
function showPage(id) {
  document.querySelectorAll("[id^='page-']").forEach(p => {
    p.style.display = "none";
  });

  const target = document.getElementById("page-" + id);
  if (target) target.style.display = "flex";
}

// ===============================
// ELEMENT LOADER (FIXED — NO NaN EVER)
// ===============================
function loadElement() {
  const sel = document.getElementById("element-select");
  if (!sel) return;

  const Z = safe(sel.value, 6);
  const symbol = ELEMENT_SYMBOLS[Z - 1] || "H";

  window.STATE.Z = Z;
  window.STATE.symbol = symbol;

  setText("el-symbol", symbol);
  setText("el-z", Z);
  setText("el-protons", Z);
  setText("el-electrons", Z);

  const neutrons = Math.round(Z * 1.1);
  setText("el-neutrons", neutrons);

  setText("el-mass", (Z * 2.2).toFixed(3) + " u");

  const valence = Z <= 2 ? Z : ((Z % 8) || 1);
  setText("el-valence", valence);

  setText("atom-name-chip", symbol);

  if (window.atomRenderer) {
    window.atomRenderer.update(Z);
  }
}

// ===============================
// ATOM RENDERER (STABLE THREE.JS CORE)
// ===============================
class AtomRenderer {
  constructor(id) {
    const canvas = document.getElementById(id);
    if (!canvas || typeof THREE === "undefined") return;

    this.canvas = canvas;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.z = 6;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });

    this.resize();

    window.addEventListener("resize", () => this.resize());

    this.electrons = [];

    this.nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0xff4444 })
    );

    this.scene.add(this.nucleus);

    this.createElectrons(6);
    this.animate();
  }

  resize() {
    const r = this.canvas.getBoundingClientRect();
    this.renderer.setSize(r.width, r.height);
    this.camera.aspect = r.width / r.height;
    this.camera.updateProjectionMatrix();
  }

  createElectrons(Z) {
    this.electrons.forEach(e => this.scene.remove(e.mesh));
    this.electrons = [];

    const shells = [2, 8, 18, 32];
    let remaining = Z;
    let baseR = 1.5;

    for (let s = 0; s < shells.length && remaining > 0; s++) {
      const count = Math.min(shells[s], remaining);

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;

        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 16, 16),
          new THREE.MeshBasicMaterial({
            color: 0x00d4ff,
            emissive: 0x003344
          })
        );

        const radius = baseR + s * 1.4;

        this.electrons.push({
          mesh,
          angle,
          radius,
          speed: 0.02 + s * 0.002
        });

        this.scene.add(mesh);
      }

      remaining -= count;
    }
  }

  update(Z) {
    this.createElectrons(Z);
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
// ORBITAL (SAFE STUB)
// ===============================
function selectOrbital(type, name) {
  document.querySelectorAll(".orbital-item")
    .forEach(e => e.classList.remove("selected"));

  const clicked = event?.target?.closest(".orbital-item");
  if (clicked) clicked.classList.add("selected");

  setText("orbital-name-chip", name + " orbital");
  setText("orbital-theory-content", name + " orbital selected.");
}

function updateOrbitalOpacity(v) {
  const c = document.getElementById("orbital-canvas");
  if (c) c.style.opacity = v / 100;
}

// ===============================
// BONDING TABS (SAFE)
// ===============================
function showBondTab(tab) {
  document.querySelectorAll(".bond-tab-content")
    .forEach(e => e.style.display = "none");

  const t = document.getElementById("bond-tab-" + tab);
  if (t) t.style.display = "block";
}

// ===============================
// INIT
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  window.atomRenderer = new AtomRenderer("atom-canvas");

  const sel = document.getElementById("element-select");
  if (sel) sel.addEventListener("change", loadElement);

  loadElement();
});
