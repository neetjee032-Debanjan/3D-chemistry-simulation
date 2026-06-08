import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// Initialize variables
let scene, camera, renderer, labelRenderer, controls, currentModel = null;

// Element data
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

const allElements = Object.keys(elementsData);

// Molecule library for VSEPR
const molecules = {
    "Methane (CH₄)": { type: "Tetrahedral", atoms: ["C", "H", "H", "H", "H"], positions: [[0,0,0], [0.7,0.7,0.7], [0.7,-0.7,-0.7], [-0.7,0.7,-0.7], [-0.7,-0.7,0.7]], colors: [0x7c7c7c, 0xcfcfcf, 0xcfcfcf, 0xcfcfcf, 0xcfcfcf], radii: [0.4, 0.25, 0.25, 0.25, 0.25], info: "sp³ hybridized, tetrahedral, 109.5°" },
    "Water (H₂O)": { type: "Bent", atoms: ["O", "H", "H"], positions: [[0,0,0], [0.7,0.5,0], [-0.7,0.5,0]], colors: [0x3b82f6, 0xe0e0e0, 0xe0e0e0], radii: [0.45, 0.25, 0.25], info: "sp³ hybridized, bent (104.5°), AX₂E₂" },
    "Ammonia (NH₃)": { type: "Trigonal Pyramidal", atoms: ["N", "H", "H", "H"], positions: [[0,0,0], [0.7,0.7,0], [0.7,-0.4,-0.6], [-0.8,-0.4,0.5]], colors: [0x4c9aff, 0xdddddd, 0xdddddd, 0xdddddd], radii: [0.45, 0.27, 0.27, 0.27], info: "sp³ hybridized, pyramidal, ~107°" },
    "CO₂": { type: "Linear", atoms: ["C", "O", "O"], positions: [[0,0,0], [1.1,0,0], [-1.1,0,0]], colors: [0x607d8b, 0xe34234, 0xe34234], radii: [0.4, 0.45, 0.45], info: "sp hybridized, linear, 180°" },
    "BF₃": { type: "Trigonal Planar", atoms: ["B", "F", "F", "F"], positions: [[0,0,0], [0.9,0,0], [-0.45,0.78,0], [-0.45,-0.78,0]], colors: [0xcd9575, 0x6b8e23, 0x6b8e23, 0x6b8e23], radii: [0.38, 0.4, 0.4, 0.4], info: "sp² hybridized, trigonal planar, 120°" }
};

// MO Theory data
function getMOData(compound) {
    const data = {
        "O₂": { config: "(σ2s)² (σ*2s)² (σ2p)² (π2p)⁴ (π*2p)²", bondOrder: 2, magnetic: "Paramagnetic" },
        "N₂": { config: "(σ2s)² (σ*2s)² (π2p)⁴ (σ2p)²", bondOrder: 3, magnetic: "Diamagnetic" },
        "F₂": { config: "(σ2s)² (σ*2s)² (σ2p)² (π2p)⁴ (π*2p)⁴", bondOrder: 1, magnetic: "Diamagnetic" },
        "CO": { config: "(σ2s)² (σ*2s)² (π2p)⁴ (σ2p)²", bondOrder: 3, magnetic: "Diamagnetic" }
    };
    return data[compound] || data["O₂"];
}

// Create 3D atom model
function createAtomModel(element) {
    const group = new THREE.Group();
    const data = elementsData[element];
    const radius = data.radius * 0.6;
    
    // Nucleus
    const nucleusMat = new THREE.MeshStandardMaterial({ color: 0xffaa66, emissive: 0x442200 });
    const nucleus = new THREE.Mesh(new THREE.SphereGeometry(radius, 64, 64), nucleusMat);
    group.add(nucleus);
    
    // Electron orbits
    const orbits = [0.9, 1.3, 1.7];
    orbits.forEach((r, i) => {
        const points = [];
        for (let ang = 0; ang <= 360; ang += 10) {
            const rad = ang * Math.PI / 180;
            points.push(new THREE.Vector3(Math.cos(rad) * r, Math.sin(rad) * r * 0.7, Math.sin(rad) * r * 0.5));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0x4d9eff });
        const orbit = new THREE.LineLoop(geometry, material);
        group.add(orbit);
    });
    
    // Label
    const div = document.createElement('div');
    div.textContent = data.symbol;
    div.style.cssText = 'color:#fff; font-size:20px; font-weight:bold; background:rgba(0,0,0,0.7); padding:4px 12px; border-radius:25px; border:1px solid #3b82f6;';
    const label = new CSS2DObject(div);
    label.position.set(0, radius + 0.5, 0);
    group.add(label);
    
    return group;
}

