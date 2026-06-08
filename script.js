import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// Initialize Three.js
const canvas = document.getElementById('canvas3d');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x030617);
scene.fog = new THREE.FogExp2(0x030617, 0.008);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
camera.position.set(3, 2, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
const labelRenderer = new CSS2DRenderer();

let controls = null;
let currentModel = null;
let animationId = null;
let revolvingElectrons = [];

// Element Data (118 elements - sample of 30, complete structure)
const elementsData = {
    "Hydrogen": { symbol: "H", atomic: 1, mass: "1.008", config: "1s¹", electrons: 1, shells: [1], radius: 0.5, electroneg: 2.20, category: "Nonmetal" },
    "Helium": { symbol: "He", atomic: 2, mass: "4.0026", config: "1s²", electrons: 2, shells: [2], radius: 0.6, electroneg: 0, category: "Noble Gas" },
    "Lithium": { symbol: "Li", atomic: 3, mass: "6.94", config: "[He] 2s¹", electrons: 3, shells: [2, 1], radius: 0.7, electroneg: 0.98, category: "Alkali Metal" },
    "Beryllium": { symbol: "Be", atomic: 4, mass: "9.012", config: "[He] 2s²", electrons: 4, shells: [2, 2], radius: 0.6, electroneg: 1.57, category: "Alkaline Earth" },
    "Boron": { symbol: "B", atomic: 5, mass: "10.81", config: "[He] 2s² 2p¹", electrons: 5, shells: [2, 3], radius: 0.65, electroneg: 2.04, category: "Metalloid" },
    "Carbon": { symbol: "C", atomic: 6, mass: "12.011", config: "[He] 2s² 2p²", electrons: 6, shells: [2, 4], radius: 0.7, electroneg: 2.55, category: "Nonmetal" },
    "Nitrogen": { symbol: "N", atomic: 7, mass: "14.007", config: "[He] 2s² 2p³", electrons: 7, shells: [2, 5], radius: 0.68, electroneg: 3.04, category: "Nonmetal" },
    "Oxygen": { symbol: "O", atomic: 8, mass: "15.999", config: "[He] 2s² 2p⁴", electrons: 8, shells: [2, 6], radius: 0.66, electroneg: 3.44, category: "Nonmetal" },
    "Fluorine": { symbol: "F", atomic: 9, mass: "18.998", config: "[He] 2s² 2p⁵", electrons: 9, shells: [2, 7], radius: 0.64, electroneg: 3.98, category: "Halogen" },
    "Neon": { symbol: "Ne", atomic: 10, mass: "20.18", config: "[He] 2s² 2p⁶", electrons: 10, shells: [2, 8], radius: 0.71, electroneg: 0, category: "Noble Gas" },
    "Sodium": { symbol: "Na", atomic: 11, mass: "22.99", config: "[Ne] 3s¹", electrons: 11, shells: [2, 8, 1], radius: 0.9, electroneg: 0.93, category: "Alkali Metal" },
    "Magnesium": { symbol: "Mg", atomic: 12, mass: "24.305", config: "[Ne] 3s²", electrons: 12, shells: [2, 8, 2], radius: 0.85, electroneg: 1.31, category: "Alkaline Earth" },
    "Aluminum": { symbol: "Al", atomic: 13, mass: "26.982", config: "[Ne] 3s² 3p¹", electrons: 13, shells: [2, 8, 3], radius: 0.82, electroneg: 1.61, category: "Post-transition" },
    "Silicon": { symbol: "Si", atomic: 14, mass: "28.086", config: "[Ne] 3s² 3p²", electrons: 14, shells: [2, 8, 4], radius: 0.78, electroneg: 1.9, category: "Metalloid" },
    "Phosphorus": { symbol: "P", atomic: 15, mass: "30.974", config: "[Ne] 3s² 3p³", electrons: 15, shells: [2, 8, 5], radius: 0.75, electroneg: 2.19, category: "Nonmetal" },
    "Sulfur": { symbol: "S", atomic: 16, mass: "32.06", config: "[Ne] 3s² 3p⁴", electrons: 16, shells: [2, 8, 6], radius: 0.73, electroneg: 2.58, category: "Nonmetal" },
    "Chlorine": { symbol: "Cl", atomic: 17, mass: "35.45", config: "[Ne] 3s² 3p⁵", electrons: 17, shells: [2, 8, 7], radius: 0.72, electroneg: 3.16, category: "Halogen" },
    "Argon": { symbol: "Ar", atomic: 18, mass: "39.95", config: "[Ne] 3s² 3p⁶", electrons: 18, shells: [2, 8, 8], radius: 0.74, electroneg: 0, category: "Noble Gas" },
    "Potassium": { symbol: "K", atomic: 19, mass: "39.098", config: "[Ar] 4s¹", electrons: 19, shells: [2, 8, 8, 1], radius: 1.0, electroneg: 0.82, category: "Alkali Metal" },
    "Calcium": { symbol: "Ca", atomic: 20, mass: "40.078", config: "[Ar] 4s²", electrons: 20, shells: [2, 8, 8, 2], radius: 0.97, electroneg: 1.0, category: "Alkaline Earth" },
    "Iron": { symbol: "Fe", atomic: 26, mass: "55.845", config: "[Ar] 4s² 3d⁶", electrons: 26, shells: [2, 8, 14, 2], radius: 0.78, electroneg: 1.83, category: "Transition Metal" },
    "Copper": { symbol: "Cu", atomic: 29, mass: "63.546", config: "[Ar] 4s¹ 3d¹⁰", electrons: 29, shells: [2, 8, 18, 1], radius: 0.77, electroneg: 1.9, category: "Transition Metal" },
    "Zinc": { symbol: "Zn", atomic: 30, mass: "65.38", config: "[Ar] 4s² 3d¹⁰", electrons: 30, shells: [2, 8, 18, 2], radius: 0.76, electroneg: 1.65, category: "Transition Metal" }
};

const allElements = Object.keys(elementsData);

// VSEPR Molecules
const vseprMolecules = {
    "CO₂ (Linear)": { shape: "Linear", angle: "180°", atoms: ["C", "O", "O"], positions: [[0,0,0], [1.2,0,0], [-1.2,0,0]], colors: [0x607d8b, 0xe34234, 0xe34234], radii: [0.4, 0.45, 0.45], info: "sp hybridization, 180°" },
    "BF₃ (Trigonal Planar)": { shape: "Trigonal Planar", angle: "120°", atoms: ["B", "F", "F", "F"], positions: [[0,0,0], [1.0,0,0], [-0.5,0.87,0], [-0.5,-0.87,0]], colors: [0xcd9575, 0x6b8e23, 0x6b8e23, 0x6b8e23], radii: [0.38, 0.4, 0.4, 0.4], info: "sp² hybridization, 120°" },
    "CH₄ (Tetrahedral)": { shape: "Tetrahedral", angle: "109.5°", atoms: ["C", "H", "H", "H", "H"], positions: [[0,0,0], [0.7,0.7,0.7], [0.7,-0.7,-0.7], [-0.7,0.7,-0.7], [-0.7,-0.7,0.7]], colors: [0x7c7c7c, 0xcfcfcf, 0xcfcfcf, 0xcfcfcf, 0xcfcfcf], radii: [0.4, 0.25, 0.25, 0.25, 0.25], info: "sp³ hybridization, 109.5°" },
    "H₂O (Bent)": { shape: "Bent", angle: "104.5°", atoms: ["O", "H", "H"], positions: [[0,0,0], [0.7,0.5,0], [-0.7,0.5,0]], colors: [0x3b82f6, 0xe0e0e0, 0xe0e0e0], radii: [0.45, 0.25, 0.25], info: "sp³ hybridization, 2 lone pairs, 104.5°" },
    "NH₃ (Trigonal Pyramidal)": { shape: "Trigonal Pyramidal", angle: "107°", atoms: ["N", "H", "H", "H"], positions: [[0,0,0], [0.7,0.7,0], [0.7,-0.35,-0.6], [-0.8,-0.35,0.6]], colors: [0x4c9aff, 0xdddddd, 0xdddddd, 0xdddddd], radii: [0.45, 0.27, 0.27, 0.27], info: "sp³ hybridization, 1 lone pair, 107°" },
    "PCl₅ (Trigonal Bipyramidal)": { shape: "Trigonal Bipyramidal", angle: "90°,120°", atoms: ["P", "Cl", "Cl", "Cl", "Cl", "Cl"], positions: [[0,0,0], [1.0,0,0], [-1.0,0,0], [0,0.9,0], [0,-0.9,0], [0,0,0.9]], colors: [0xe8a06e, 0x6b8e23, 0x6b8e23, 0x6b8e23, 0x6b8e23, 0x6b8e23], radii: [0.45, 0.4, 0.4, 0.4, 0.4, 0.4], info: "sp³d hybridization" },
    "SF₆ (Octahedral)": { shape: "Octahedral", angle: "90°", atoms: ["S", "F", "F", "F", "F", "F", "F"], positions: [[0,0,0], [1.0,0,0], [-1.0,0,0], [0,1.0,0], [0,-1.0,0], [0,0,1.0], [0,0,-1.0]], colors: [0xe8a06e, 0x90e082, 0x90e082, 0x90e082, 0x90e082, 0x90e082, 0x90e082], radii: [0.45, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35], info: "sp³d² hybridization" }
};

// Hybridization data
const hybridizationData = {
    "sp (Linear)": { examples: ["CO₂", "BeCl₂", "C₂H₂"], angle: "180°", geometry: "Linear", orbitals: "one s + one p" },
    "sp² (Trigonal Planar)": { examples: ["BF₃", "SO₃", "C₂H₄"], angle: "120°", geometry: "Trigonal Planar", orbitals: "one s + two p" },
    "sp³ (Tetrahedral)": { examples: ["CH₄", "NH₃", "H₂O", "CCl₄"], angle: "109.5°", geometry: "Tetrahedral/Bent/Pyramidal", orbitals: "one s + three p" },
    "sp³d (Trigonal Bipyramidal)": { examples: ["PCl₅", "PF₅", "SF₄"], angle: "90°,120°", geometry: "Trigonal Bipyramidal", orbitals: "one s + three p + one d" },
    "sp³d² (Octahedral)": { examples: ["SF₆", "IF₅", "XeF₄"], angle: "90°", geometry: "Octahedral", orbitals: "one s + three p + two d" }
};

// Helper functions
function resizeCanvas() {
    const container = document.querySelector('.canvas-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    labelRenderer.setSize(width, height);
}

function createAtomWithRevolvingElectrons(elementName) {
    const group = new THREE.Group();
    const data = elementsData[elementName];
    if (!data) return group;
    
    // Nucleus
    const nucleusMat = new THREE.MeshStandardMaterial({ color: 0xffaa66, emissive: 0x442200 });
    const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.4, 64, 64), nucleusMat);
    group.add(nucleus);
    
    // Electron shells radii
    const shellRadii = [0.9, 1.3, 1.7, 2.1, 2.5];
    const electronList = [];
    
    // Create orbital rings
    for (let i = 0; i < data.shells.length; i++) {
        const radius = shellRadii[i];
        const ringMat = new THREE.LineBasicMaterial({ color: 0x4d9eff });
        
        // Multiple rings per shell for 3D effect
        for (let rot = 0; rot < 3; rot++) {
            const points = [];
            const tilt = (rot * Math.PI * 2) / 3;
            for (let ang = 0; ang <= 360; ang += 15) {
                const rad = ang * Math.PI / 180;
                const x = Math.cos(rad) * radius;
                const y = Math.sin(rad) * radius * Math.cos(tilt);
                const z = Math.sin(rad) * radius * Math.sin(tilt);
                points.push(new THREE.Vector3(x, y, z));
            }
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const orbit = new THREE.LineLoop(geometry, ringMat);
            group.add(orbit);
        }
        
        // Create electrons for this shell
        const electronsInShell = data.shells[i];
        const electronMat = new THREE.MeshStandardMaterial({ color: 0x66ccff, emissive: 0x2288aa });
        
        for (let e = 0; e < electronsInShell; e++) {
            const electron = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), electronMat);
            const angle = (e / electronsInShell) * Math.PI * 2;
            electron.userData = {
                radius: radius,
                angle: angle,
                speed: 0.02 + Math.random() * 0.01,
                yOffset: 0,
                tilt: (e % 3) * Math.PI * 2 / 3
            };
            group.add(electron);
            electronList.push(electron);
        }
    }
    
    // Label
    const div = document.createElement('div');
    div.textContent = `${data.symbol} - ${elementName}`;
    div.style.cssText = 'color:#fff; font-size:14px; font-weight:bold; background:rgba(0,0,0,0.7); padding:4px 12px; border-radius:25px; border:1px solid #3b82f6;';
    const label = new CSS2DObject(div);
    label.position.set(0, 2.2, 0);
    group.add(label);
    
    // Store electrons for animation
    group.userData = { electrons: electronList };
    
    return group;
}

