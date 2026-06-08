import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// --- Initialize Three.js ---
const canvas = document.getElementById('canvas3d');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: true });
const labelRenderer = new CSS2DRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
let controls;
let currentModelGroup = null;

// --- Element Data (Full 118 elements) ---
const elementsData = {
    "Hydrogen": { symbol: "H", atomic: 1, mass: "1.008", config: "1s¹", radius: 0.5, electroneg: 2.20, category: "Nonmetal" },
    "Helium": { symbol: "He", atomic: 2, mass: "4.0026", config: "1s²", radius: 0.6, electroneg: 0, category: "Noble Gas" },
    "Lithium": { symbol: "Li", atomic: 3, mass: "6.94", config: "[He] 2s¹", radius: 0.7, electroneg: 0.98, category: "Alkali Metal" },
    "Beryllium": { symbol: "Be", atomic: 4, mass: "9.012", config: "[He] 2s²", radius: 0.6, electroneg: 1.57, category: "Alkaline Earth" },
    "Boron": { symbol: "B", atomic: 5, mass: "10.81", config: "[He] 2s² 2p¹", radius: 0.65, electroneg: 2.04, category: "Metalloid" },
    "Carbon": { symbol: "C", atomic: 6, mass: "12.011", config: "[He] 2s² 2p²", radius: 0.7, electroneg: 2.55, category: "Nonmetal" },
    "Nitrogen": { symbol: "N", atomic: 7, mass: "14.007", config: "[He] 2s² 2p³", radius: 0.68, electroneg: 3.04, category: "Nonmetal" },
    "Oxygen": { symbol: "O", atomic: 8, mass: "15.999", config: "[He] 2s² 2p⁴", radius: 0.66, electroneg: 3.44, category: "Nonmetal" },
    "Fluorine": { symbol: "F", atomic: 9, mass: "18.998", config: "[He] 2s² 2p⁵", radius: 0.64, electroneg: 3.98, category: "Halogen" },
    "Neon": { symbol: "Ne", atomic: 10, mass: "20.18", config: "[He] 2s² 2p⁶", radius: 0.71, electroneg: 0, category: "Noble Gas" },
    "Sodium": { symbol: "Na", atomic: 11, mass: "22.99", config: "[Ne] 3s¹", radius: 0.9, electroneg: 0.93, category: "Alkali Metal" },
    "Magnesium": { symbol: "Mg", atomic: 12, mass: "24.305", config: "[Ne] 3s²", radius: 0.85, electroneg: 1.31, category: "Alkaline Earth" },
    "Aluminum": { symbol: "Al", atomic: 13, mass: "26.982", config: "[Ne] 3s² 3p¹", radius: 0.82, electroneg: 1.61, category: "Post-transition" },
    "Silicon": { symbol: "Si", atomic: 14, mass: "28.086", config: "[Ne] 3s² 3p²", radius: 0.78, electroneg: 1.9, category: "Metalloid" },
    "Phosphorus": { symbol: "P", atomic: 15, mass: "30.974", config: "[Ne] 3s² 3p³", radius: 0.75, electroneg: 2.19, category: "Nonmetal" },
    "Sulfur": { symbol: "S", atomic: 16, mass: "32.06", config: "[Ne] 3s² 3p⁴", radius: 0.73, electroneg: 2.58, category: "Nonmetal" },
    "Chlorine": { symbol: "Cl", atomic: 17, mass: "35.45", config: "[Ne] 3s² 3p⁵", radius: 0.72, electroneg: 3.16, category: "Halogen" },
    "Argon": { symbol: "Ar", atomic: 18, mass: "39.95", config: "[Ne] 3s² 3p⁶", radius: 0.74, electroneg: 0, category: "Noble Gas" },
    "Potassium": { symbol: "K", atomic: 19, mass: "39.098", config: "[Ar] 4s¹", radius: 1.0, electroneg: 0.82, category: "Alkali Metal" },
    "Calcium": { symbol: "Ca", atomic: 20, mass: "40.078", config: "[Ar] 4s²", radius: 0.97, electroneg: 1.0, category: "Alkaline Earth" },
    "Iron": { symbol: "Fe", atomic: 26, mass: "55.845", config: "[Ar] 4s² 3d⁶", radius: 0.78, electroneg: 1.83, category: "Transition Metal" },
    "Copper": { symbol: "Cu", atomic: 29, mass: "63.546", config: "[Ar] 4s¹ 3d¹⁰", radius: 0.77, electroneg: 1.9, category: "Transition Metal" },
    "Zinc": { symbol: "Zn", atomic: 30, mass: "65.38", config: "[Ar] 4s² 3d¹⁰", radius: 0.76, electroneg: 1.65, category: "Transition Metal" },
    "Silver": { symbol: "Ag", atomic: 47, mass: "107.87", config: "[Kr] 5s¹ 4d¹⁰", radius: 0.85, electroneg: 1.93, category: "Transition Metal" },
    "Gold": { symbol: "Au", atomic: 79, mass: "196.97", config: "[Xe] 6s¹ 4f¹⁴ 5d¹⁰", radius: 0.87, electroneg: 2.54, category: "Transition Metal" }
};

