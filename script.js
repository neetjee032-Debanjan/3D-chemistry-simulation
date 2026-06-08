// ===================== FULL PERIODIC TABLE (118 ELEMENTS) =====================
const elements = [
  {n:"Hydrogen",s:"H",a:1},{n:"Helium",s:"He",a:2},
  {n:"Lithium",s:"Li",a:3},{n:"Beryllium",s:"Be",a:4},
  {n:"Boron",s:"B",a:5},{n:"Carbon",s:"C",a:6},
  {n:"Nitrogen",s:"N",a:7},{n:"Oxygen",s:"O",a:8},
  {n:"Fluorine",s:"F",a:9},{n:"Neon",s:"Ne",a:10},

  {n:"Sodium",s:"Na",a:11},{n:"Magnesium",s:"Mg",a:12},
  {n:"Aluminium",s:"Al",a:13},{n:"Silicon",s:"Si",a:14},
  {n:"Phosphorus",s:"P",a:15},{n:"Sulfur",s:"S",a:16},
  {n:"Chlorine",s:"Cl",a:17},{n:"Argon",s:"Ar",a:18},

  {n:"Potassium",s:"K",a:19},{n:"Calcium",s:"Ca",a:20},
  {n:"Scandium",s:"Sc",a:21},{n:"Titanium",s:"Ti",a:22},
  {n:"Vanadium",s:"V",a:23},{n:"Chromium",s:"Cr",a:24},
  {n:"Manganese",s:"Mn",a:25},{n:"Iron",s:"Fe",a:26},
  {n:"Cobalt",s:"Co",a:27},{n:"Nickel",s:"Ni",a:28},
  {n:"Copper",s:"Cu",a:29},{n:"Zinc",s:"Zn",a:30},

  {n:"Gallium",s:"Ga",a:31},{n:"Germanium",s:"Ge",a:32},
  {n:"Arsenic",s:"As",a:33},{n:"Selenium",s:"Se",a:34},
  {n:"Bromine",s:"Br",a:35},{n:"Krypton",s:"Kr",a:36},

  {n:"Rubidium",s:"Rb",a:37},{n:"Strontium",s:"Sr",a:38},
  {n:"Yttrium",s:"Y",a:39},{n:"Zirconium",s:"Zr",a:40},
  {n:"Niobium",s:"Nb",a:41},{n:"Molybdenum",s:"Mo",a:42},
  {n:"Technetium",s:"Tc",a:43},{n:"Ruthenium",s:"Ru",a:44},
  {n:"Rhodium",s:"Rh",a:45},{n:"Palladium",s:"Pd",a:46},
  {n:"Silver",s:"Ag",a:47},{n:"Cadmium",s:"Cd",a:48},

  {n:"Indium",s:"In",a:49},{n:"Tin",s:"Sn",a:50},
  {n:"Antimony",s:"Sb",a:51},{n:"Tellurium",s:"Te",a:52},
  {n:"Iodine",s:"I",a:53},{n:"Xenon",s:"Xe",a:54},

  {n:"Cesium",s:"Cs",a:55},{n:"Barium",s:"Ba",a:56},

  {n:"Lanthanum",s:"La",a:57},{n:"Cerium",s:"Ce",a:58},
  {n:"Praseodymium",s:"Pr",a:59},{n:"Neodymium",s:"Nd",a:60},
  {n:"Promethium",s:"Pm",a:61},{n:"Samarium",s:"Sm",a:62},
  {n:"Europium",s:"Eu",a:63},{n:"Gadolinium",s:"Gd",a:64},
  {n:"Terbium",s:"Tb",a:65},{n:"Dysprosium",s:"Dy",a:66},
  {n:"Holmium",s:"Ho",a:67},{n:"Erbium",s:"Er",a:68},
  {n:"Thulium",s:"Tm",a:69},{n:"Ytterbium",s:"Yb",a:70},
  {n:"Lutetium",s:"Lu",a:71},

  {n:"Hafnium",s:"Hf",a:72},{n:"Tantalum",s:"Ta",a:73},
  {n:"Tungsten",s:"W",a:74},{n:"Rhenium",s:"Re",a:75},
  {n:"Osmium",s:"Os",a:76},{n:"Iridium",s:"Ir",a:77},
  {n:"Platinum",s:"Pt",a:78},{n:"Gold",s:"Au",a:79},
  {n:"Mercury",s:"Hg",a:80},

  {n:"Thallium",s:"Tl",a:81},{n:"Lead",s:"Pb",a:82},
  {n:"Bismuth",s:"Bi",a:83},{n:"Polonium",s:"Po",a:84},
  {n:"Astatine",s:"At",a:85},{n:"Radon",s:"Rn",a:86},

  {n:"Francium",s:"Fr",a:87},{n:"Radium",s:"Ra",a:88},

  {n:"Actinium",s:"Ac",a:89},{n:"Thorium",s:"Th",a:90},
  {n:"Protactinium",s:"Pa",a:91},{n:"Uranium",s:"U",a:92},
  {n:"Neptunium",s:"Np",a:93},{n:"Plutonium",s:"Pu",a:94},
  {n:"Americium",s:"Am",a:95},{n:"Curium",s:"Cm",a:96},
  {n:"Berkelium",s:"Bk",a:97},{n:"Californium",s:"Cf",a:98},
  {n:"Einsteinium",s:"Es",a:99},{n:"Fermium",s:"Fm",a:100},
  {n:"Mendelevium",s:"Md",a:101},{n:"Nobelium",s:"No",a:102},
  {n:"Lawrencium",s:"Lr",a:103},

  {n:"Rutherfordium",s:"Rf",a:104},{n:"Dubnium",s:"Db",a:105},
  {n:"Seaborgium",s:"Sg",a:106},{n:"Bohrium",s:"Bh",a:107},
  {n:"Hassium",s:"Hs",a:108},{n:"Meitnerium",s:"Mt",a:109},
  {n:"Darmstadtium",s:"Ds",a:110},{n:"Roentgenium",s:"Rg",a:111},
  {n:"Copernicium",s:"Cn",a:112},

  {n:"Nihonium",s:"Nh",a:113},{n:"Flerovium",s:"Fl",a:114},
  {n:"Moscovium",s:"Mc",a:115},{n:"Livermorium",s:"Lv",a:116},
  {n:"Tennessine",s:"Ts",a:117},{n:"Oganesson",s:"Og",a:118}
];

