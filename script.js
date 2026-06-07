/////////////////////////////////////////////////////
// ATOMLAB FINAL STABLE FULL ENGINE (REBUILT)
/////////////////////////////////////////////////////

// ===============================
// GLOBAL STATE
// ===============================
window.STATE = {
  Z: 1,
  symbol: "H"
};

// ===============================
// ELEMENT SYMBOL LIST (1–118)
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
// INIT DROPDOWN (AUTO 118 ELEMENTS)
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

  sel.value = 6; // default Carbon
}

// ===============================
// SAFE TEXT UPDATE
// ===============================
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerText = val;
}

// ===============================
// LOAD ELEMENT (FIXED SYNC SYSTEM)
// ===============================
function loadElement() {
  const sel = document.getElementById("element-select");
  if (!sel) return;

  const Z = parseInt(sel.value);
  const symbol = ELEMENTS[Z - 1];

  // global state sync
  window.STATE.Z = Z;
  window.STATE.symbol = symbol;

  // UI update (NO OLD DATA EVER REMAINS)
  setText("el-symbol", symbol);
  setText("el-z", Z);
  setText("el-protons", Z);
  setText("el-electrons", Z);
  setText("el-mass", (Z * 2.1).toFixed(2));

  // update atom
  if (window.atomRenderer) {
    window.atomRenderer.update(Z);
  }

  console.log("Loaded:", symbol, Z);
}

// ===============================
// ATOM RENDERER (TRUE 3D ORBIT SYSTEM)
// ===============================
class AtomRenderer {
  constructor(id) {
    const canvas = document.getElementById(id);
    if (!canvas || typeof THREE === "undefined") return;

    // scene
    this.scene = new THREE.Scene();

    // camera
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.z = 10;

    // renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });

    this.renderer.setSize(350, 350);

    // rotation control
    this.rotX = 0;
    this.rotY = 0;
    this.drag = false;
    this.prevX = 0;
    this.prevY = 0;

    canvas.addEventListener("mousedown", (e) => {
      this.drag = true;
      this.prevX = e.clientX;
      this.prevY = e.clientY;
    });

    window.addEventListener("mouseup", () => {
      this.drag = false;
    });

    window.addEventListener("mousemove", (e) => {
      if (!this.drag) return;

      this.rotY += (e.clientX - this.prevX) * 0.01;
      this.rotX += (e.clientY - this.prevY) * 0.01;

      this.prevX = e.clientX;
      this.prevY = e.clientY;
    });

    // nucleus
    this.nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xff4444 })
    );

    this.scene.add(this.nucleus);

    this.electrons = [];
    this.orbits = [];

    this.createElectrons(1);
    this.animate();
  }

  // ===============================
  // ELECTRONS + 3D ORBITS
  // ===============================
  createElectrons(Z) {
    this.electrons.forEach(e => this.scene.remove(e.mesh));
    this.orbits.forEach(o => this.scene.remove(o));

    this.electrons = [];
    this.orbits = [];

    const shells = [2, 8, 18, 32, 50, 72, 98];

    let remaining = Z;
    let baseR = 1.8;

    for (let s = 0; s < shells.length; s++) {
      if (remaining <= 0) break;

      const count = Math.min(shells[s], remaining);
      const radius = baseR + s * 1.4;

      // ORBIT (3D TILTED RING)
      const orbit = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.01, 10, 120),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.25
        })
      );

      orbit.rotation.x = Math.random() * Math.PI;
      orbit.rotation.y = Math.random() * Math.PI;
      orbit.rotation.z = Math.random() * Math.PI;

      this.scene.add(orbit);
      this.orbits.push(orbit);

      // ELECTRONS
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;

        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0x00d4ff })
        );

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

  // ===============================
  // ANIMATION LOOP
  // ===============================
  animate() {
    requestAnimationFrame(() => this.animate());

    this.scene.rotation.x = this.rotX;
    this.scene.rotation.y = this.rotY;

    this.electrons.forEach(e => {
      e.angle += e.speed;

      const x = Math.cos(e.angle) * e.radius;
      const y = Math.sin(e.angle) * e.radius;
      const z = Math.sin(e.angle * 0.6) * (e.radius * 0.4);

      e.mesh.position.set(x, y, z);
    });

    this.renderer.render(this.scene, this.camera);
  }
}

// ===============================
// NAV SAFE
// ===============================
function showPage(id) {
  document.querySelectorAll("div[id^='page-']")
    .forEach(p => p.style.display = "none");

  const target = document.getElementById("page-" + id);
  if (target) target.style.display = "flex";
}

// ===============================
// INIT
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  initDropdown();

  window.atomRenderer = new AtomRenderer("atom-canvas");

  const sel = document.getElementById("element-select");
  sel.addEventListener("change", loadElement);

  loadElement();
});
