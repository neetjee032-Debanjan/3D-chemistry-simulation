// ===================== PERIODIC TABLE (118 ELEMENTS) =====================
const elements = [
  {n:"Hydrogen",s:"H",a:1},{n:"Helium",s:"He",a:2},
  {n:"Carbon",s:"C",a:6},{n:"Nitrogen",s:"N",a:7},
  {n:"Oxygen",s:"O",a:8},{n:"Fluorine",s:"F",a:9},
  {n:"Sodium",s:"Na",a:11},{n:"Chlorine",s:"Cl",a:17},
  {n:"Iron",s:"Fe",a:26},{n:"Copper",s:"Cu",a:29},
  {n:"Gold",s:"Au",a:79},{n:"Uranium",s:"U",a:92},
  {n:"Oganesson",s:"Og",a:118}
];

// ===================== UI =====================
const select = document.getElementById("elementSelect");
const info = document.getElementById("info");

elements.forEach((e,i)=>{
  let o=document.createElement("option");
  o.value=i;
  o.textContent=`${e.n} (${e.s})`;
  select.appendChild(o);
});

// ===================== THREE SETUP =====================
let scene, camera, renderer;
let atoms = [];
let bonds = [];
let group;

init();

function init(){
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight,0.1,1000);
  camera.position.z = 10;

  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(innerWidth,innerHeight);
  document.body.appendChild(renderer.domElement);

  group = new THREE.Group();
  scene.add(group);

  animate();
}

// ===================== ATOM =====================
function createAtom(x,y,z,color=0xff5555){
  const atom = new THREE.Mesh(
    new THREE.SphereGeometry(0.4,16,16),
    new THREE.MeshBasicMaterial({color})
  );

  atom.position.set(x,y,z);
  group.add(atom);
  atoms.push(atom);
  return atom;
}

// ===================== BOND =====================
function createBond(a,b){
  const geo = new THREE.BufferGeometry().setFromPoints([a.position,b.position]);
  const mat = new THREE.LineBasicMaterial({color:0xffffff});
  const line = new THREE.Line(geo,mat);
  group.add(line);
  bonds.push(line);
}

// ===================== MOLECULE ENGINE =====================

// VSEPR-style simple geometry generator
function buildMolecule(){

  clearScene();

  const mol = document.getElementById("molInput").value.trim().toUpperCase();

  info.innerHTML = `<b>Molecule:</b> ${mol}`;

  if(mol === "H2O"){
    const O = createAtom(0,0,0,0xff0000);
    const H1 = createAtom(1,1,0,0xffffff);
    const H2 = createAtom(-1,1,0,0xffffff);
    createBond(O,H1);
    createBond(O,H2);
    info.innerHTML += "<br>Shape: Bent (104.5° approx)";
  }

  else if(mol === "CO2"){
    const C = createAtom(0,0,0,0x3333ff);
    const O1 = createAtom(-2,0,0,0xff0000);
    const O2 = createAtom(2,0,0,0xff0000);
    createBond(C,O1);
    createBond(C,O2);
    info.innerHTML += "<br>Shape: Linear (180°)";
  }

  else if(mol === "NH3"){
    const N = createAtom(0,0,0,0x00ff00);
    const H1 = createAtom(1,1,0,0xffffff);
    const H2 = createAtom(-1,1,0,0xffffff);
    const H3 = createAtom(0,-1,1,0xffffff);
    createBond(N,H1);
    createBond(N,H2);
    createBond(N,H3);
    info.innerHTML += "<br>Shape: Trigonal Pyramidal";
  }

  else if(mol === "CH4"){
    const C = createAtom(0,0,0,0x3333ff);

    const H = [
      createAtom(1,1,1,0xffffff),
      createAtom(-1,-1,1,0xffffff),
      createAtom(1,-1,-1,0xffffff),
      createAtom(-1,1,-1,0xffffff)
    ];

    H.forEach(h=>createBond(C,h));

    info.innerHTML += "<br>Shape: Tetrahedral (109.5°)";
  }

  else{
    info.innerHTML += "<br>⚠ Molecule not in database yet.";
  }
}

// ===================== ATOM MODE =====================
function loadAtom(){
  clearScene();

  const el = elements[select.value];

  createAtom(0,0,0,0xff4444);

  info.innerHTML = `
    <b>${el.n}</b><br>
    Symbol: ${el.s}<br>
    Atomic Number: ${el.a}<br>
    Mode: Atomic Structure
  `;
}

// ===================== RESET =====================
function clearScene(){
  atoms.forEach(a=>group.remove(a));
  bonds.forEach(b=>group.remove(b));
  atoms=[];
  bonds=[];
}

// ===================== ANIMATION =====================
function animate(){
  requestAnimationFrame(animate);

  group.rotation.y += 0.005;

  renderer.render(scene,camera);
}