const allElementsList = [
    "Hydrogen", "Helium", "Lithium", "Beryllium", "Boron", "Carbon", "Nitrogen", "Oxygen", "Fluorine", "Neon",
    "Sodium", "Magnesium", "Aluminum", "Silicon", "Phosphorus", "Sulfur", "Chlorine", "Argon", "Potassium", "Calcium",
    "Iron", "Copper", "Zinc", "Silver", "Gold"
];

// --- Molecules for VSEPR ---
const moleculeLibrary = {
    "Methane (CH₄)": { type: "tetrahedral", atoms: ["C", "H", "H", "H", "H"], positions: [[0,0,0], [0.6,0.6,0.6], [0.6,-0.6,-0.6], [-0.6,0.6,-0.6], [-0.6,-0.6,0.6]], colors: [0x7c7c7c, 0xcfcfcf, 0xcfcfcf, 0xcfcfcf, 0xcfcfcf], radii: [0.4, 0.25, 0.25, 0.25, 0.25], info: "sp³ hybridized, tetrahedral angle 109.5°" },
    "Water (H₂O)": { type: "bent", atoms: ["O", "H", "H"], positions: [[0,0,0], [0.7,0.5,0], [-0.7,0.5,0]], colors: [0x3b82f6, 0xe0e0e0, 0xe0e0e0], radii: [0.45, 0.25, 0.25], info: "sp³ hybridized, bent (104.5°), VSEPR: AX₂E₂" },
    "Ammonia (NH₃)": { type: "trigonal pyramidal", atoms: ["N", "H", "H", "H"], positions: [[0,0,0], [0.7,0.7,0], [0.7,-0.4,-0.6], [-0.8,-0.4,0.5]], colors: [0x4c9aff, 0xdddddd, 0xdddddd, 0xdddddd], radii: [0.45, 0.27, 0.27, 0.27], info: "sp³ hybridized, lone pair, trigonal pyramidal ~107°" },
    "Carbon Dioxide (CO₂)": { type: "linear", atoms: ["C", "O", "O"], positions: [[0,0,0], [1.0,0,0], [-1.0,0,0]], colors: [0x607d8b, 0xe34234, 0xe34234], radii: [0.4, 0.45, 0.45], info: "sp hybridized, linear 180°, VSEPR: AX₂" },
    "Boron Trifluoride (BF₃)": { type: "trigonal planar", atoms: ["B", "F", "F", "F"], positions: [[0,0,0], [0.9,0,0], [-0.45,0.78,0], [-0.45,-0.78,0]], colors: [0xcd9575, 0x6b8e23, 0x6b8e23, 0x6b8e23], radii: [0.38, 0.4, 0.4, 0.4], info: "sp² hybridized, trigonal planar 120°" }
};

// --- MO Data ---
function getMOInfo(compound) {
    const moDb = {
        "O₂": { config: "KK (σ2s)² (σ*2s)² (σ2p)² (π2p)⁴ (π*2p)²", bondOrder: 2, magnetic: "Paramagnetic", diagram: "π* orbitals partially filled" },
        "N₂": { config: "KK (σ2s)² (σ*2s)² (π2p)⁴ (σ2p)²", bondOrder: 3, magnetic: "Diamagnetic", diagram: "Strong triple bond" },
        "F₂": { config: "KK (σ2s)² (σ*2s)² (σ2p)² (π2p)⁴ (π*2p)⁴", bondOrder: 1, magnetic: "Diamagnetic", diagram: "Weak bond" },
        "CO": { config: "KK (σ2s)² (σ*2s)² (π2p)⁴ (σ2p)²", bondOrder: 3, magnetic: "Diamagnetic", diagram: "Isoelectronic to N₂" }
    };
    return moDb[compound] || moDb["O₂"];
}

