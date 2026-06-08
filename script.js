/////////////////////////////////////////////////////
// ATOMLAB ULTRA STABLE ENGINE (FULL REBUILD FIX)
/////////////////////////////////////////////////////

// ===============================
// GLOBAL STATE (SINGLE SOURCE OF TRUTH)
// ===============================
window.STATE = {
  Z: 1,
  symbol: "H"
};

// ===============================
// FULL PERIODIC TABLE (118 ELEMENTS AUTO-GENERATED)
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
// CREATE DROPDOWN AUTOMATICALLY (FIXES YOUR MAIN ISSUE)
// ===============================
function initDropdown() {
  const sel = document.getElementById("element-select");
  if (!sel) return;

  sel.innerHTML = "";

  for (let i = 1; i <= 118; i++) {
    const opt = document.createElement("option");
    const symbol = ELEMENT_SYMBOLS[i - 1];

    opt.value = i;
    opt.textContent = `${symbol} (Z=${i})`;

    sel.appendChild(opt);
  }

  sel.value = 6; // default Carbon
}

// ===============================
// SAFE TEXT SETTER
// ===============================
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerText = val;
}

// ===============================
// MAIN ELEMENT LOADER (100% FIXED)
// ===============================
function loadElement() {
  const sel = document.getElementById("element-select");
  if (!sel) return;

  const Z = parseInt(sel.value);

  const symbol = ELEMENT_SYMBOLS[Z - 1] || "X";

  // update global state
  window.STATE.Z = Z;
  window.STATE.symbol = symbol;

  // ALWAYS overwrite UI (prevents Carbon/Hydrogen freeze)
  setText("el-symbol", symbol);
  setText("el-z", Z);
  setText("el-protons", Z);
  setText("el-electrons", Z);
  setText("el-mass", (Z * 2.2).toFixed(3));

  // update atom
  if (window.atomRenderer) {
    window.atomRenderer.update(Z);
  }

  console.log("Loaded element:", symbol, Z);
}

// ===============================
// ATOM RENDERER (STABLE FOR ALL Z)
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

    this.electrons = [];

    this.nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xff4444 })
    );

    this.scene.add(this.nucleus);

    this.createElectrons(1);
    this.animate();
  }

  createElectrons(Z) {
    this.electrons.forEach(e => this.scene.remove(e.mesh));
    this.electrons = [];

    const shells = [2, 8, 18, 32, 50, 72, 98];

    let remaining = Z;
    let baseR = 1.5;

    for (let s = 0; s < shells.length; s++) {
      if (remaining <= 0) break;

      const count = Math.min(shells[s], remaining);

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;

        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0x00d4ff })
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
// NAVIGATION (SAFE)
// ===============================
function showPage(id) {
  document.querySelectorAll("div[id^='page-']")
    .forEach(p => p.style.display = "none");

  const target = document.getElementById("page-" + id);
  if (target) target.style.display = "flex";
}

// ===============================
// INIT EVERYTHING
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  initDropdown();

  window.atomRenderer = new AtomRenderer("atom-canvas");

  const sel = document.getElementById("element-select");
  sel.addEventListener("change", loadElement);

  loadElement();
});