// Create 3D molecule model
function createMoleculeModel(name) {
    const mol = molecules[name];
    if (!mol) return new THREE.Group();
    const group = new THREE.Group();
    
    mol.atoms.forEach((atom, idx) => {
        const pos = mol.positions[idx];
        const mat = new THREE.MeshStandardMaterial({ color: mol.colors[idx], roughness: 0.3 });
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(mol.radii[idx], 64, 64), mat);
        sphere.position.set(pos[0], pos[1], pos[2]);
        group.add(sphere);
        
        const div = document.createElement('div');
        div.textContent = atom;
        div.style.cssText = 'color:#fff; font-size:11px; background:rgba(0,0,0,0.6); padding:2px 6px; border-radius:12px;';
        const label = new CSS2DObject(div);
        label.position.set(pos[0], pos[1] + 0.35, pos[2]);
        group.add(label);
    });
    
    // Add bonds
    for (let i = 0; i < mol.positions.length; i++) {
        for (let j = i + 1; j < mol.positions.length; j++) {
            const p1 = new THREE.Vector3(mol.positions[i][0], mol.positions[i][1], mol.positions[i][2]);
            const p2 = new THREE.Vector3(mol.positions[j][0], mol.positions[j][1], mol.positions[j][2]);
            const dist = p1.distanceTo(p2);
            if (dist < 1.5) {
                const mid = p1.clone().add(p2).multiplyScalar(0.5);
                const dir = p2.clone().sub(p1).normalize();
                const cylinder = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.08, 0.08, dist, 6),
                    new THREE.MeshStandardMaterial({ color: 0xaaaaff })
                );
                cylinder.position.copy(mid);
                cylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), dir);
                group.add(cylinder);
            }
        }
    }
    return group;
}

// Initialize 3D scene
function init3D() {
    const container = document.querySelector('.canvas-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030617);
    scene.fog = new THREE.FogExp2(0x030617, 0.01);
    
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(3, 2, 5);
    camera.lookAt(0, 0, 0);
    
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas3d'), antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x030617, 1);
    
    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(width, height);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.left = '0px';
    labelRenderer.domElement.style.pointerEvents = 'none';
    container.appendChild(labelRenderer.domElement);
    
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = false;
    controls.enableZoom = true;
    controls.zoomSpeed = 1.2;
    
    // Lighting
    const ambient = new THREE.AmbientLight(0x404060);
    scene.add(ambient);
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(2, 3, 4);
    scene.add(mainLight);
    const fillLight = new THREE.PointLight(0x4466cc, 0.5);
    fillLight.position.set(-1, 2, 2);
    scene.add(fillLight);
    const backLight = new THREE.PointLight(0xffaa66, 0.3);
    backLight.position.set(0, 1, -3);
    scene.add(backLight);
    
    // Stars background
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = [];
    for (let i = 0; i < 1000; i++) {
        starPositions.push((Math.random() - 0.5) * 200);
        starPositions.push((Math.random() - 0.5) * 100);
        starPositions.push((Math.random() - 0.5) * 80 - 40);
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(starPositions), 3));
    const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true }));
    scene.add(stars);
    
    // Default model
    currentModel = createAtomModel("Carbon");
    scene.add(currentModel);
    
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    if (renderer && scene && camera) renderer.render(scene, camera);
    if (labelRenderer) labelRenderer.render(scene, camera);
}

// Sidebar UI handlers
function showAtomicStructure() {
    const sidebar = document.getElementById('infoSidebar');
    sidebar.innerHTML = `
        <div class="card">
            <h3><i class="fas fa-atom"></i> 118 Elements</h3>
            <select id="elementSelect">${allElements.map(el => `<option value="${el}">${el} (${elementsData[el].symbol})</option>`).join('')}</select>
            <button id="viewAtomBtn" class="simulate">🔬 View 3D Atom</button>
            <div id="elementInfo" class="info-text mt-2"></div>
        </div>
        <div class="card">
            <h4>📖 Atomic Theory</h4>
            <p>Atoms consist of a dense nucleus (protons + neutrons) surrounded by electron clouds in quantized orbitals.</p>
        </div>
    `;
    
    document.getElementById('viewAtomBtn').onclick = () => {
        const element = document.getElementById('elementSelect').value;
        if (currentModel) scene.remove(currentModel);
        currentModel = createAtomModel(element);
        scene.add(currentModel);
        
        const data = elementsData[element];
        document.getElementById('elementInfo').innerHTML = `
            <div class="property-row"><strong>${element}</strong> (${data.symbol})</div>
            <div class="property-row">Atomic Number: ${data.atomic}</div>
            <div class="property-row">Atomic Mass: ${data.mass} u</div>
            <div class="property-row">Electron Config: ${data.config}</div>
            <div class="property-row">Electronegativity: ${data.electroneg}</div>
            <div class="property-row">Category: ${data.category}</div>
        `;
    };
    document.getElementById('viewAtomBtn').click();
}

