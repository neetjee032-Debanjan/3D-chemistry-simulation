/////////////////////////////////////////////////////
// ATOMLAB — FAILSAFE ENGINE (CRASH PROOF VERSION)
/////////////////////////////////////////////////////

(function () {

  // =========================
  // SAFE START (NO CRASH EVER)
  // =========================
  function startWhenReady() {

    const canvas = document.getElementById("atom-canvas");
    const selector = document.getElementById("element-select");

    if (!canvas || !selector || typeof THREE === "undefined") {
      setTimeout(startWhenReady, 300);
      return;
    }

    console.log("ATOM ENGINE STARTED");

    // =========================
    // STATE
    // =========================
    const STATE = {
      Z: 1,
      symbol: "H"
    };

    // =========================
    // SYMBOLS
    // =========================
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

    // =========================
    // UI SAFE UPDATE
    // =========================
    function setText(id, val) {
      const el = document.getElementById(id);
      if (el) el.innerText = val;
    }

    // =========================
    // THREE SETUP
    // =========================
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });

    renderer.setSize(400, 400);

    // nucleus
    const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xff4444 })
    );

    scene.add(nucleus);

    let electrons = [];

    // =========================
    // BUILD ATOM (SAFE)
    // =========================
    function build(Z) {

      electrons.forEach(e => scene.remove(e));
      electrons = [];

      const shells = [2, 8, 18, 32, 50, 72, 98];

      let remaining = Z;
      let base = 2;

      for (let s = 0; s < shells.length; s++) {

        if (remaining <= 0) break;

        const count = Math.min(shells[s], remaining);
        const radius = base + s * 1.7;

        for (let i = 0; i < count; i++) {

          const e = new THREE.Mesh(
            new THREE.SphereGeometry(0.12, 12, 12),
            new THREE.MeshBasicMaterial({ color: 0x00d4ff })
          );

          e.userData = {
            angle: Math.random() * Math.PI * 2,
            radius: radius,
            speed: 0.015 + s * 0.002,
            tiltX: Math.random() * 0.6,
            tiltY: Math.random() * 0.6
          };

          scene.add(e);
          electrons.push(e);
        }

        remaining -= count;
      }
    }

    // =========================
    // UPDATE ELEMENT
    // =========================
    function updateElement() {

      const Z = parseInt(selector.value);

      STATE.Z = Z;
      STATE.symbol = SYMBOLS[Z - 1];

      setText("el-symbol", STATE.symbol);
      setText("el-z", Z);

      build(Z);

      console.log("Loaded:", STATE.symbol, Z);
    }

    // =========================
    // SAFE LISTENER
    // =========================
    selector.addEventListener("change", updateElement);

    // =========================
    // ANIMATION LOOP
    // =========================
    function animate() {

      requestAnimationFrame(animate);

      for (let e of electrons) {

        e.userData.angle += e.userData.speed;

        const r = e.userData.radius;

        let x = Math.cos(e.userData.angle) * r;
        let y = Math.sin(e.userData.angle) * r;
        let z = Math.sin(e.userData.angle) * 0.5 * r;

        // 3D tilt
        const tx = e.userData.tiltX;
        const ty = e.userData.tiltY;

        e.position.x = x * Math.cos(tx) - z * Math.sin(tx);
        e.position.z = z * Math.cos(tx) + x * Math.sin(tx);
        e.position.y = y * Math.cos(ty);
      }

      renderer.render(scene, camera);
    }

    // =========================
    // START
    // =========================
    build(1);
    animate();
    updateElement();

  }

  startWhenReady();

})();