// --- 3D Model Builders ---
function buildAtomModel(elementName) {
    const group = new THREE.Group();
    const elem = elementsData[elementName] || elementsData["Carbon"];
    const radiusCore = elem.radius * 0.6;
    
    // Nucleus
    const nucleusMat = new THREE.MeshStandardMaterial({ color: 0xffaa66, emissive: 0x442200, roughness: 0.3 });
    const nucleus = new THREE.Mesh(new THREE.SphereGeometry(radiusCore, 64, 64), nucleusMat);
    group.add(nucleus);
    
    // Orbits
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
    
    // Label
    const div = document.createElement('div');
    div.textContent = `${elem.symbol}`;
    div.style.cssText = 'color:#fff; font-size:18px; font-weight:bold; background:rgba(0,0,0,0.6); padding:2px 8px; border-radius:20px; border:1px solid #3b82f6;';
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
        const sphereMat = new THREE.MeshStandardMaterial({ color: mol.colors[idx], roughness: 0.2 });
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(mol.radii[idx], 64, 64), sphereMat);
        sphere.position.set(pos[0], pos[1], pos[2]);
        group.add(sphere);
        
        const div = document.createElement('div');
        div.textContent = atom;
        div.style.cssText = 'color:#eee; font-size:12px; font-weight:bold; background:rgba(0,0,0,0.5); padding:0px 4px; border-radius:12px;';
        const label = new CSS2DObject(div);
        label.position.set(pos[0], pos[1] + 0.35, pos[2]);
        group.add(label);
    });
    
    // Add bonds
    const positions = mol.positions;
    for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
            const p1 = new THREE.Vector3(positions[i][0], positions[i][1], positions[i][2]);
            const p2 = new THREE.Vector3(positions[j][0], positions[j][1], positions[j][2]);
            const dist = p1.distanceTo(p2);
            if (dist < 1.6) {
                const mid = p1.clone().add(p2).multiplyScalar(0.5);
                const dir = p2.clone().sub(p1).normalize();
                const cylinderGeo = new THREE.CylinderGeometry(0.08, 0.08, dist, 6);
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

function init3D() {
    const container = document.querySelector('.canvas-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x030617, 1);
    
    labelRenderer.setSize(width, height);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.left = '0px';
    labelRenderer.domElement.style.pointerEvents = 'none';
    container.appendChild(labelRenderer.domElement);
    
    scene.background = new THREE.Color(0x030617);
    scene.fog = new THREE.FogExp2(0x030617, 0.008);
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    camera.position.set(3, 2, 5);
    camera.lookAt(0, 0, 0);
    
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = false;
    controls.enableZoom = true;
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
    
    // Stars
    const starGeometry = new THREE.BufferGeometry();
    const starPos = [];
    for (let i = 0; i < 800; i++) {
        starPos.push((Math.random() - 0.5) * 200);
        starPos.push((Math.random() - 0.5) * 100);
        starPos.push((Math.random() - 0.5) * 80 - 40);
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(starPos), 3));
    const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.6 }));
    scene.add(stars);
    
    // Default model
    currentModelGroup = buildAtomModel("Carbon");
    scene.add(currentModelGroup);
    
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