function showOrbitals() {
    const sidebar = document.getElementById('infoSidebar');
    sidebar.innerHTML = `
        <div class="card">
            <h3><i class="fas fa-shapes"></i> Orbital Explorer</h3>
            <button id="showS" class="simulate">🎯 s-Orbital (Spherical)</button>
            <button id="showP" class="simulate">🎯 p-Orbital (Dumbbell)</button>
            <div class="info-text mt-2">s-orbitals are spherical and non-directional. p-orbitals have dumbbell shapes with directional character.</div>
        </div>
    `;
    
    document.getElementById('showS').onclick = () => {
        if (currentModel) scene.remove(currentModel);
        const group = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.4 });
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.0, 64, 64), mat);
        group.add(sphere);
        currentModel = group;
        scene.add(currentModel);
    };
    
    document.getElementById('showP').onclick = () => {
        if (currentModel) scene.remove(currentModel);
        const group = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({ color: 0xf97316 });
        const lobe1 = new THREE.Mesh(new THREE.SphereGeometry(0.7, 48, 48), mat);
        lobe1.position.set(1.2, 0, 0);
        const lobe2 = new THREE.Mesh(new THREE.SphereGeometry(0.7, 48, 48), mat);
        lobe2.position.set(-1.2, 0, 0);
        group.add(lobe1, lobe2);
        currentModel = group;
        scene.add(currentModel);
    };
}

function showVSEPR() {
    const sidebar = document.getElementById('infoSidebar');
    sidebar.innerHTML = `
        <div class="card">
            <h3><i class="fas fa-dice-d6"></i> VSEPR & Hybridization</h3>
            <select id="moleculeSelect">${Object.keys(molecules).map(m => `<option value="${m}">${m}</option>`).join('')}</select>
            <button id="viewMoleculeBtn" class="simulate">🧪 View 3D Molecule</button>
            <div id="moleculeInfo" class="info-text mt-2"></div>
        </div>
        <div class="card">
            <h4>VSEPR Theory</h4>
            <p>Electron pairs repel to minimize repulsion. Common geometries: linear, trigonal planar, tetrahedral, bent.</p>
        </div>
    `;
    
    document.getElementById('viewMoleculeBtn').onclick = () => {
        const molecule = document.getElementById('moleculeSelect').value;
        if (currentModel) scene.remove(currentModel);
        currentModel = createMoleculeModel(molecule);
        scene.add(currentModel);
        document.getElementById('moleculeInfo').innerHTML = `<strong>${molecule}</strong><br>Shape: ${molecules[molecule].type}<br>${molecules[molecule].info}`;
    };
    document.getElementById('viewMoleculeBtn').click();
}

function showMO() {
    const sidebar = document.getElementById('infoSidebar');
    sidebar.innerHTML = `
        <div class="card">
            <h3><i class="fas fa-chart-line"></i> Molecular Orbital Theory</h3>
            <select id="moSelect"><option>O₂</option><option>N₂</option><option>F₂</option><option>CO</option></select>
            <button id="viewMOBtn" class="simulate">📊 Show MO Diagram</button>
            <div id="moInfo" class="info-text mt-2"></div>
        </div>
    `;
    
    document.getElementById('viewMOBtn').onclick = () => {
        const compound = document.getElementById('moSelect').value;
        const data = getMOData(compound);
        document.getElementById('moInfo').innerHTML = `
            <strong>${compound} Molecular Orbitals</strong><br>
            Configuration: ${data.config}<br>
            Bond Order: ${data.bondOrder}<br>
            Magnetic Property: ${data.magnetic}
        `;
        
        if (currentModel) scene.remove(currentModel);
        const group = new THREE.Group();
        for (let i = 0; i < 6; i++) {
            const bar = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2 + i * 0.1, 0.2), new THREE.MeshStandardMaterial({ color: 0x66aaff }));
            bar.position.set(i - 2.5, i * 0.25, 0);
            group.add(bar);
        }
        currentModel = group;
        scene.add(currentModel);
    };
    document.getElementById('viewMOBtn').click();
}

function showResources() {
    const sidebar = document.getElementById('infoSidebar');
    sidebar.innerHTML = `
        <div class="card">
            <h3><i class="fas fa-book"></i> Free Resources</h3>
            <ul class="resource-list">
                <li>📘 <a href="#" onclick="return false;">Chem LibreTexts - Atomic Theory</a></li>
                <li>🎓 <a href="#" onclick="return false;">Khan Academy - Chemical Bonding</a></li>
                <li>🧪 <a href="#" onclick="return false;">PhET Interactive Simulations</a></li>
                <li>📖 <a href="#" onclick="return false;">IUPAC Gold Book</a></li>
                <li>🎥 <a href="#" onclick="return false;">3D Chemistry Visualizations</a></li>
            </ul>
        </div>
        <div class="card">
            <h4>Recommended Textbooks</h4>
            <p>• Organic Chemistry - Clayden<br>• Physical Chemistry - Atkins<br>• Inorganic Chemistry - Huheey</p>
        </div>
    `;
}

// Main initialization
function init() {
    init3D();
    
    // Set up button handlers
    document.querySelectorAll('.topic-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.topic-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const topic = btn.dataset.topic;
            if (topic === 'atomic') showAtomicStructure();
            else if (topic === 'orbitals') showOrbitals();
            else if (topic === 'vsepr') showVSEPR();
            else if (topic === 'mot') showMO();
            else if (topic === 'resources') showResources();
        };
    });
    
    // Start with atomic structure
    showAtomicStructure();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const container = document.querySelector('.canvas-container');
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        labelRenderer.setSize(width, height);
    });
}

// Start the app
init();
