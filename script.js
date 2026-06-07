/////////////////////////////////////////////////////
// ATOMLAB SAFE FULL ENGINE (NAVIGATION PROTECTED)
/////////////////////////////////////////////////////

// ===============================
// GLOBAL STATE
// ===============================
window.STATE = { Z: 1, symbol: "H" };

// ===============================
// 118 ELEMENT LIST
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
// SAFE TEXT UPDATE
// ===============================
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerText = val;
}

// ===============================
// NAVIGATION (RESTORED - DO NOT BREAK)
// ===============================
window.showPage = function (id) {
  const pages = document.querySelectorAll("div[id^='page-']");
  pages.forEach(p => (p.style.display = "none"));

  const target = document.getElementById("page-" + id);
  if (target) target.style.display = "flex";

  // re-init atomic ONLY when needed
  if (id === "atomic" && window.atomRenderer) {
    window.atomRenderer.update(window.STATE.Z);
  }
};

// ===============================
// LOAD ELEMENT
// ===============================
function loadElement() {
  const sel = document.getElementById("element-select");
  if (!sel) return;

  const Z = parseInt(sel.value);
  const symbol = ELEMENTS[Z - 1];

  window.STATE.Z = Z;
  window.STATE.symbol = symbol;

  setText("el-symbol", symbol);
  setText("el-z", Z);
  setText("el-protons", Z);
  setText("el-electrons", Z);
  setText("el-mass", (Z * 2.1).toFixed(2));

  window.atomRenderer?.update(Z);
}

// ===============================
// ATOM RENDERER (STABLE 3D SYSTEM)
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

    // rotation
    this.rx = 0;
    this.ry = 0;
    this.drag = false;
    this.px = 0;
    this.py = 0;

    canvas.addEventListener("mousedown", (e) => {
      this.drag = true;
      this.px = e.clientX;
      this.py = e.clientY;
    });

    window.addEventListener("mouseup", () => this.drag = false);

    window.addEventListener("mousemove", (e) => {
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
    this.shells = [];

    this.createElectrons(1);
    this.animate();
  }

  // shell structure
  getShells() {
    return [2, 8, 18, 32, 50, 72, 98];
  }

  createElectrons(Z) {
    this.electrons.forEach(e => this.scene.remove(e));
    this.shells.forEach(s => this.scene.remove(s));

    this.electrons = [];
    this.shells = [];

    const shells = this.getShells();
    let remaining = Z;
    let base = 2;

    for (let s = 0; s < shells.length; s++) {
      if (remaining <= 0) break;

      const count = Math.min(shells[s], remaining);
      const radius = base + s * 1.6;

      // orbit ring (visible)
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.01, 10, 120),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          opacity: 0.2,
          transparent: true
        })
      );

      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;

      this.scene.add(ring);
      this.shells.push(ring);

      for (let i = 0; i < count; i++) {
        const electron = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0x00d4ff })
        );

        electron.userData = {
          angle: (i / count) * Math.PI * 2,
          radius: radius,
          speed: 0.02 + s * 0.002,
          tiltX: ring.rotation.x,
          tiltY: ring.rotation.y
        };

        this.scene.add(electron);
        this.electrons.push(electron);
      }

      remaining -= count;
    }
  }

  update(Z) {
    this.createElectrons(Z);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.scene.rotation.x = this.rx;
    this.scene.rotation.y = this.ry;

    for (let e of this.electrons) {
      e.userData.angle += e.userData.speed;

      e.position.x = Math.cos(e.userData.angle) * e.userData.radius;
      e.position.y = Math.sin(e.userData.angle) * e.userData.radius;
      e.position.z = Math.sin(e.userData.angle * 0.7) * (e.userData.radius * 0.35);
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