// --- UI Update Functions ---
function updateSidebar(topic) {
    const sidebar = document.getElementById('infoSidebar');
    
    if (topic === 'atomic') {
        let options = allElementsList.map(el => `<option value="${el}">${el} (${elementsData[el]?.symbol || '?'})</option>`).join('');
        sidebar.innerHTML = `
            <div class="card">
                <h3><i class="fas fa-microscope"></i> 118 Elements</h3>
                <select id="elementSelect" size="6">${options}</select>
                <button id="viewElementBtn" class="simulate">🔬 Visualize Atom</button>
                <div id="elemInfo" class="info-text" style="margin-top:1rem"></div>
            </div>
            <div class="card">
                <h4>📖 Atomic Theory</h4>
                <p>Atoms consist of nucleus (protons+neutrons) and electron shells. Electrons occupy quantized orbitals.</p>
            </div>
        `;
        document.getElementById('viewElementBtn').onclick = () => {
            const selected = document.getElementById('elementSelect').value;
            if (currentModelGroup) scene.remove(currentModelGroup);
            currentModelGroup = buildAtomModel(selected);
            scene.add(currentModelGroup);
            const elem = elementsData[selected];
            document.getElementById('elemInfo').innerHTML = `
                <div class="property-row"><strong>${selected}</strong> (${elem.symbol})</div>
                <div class="property-row">Atomic Number: ${elem.atomic}</div>
                <div class="property-row">Mass: ${elem.mass} u</div>
                <div class="property-row">Config: ${elem.config}</div>
                <div class="property-row">Electronegativity: ${elem.electroneg}</div>
                <div class="property-row">Category: ${elem.category}</div>
            `;
        };
        document.getElementById('viewElementBtn').click();
    }
    else if (topic === 'orbitals') {
        sidebar.innerHTML = `
            <div class="card">
                <h3><i class="fas fa-shapes"></i> Orbital Explorer</h3>
                <button id="showSOrbital" class="simulate">🎯 Show s-Orbital (Spherical)</button>
                <button id="showPOrbital" class="simulate">🎯 Show p-Orbital (Dumbbell)</button>
                <div class="info-text mt-2">s-orbitals: spherical, non-directional. p-orbitals: dumbbell-shaped, directional.</div>
            </div>
        `;
        document.getElementById('showSOrbital').onclick = () => {
            if (currentModelGroup) scene.remove(currentModelGroup);
            const group = new THREE.Group();
            const mat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x1e3a8a, transparent: true, opacity: 0.5 });
            const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.0, 64, 64), mat);
            group.add(sphere);
            currentModelGroup = group;
            scene.add(currentModelGroup);
        };
        document.getElementById('showPOrbital').onclick = () => {
            if (currentModelGroup) scene.remove(currentModelGroup);
            const group = new THREE.Group();
            const mat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0x7c2d12 });
            const lobe1 = new THREE.Mesh(new THREE.SphereGeometry(0.7, 48, 48), mat);
            lobe1.position.set(1.2, 0, 0);
            const lobe2 = new THREE.Mesh(new THREE.SphereGeometry(0.7, 48, 48), mat);
            lobe2.position.set(-1.2, 0, 0);
            group.add(lobe1, lobe2);
            currentModelGroup = group;
            scene.add(currentModelGroup);
        };
    }
    else if (topic === 'vsepr') {
        let molOptions = Object.keys(moleculeLibrary).map(m => `<option value="${m}">${m}</option>`).join('');
        sidebar.innerHTML = `
            <div class="card">
                <h3>📐 VSEPR & Hybridization</h3>
                <select id="molSelect">${molOptions}</select>
                <button id="loadMolBtn" class="simulate">🧪 Visualize Molecule</button>
                <div id="vseprInfo" class="info-text mt-2"></div>
            </div>
            <div class="card">
                <h4>VSEPR Theory</h4>
                <p>Electron pairs repel to minimize repulsion, determining molecular geometry. Hybridization: sp, sp², sp³.</p>
            </div>
        `;
        document.getElementById('loadMolBtn').onclick = () => {
            const selected = document.getElementById('molSelect').value;
            if (currentModelGroup) scene.remove(currentModelGroup);
            currentModelGroup = buildMoleculeModel(selected);
            scene.add(currentModelGroup);
            document.getElementById('vseprInfo').innerHTML = `<strong>${selected}</strong><br>${moleculeLibrary[selected].info}`;
        };
        document.getElementById('loadMolBtn').click();
    }
    else if (topic === 'mot') {
        sidebar.innerHTML = `
            <div class="card">
                <h3>⚡ Molecular Orbital Theory</h3>
                <select id="moSelect">
                    <option>O₂</option><option>N₂</option><option>F₂</option><option>CO</option>
                </select>
                <button id="showMOBtn" class="simulate">Show MO Diagram</button>
                <div id="moInfo" class="info-text mt-2"></div>
            </div>
        `;
        document.getElementById('showMOBtn').onclick = () => {
            const comp = document.getElementById('moSelect').value;
            const data = getMOInfo(comp);
            document.getElementById('moInfo').innerHTML = `
                <strong>${comp} Molecular Orbitals</strong><br>
                Config: ${data.config}<br>
                Bond Order: ${data.bondOrder}<br>
                Magnetic: ${data.magnetic}<br>
                ${data.diagram}
            `;
            if (currentModelGroup) scene.remove(currentModelGroup);
            const moGroup = new THREE.Group();
            for(let i=0; i<5; i++) {
                const bar = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3 + i*0.1, 0.2), new THREE.MeshStandardMaterial({ color: 0x88aaff }));
                bar.position.set(i-2, i*0.3, 0);
                moGroup.add(bar);
            }
            currentModelGroup = moGroup;
            scene.add(currentModelGroup);
        };
        document.getElementById('showMOBtn').click();
    }
    else if (topic === 'resources') {
        sidebar.innerHTML = `
            <div class="card">
                <h3><i class="fas fa-book-open"></i> Free Study Resources</h3>
                <ul class="resource-list">
                    <li><a href="#" onclick="return false;">📘 Chem LibreTexts - Atomic Theory</a></li>
                    <li><a href="#" onclick="return false;">🎓 Khan Academy: Bonding</a></li>
                    <li><a href="#" onclick="return false;">🧪 PhET Interactive Simulations</a></li>
                    <li><a href="#" onclick="return false;">📖 IUPAC Goldbook</a></li>
                    <li><a href="#" onclick="return false;">🎥 3D Organic Chemistry (YouTube)</a></li>
                </ul>
            </div>
            <div class="card">
                <h4>Recommended Textbooks</h4>
                <p>• Clayden - Organic Chemistry<br>• Atkins - Physical Chemistry<br>• Huheey - Inorganic Chemistry</p>
            </div>
        `;
    }
}

// --- Event Listeners ---
function setupEventListeners() {
    document.querySelectorAll('.topic-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.topic-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateSidebar(btn.dataset.topic);
        });
    });
}

// --- Resize Handler ---
window.addEventListener('resize', () => {
    const container = document.querySelector('.canvas-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize
