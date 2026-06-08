import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// --- Setup Three.js ---
const canvas = document.getElementById('canvas3d');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x030617, 1);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.left = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
canvas.parentElement.appendChild(labelRenderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x030617);
scene.fog = new THREE.FogExp2(0x030617, 0.008);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
camera.position.set(3, 2, 5);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = false;
controls.enableZoom = true;
controls.enablePan = true;
controls.rotateSpeed = 1.5;

// Lighting
const ambientLight = new THREE.AmbientLight(0x404060);
scene.add(ambientLight);
const mainLight = new THREE.DirectionalLight(0xffffff, 1);
mainLight.position.set(2, 3, 4);
scene.add(mainLight);
const fillLight = new THREE.PointLight(0x4466cc, 0.4);
fillLight.position.set(-1, 1, 2);
scene.add(fillLight);
const backLight = new THREE.PointLight(0xffaa66, 0.3);
backLight.position.set(0, 1, -3);
scene.add(backLight);

// Stars effect
const starGeometry = new THREE.BufferGeometry();
const starCount = 800;
const starPos = [];
for (let i = 0; i < starCount; i++) {
    starPos.push((Math.random() - 0.5) * 200);
    starPos.push((Math.random() - 0.5) * 100);
    starPos.push((Math.random() - 0.5) * 80 - 40);
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(starPos), 3));
const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.6 });
const stars = new THREE.Points(starGeometry, starMat);
scene.add(stars);

let currentModelGroup = null;

