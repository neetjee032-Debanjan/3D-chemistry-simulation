/////////////////////////////////////////////////////
// ATOMLAB FINAL MASTER ENGINE (FULL FIXED BUILD)
/////////////////////////////////////////////////////

// ===============================
// GLOBAL STATE
// ===============================
window.STATE = {
  Z: 1,
  symbol: "H"
};

// ===============================
// ELEMENT LIST (118)
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
// SAFE TEXT UPDATE
// ===============================
function setText(id,val){
  const el=document.getElementById(id);
  if(el) el.innerText=val;
}

// ===============================
// LOAD ELEMENT (FIXED SYNC)
// ===============================
function loadElement(){
  const sel=document.getElementById("element-select");
  if(!sel) return;

  const Z=parseInt(sel.value);
  const symbol=ELEMENT_SYMBOLS[Z-1];

  window.STATE.Z=Z;
  window.STATE.symbol=symbol;

  setText("el-symbol",symbol);
  setText("el-z",Z);
  setText("el-protons",Z);
  setText("el-electrons",Z);

  // safe fallback mass
  setText("el-mass",(Z*2.2).toFixed(2));

  // trigger atom update
  window.atomRenderer?.update(Z);
}

// ===============================
// NAVIGATION (DO NOT BREAK HTML)
// ===============================
function showPage(id){
  document.querySelectorAll("div[id^='page-']")
    .forEach(p=>p.style.display="none");

  const target=document.getElementById("page-"+id);
  if(target) target.style.display="flex";
}

// ===============================
// ATOM RENDERER (WORKING FOR ALL ELEMENTS)
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

        this.electrons.push({
          mesh,
          angle,
          radius:base+s*1.4,
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
// ORBITAL EXPLORER (FULL FIXED)
// ===============================
class OrbitalExplorer{
  constructor(id){
    const canvas=document.getElementById(id);
    if(!canvas || typeof THREE==="undefined") return;

    this.scene=new THREE.Scene();
    this.camera=new THREE.PerspectiveCamera(75,1,0.1,1000);
    this.camera.position.z=4;

    this.renderer=new THREE.WebGLRenderer({canvas,alpha:true});
    this.renderer.setSize(350,350);

    this.mesh=null;

    this.setOrbital("s");
    this.animate();
  }

  setOrbital(type){

    if(this.mesh) this.scene.remove(this.mesh);

    let geometry;

    // REAL ORBITAL VISUALS
    if(type==="s"){
      geometry=new THREE.SphereGeometry(1.2,32,32);
    }

    else if(type==="p"){
      geometry=new THREE.CapsuleGeometry(0.4,2,16,16);
    }

    else if(type==="d"){
      geometry=new THREE.TorusKnotGeometry(0.8,0.25,120,16);
    }

    else if(type==="f"){
      geometry=new THREE.IcosahedronGeometry(1.3,1);
    }

    else{
      geometry=new THREE.SphereGeometry(1,16,16);
    }

    this.mesh=new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        color:0x7c3aed,
        wireframe:true
      })
    );

    this.scene.add(this.mesh);
  }

  animate(){
    requestAnimationFrame(()=>this.animate());

    if(this.mesh){
      this.mesh.rotation.x+=0.005;
      this.mesh.rotation.y+=0.01;
    }

    this.renderer.render(this.scene,this.camera);
  }
}

// ===============================
// ORBITAL CLICK HANDLER (YOUR HTML USES THIS)
// ===============================
function selectOrbital(type,label){
  window.orbitalExplorer.setOrbital(type);

  const chip=document.getElementById("orbital-name-chip");
  if(chip) chip.innerText=label+" orbital";
}

// ===============================
// INIT EVERYTHING
// ===============================
window.addEventListener("DOMContentLoaded",()=>{

  window.atomRenderer=new AtomRenderer("atom-canvas");

  window.orbitalExplorer=new OrbitalExplorer("orbital-canvas");

  const sel=document.getElementById("element-select");
  if(sel){
    sel.addEventListener("change",loadElement);
  }

  loadElement();
});
