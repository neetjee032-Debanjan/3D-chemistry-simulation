/////////////////////////////////////////////////////
// ATOMLAB MASTER FIX (FULL STABLE + NAVIGATION SAFE)
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
// ELEMENTS
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
// ELECTRON CONFIG
// ===============================
const ORBITALS=[
{n:"1s",m:2},{n:"2s",m:2},{n:"2p",m:6},{n:"3s",m:2},{n:"3p",m:6},
{n:"4s",m:2},{n:"3d",m:10},{n:"4p",m:6},{n:"5s",m:2},{n:"4d",m:10},
{n:"5p",m:6},{n:"6s",m:2},{n:"4f",m:14},{n:"5d",m:10},{n:"6p",m:6},
{n:"7s",m:2},{n:"5f",m:14},{n:"6d",m:10},{n:"7p",m:6}
];

function config(Z){
  let r=Z,c=[];
  for(let o of ORBITALS){
    if(r<=0) break;
    let f=Math.min(o.m,r);
    c.push(`${o.n}^${f}`);
    r-=f;
  }
  return c.join(" ");
}

// ===============================
// SAFE UI
// ===============================
function setText(id,v){
  const el=document.getElementById(id);
  if(el) el.innerText=v;
}

// ===============================
// PAGE NAVIGATION (RESTORED)
// ===============================
function showPage(id){
  document.querySelectorAll("[id^='page-']")
    .forEach(p=>p.style.display="none");

  const t=document.getElementById("page-"+id);
  if(t) t.style.display="flex";

  document.querySelectorAll(".nav-btn")
    .forEach(b=>{
      b.classList.remove("active");
      if(b.getAttribute("onclick")?.includes(id)) b.classList.add("active");
    });
}

// ===============================
// ELEMENT LOAD
// ===============================
function loadElement(){
  const sel=document.getElementById("element-select");
  if(!sel) return;

  const Z=parseInt(sel.value);
  const symbol=ELEMENT_SYMBOLS[Z-1];

  const cfg=config(Z);

  window.STATE={Z,symbol,config:cfg};

  setText("el-symbol",symbol);
  setText("el-z",Z);
  setText("el-protons",Z);
  setText("el-electrons",Z);
  setText("el-mass",(Z*2.2).toFixed(2));
  setText("el-config",cfg);

  window.atomRenderer?.update(Z);
}

// ===============================
// ATOM ENGINE (SAFE)
// ===============================
class AtomRenderer{
  constructor(id){
    const c=document.getElementById(id);
    if(!c||typeof THREE==="undefined") return;

    this.scene=new THREE.Scene();
    this.camera=new THREE.PerspectiveCamera(75,1,0.1,1000);
    this.camera.position.z=6;

    this.r=new THREE.WebGLRenderer({canvas:c,alpha:true});
    this.r.setSize(350,350);

    this.e=[];

    this.n=new THREE.Mesh(
      new THREE.SphereGeometry(0.5,16,16),
      new THREE.MeshBasicMaterial({color:0xff4444})
    );

    this.scene.add(this.n);

    this.update(1);
    this.animate();
  }

  update(Z){
    this.e.forEach(x=>this.scene.remove(x.m));
    this.e=[];

    const s=[2,8,18,32,50,72,98];
    let r=Z,b=1.5;

    for(let i=0;i<s.length;i++){
      if(r<=0) break;
      let c=Math.min(s[i],r);

      for(let j=0;j<c;j++){
        let a=(j/c)*Math.PI*2;

        let m=new THREE.Mesh(
          new THREE.SphereGeometry(0.1,12,12),
          new THREE.MeshBasicMaterial({color:0x00d4ff})
        );

        let rad=b+i*1.4;

        this.e.push({m, a, rad, sp:0.02+i*0.002});
        this.scene.add(m);
      }

      r-=c;
    }
  }

  animate(){
    requestAnimationFrame(()=>this.animate());

    this.e.forEach(x=>{
      x.a+=x.sp;
      x.m.position.x=Math.cos(x.a)*x.rad;
      x.m.position.y=Math.sin(x.a)*x.rad;
    });

    this.r.render(this.scene,this.camera);
  }
}

// ===============================
// ORBITAL SAFE (NO BREAK)
// ===============================
class OrbitalRenderer{
  constructor(id){
    const c=document.getElementById(id);
    if(!c||typeof THREE==="undefined") return;

    this.scene=new THREE.Scene();
    this.camera=new THREE.PerspectiveCamera(75,1,0.1,1000);
    this.camera.position.z=5;

    this.r=new THREE.WebGLRenderer({canvas:c,alpha:true});
    this.r.setSize(350,350);

    this.group=new THREE.Group();
    this.scene.add(this.group);

    this.set("s");
    this.animate();
  }

  set(t){
    while(this.group.children.length){
      this.group.remove(this.group.children[0]);
    }

    for(let i=0;i<400;i++){
      let x,y,z;

      if(t==="s"){
        let r=Math.random()*1.5;
        let th=Math.random()*Math.PI*2;
        let ph=Math.random()*Math.PI;
        x=r*Math.sin(ph)*Math.cos(th);
        y=r*Math.sin(ph)*Math.sin(th);
        z=r*Math.cos(ph);
      }
      else if(t==="p"){
        x=(Math.random()>0.5?1:-1)*Math.random();
        y=(Math.random()-0.5)*0.5;
        z=(Math.random()-0.5)*0.5;
      }
      else{
        x=(Math.random()-0.5);
        y=(Math.random()-0.5);
        z=(Math.random()-0.5);
      }

      let p=new THREE.Mesh(
        new THREE.SphereGeometry(0.03,6,6),
        new THREE.MeshBasicMaterial({color:0x8b5cf6})
      );

      p.position.set(x,y,z);
      this.group.add(p);
    }
  }

  animate(){
    requestAnimationFrame(()=>this.animate());
    this.group.rotation.y+=0.003;
    this.r.render(this.scene,this.camera);
  }
}

// ===============================
// INIT (RESTORED FULL SITE FLOW)
// ===============================
window.addEventListener("DOMContentLoaded",()=>{

  const sel=document.getElementById("element-select");

  if(sel){
    sel.addEventListener("change",loadElement);
  }

  window.atomRenderer=new AtomRenderer("atom-canvas");
  window.orbitalRenderer=new OrbitalRenderer("orbital-canvas");

  loadElement();
});
