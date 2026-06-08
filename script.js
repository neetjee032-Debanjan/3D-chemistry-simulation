/////////////////////////////////////////////////////
// ATOMLAB — CLEAN SINGLE ENGINE (FINAL FIX)
/////////////////////////////////////////////////////

// ===============================
// GUARANTEED ELEMENT DATABASE (ONLY ONE)
// ===============================
const ELEMENTS = {
  H: {Z:1}, He:{Z:2}, Li:{Z:3}, Be:{Z:4}, B:{Z:5}, C:{Z:6}, N:{Z:7}, O:{Z:8}, F:{Z:9}, Ne:{Z:10},
  Na:{Z:11}, Mg:{Z:12}, Al:{Z:13}, Si:{Z:14}, P:{Z:15}, S:{Z:16}, Cl:{Z:17}, Ar:{Z:18},
  K:{Z:19}, Ca:{Z:20}, Sc:{Z:21}, Ti:{Z:22}, V:{Z:23}, Cr:{Z:24}, Mn:{Z:25}, Fe:{Z:26}, Co:{Z:27}, Ni:{Z:28}, Cu:{Z:29}, Zn:{Z:30},
  Ga:{Z:31}, Ge:{Z:32}, As:{Z:33}, Se:{Z:34}, Br:{Z:35}, Kr:{Z:36},
  Rb:{Z:37}, Sr:{Z:38}, Y:{Z:39}, Zr:{Z:40}, Nb:{Z:41}, Mo:{Z:42}, Tc:{Z:43}, Ru:{Z:44}, Rh:{Z:45}, Pd:{Z:46}, Ag:{Z:47}, Cd:{Z:48},
  In:{Z:49}, Sn:{Z:50}, Sb:{Z:51}, Te:{Z:52}, I:{Z:53}, Xe:{Z:54},
  Cs:{Z:55}, Ba:{Z:56}, La:{Z:57}, Ce:{Z:58}, Pr:{Z:59}, Nd:{Z:60}, Pm:{Z:61}, Sm:{Z:62}, Eu:{Z:63}, Gd:{Z:64}, Tb:{Z:65}, Dy:{Z:66},
  Ho:{Z:67}, Er:{Z:68}, Tm:{Z:69}, Yb:{Z:70}, Lu:{Z:71},
  Hf:{Z:72}, Ta:{Z:73}, W:{Z:74}, Re:{Z:75}, Os:{Z:76}, Ir:{Z:77}, Pt:{Z:78}, Au:{Z:79}, Hg:{Z:80},
  Tl:{Z:81}, Pb:{Z:82}, Bi:{Z:83}, Po:{Z:84}, At:{Z:85}, Rn:{Z:86},
  Fr:{Z:87}, Ra:{Z:88}, Ac:{Z:89}, Th:{Z:90}, Pa:{Z:91}, U:{Z:92}, Np:{Z:93}, Pu:{Z:94}, Am:{Z:95}, Cm:{Z:96}, Bk:{Z:97}, Cf:{Z:98},
  Es:{Z:99}, Fm:{Z:100}, Md:{Z:101}, No:{Z:102}, Lr:{Z:103},
  Rf:{Z:104}, Db:{Z:105}, Sg:{Z:106}, Bh:{Z:107}, Hs:{Z:108}, Mt:{Z:109}, Ds:{Z:110}, Rg:{Z:111}, Cn:{Z:112},
  Nh:{Z:113}, Fl:{Z:114}, Mc:{Z:115}, Lv:{Z:116}, Ts:{Z:117}, Og:{Z:118}
};

// ===============================
// SAFE GET ELEMENT
// ===============================
function getElement() {
  const sel = document.getElementById("element-select");
  const sym = sel?.value || "H";
  return ELEMENTS[sym] || ELEMENTS["H"];
}

// ===============================
// LOAD ELEMENT (UI ONLY — NO LOGIC MIXING)
// ===============================
function loadElement() {
  const sym = document.getElementById("element-select").value;
  const el = ELEMENTS[sym] || ELEMENTS.H;

  document.getElementById("el-symbol").innerText = sym;
  document.getElementById("el-z").innerText = el.Z;
  document.getElementById("el-protons").innerText = el.Z;
  document.getElementById("el-electrons").innerText = el.Z;

  window.atom3D.update(el.Z);
}

// ===============================
// THREE.JS ENGINE (ONLY ONE SYSTEM)
// ===============================
class Atom3D {
  constructor(canvasId) {
    const canvas = document.getElementById(canvasId);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75,1,0.1,1000);
    this.camera.position.z = 12;

    this.renderer = new THREE.WebGLRenderer({canvas,alpha:true});
    this.renderer.setSize(400,400);

    this.electrons = [];
    this.rings = [];

    this.build(1);
    this.animate();
  }

  build(Z) {
    this.electrons.forEach(e=>this.scene.remove(e));
    this.rings.forEach(r=>this.scene.remove(r));

    this.electrons = [];
    this.rings = [];

    const shells = [2,8,18,32,50,72,98];
    let remaining = Z;
    let base = 2;

    for(let s=0;s<shells.length;s++){
      if(remaining<=0) break;

      let count = Math.min(shells[s], remaining);
      let r = base + s*1.7;

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(r,0.01,10,100),
        new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.2})
      );

      this.scene.add(ring);
      this.rings.push(ring);

      for(let i=0;i<count;i++){
        const e = new THREE.Mesh(
          new THREE.SphereGeometry(0.12,10,10),
          new THREE.MeshBasicMaterial({color:0x00d4ff})
        );

        e.userData = {
          a:(i/count)*Math.PI*2,
          r:r
        };

        this.scene.add(e);
        this.electrons.push(e);
      }

      remaining -= count;
    }
  }

  update(Z){
    this.build(Z);
  }

  animate(){
    requestAnimationFrame(()=>this.animate());

    for(let e of this.electrons){
      e.userData.a += 0.02;
      let r = e.userData.r;

      e.position.x = Math.cos(e.userData.a)*r;
      e.position.y = Math.sin(e.userData.a)*r;
      e.position.z = Math.sin(e.userData.a)*0.5*r;
    }

    this.renderer.render(this.scene,this.camera);
  }
}

// ===============================
// INIT (ONLY ONCE)
// ===============================
window.addEventListener("DOMContentLoaded",()=>{
  window.atom3D = new Atom3D("atom-canvas");
  document.getElementById("element-select").addEventListener("change",loadElement);
  loadElement();
});