// ===================== UI =====================
const select = document.getElementById("elementSelect");
const info = document.getElementById("info");

elements.forEach((el, i) => {
  let o = document.createElement("option");
  o.value = i;
  o.textContent = `${el.n} (${el.s})`;
  select.appendChild(o);
});

// ===================== THREE.JS =====================
let scene, camera, renderer;
let nucleus;
let electrons = [];

init();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
  camera.position.z = 10;

  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(renderer.domElement);

  createAtom(1);

  animate();
}

// ===================== SHELL MODEL (IMPORTANT FIX) =====================
function shellConfig(Z) {
  const shells = [];
  let remaining = Z;
  const caps = [2,8,18,32,50,72,98];

  for (let i = 0; i < caps.length && remaining > 0; i++) {
    let take = Math.min(caps[i], remaining);
    shells.push(take);
    remaining -= take;
  }
  return shells;
}

// ===================== ATOM =====================
function createAtom(Z) {

  if (nucleus) scene.remove(nucleus);
  electrons.forEach(e => scene.remove(e));
  electrons = [];

  nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 32, 32),
    new THREE.MeshBasicMaterial({color:0xff5555})
  );

  scene.add(nucleus);

  const shells = shellConfig(Z);

  let radiusBase = 2;

  shells.forEach((count, si) => {
    const radius = radiusBase + si * 1.5;

    for (let i = 0; i < count; i++) {
      const e = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 12, 12),
        new THREE.MeshBasicMaterial({color:0x55aaff})
      );

      e.userData = {
        angle: Math.random() * Math.PI * 2,
        speed: 0.02 + si * 0.003,
        radius
      };

      scene.add(e);
      electrons.push(e);
    }
  });
}

// ===================== LOAD =====================
function loadAtom() {
  const el = elements[select.value];

  createAtom(el.a);

  info.innerHTML = `
    <b>${el.n}</b><br>
    Symbol: ${el.s}<br>
    Atomic Number: ${el.a}<br>
    Shell Model Enabled ✔
  `;
}

// ===================== ANIMATION =====================
function animate() {
  requestAnimationFrame(animate);

  electrons.forEach(e => {
    e.userData.angle += e.userData.speed;

    e.position.x = Math.cos(e.userData.angle) * e.userData.radius;
    e.position.y = Math.sin(e.userData.angle) * e.userData.radius;
  });

  renderer.render(scene, camera);
}
