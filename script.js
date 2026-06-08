/////////////////////////////////////////////////////
// ATOMLAB FINAL FULL SCIENTIFIC ENGINE (ALL-IN-ONE)
/////////////////////////////////////////////////////

// ===============================
// GLOBAL STATE
// ===============================
window.STATE = {
  Z: 1,
  symbol: "H",
  config: ""
};

// ===============================
// ELEMENT SYMBOLS (1–118)
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
// ELECTRON CONFIGURATION ENGINE
// ===============================
const ORBITALS = [
{ name:"1s", max:2 },
{ name:"2s", max:2 },
{ name:"2p", max:6 },
{ name:"3s", max:2 },
{ name:"3p", max:6 },
{ name:"4s", max:2 },
{ name:"3d", max:10 },
{ name:"4p", max:6 },
{ name:"5s", max:2 },
{ name:"4d", max:10 },
{ name:"5p", max:6 },
{ name:"6s", max:2 },
{ name:"4f", max:14 },
{ name:"5d", max:10 },
{ name:"6p", max:6 },
{ name:"7s", max:2 },
{ name:"5f", max:14 },
{ name:"6d", max:10 },
{ name:"7p", max:6 }
];

function getElectronConfig(Z){
  let remaining = Z;
  let config = [];

  for(let o of ORBITALS){
    if(remaining <= 0) break;
    let fill = Math.min(o.max, remaining);
    config.push(`${o.name}^${fill}`);
    remaining -= fill;
  }

  return config.join(" ");
}

function getValence(config){
  let parts = config.split(" ");
  return parseInt(parts[parts.length-1].split("^")[1]) || 0;
}

// ===============================
// VSEPR + BOND ENGINE
// ===============================
function getVSEPR(valence){
  if(valence <= 2) return "Linear";
  if(valence === 3) return "Trigonal Planar";
  if(valence === 4) return "Tetrahedral";
  if(valence === 5) return "Trigonal Bipyramidal";
  if(valence === 6) return "Octahedral";
  return "Complex";
}

function getBond(valence){
  if(valence <= 1) return "No Bond / Noble Gas";
  if(valence <= 3) return "Weak Covalent";
  if(valence <= 5) return "Strong Covalent";
  if(valence <= 7) return "Reactive / Polar Covalent";
  return "Stable Noble Gas";
}

// ===============================
// DROPDOWN AUTO GENERATION
// ===============================
function initDropdown(){
  const sel = document.getElementById("element-select");
  if(!sel) return;

  sel.innerHTML = "";

  for(let i=1;i<=118;i++){
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `${ELEMENT_SYMBOLS[i-1]} (Z=${i})`;
    sel.appendChild(opt);
  }

  sel.value = 6;
}

// ===============================
// UI HELPER
// ===============================
function setText(id,val){
  const el=document.getElementById(id);
  if(el) el.innerText=val;
}

// ===============================
// MAIN LOADER (100% FIXED SYSTEM)
// ===============================
function loadElement(){
  const sel=document.getElementById("element-select");
  if(!sel) return;

  const Z=parseInt(sel.value);
  const symbol=ELEMENT_SYMBOLS[Z-1];

  const config=getElectronConfig(Z);
  const valence=getValence(config);

  window.STATE={Z,symbol,config};

  setText("el-symbol",symbol);
  setText("el-z",Z);
  setText("el-protons",Z);
  setText("el-electrons",Z);
  setText("el-mass",(Z*2.2).toFixed(3));
  setText("el-config",config);
  setText("el-valence",valence);
  setText("el-geometry",getVSEPR(valence));
  setText("el-bond",getBond(valence));

  window.atomRenderer?.update(Z);
}

// ===============================
// ATOM SIMULATION (STABLE 118 SUPPORT)
// ===============================
class AtomRenderer{
  constructor(id){
    const canvas=document.getElementById(id);
    if(!canvas || typeof THREE==="undefined") return;

    this.scene=new THREE.Scene();
    this.camera=new THREE.PerspectiveCamera(75,1,0.1,1000);
    this.camera.position.z=6;

    this.renderer=new THREE.WebGLRenderer({canvas,alpha:true});
    this.renderer.setSize(350,350);

    this.electrons=[];

    this.nucleus=new THREE.Mesh(
      new THREE.SphereGeometry(0.5,16,16),
      new THREE.MeshBasicMaterial({color:0xff4444})
    );

    this.scene.add(this.nucleus);

    this.createElectrons(1);
    this.animate();
  }

  createElectrons(Z){
    this.electrons.forEach(e=>this.scene.remove(e.mesh));
    this.electrons=[];

    const shells=[2,8,18,32,50,72,98];

    let remaining=Z;
    let base=1.5;

    for(let s=0;s<shells.length;s++){
      if(remaining<=0) break;

      let count=Math.min(shells[s],remaining);

      for(let i=0;i<count;i++){
        let angle=(i/count)*Math.PI*2;

        let mesh=new THREE.Mesh(
          new THREE.SphereGeometry(0.1,12,12),
          new THREE.MeshBasicMaterial({color:0x00d4ff})
        );

        let radius=base+s*1.4;

        this.electrons.push({
          mesh,
          angle,
          radius,
          speed:0.02+s*0.002
        });

        this.scene.add(mesh);
      }

      remaining-=count;
    }
  }

  update(Z){
    this.createElectrons(Z);
  }

  animate(){
    requestAnimationFrame(()=>this.animate());

    this.electrons.forEach(e=>{
      e.angle+=e.speed;
      e.mesh.position.x=Math.cos(e.angle)*e.radius;
      e.mesh.position.y=Math.sin(e.angle)*e.radius;
    });

    this.renderer.render(this.scene,this.camera);
  }
}

// ===============================
// INIT SYSTEM
// ===============================
window.addEventListener("DOMContentLoaded",()=>{
  initDropdown();

  window.atomRenderer=new AtomRenderer("atom-canvas");

  const sel=document.getElementById("element-select");
  sel.addEventListener("change",loadElement);

  loadElement();
});
