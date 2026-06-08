/////////////////////////////////////////////////////
// ATOMLAB ULTRA STABLE ENGINE + 3D ORBIT UPGRADE
/////////////////////////////////////////////////////

// ===============================
// GLOBAL STATE
// ===============================
window.STATE = {
  Z: 1,
  symbol: "H"
};

// ===============================
// ELEMENT SYMBOLS (118)
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
// SAFE TEXT
// ===============================
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerText = val;
}

// ===============================
// LOAD ELEMENT
// ===============================
function loadElement() {
  const sel = document.getElementById("element-select");
  const Z = parseInt(sel.value);

  const symbol = ELEMENT_SYMBOLS[Z - 1];

  window.STATE.Z = Z;
  window.STATE.symbol = symbol;

  setText("el-symbol", symbol);
  setText("el-z", Z);
  setText("el-protons", Z);
  setText("el-electrons", Z);
  setText("el-mass", (Z * 2.2).toFixed(2));

  window.atomRenderer?.update(Z);

  console.log("Loaded:", symbol, Z);
}

// ===============================
// ATOM RENDERER (FULL 3D ORBIT SYSTEM)
// ===============================
class AtomRenderer {

  constructor(id) {

    const canvas = document.getElementById(id);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    this.camera.position.z = 14;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });

    this.renderer.setSize(350, 350);

    // nucleus
    this.nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xff4444 })
    );

    this.scene.add(this.nucleus);

    this.electrons = [];
    this.orbits = [];

    this.update(1);
    this.animate();
  }

  // shell structure
  shells() {
    return [2, 8, 18, 32, 50, 72, 98];
  }

  // ===============================
  // BUILD ATOM
  // ===============================
  update(Z) {

    this.electrons.forEach(e => this.scene.remove(e));
    this.orbits.forEach(o => this.scene.remove(o));

    this.electrons = [];
    this.orbits = [];

    let remaining = Z;
    let base = 2;

    for (let s = 0; s < this.shells().length; s++) {

      if (remaining <= 0) break;

      const count = Math.min(this.shells()[s], remaining);
      const radius = base + s * 1.8;

      // =========================
      // ORBIT RING (3D TILTED)
      // =========================
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.02, 16, 160),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.25
        })
      );

      // RANDOM 3D ORIENTATION (KEY FIX)
      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;
      ring.rotation.z = Math.random() * Math.PI;

      this.scene.add(ring);
      this.orbits.push(ring);

      // =========================
      // ELECTRONS (3D MOTION)
      // =========================
      for (let i = 0; i < count; i++) {

        const e = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 14, 14),
          new THREE.MeshBasicMaterial({ color: 0x00d4ff })
        );

        e.userData = {
          angle: (i / count) * Math.PI * 2,
          radius: radius,
          speed: 0.015 + s * 0.002,

          // 3D orbital tilt factors
          tiltX: Math.random() * 0.8,
          tiltY: Math.random() * 0.8,
          tiltZ: Math.random() * 0.8
        };

        this.scene.add(e);
        this.electrons.push(e);
      }

      remaining -= count;
    }
  }

  // ===============================
  // ANIMATION (TRUE 3D ORBIT MOTION)
  // ===============================
  animate() {

    requestAnimationFrame(() => this.animate());

    for (let e of this.electrons) {

      e.userData.angle += e.userData.speed;

      const r = e.userData.radius;

      // base orbit path
      let x = Math.cos(e.userData.angle) * r;
      let y = Math.sin(e.userData.angle) * r;
      let z = Math.sin(e.userData.angle * 0.7) * r * 0.6;

      // apply 3D tilting transforms
      const tx = e.userData.tiltX;
      const ty = e.userData.tiltY;
      const tz = e.userData.tiltZ;

      e.position.x = x * Math.cos(tx) - z * Math.sin(tx);
      e.position.y = y * Math.cos(ty) - z * Math.sin(ty);
      e.position.z = z * Math.cos(tz) + x * Math.sin(tz);
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// ===============================
// INIT SYSTEM
// ===============================
window.addEventListener("DOMContentLoaded", () => {

  window.atomRenderer = new AtomRenderer("atom-canvas");

  const sel = document.getElementById("element-select");
  sel.addEventListener("change", loadElement);

  loadElement();
});
