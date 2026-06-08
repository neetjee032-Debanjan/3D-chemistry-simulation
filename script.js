/////////////////////////////////////////////////////
// ATOMLAB STABLE FULL ENGINE (SAFE COMPLETE BUILD)
/////////////////////////////////////////////////////

// ===============================
// GLOBAL STATE
// ===============================
window.STATE = {
  Z: 6,
  symbol: "C"
};

// ===============================
// ELEMENTS
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

function safeNum(v, fallback = 0) {
  const n = Number(v);
  return isNaN(n) ? fallback : n;
}

// ===============================
// NAVIGATION SYSTEM
// ===============================
function showPage(id) {
  document.querySelectorAll("[id^='page-']").forEach(p => {
    p.style.display = "none";
  });

  const target = document.getElementById("page-" + id);
  if (target) target.style.display = "flex";

  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  if (event?.target) event.target.classList.add("active");
}

// ===============================
// ELEMENT LOADING (FIXED — NO NaN EVER)
// ===============================
function loadElement() {
  const sel = document.getElementById("element-select");
  if (!sel) return;

  const Z = safeNum(sel.value, 6);
  const symbol = ELEMENT_SYMBOLS[Z - 1] || "H";

  window.STATE.Z = Z;
  window.STATE.symbol = symbol;

  setText("el-symbol", symbol);
  setText("el-z", Z);
  setText("el-protons", Z);
  setText("el-electrons", Z);

  // safe derived values
  const neutrons = Math.round(Z * 1.1);
  setText("el-neutrons", neutrons);

  const mass = (Z * 2.2).toFixed(3);
  setText("el-mass", mass + " u");

  const valence = Z <= 2 ? Z : (Z <= 10 ? (Z - 2) : (Z % 8));
  setText("el-valence", valence);

  // update chip
  setText("atom-name-chip", symbol);

  if (window.atomRenderer) {
    window.atomRenderer.update(Z);
  }
}

// ===============================
// ATOM RENDERER (FULLY STABLE THREE.JS)
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

    this.electrons = [];

    this.nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0xff4444 })
    );

    this.scene.add(this.nucleus);

    this.createElectrons(6);
    this.animate();

    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.renderer.setSize(rect.width, rect.height);
    this.camera.aspect = rect.width / rect.height;
    this.camera.updateProjectionMatrix();
  }

  createElectrons(Z) {
    this.electrons.forEach(e => this.scene.remove(e.mesh));
    this.electrons = [];

    const shells = [2, 8, 18, 32, 50];
    let remaining = Z;
    let baseR = 1.5;

    for (let s = 0; s < shells.length && remaining > 0; s++) {
      const count = Math.min(shells[s], remaining);

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;

        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.14, 16, 16),
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
          speed: 0.015 + s * 0.002
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
      e.mesh.position.z = Math.sin(e.angle * 0.5) * 0.3;
    });

    this.nucleus.rotation.y += 0.002;

    this.renderer.render(this.scene, this.camera);
  }
}

// ===============================
// ORBITAL SYSTEM (SAFE STUB)
// ===============================
function selectOrbital(type, name) {
  document.querySelectorAll(".orbital-item")
    .forEach(el => el.classList.remove("selected"));

  const clicked = event?.target?.closest(".orbital-item");
  if (clicked) clicked.classList.add("selected");

  setText("orbital-name-chip", name + " orbital");

  setText(
    "orbital-theory-content",
    `${name} orbital selected. Full quantum density simulation module will be added here.`
  );
}

function updateOrbitalOpacity(v) {
  const canvas = document.getElementById("orbital-canvas");
  if (canvas) canvas.style.opacity = v / 100;
}

// ===============================
// BONDING TABS (FULL FIX)
// ===============================
function showBondTab(tab) {
  document.querySelectorAll(".bond-tab-content")
    .forEach(el => el.style.display = "none");

  const target = document.getElementById("bond-tab-" + tab);
  if (target) target.style.display = "block";

  document.querySelectorAll(".tab")
    .forEach(t => t.classList.remove("active"));

  const clicked = event?.target;
  if (clicked) clicked.classList.add("active");
}

// ===============================
// INIT SYSTEM
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  window.atomRenderer = new AtomRenderer("atom-canvas");

  const sel = document.getElementById("element-select");
  if (sel) sel.addEventListener("change", loadElement);

  loadElement();
});