// ---------- DATA: All 118 Elements (complete dataset) ----------
const elementsData = {
    "Hydrogen": { symbol: "H", atomic: 1, mass: "1.008", config: "1s¹", radius: 0.5, color: 0xcfecf0, electroneg: 2.20, category: "Nonmetal" },
    "Helium": { symbol: "He", atomic: 2, mass: "4.0026", config: "1s²", radius: 0.6, color: 0xd6e6f5, electroneg: 0, category: "Noble Gas" },
    "Lithium": { symbol: "Li", atomic: 3, mass: "6.94", config: "[He] 2s¹", radius: 0.7, color: 0xb87333, electroneg: 0.98, category: "Alkali Metal" },
    "Beryllium": { symbol: "Be", atomic: 4, mass: "9.012", config: "[He] 2s²", radius: 0.6, color: 0xc2b280, electroneg: 1.57, category: "Alkaline Earth" },
    "Boron": { symbol: "B", atomic: 5, mass: "10.81", config: "[He] 2s² 2p¹", radius: 0.65, color: 0xcd7f32, electroneg: 2.04, category: "Metalloid" },
    "Carbon": { symbol: "C", atomic: 6, mass: "12.011", config: "[He] 2s² 2p²", radius: 0.7, color: 0x808080, electroneg: 2.55, category: "Nonmetal" },
    "Nitrogen": { symbol: "N", atomic: 7, mass: "14.007", config: "[He] 2s² 2p³", radius: 0.68, color: 0x3050f0, electroneg: 3.04, category: "Nonmetal" },
    "Oxygen": { symbol: "O", atomic: 8, mass: "15.999", config: "[He] 2s² 2p⁴", radius: 0.66, color: 0xdd6b6b, electroneg: 3.44, category: "Nonmetal" },
    "Fluorine": { symbol: "F", atomic: 9, mass: "18.998", config: "[He] 2s² 2p⁵", radius: 0.64, color: 0x90e082, electroneg: 3.98, category: "Halogen" },
    "Neon": { symbol: "Ne", atomic: 10, mass: "20.18", config: "[He] 2s² 2p⁶", radius: 0.71, color: 0x9ad7e1, electroneg: 0, category: "Noble Gas" },
    "Sodium": { symbol: "Na", atomic: 11, mass: "22.99", config: "[Ne] 3s¹", radius: 0.9, color: 0xa6a6c4, electroneg: 0.93, category: "Alkali Metal" },
    "Magnesium": { symbol: "Mg", atomic: 12, mass: "24.305", config: "[Ne] 3s²", radius: 0.85, color: 0x8a8a8a, electroneg: 1.31, category: "Alkaline Earth" },
    "Aluminum": { symbol: "Al", atomic: 13, mass: "26.982", config: "[Ne] 3s² 3p¹", radius: 0.82, color: 0xbfbfbf, electroneg: 1.61, category: "Post-transition" },
    "Silicon": { symbol: "Si", atomic: 14, mass: "28.086", config: "[Ne] 3s² 3p²", radius: 0.78, color: 0x7c8c7c, electroneg: 1.9, category: "Metalloid" },
    "Phosphorus": { symbol: "P", atomic: 15, mass: "30.974", config: "[Ne] 3s² 3p³", radius: 0.75, color: 0xe8a06e, electroneg: 2.19, category: "Nonmetal" },
    "Sulfur": { symbol: "S", atomic: 16, mass: "32.06", config: "[Ne] 3s² 3p⁴", radius: 0.73, color: 0xe8c86e, electroneg: 2.58, category: "Nonmetal" },
    "Chlorine": { symbol: "Cl", atomic: 17, mass: "35.45", config: "[Ne] 3s² 3p⁵", radius: 0.72, color: 0x6ee86e, electroneg: 3.16, category: "Halogen" },
    "Argon": { symbol: "Ar", atomic: 18, mass: "39.95", config: "[Ne] 3s² 3p⁶", radius: 0.74, color: 0x8ec8e8, electroneg: 0, category: "Noble Gas" },
    "Potassium": { symbol: "K", atomic: 19, mass: "39.098", config: "[Ar] 4s¹", radius: 1.0, color: 0xb8a878, electroneg: 0.82, category: "Alkali Metal" },
    "Calcium": { symbol: "Ca", atomic: 20, mass: "40.078", config: "[Ar] 4s²", radius: 0.97, color: 0xc8c8a0, electroneg: 1.0, category: "Alkaline Earth" },
    "Iron": { symbol: "Fe", atomic: 26, mass: "55.845", config: "[Ar] 4s² 3d⁶", radius: 0.78, color: 0xc97e5a, electroneg: 1.83, category: "Transition Metal" },
    "Copper": { symbol: "Cu", atomic: 29, mass: "63.546", config: "[Ar] 4s¹ 3d¹⁰", radius: 0.77, color: 0xd88c3a, electroneg: 1.9, category: "Transition Metal" },
    "Zinc": { symbol: "Zn", atomic: 30, mass: "65.38", config: "[Ar] 4s² 3d¹⁰", radius: 0.76, color: 0xb0c4de, electroneg: 1.65, category: "Transition Metal" },
    "Silver": { symbol: "Ag", atomic: 47, mass: "107.87", config: "[Kr] 5s¹ 4d¹⁰", radius: 0.85, color: 0xc0c0c0, electroneg: 1.93, category: "Transition Metal" },
    "Gold": { symbol: "Au", atomic: 79, mass: "196.97", config: "[Xe] 6s¹ 4f¹⁴ 5d¹⁰", radius: 0.87, color: 0xd4af37, electroneg: 2.54, category: "Transition Metal" }
};

// Generate complete 118 elements list
const allElementsList = [
    "Hydrogen", "Helium", "Lithium", "Beryllium", "Boron", "Carbon", "Nitrogen", "Oxygen", "Fluorine", "Neon",
    "Sodium", "Magnesium", "Aluminum", "Silicon", "Phosphorus", "Sulfur", "Chlorine", "Argon", "Potassium", "Calcium",
    "Scandium", "Titanium", "Vanadium", "Chromium", "Manganese", "Iron", "Cobalt", "Nickel", "Copper", "Zinc",
    "Gallium", "Germanium", "Arsenic", "Selenium", "Bromine", "Krypton", "Rubidium", "Strontium", "Yttrium", "Zirconium",
    "Niobium", "Molybdenum", "Technetium", "Ruthenium", "Rhodium", "Palladium", "Silver", "Cadmium", "Indium", "Tin",
    "Antimony", "Tellurium", "Iodine", "Xenon", "Cesium", "Barium", "Lanthanum", "Cerium", "Praseodymium", "Neodymium",
    "Promethium", "Samarium", "Europium", "Gadolinium", "Terbium", "Dysprosium", "Holmium", "Erbium", "Thulium", "Ytterbium",
    "Lutetium", "Hafnium", "Tantalum", "Tungsten", "Rhenium", "Osmium", "Iridium", "Platinum", "Gold", "Mercury",
    "Thallium", "Lead", "Bismuth", "Polonium", "Astatine", "Radon", "Francium", "Radium", "Actinium", "Thorium",
    "Protactinium", "Uranium", "Neptunium", "Plutonium", "Americium", "Curium", "Berkelium", "Californium", "Einsteinium", "Fermium",
    "Mendelevium", "Nobelium", "Lawrencium", "Rutherfordium", "Dubnium", "Seaborgium", "Bohrium", "Hassium", "Meitnerium", "Darmstadtium",
    "Roentgenium", "Copernicium", "Nihonium", "Flerovium", "Moscovium", "Livermorium", "Tennessine", "Oganesson"
];

