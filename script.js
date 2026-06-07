/////////////////////////////////////////////////////
// ATOMLAB FINAL ENGINE — TRUE 3D ORBIT VERSION
/////////////////////////////////////////////////////

// ===============================
// GLOBAL STATE
// ===============================
window.STATE = { Z: 1, symbol: "H" };

// ===============================
// ELEMENTS (1–118)
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
// INIT DROPDOWN (118 ELEMENTS)
// ===============================
function initDropdown() {
  const sel = document.getElementById("element-select");
  if (!sel) return;

  sel.innerHTML = "";
  for (let i = 1; i <= 118; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `${ELEMENTS[i - 1]} (Z=${i})`;
    sel.appendChild(opt);
  }
  sel.value = 6;
}

// ===============================
// SAFE TEXT
// ===============================
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerText = val;
}

// ===============================
// LOAD ELEMENT (SYNC FIXED)
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
// ⭐ TRUE 3D ATOM RENDERER (FIXED PHYSICS STYLE)
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

    // ===============================
    // DRAG ROTATION
    // ===============================
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

    // ===============================
    // NUCLEUS
    // ===============================
    this.nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xff4444 })
    );
    this.scene.add(this.nucleus);

    // containers
    this.shellGroups = [];
    this.electrons = [];

    this.createElectrons(1);
    this.animate();
  }

  // ===============================
  // SHELL STRUCTURE (K L M N O P Q)
  // ===============================
  getShellCapacity() {
    return [2, 8, 18, 32, 50, 72, 98];
  }

  // ===============================
  // BUILD ATOM
  // ===============================
  createElectrons(Z) {
    // clear old
    this.shellGroups.forEach(g => this.scene.remove(g));
    this.shellGroups = [];
    this.electrons = [];

    const shells = this.getShellCapacity();
    let remaining = Z;
    let baseR = 2;

    for (let s = 0; s < shells.length; s++) {
      if (remaining <= 0) break;

      const count = Math.min(shells[s], remaining);
      const radius = baseR + s * 1.6;

      // ===============================
      // SHELL GROUP (TRUE 3D ORBIT PLANE)
      // ===============================
      const group = new THREE.Group();

      // random 3D tilt (IMPORTANT FIX)
      group.rotation.x = Math.random() * Math.PI;
      group.rotation.y = Math.random() * Math.PI;
      group.rotation.z = Math.random() * Math.PI;

      this.scene.add(group);
      this.shellGroups.push(group);

      // orbit ring (visual guide)
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.01, 10, 120),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.25
        })
      );

      group.add(ring);

      // ===============================
      // ELECTRONS (MOVE IN LOCAL PLANE)
      // ===============================
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;

        const electron = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0x00d4ff })
        );

        electron.userData = {
          angle,
          radius,
          speed: 0.02 + s * 0.003
        };

        group.add(electron);
        this.electrons.push(electron);
      }

      remaining -= count;
    }
  }

  update(Z) {
    this.createElectrons(Z);
  }

  // ===============================
  // ANIMATION LOOP (TRUE 3D ORBIT MOTION)
  // ===============================
  animate() {
    requestAnimationFrame(() => this.animate());

    // rotate whole atom
    this.scene.rotation.x = this.rx;
    this.scene.rotation.y = this.ry;

    // electrons move inside tilted shells
    for (let e of this.electrons) {
      e.userData.angle += e.userData.speed;

      const r = e.userData.radius;

      e.position.x = Math.cos(e.userData.angle) * r;
      e.position.y = Math.sin(e.userData.angle) * r;
      e.position.z = Math.sin(e.userData.angle * 0.6) * (r * 0.4);
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// ===============================
// INIT
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  initDropdown();

  window.atomRenderer = new AtomRenderer("atom-canvas");

  const sel = document.getElementById("element-select");
  if (sel) sel.addEventListener("change", loadElement);

  loadElement();
});
