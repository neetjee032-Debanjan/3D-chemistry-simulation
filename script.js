/////////////////////////////////////////////////////
// ATOMLAB MASTER SCIENTIFIC ENGINE (FINAL BUILD)
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
// ELECTRON CONFIGURATION (AUFBAU)
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
// VSEPR + BONDING
// ===============================
function getVSEPR(v){
  if(v<=2) return "Linear";
  if(v===3) return "Trigonal Planar";
  if(v===4) return "Tetrahedral";
  if(v===5) return "Trigonal Bipyramidal";
  if(v===6) return "Octahedral";
  return "Complex";
}

function getBond(v){
  if(v<=1) return "Noble / Non-reactive";
  if(v<=3) return "Weak Covalent";
  if(v<=5) return "Strong Covalent";
  if(v<=7) return "Reactive Covalent";
  return "Stable";
}

// ===============================
// DROPDOWN GENERATOR (FIXED)
// ===============================
function initDropdown(){
  const sel=document.getElementById("element-select");
  if(!sel) return;

  sel.innerHTML="";

  for(let i=1;i<=118;i++){
    const opt=document.createElement("option");
    opt.value=i;
    opt.textContent=`${ELEMENT_SYMBOLS[i-1]} (Z=${i})`;
    sel.appendChild(opt);
  }

  sel.value=6;
}

// ===============================
// SAFE UI SETTER
// ===============================
function setText(id,val){
  const el=document.getElementById(id);
  if(el) el.innerText=val;
}

// ===============================
// MAIN ELEMENT ENGINE (FULL SYNC FIX)
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
// ATOM 3D ENGINE (STABLE)
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
// ORBITAL CLOUD VISUALIZATION (REAL)
// ===============================
class OrbitalRenderer{
  constructor(id){
    const canvas=document.getElementById(id);
    if(!canvas || typeof THREE==="undefined") return;

    this.scene=new THREE.Scene();
    this.camera=new THREE.PerspectiveCamera(75,1,0.1,1000);
    this.camera.position.z=5;

    this.renderer=new THREE.WebGLRenderer({canvas,alpha:true});
    this.renderer.setSize(350,350);

    this.cloud=new THREE.Group();
    this.scene.add(this.cloud);

    this.set("s");
    this.animate();
  }

  set(type){
    while(this.cloud.children.length){
      this.cloud.remove(this.cloud.children[0]);
    }

    const N=600;

    for(let i=0;i<N;i++){
      let x,y,z;

      if(type==="s"){
        let r=Math.random()*1.5;
        let t=Math.random()*Math.PI*2;
        let p=Math.random()*Math.PI;
        x=r*Math.sin(p)*Math.cos(t);
        y=r*Math.sin(p)*Math.sin(t);
        z=r*Math.cos(p);
      }

      else if(type==="p"){
        let l=Math.random()>0.5?1:-1;
        x=l*Math.random()*1.2;
        y=(Math.random()-0.5)*0.5;
        z=(Math.random()-0.5)*0.5;
      }

      else{
        let a=Math.random()*Math.PI*2;
        let r=Math.random()*1.2;
        x=r*Math.cos(a);
        y=r*Math.sin(a);
        z=(Math.random()-0.5);
      }

      const p=new THREE.Mesh(
        new THREE.SphereGeometry(0.03,6,6),
        new THREE.MeshBasicMaterial({color:0x8b5cf6})
      );

      p.position.set(x,y,z);
      this.cloud.add(p);
    }
  }

  animate(){
    requestAnimationFrame(()=>this.animate());
    this.cloud.rotation.y+=0.003;
    this.renderer.render(this.scene,this.camera);
  }
}

// ===============================
// INIT SYSTEM
// ===============================
window.addEventListener("DOMContentLoaded",()=>{
  initDropdown();

  window.atomRenderer=new AtomRenderer("atom-canvas");
  window.orbitalRenderer=new OrbitalRenderer("orbital-canvas");

  const sel=document.getElementById("element-select");
  sel.addEventListener("change",loadElement);

  loadElement();
});