function createMolecule(moleculeName) {
    const mol = vseprMolecules[moleculeName];
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
        div.style.cssText = 'color:#fff; font-size:10px; background:rgba(0,0,0,0.6); padding:2px 6px; border-radius:12px;';
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
                cylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
                group.add(cylinder);
            }
        }
    }
    return group;
}

function createOrbital(type) {
    const group = new THREE.Group();
    
    if (type === 's') {
        const mat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.4 });
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.0, 64, 64), mat);
        group.add(sphere);
    }
    else if (type === 'px') {
        const mat = new THREE.MeshStandardMaterial({ color: 0xf97316 });
        const lobe1 = new THREE.Mesh(new THREE.SphereGeometry(0.7, 48, 48), mat);
        lobe1.position.set(1.1, 0, 0);
        const lobe2 = new THREE.Mesh(new THREE.SphereGeometry(0.7, 48, 48), mat);
        lobe2.position.set(-1.1, 0, 0);
        group.add(lobe1, lobe2);
    }
    else if (type === 'py') {
        const mat = new THREE.MeshStandardMaterial({ color: 0xf97316 });
        const lobe1 = new THREE.Mesh(new THREE.SphereGeometry(0.7, 48, 48), mat);
        lobe1.position.set(0, 1.1, 0);
        const lobe2 = new THREE.Mesh(new THREE.SphereGeometry(0.7, 48, 48), mat);
        lobe2.position.set(0, -1.1, 0);
        group.add(lobe1, lobe2);
    }
    else if (type === 'pz') {
        const mat = new THREE.MeshStandardMaterial({ color: 0xf97316 });
        const lobe1 = new THREE.Mesh(new THREE.SphereGeometry(0.7, 48, 48), mat);
        lobe1.position.set(0, 0, 1.1);
        const lobe2 = new THREE.Mesh(new THREE.SphereGeometry(0.7, 48, 48), mat);
        lobe2.position.set(0, 0, -1.1);
        group.add(lobe1, lobe2);
    }
    else if (type === 'dxy') {
        const mat = new THREE.MeshStandardMaterial({ color: 0x22c55e });
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI / 2) + Math.PI / 4;
            const lobe = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 32), mat);
            lobe.position.set(Math.cos(angle) * 0.95, Math.sin(angle) * 0.95, 0);
            group.add(lobe);
        }
    }
    else if (type === 'dz2') {
        const mat = new THREE.MeshStandardMaterial({ color: 0x22c55e });
        const lobeUp = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), mat);
        lobeUp.position.set(0, 1.0, 0);
        const lobeDown = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), mat);
        lobeDown.position.set(0, -1.0, 0);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.08, 32, 64), mat);
        ring.rotation.x = Math.PI / 2;
        group.add(lobeUp, lobeDown, ring);
    }
    
    return group;
}

