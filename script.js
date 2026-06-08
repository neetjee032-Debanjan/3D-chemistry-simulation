/////////////////////////////////////////////////////
// ATOM SIMULATION CORE (STABLE ARCHITECTURE)
/////////////////////////////////////////////////////

// ===============================
// DATA LAYER (TRUTH SOURCE)
// ===============================
const PERIODIC_TABLE = [
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
// STATE (SINGLE SOURCE)
// ===============================
const STATE = {
  Z: 1,
  symbol: "H"
};

// ===============================
// SAFE DOM ACCESS
// ===============================
function $(id) {
  return document.getElementById(id);
}

function set(id, val) {
  const el = $(id);
  if (el) el.innerText = val;
}

// ===============================
// ELEMENT RESOLVER (NO FAIL MODE)
// ===============================
function resolveElement() {
  const sel = $("element-select");
  if (!sel) return { Z: 1, symbol: "H" };

  const index = sel.selectedIndex;
  const value = sel.value;

  // Case 1: numeric index
  let Z = parseInt(value);

  if (!isNaN(Z) && Z >= 1 && Z <= 118) {
    return { Z, symbol: PERIODIC_TABLE[Z - 1] };
  }

  // Case 2: direct symbol match
  const symIndex = PERIODIC_TABLE.indexOf(value);
  if (symIndex !== -1) {
    return { Z: symIndex + 1, symbol: value };
  }

  // Case 3: fallback via dropdown index (CRITICAL FIX)
  if (index >= 0 && index < 118) {
    return {
      Z: index + 1,
      symbol: PERIODIC_TABLE[index]
    };
  }

  return { Z: 1, symbol: "H" };
}

// ===============================
// LOAD ELEMENT (UI + STATE + SIM)
// ===============================
function loadElement() {
  const el = resolveElement();

  STATE.Z = el.Z;
  STATE.symbol = el.symbol;

  set("el-symbol", el.symbol);
  set("el-z", el.Z);
  set("el-protons", el.Z);
  set("el-electrons", el.Z);
  set("el-mass", (el.Z * 2.2).toFixed(2));

  if (window.ATOM) {
    window.ATOM.update(el.Z);
  }
}

// ===============================
// THREE.JS ENGINE (CLEAN RENDER ONLY)
// ===============================
class AtomEngine {
  constructor(canvasId) {
    const canvas = $(canvasId);
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

    this.rx = 0;
    this.ry = 0;
    this.drag = false;

    canvas.addEventListener("mousedown", e => {
      this.drag = true;
      this.x = e.clientX;
      this.y = e.clientY;
    });

    window.addEventListener("mouseup", () => this.drag = false);

    window.addEventListener("mousemove", e => {
      if (!this.drag) return;
      this.ry += (e.clientX - this.x) * 0.01;
      this.rx += (e.clientY - this.y) * 0.01;
      this.x = e.clientX;
      this.y = e.clientY;
    });

    this.nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xff4444 })
    );

    this.scene.add(this.nucleus);

    this.electrons = [];
    this.orbits = [];

    this.update(1);
    this.animate();
  }

  shells() {
    return [2, 8, 18, 32, 50, 72, 98];
  }

  update(Z) {
    Z = Math.max(1, Math.min(118, Z || 1));

    this.electrons.forEach(e => this.scene.remove(e));
    this.orbits.forEach(o => this.scene.remove(o));

    this.electrons = [];
    this.orbits = [];

    let remaining = Z;
    let base = 2;

    for (let s = 0; s < this.shells().length; s++) {
      if (remaining <= 0) break;

      const count = Math.min(this.shells()[s], remaining);
      const radius = base + s * 1.7;

      const orbit = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.015, 12, 120),
        new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.2, transparent: true })
      );

      this.scene.add(orbit);
      this.orbits.push(orbit);

      for (let i = 0; i < count; i++) {
        const e = new THREE.Mesh(
          new THREE.SphereGeometry(0.13, 14, 14),
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
// INIT (STABLE HOOKS)
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  window.ATOM = new AtomEngine("atom-canvas");

  const sel = $("element-select");
  if (sel) sel.addEventListener("change", loadElement);

  loadElement();
});