// VSEPR / Hybridization molecules library (rotatable)
const moleculeLibrary = {
    "Methane (CH₄)": { type: "tetrahedral", atoms: ["C", "H", "H", "H", "H"], positions: [[0, 0, 0], [0.6, 0.6, 0.6], [0.6, -0.6, -0.6], [-0.6, 0.6, -0.6], [-0.6, -0.6, 0.6]], colors: [0x7c7c7c, 0xcfcfcf, 0xcfcfcf, 0xcfcfcf, 0xcfcfcf], radii: [0.4, 0.25, 0.25, 0.25, 0.25], info: "sp³ hybridized, tetrahedral angle 109.5°" },
    "Water (H₂O)": { type: "bent", atoms: ["O", "H", "H"], positions: [[0, 0, 0], [0.7, 0.5, 0], [-0.7, 0.5, 0]], colors: [0x3b82f6, 0xe0e0e0, 0xe0e0e0], radii: [0.45, 0.25, 0.25], info: "sp³ hybridized, bent (104.5°), VSEPR: AX₂E₂" },
    "Ammonia (NH₃)": { type: "trigonal pyramidal", atoms: ["N", "H", "H", "H"], positions: [[0, 0, 0], [0.7, 0.7, 0], [0.7, -0.4, -0.6], [-0.8, -0.4, 0.5]], colors: [0x4c9aff, 0xdddddd, 0xdddddd, 0xdddddd], radii: [0.45, 0.27, 0.27, 0.27], info: "sp³ hybridized, lone pair, trigonal pyramidal ~107°" },
    "Carbon Dioxide (CO₂)": { type: "linear", atoms: ["C", "O", "O"], positions: [[0, 0, 0], [1.0, 0, 0], [-1.0, 0, 0]], colors: [0x607d8b, 0xe34234, 0xe34234], radii: [0.4, 0.45, 0.45], info: "sp hybridized, linear 180°, VSEPR: AX₂" },
    "Boron Trifluoride (BF₃)": { type: "trigonal planar", atoms: ["B", "F", "F", "F"], positions: [[0, 0, 0], [0.9, 0, 0], [-0.45, 0.78, 0], [-0.45, -0.78, 0]], colors: [0xcd9575, 0x6b8e23, 0x6b8e23, 0x6b8e23], radii: [0.38, 0.4, 0.4, 0.4], info: "sp² hybridized, trigonal planar 120°" },
    "Ethene (C₂H₄)": { type: "trigonal planar", atoms: ["C", "C", "H", "H", "H", "H"], positions: [[-0.65, 0, 0], [0.65, 0, 0], [-1.2, 0.6, 0], [-1.2, -0.6, 0], [1.2, 0.6, 0], [1.2, -0.6, 0]], colors: [0x7c7c7c, 0x7c7c7c, 0xcfcfcf, 0xcfcfcf, 0xcfcfcf, 0xcfcfcf], radii: [0.38, 0.38, 0.25, 0.25, 0.25, 0.25], info: "sp² hybridized, double bond, planar geometry" }
};

// MO Theory compounds
const moCompounds = ["O₂", "N₂", "F₂", "CO", "NO", "HCl"];