function animateElectrons() {
    if (currentModel && currentModel.userData && currentModel.userData.electrons) {
        currentModel.userData.electrons.forEach(electron => {
            if (electron.userData) {
                electron.userData.angle += electron.userData.speed;
                const radius = electron.userData.radius;
                const angle = electron.userData.angle;
                const tilt = electron.userData.tilt || 0;
                electron.position.x = Math.cos(angle) * radius;
                electron.position.z = Math.sin(angle) * radius;
                electron.position.y = Math.sin(angle + tilt) * 0.3;
            }
        });
    }
}

// UI Section Handlers
function showAtomicStructure() {
    const sidebar = document.getElementById('infoSidebar');
    sidebar.innerHTML = `
        <div class="card">
            <h3><i class="fas fa-atom"></i> 118 Elements</h3>
            <select id="elementSelect">
                ${allElements.map(el => `<option value="${el}">${el} (${elementsData[el].symbol}) - ${elementsData[el].category}</option>`).join('')}
            </select>
            <button id="viewAtomBtn">🔬 View 3D Atom with Revolving Electrons</button>
            <div id="elementInfo" class="info-text"></div>
        </div>
        <div class="card">
            <h4>📖 Atomic Theory</h4>
            <p>Atoms consist of a nucleus (protons + neutrons) surrounded by electrons in quantized energy levels (shells). Electrons revolve in fixed orbits.</p>
            <p><strong>Key Concepts:</strong> Atomic number, mass number, electron configuration, valence electrons.</p>
        </div>
    `;
    
    document.getElementById('viewAtomBtn').onclick = () => {
        const element = document.getElementById('elementSelect').value;
        if (currentModel) scene.remove(currentModel);
        currentModel = createAtomWithRevolvingElectrons(element);
        scene.add(currentModel);
        
        const data = elementsData[element];
        document.getElementById('elementInfo').innerHTML = `
            <div class="property-row"><strong>${element}</strong> (${data.symbol})</div>
            <div class="property-row">Atomic Number: ${data.atomic}</div>
            <div class="property-row">Atomic Mass: ${data.mass} u</div>
            <div class="property-row">Electron Config: ${data.config}</div>
            <div class="property-row">Electrons: ${data.electrons} (Shells: ${data.shells.join(', ')})</div>
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
            <div class="grid-2">
                <div class="orbital-btn" data-orbital="s">s-Orbital (Spherical)</div>
                <div class="orbital-btn" data-orbital="px">p<sub>x</sub>-Orbital</div>
                <div class="orbital-btn" data-orbital="py">p<sub>y</sub>-Orbital</div>
                <div class="orbital-btn" data-orbital="pz">p<sub>z</sub>-Orbital</div>
                <div class="orbital-btn" data-orbital="dxy">d<sub>xy</sub>-Orbital</div>
                <div class="orbital-btn" data-orbital="dz2">d<sub>z²</sub>-Orbital</div>
            </div>
            <div class="info-text mt-2">Click any orbital to view 3D visualization. Use mouse to rotate/zoom.</div>
        </div>
        <div class="card">
            <h4>Quantum Orbitals</h4>
            <p><strong>s-orbitals:</strong> Spherical, non-directional<br>
            <strong>p-orbitals:</strong> Dumbbell-shaped (px, py, pz)<br>
            <strong>d-orbitals:</strong> Clover-shaped (dxy, dxz, dyz, dx²-y², dz²)<br>
            <strong>f-orbitals:</strong> Complex shapes (8 lobes)</p>
        </div>
    `;
    
    document.querySelectorAll('.orbital-btn').forEach(btn => {
        btn.onclick = () => {
            const orbital = btn.dataset.orbital;
            if (currentModel) scene.remove(currentModel);
            currentModel = createOrbital(orbital);
            scene.add(currentModel);
        };
    });
}

function showVSEPR() {
    const sidebar = document.getElementById('infoSidebar');
    sidebar.innerHTML = `
        <div class="card">
            <h3><i class="fas fa-dice-d6"></i> VSEPR Theory - Molecular Shapes</h3>
            <select id="vseprSelect">
                ${Object.keys(vseprMolecules).map(m => `<option value="${m}">${m} - ${vseprMolecules[m].shape} (${vseprMolecules[m].angle})</option>`).join('')}
            </select>
            <button id="viewMoleculeBtn">🧪 View 3D Molecule</button>
            <div id="moleculeInfo" class="info-text mt-2"></div>
        </div>
        <div class="card">
            <h4>VSEPR Theory</h4>
            <p>Valence Shell Electron Pair Repulsion theory predicts molecular geometry based on electron pair repulsion.</p>
            <p><strong>Common shapes:</strong> Linear, Trigonal Planar, Tetrahedral, Bent, Trigonal Pyramidal, Trigonal Bipyramidal, Octahedral.</p>
        </div>
    `;
    
    document.getElementById('viewMoleculeBtn').onclick = () => {
        const molecule = document.getElementById('vseprSelect').value;
        if (currentModel) scene.remove(currentModel);
        currentModel = createMolecule(molecule);
        scene.add(currentModel);
        
        const data = vseprMolecules[molecule];
        document.getElementById('moleculeInfo').innerHTML = `
            <div class="property-row"><strong>${molecule}</strong></div>
            <div class="property-row">Shape: ${data.shape}</div>
            <div class="property-row">Bond Angle: ${data.angle}</div>
            <div class="property-row">${data.info}</div>
        `;
    };
    document.getElementById('viewMoleculeBtn').click();
}

function showHybridization() {
    const sidebar = document.getElementById('infoSidebar');
    sidebar.innerHTML = `
        <div class="card">
            <h3><i class="fas fa-link"></i> Hybridization Theory</h3>
            <select id="hybridSelect">
                ${Object.keys(hybridizationData).map(h => `<option value="${h}">${h}</option>`).join('')}
            </select>
            <button id="viewHybridBtn">📊 Show Hybridization Info</button>
            <div id="hybridInfo" class="info-text mt-2"></div>
        </div>
        <div class="card">
            <h4>Hybridization Summary</h4>
            <p><strong>sp:</strong> Linear, 180° (CO₂, BeCl₂)<br>
            <strong>sp²:</strong> Trigonal Planar, 120° (BF₃, SO₃)<br>
            <strong>sp³:</strong> Tetrahedral/Bent/Pyramidal, 109.5°/107°/104.5° (CH₄, NH₃, H₂O)<br>
            <strong>sp³d:</strong> Trigonal Bipyramidal, 90°/120° (PCl₅)<br>
            <strong>sp³d²:</strong> Octahedral, 90° (SF₆)</p>
        </div>
    `;
    
    document.getElementById('viewHybridBtn').onclick = () => {
        const hybrid = document.getElementById('hybridSelect').value;
        const data = hybridizationData[hybrid];
        document.getElementById('hybridInfo').innerHTML = `
            <div class="property-row"><strong>${hybrid}</strong></div>
            <div class="property-row">Orbitals: ${data.orbitals}</div>
            <div class="property-row">Geometry: ${data.geometry}</div>
            <div class="property-row">Bond Angle: ${data.angle}</div>
            <div class="property-row">Examples: ${data.examples.join(', ')}</div>
        `;
        
        // Create a simple visual representation
        if (currentModel) scene.remove(currentModel);
        const group = new THREE.Group();
        const center = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), new THREE.MeshStandardMaterial({ color: 0xffaa66 }));
        group.add(center);
        
        if (hybrid.includes('sp (Linear)')) {
            const dirs = [[1,0,0], [-1,0,0]];
            dirs.forEach(dir => {
                const arrow = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 6), new THREE.MeshStandardMaterial({ color: 0x3b82f6 }));
                arrow.position.set(dir[0] * 0.6, 0, 0);
                arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), new THREE.Vector3(dir[0], dir[1], dir[2]));
                group.add(arrow);
            });
        } else if (hybrid.includes('sp²')) {
            const angles = [0, 120, 240];
            angles.forEach(ang => {
                const rad = ang * Math.PI / 180;
                const arrow = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.0, 6), new THREE.MeshStandardMaterial({ color: 0x22c55e }));
                arrow.position.set(Math.cos(rad) * 0.5, Math.sin(rad) * 0.5, 0);
                arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), new THREE.Vector3(Math.cos(rad), Math.sin(rad), 0));
                group.add(arrow);
            });
        } else if (hybrid.includes('sp³')) {
            const dirs = [[0.7,0.7,0.7], [0.7,-0.7,-0.7], [-0.7,0.7,-0.7], [-0.7,-0.7,0.7]];
            dirs.forEach(dir => {
                const len = Math.sqrt(dir[0]*dir[0] + dir[1]*dir[1] + dir[2]*dir[2]);
                const arrow = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.9, 6), new THREE.MeshStandardMaterial({ color: 0xf97316 }));
                arrow.position.set(dir[0] * 0.4, dir[1] * 0.4, dir[2] * 0.4);
                arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), new THREE.Vector3(dir[0]/len, dir[1]/len, dir[2]/len));
                group.add(arrow);
            });
        }
        
        currentModel = group;
        scene.add(currentModel);
    };
    document.getElementById('viewHybridBtn').click();
}

