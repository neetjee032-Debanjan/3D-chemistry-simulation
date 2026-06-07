
// ===== MODEL DATABASE =====
const MODELS = {
  h: {
    atoms: [{pos:[0,0,0], color:0xff4444, r:0.5}]
  },

  o: {
    atoms: [
      {pos:[0,0,0], color:0xff4444, r:0.6},
      {pos:[1.2,0.8,0], color:0x00d4ff, r:0.2},
      {pos:[-1.2,-0.8,0], color:0x00d4ff, r:0.2}
    ]
  },

  h2: {
    atoms: [
      {pos:[-1.5,0,0], color:0xff4444, r:0.5},
      {pos:[1.5,0,0], color:0xff4444, r:0.5}
    ],
    bonds: [[0,1]]
  },

  h2o: {
    atoms: [
      {pos:[0,0,0], color:0xff4444, r:0.6},
      {pos:[1.2,0.8,0], color:0xffffff, r:0.3},
      {pos:[-1.2,0.8,0], color:0xffffff, r:0.3}
    ],
    bonds: [[0,1],[0,2]]
  }
};

// ===== MAIN FUNCTION CALLED BY HTML =====
function loadModel() {
  const input = document.getElementById("input").value.trim().toLowerCase();

  let model = MODELS[input];

  if (!model) {
    alert("Model not found. Try: H, O, H2, H2O");
    return;
  }

  // Use existing renderer system (IMPORTANT)
  if (window.atomRenderer) {
    atomRenderer.clear?.();
    atomRenderer.buildMol(model.atoms, model.bonds || []);
  }

  if (window.moleculeRenderer) {
    moleculeRenderer.clear?.();
    moleculeRenderer.buildMol(model.atoms, model.bonds || []);
  }

  if (window.orbitalRenderer) {
    orbitalRenderer.clear?.();
    orbitalRenderer.buildMol?.(model.atoms, model.bonds || []);
  }
}

// Optional: auto-run on Enter key
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") loadModel();
});