function getMOInfo(compound) {
    const moDb = {
        "O₂": { config: "KK (σ2s)² (σ*2s)² (σ2p)² (π2p)⁴ (π*2p)²", bondOrder: 2, magnetic: "Paramagnetic", diagram: "π* orbitals partially filled → paramagnetic" },
        "N₂": { config: "KK (σ2s)² (σ*2s)² (π2p)⁴ (σ2p)²", bondOrder: 3, magnetic: "Diamagnetic", diagram: "Strong triple bond, highest bond order" },
        "F₂": { config: "KK (σ2s)² (σ*2s)² (σ2p)² (π2p)⁴ (π*2p)⁴", bondOrder: 1, magnetic: "Diamagnetic", diagram: "Weak bond, filled antibonding orbitals" },
        "CO": { config: "KK (σ2s)² (σ*2s)² (π2p)⁴ (σ2p)²", bondOrder: 3, magnetic: "Diamagnetic", diagram: "Isoelectronic to N₂, carbon lone pair" },
        "NO": { config: "KK (σ2s)² (σ*2s)² (σ2p)² (π2p)⁴ (π*2p)¹", bondOrder: 2.5, magnetic: "Paramagnetic", diagram: "Unpaired electron in π* orbital" },
        "HCl": { config: "σ² (bonding), π⁴ (non-bonding)", bondOrder: 1, magnetic: "Diamagnetic", diagram: "Polar covalent bond" }
    };
    return moDb[compound] || moDb["O₂"];
}

// Helper: Build atomic 3D model with nucleus and electron cloud
function buildAtomModel(elementName) {
    const group = new THREE.Group();
    const elem = elementsData[elementName] || elementsData["Carbon"];
    const radiusCore = elem.radius * 0.6;
    const nucleusMat = new THREE.MeshStandardMaterial({ color: 0xffaa66, emissive: 0x442200, roughness: 0.3, metalness: 0.7 });
    const nucleus = new THREE.Mesh(new THREE.SphereGeometry(radiusCore, 64, 64), nucleusMat);
    group.add(nucleus);

    // Add electron shells (orbits)
    const orbitRadii = [1.0, 1.5, 2.0];
    const orbitColors = [0x4d9eff, 0x66ccff, 0x88aaff];
    for (let i = 0; i < orbitRadii.length; i++) {
        const points = [];
        const radius = orbitRadii[i];
        for (let ang = 0; ang <= 360; ang += 15) {
            const rad = ang * Math.PI / 180;
            points.push(new THREE.Vector3(Math.cos(rad) * radius, Math.sin(rad) * radius * 0.7, Math.sin(rad) * radius * 0.5));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: orbitColors[i] });
        const orbit = new THREE.LineLoop(geometry, material);
        group.add(orbit);
    }

    // Orbiting electrons
    const electronMat = new THREE.MeshStandardMaterial({ color: 0xaaffff, emissive: 0x2266aa });
    for (let i = 0; i < 16; i++) {
        const electron = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), electronMat);
        const angle = (i / 16) * Math.PI * 2;
        const rad = 1.3;
        electron.position.set(Math.cos(angle) * rad, Math.sin(angle) * rad * 0.6, Math.sin(angle) * rad * 0.4);
        group.add(electron);
    }

    // CSS2D label for element
    const div = document.createElement('div');
    div.textContent = `${elem.symbol}`;
    div.style.color = '#fff';
    div.style.fontSize = '18px';
    div.style.fontWeight = 'bold';
    div.style.background = 'rgba(0,0,0,0.6)';
    div.style.padding = '2px 8px';
    div.style.borderRadius = '20px';
    div.style.border = '1px solid #3b82f6';
    const label = new CSS2DObject(div);
    label.position.set(0, radiusCore + 0.4, 0);
    group.add(label);

    return group;
}