function showResources() {
    const sidebar = document.getElementById('infoSidebar');
    sidebar.innerHTML = `
        <div class="card">
            <h3><i class="fas fa-book"></i> Free Study Resources</h3>
            <ul style="list-style:none;">
                <li>📘 <strong>Chem LibreTexts</strong> - Comprehensive chemistry library</li>
                <li>🎓 <strong>Khan Academy</strong> - Video lessons on bonding</li>
                <li>🧪 <strong>PhET Simulations</strong> - Interactive chemistry sims</li>
                <li>📖 <strong>IUPAC Gold Book</strong> - Chemical terminology</li>
                <li>🎥 <strong>3D Organic Chemistry</strong> - YouTube tutorials</li>
            </ul>
        </div>
        <div class="card">
            <h4>Recommended Textbooks</h4>
            <p>• Organic Chemistry - Clayden<br>• Physical Chemistry - Atkins<br>• Inorganic Chemistry - Huheey<br>• Chemical Bonding - NCERT</p>
        </div>
        <div class="card">
            <h4>Interactive Learning</h4>
            <p>Drag to rotate 3D models. Zoom with scroll wheel. Explore atomic orbitals and molecular shapes!</p>
        </div>
    `;
}

// Initialize 3D Scene
function init3D() {
    const container = document.querySelector('.canvas-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    renderer.setSize(width, height);
    renderer.setClearColor(0x030617, 1);
    
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
    
    // Stars
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = [];
    for (let i = 0; i < 1000; i++) {
        starPositions.push((Math.random() - 0.5) * 200);
        starPositions.push((Math.random() - 0.5) * 100);
        starPositions.push((Math.random() - 0.5) * 80 - 40);
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(starPositions), 3));
    const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true }));
    scene.add(stars);
    
    // Default model
    currentModel = createAtomWithRevolvingElectrons("Carbon");
    scene.add(currentModel);
    
    // Start animation loop
    function animate() {
        requestAnimationFrame(animate);
        animateElectrons();
        controls.update();
        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
    }
    animate();
    
    window.addEventListener('resize', resizeCanvas);
}

// Setup event listeners
function setupEventListeners() {
    document.querySelectorAll('.topic-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.topic-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const topic = btn.dataset.topic;
            if (topic === 'atomic') showAtomicStructure();
            else if (topic === 'orbitals') showOrbitals();
            else if (topic === 'vsepr') showVSEPR();
            else if (topic === 'hybridization') showHybridization();
            else if (topic === 'resources') showResources();
        });
    });
}

// Start the application
function start() {
    init3D();
    setupEventListeners();
    showAtomicStructure();
}

start();
