/////////////////////////////////////////////////////
// ATOMLAB — SAFE RECOVERY ENGINE (NO CRASH VERSION)
/////////////////////////////////////////////////////

(function () {

  console.log("ATOM ENGINE LOADING...");

  // ----------------------------
  // SAFE WAIT FOR DOM
  // ----------------------------
  window.addEventListener("DOMContentLoaded", () => {

    console.log("DOM READY");

    const canvas = document.getElementById("atom-canvas");
    const selector = document.getElementById("element-select");

    // ----------------------------
    // CHECK 1: Canvas exists
    // ----------------------------
    if (!canvas) {
      console.error("❌ atom-canvas NOT FOUND in HTML");
      return;
    }

    // ----------------------------
    // CHECK 2: THREE exists
    // ----------------------------
    if (typeof THREE === "undefined") {
      console.error("❌ THREE.js NOT LOADED — check script tag in HTML");
      return;
    }

    console.log("THREE.js OK");

    // ----------------------------
    // PERIODIC TABLE
    // ----------------------------
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

    // ----------------------------
    // STATE
    // ----------------------------
    let Z = 1;

    // ----------------------------
    // THREE SETUP
    // ----------------------------
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });

    renderer.setSize(400, 400);

    // nucleus
    const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xff4444 })
    );

    scene.add(nucleus);

    let electrons = [];

    // ----------------------------
    // BUILD ATOM
    // ----------------------------
    function buildAtom(Z) {

      console.log("Building atom Z =", Z);

      electrons.forEach(e => scene.remove(e));
      electrons = [];

      const shells = [2,8,18,32,50,72,98];

      let remaining = Z;
      let base = 2;

      for (let s = 0; s < shells.length; s++) {
        if (remaining <= 0) break;

        const count = Math.min(shells[s], remaining);
        const radius = base + s * 1.6;

        for (let i = 0; i < count; i++) {
          const e = new THREE.Mesh(
            new THREE.SphereGeometry(0.12, 12, 12),
            new THREE.MeshBasicMaterial({ color: 0x00d4ff })
          );

          e.userData = {
            angle: (i / count) * Math.PI * 2,
            radius
          };

          scene.add(e);
          electrons.push(e);
        }

        remaining -= count;
      }
    }

    // ----------------------------
    // UPDATE UI
    // ----------------------------
    function updateUI(Z) {
      const sym = SYMBOLS[Z - 1];

      const el = document.getElementById("el-symbol");
      if (el) el.innerText = sym;

      const zEl = document.getElementById("el-z");
      if (zEl) zEl.innerText = Z;
    }

    // ----------------------------
    // SELECT HANDLER
    // ----------------------------
    function onSelectChange() {
      if (!selector) return;

      const val = selector.value;

      let newZ = parseInt(val);

      if (isNaN(newZ)) {
        newZ = SYMBOLS.indexOf(val) + 1;
      }

      if (newZ < 1 || newZ > 118) newZ = 1;

      Z = newZ;

      updateUI(Z);
      buildAtom(Z);
    }

    if (selector) {
      selector.addEventListener("change", onSelectChange);
    }

    // ----------------------------
    // ANIMATION LOOP
    // ----------------------------
    function animate() {
      requestAnimationFrame(animate);

      electrons.forEach(e => {
        e.userData.angle += 0.02;

        const r = e.userData.radius;

        e.position.x = Math.cos(e.userData.angle) * r;
        e.position.y = Math.sin(e.userData.angle) * r;
        e.position.z = Math.sin(e.userData.angle) * 0.5 * r;
      });

      renderer.render(scene, camera);
    }

    // START
    buildAtom(1);
    animate();

    console.log("ATOM ENGINE STARTED SUCCESSFULLY");

  });

})();