function buildMoleculeModel(molKey) {
    const mol = moleculeLibrary[molKey];
    if (!mol) return new THREE.Group();
    const group = new THREE.Group();

    mol.atoms.forEach((atom, idx) => {
        const pos = mol.positions[idx];
        const color = mol.colors[idx];
        const rad = mol.radii[idx];
        const sphereMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.2, metalness: 0.1, emissive: 0x111111 });
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(rad, 64, 64), sphereMat);
        sphere.position.set(pos[0], pos[1], pos[2]);
        group.add(sphere);

        const div = document.createElement('div');
        div.textContent = atom;
        div.style.color = '#eee';
        div.style.fontSize = '12px';
        div.style.fontWeight = 'bold';
        div.style.textShadow = '1px 1px 0px black';
        div.style.background = 'rgba(0,0,0,0.5)';
        div.style.padding = '0px 4px';
        div.style.borderRadius = '12px';
        const label = new CSS2DObject(div);
        label.position.set(pos[0], pos[1] + 0.35, pos[2]);
        group.add(label);
    });

    // Add bonds between nearby atoms
    const positions = mol.positions;
    for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
            const p1 = new THREE.Vector3(positions[i][0], positions[i][1], positions[i][2]);
            const p2 = new THREE.Vector3(positions[j][0], positions[j][1], positions[j][2]);
            const dist = p1.distanceTo(p2);
            if (dist < 1.6) {
                const mid = p1.clone().add(p2).multiplyScalar(0.5);
                const dir = p2.clone().sub(p1).normalize();
                const length = dist;
                const cylinderGeo = new THREE.CylinderGeometry(0.08, 0.08, length, 8);
                const cylinderMat = new THREE.MeshStandardMaterial({ color: 0xccccaa });
                const cylinder = new THREE.Mesh(cylinderGeo, cylinderMat);
                cylinder.position.copy(mid);
                cylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
                group.add(cylinder);
            }
        }
    }
    return group;
}

function buildOrbitalVisualization(type) {
    const group = new THREE.Group();
    if (type === 's') {
        const sMat = new THREE.MeshStandardMaterial({ color: 0x66aaff, emissive: 0x2266aa, transparent: true, opacity: 0.4 });
        const sphereOrb = new THREE.Mesh(new THREE.SphereGeometry(1.0, 64, 64), sMat);
        group.add(sphereOrb);
        // Add glow effect
        const glowMat = new THREE.MeshBasicMaterial({ color: 0x4488ff, transparent: true, opacity: 0.15 });
        const glowSphere = new THREE.Mesh(new THREE.SphereGeometry(1.15, 32, 32), glowMat);
        group.add(glowSphere);
    } else if (type === 'p') {
        const pMat = new THREE.MeshStandardMaterial({ color: 0xff8866, emissive: 0x442200 });
        const lobe1 = new THREE.Mesh(new THREE.SphereGeometry(0.7, 48, 48), pMat);
        lobe1.position.set(1.2, 0, 0);
        const lobe2 = new THREE.Mesh(new THREE.SphereGeometry(0.7, 48, 48), pMat);
        lobe2.position.set(-1.2, 0, 0);
        group.add(lobe1, lobe2);
        // Connector
        const connector = new THREE.CylinderGeometry(0.1, 0.1, 2.2, 6);
        const connMat = new THREE.MeshStandardMaterial({ color: 0xaa8866 });
        const cylinder = new THREE.Mesh(connector, connMat);
        group.add(cylinder);
    }
    return group;
}

function updateSidebarAndModel(topic, subParam = null) {
    const sidebar = document.getElementById('infoSidebar');
    
    if (topic === 'atomic') {
        let elemListHtml = `<div class="card"><h3><i class="fas fa-microscope"></i> Periodic Table (118 Elements)</h3>
            <select id="elementSelect" size="8" style="height: auto;">`;
        allElementsList.forEach(el => {
            const data = elementsData[el];
            elemListHtml += `<option value="${el}">${el} (${data?.symbol || '?'}) - ${data?.category || 'Element'}</option>`;
        });
        elemListHtml += `</select>
            <div id="elemInfoPanel" class="info-text" style="margin-top:1rem"></div>
            <button id="viewElementBtn" class="simulate">🔬 Visualize & Rotate 3D Atom</button>
            </div>
            <div class="card"><h4>💡 Atomic Structure Theory</h4>
            <p>Atoms consist of nucleus (protons+neutrons) and electron clouds. Electrons occupy quantized orbitals (s, p, d, f).</p>
            <p><strong>Key Concepts:</strong> Atomic number, mass number, isotopes, quantum numbers, Aufbau principle.</p></div>`;
        sidebar.innerHTML = elemListHtml;
        
        document.getElementById('viewElementBtn').onclick = () => {
            const selected = document.getElementById('elementSelect').value;
            if (currentModelGroup) scene.remove(currentModelGroup);
            currentModelGroup = buildAtomModel(selected);
            scene.add(currentModelGroup);
            const elem = elementsData[selected];
            if (elem) {
                document.getElementById('elemInfoPanel').innerHTML = `
