/////////////////////////////////////////////////////
// ATOMLAB CLEAN FINAL ENGINE (FULL FIXED VERSION)
/////////////////////////////////////////////////////

// ===============================
// GLOBAL STATE (SINGLE SOURCE OF TRUTH)
// ===============================
window.ATOM_STATE = {
  Z: 1,
  symbol: "H"
};

// ===============================
// PAGE NAVIGATION
// ===============================
function showPage(id) {
  document.querySelectorAll("div[id^='page-']")
    .forEach(p => p.style.display = "none");

  const target = document.getElementById("page-" + id);
  if (target) target.style.display = "flex";

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.getAttribute("onclick")?.includes(id)) {
      btn.classList.add("active");
    }
  });
}

// ===============================
// ELEMENT LOADER (FIXED FOR ALL ELEMENTS)
// ===============================
function loadElement() {
  const sel = document.getElementById("element-select");
  if (!sel) return;

  const match = sel.value.match(/Z=(\d+)/);
  if (!match) return;

  const Z = parseInt(match[1]);
  const symbol = sel.value.match(/\((.*?)\)/)?.[1]?.split(" ")[0] || "";

  // update global state
  window.ATOM_STATE.Z = Z;
  window.ATOM_STATE.symbol = symbol;

  // UI update
  setText("el-symbol", symbol);
  setText("el-z", Z);
  setText("el-protons", Z);
  setText("el-electrons", Z);
  setText("el-mass", (Z * 2.2).toFixed(2));

  // sync 3D
  if (window.atomRenderer) {
    window.atomRenderer.update(Z);
  }
}

// ===============================
// SAFE TEXT HELPER
// ===============================
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerText = val;
}

// ===============================
// ATOM RENDERER (ALL 118 ELEMENTS)
// ===============================
class AtomRenderer {
  constructor(id) {
    const canvas = document.getElementById(id);
    if (!canvas || typeof
