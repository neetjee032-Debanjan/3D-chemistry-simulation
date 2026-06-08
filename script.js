import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// ----- Setup Scene, Camera, Renderers -----
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x03050b);
scene.fog = new THREE.FogExp2(0x03050b, 0.008);

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(4, 3, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(container.clientWidth, container.clientHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.left = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
container.appendChild(labelRenderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 1.2;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.enableZoom = true;

// Lighting
const ambientLight = new THREE.AmbientLight(0x404060);
scene.add(ambientLight);
const mainLight = new THREE.DirectionalLight(0xffffff, 1);
mainLight.position.set(2, 5, 3);
scene.add(mainLight);
const fillLight = new THREE.PointLight(0x4466cc, 0.4);
fillLight.position.set(-2, 1, 2);
scene.add(fillLight);
const backLight = new THREE.PointLight(0xffaa66, 0.3);
backLight.position.set(0, 2, -3);
scene.add(backLight);

const gridHelper = new THREE.GridHelper(8, 20, 0x88aaff, 0x335588);
gridHelper.position.y = -1.2;
scene.add(gridHelper);

let currentModelGroup = null;

// Helper function for positioning bonds
function positionBond(cylinder, pos1, pos2) {
    const direction = new THREE.Vector3().subVectors(pos2, pos1).normalize();
    const length = pos1.distanceTo(pos2);
    cylinder.scale.set(1, length, 1);
    const mid = new THREE.Vector3().addVectors(pos1, pos2).multiplyScalar(0.5);
    cylinder.position.copy(mid);
    cylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
}

function makeLabel(text, color, position) {
    const div = document.createElement('div');
    div.textContent = text;
    div.style.color = color;
    div.style.fontSize = '1rem';
    div.style.fontWeight = 'bold';
    div.style.textShadow = '1px 1px 0px black';
    div.style.background = 'rgba(0,0,0,0.6)';
    div.style.padding = '2px 8px';
    div.style.borderRadius = '20px';
    div.style.border = `1px solid ${color}`;
    div.style.backdropFilter = 'blur(4px)';
    const label = new CSS2DObject(div);
    label.position.copy(position);
    return label;
}

// ---------- 3D Model Builders ----------
function buildWater(group) {
    const O = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), new THREE.MeshStandardMaterial({ color: 0x3399ff, emissive: 0x001133, roughness: 0.3 }));
    O.position.set(0, 0, 0);
    group.add(O);
    
    const H1 = new THREE.Mesh(new THREE.SphereGeometry(0.32, 48, 48), new THREE.MeshStandardMaterial({ color: 0xccccdd }));
    const H2 = new THREE.Mesh(new THREE.SphereGeometry(0.32, 48, 48), new THREE.MeshStandardMaterial({ color: 0xccccdd }));
    const angle = 104.5 * Math.PI / 180;
    const d = 0.92;
    H1.position.set(Math.sin(angle / 2) * d, Math.cos(angle / 2) * d, 0);
    H2.position.set(-Math.sin(angle / 2) * d, Math.cos(angle / 2) * d, 0);
    group.add(H1, H2);
    
    const bond1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1, 8), new THREE.MeshStandardMaterial({ color: 0x88aaff }));
    const bond2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1, 8), new THREE.MeshStandardMaterial({ color: 0x88aaff }));
    positionBond(bond1, O.position, H1.position);
    positionBond(bond2, O.position, H2.position);
    group.add(bond1, bond2);
    
    group.add(makeLabel("O", "#88ddff", new THREE.Vector3(0, 0.6, 0)));
    group.add(makeLabel("H", "#ccccff", H1.position.clone().multiplyScalar(1.1)));
    group.add(makeLabel("H", "#ccccff", H2.position.clone().multiplyScalar(1.1)));
}

function buildTetrahedral(group, name) {
    const center = new THREE.Mesh(new THREE.SphereGeometry(0.45, 64, 64), new THREE.MeshStandardMaterial({ color: 0xaa8866 }));
    group.add(center);
    const dirs = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map(v => new THREE.Vector3(v[0], v[1], v[2]).normalize().multiplyScalar(0.95));
    dirs.forEach(pos => {
        const H = new THREE.Mesh(new THREE.SphereGeometry(0.32, 48, 48), new THREE.MeshStandardMaterial({ color: 0xddbb99 }));
        H.position.copy(pos);
        group.add(H);
        const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1, 6), new THREE.MeshStandardMaterial({ color: 0xccaa88 }));
        positionBond(cyl, center.position, H.position);
        group.add(cyl);
        group.add(makeLabel("H", "#ffdd99", pos.clone().multiplyScalar(1.15)));
    });
    group.add(makeLabel("C", "#ffaa66", new THREE.Vector3(0, 0.55, 0)));
}

function buildAmmonia(group) {
    const N = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), new THREE.MeshStandardMaterial({ color: 0x4488ff }));
    group.add(N);
    const dirs = [[0, 0.95, 0], [0.82, -0.4, 0.47], [-0.82, -0.4, 0.47], [0, -0.4, -0.95]];
    dirs.forEach(pos => {
        const H = new THREE.Mesh(new THREE.SphereGeometry(0.32, 48, 48), new THREE.MeshStandardMaterial({ color: 0xccddff }));
        H.position.set(pos[0], pos[1], pos[2]);
        group.add(H);
        const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1, 6), new THREE.MeshStandardMaterial({ color: 0x99bbff }));
        positionBond(cyl, N.position, H.position);
        group.add(cyl);
        group.add(makeLabel("H", "#ccddff", new THREE.Vector3(pos[0] * 1.2, pos[1] * 1.2, pos[2] * 1.2)));
    });
    group.add(makeLabel("N", "#88aaff", new THREE.Vector3(0, 0.7, 0)));
}

function buildLinearCO2(group) {
    const C = new THREE.Mesh(new THREE.SphereGeometry(0.45, 64, 64), new THREE.MeshStandardMaterial({ color: 0x888888 }));
    group.add(C);
    const O1 = new THREE.Mesh(new THREE.SphereGeometry(0.48, 64, 64), new THREE.MeshStandardMaterial({ color: 0xcc8866 }));
    const O2 = new THREE.Mesh(new THREE.SphereGeometry(0.48, 64, 64), new THREE.MeshStandardMaterial({ color: 0xcc8866 }));
    O1.position.set(-1.25, 0, 0);
    O2.position.set(1.25, 0, 0);
    group.add(O1, O2);
    
    const bond1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1, 8), new THREE.MeshStandardMaterial({ color: 0xcc9966 }));
    const bond2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1, 8), new THREE.MeshStandardMaterial({ color: 0xcc9966 }));
    positionBond(bond1, C.position, O1.position);
    positionBond(bond2, C.position, O2.position);
    group.add(bond1, bond2);
    
    group.add(makeLabel("C", "#ccccaa", new THREE.Vector3(0, 0.55, 0)));
    group.add(makeLabel("O", "#ffaa77", O1.position.clone().multiplyScalar(1.1)));
    group.add(makeLabel("O", "#ffaa77", O2.position.clone().multiplyScalar(1.1)));
}

function buildDiatomic(group, name, color1 = 0x55cc55) {
    const atom1 = new THREE.Mesh(new THREE.SphereGeometry(0.55, 64, 64), new THREE.MeshStandardMaterial({ color: color1 }));
    const atom2 = new THREE.Mesh(new THREE.SphereGeometry(0.55, 64, 64), new THREE.MeshStandardMaterial({ color: color1 }));
    atom1.position.set(-0.85, 0, 0);
    atom2.position.set(0.85, 0, 0);
    group.add(atom1, atom2);
    
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.7, 8), new THREE.MeshStandardMaterial({ color: 0x88cc88 }));
    cyl.position.set(0, 0, 0);
    cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0));
    group.add(cyl);
    
    group.add(makeLabel("O", "#aaffaa", new THREE.Vector3(-0.9, 0.65, 0)));
    group.add(makeLabel("O", "#aaffaa", new THREE.Vector3(0.9, 0.65, 0)));
}

function buildBenzene(group) {
    const ringRad = 1.05;
    const pts = [];
    for (let i = 0; i < 6; i++) {
        const angle = (i * 60) * Math.PI / 180;
        const x = ringRad * Math.cos(angle);
        const z = ringRad * Math.sin(angle);
        const C = new THREE.Mesh(new THREE.SphereGeometry(0.38, 48, 48), new THREE.MeshStandardMaterial({ color: 0x77aaff }));
        C.position.set(x, 0, z);
        group.add(C);
        pts.push(C.position);
        group.add(makeLabel("C", "#bbddff", new THREE.Vector3(x, 0.5, z)));
    }
    for (let i = 0; i < 6; i++) {
        const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1, 6), new THREE.MeshStandardMaterial({ color: 0xaaddff }));
        positionBond(bond, pts[i], pts[(i + 1) % 6]);
        group.add(bond);
    }
    const ringGlow = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.05, 32, 100), new THREE.MeshStandardMaterial({ color: 0xffaa55, emissive: 0x442200 }));
    group.add(ringGlow);
}

function buildEthene(group) {
    const C1 = new THREE.Mesh(new THREE.SphereGeometry(0.45, 64, 64), new THREE.MeshStandardMaterial({ color: 0x99bb99 }));
    const C2 = new THREE.Mesh(new THREE.SphereGeometry(0.45, 64, 64), new THREE.MeshStandardMaterial({ color: 0x99bb99 }));
    C1.position.set(-0.9, 0, 0);
    C2.position.set(0.9, 0, 0);
    group.add(C1, C2);
    
    const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.8, 8), new THREE.MeshStandardMaterial({ color: 0xffcc88 }));
    bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0));
    group.add(bond);
    
    group.add(makeLabel("C", "#ccffaa", new THREE.Vector3(-0.9, 0.65, 0)));
    group.add(makeLabel("C", "#ccffaa", new THREE.Vector3(0.9, 0.65, 0)));
    
    const hMat = new THREE.MeshStandardMaterial({ color: 0xddddff });
    const H1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), hMat);
    H1.position.set(-1.3, 0.7, 0.6);
    group.add(H1);
    const H2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), hMat);
    H2.position.set(-1.3, -0.7, 0.6);
    group.add(H2);
    const H3 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), hMat);
    H3.position.set(1.3, 0.7, -0.6);
    group.add(H3);
    const H4 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), hMat);
    H4.position.set(1.3, -0.7, -0.6);
    group.add(H4);
}

function buildIonicNaCl(group) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            for (let k = -1; k <= 1; k++) {
                const color = (i + j + k) % 2 === 0 ? 0x3a86ff : 0xffaa66;
                const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.35, 32, 32), new THREE.MeshStandardMaterial({ color, emissive: 0x111122 }));
                sphere.position.set(i * 1.1, j * 1.1, k * 1.1);
                group.add(sphere);
            }
        }
    }
}

// Database of molecules
const molecularDatabase = {
    "Water": { type: "Molecule", geometry: "Bent", hybridization: "sp³", bondAngle: "104.5°", theory: "VSEPR: AX₂E₂ → bent. Oxygen sp³ hybridized, two lone pairs cause angle reduction.", mo: "H₂O MO ordering: 1a₁, 2a₁, 1b₂, 3a₁, 1b₁ (HOMO). Total 10 valence electrons.", construct: buildWater },
    "Methane": { type: "Molecule", geometry: "Tetrahedral", hybridization: "sp³", bondAngle: "109.5°", theory: "sp³ hybridization, 4 equivalent C-H sigma bonds. VSEPR: AX₄, nonpolar.", mo: "CH₄: 8 valence e⁻, Td symmetry. MOs: 1a₁² (core), 2a₁², 1t₂⁶ → stable tetrahedral.", construct: (g) => buildTetrahedral(g, "Methane") },
    "Ammonia": { type: "Molecule", geometry: "Trigonal Pyramidal", hybridization: "sp³", bondAngle: "107°", theory: "N sp³ hybridized, one lone pair → pyramidal shape (AX₃E).", mo: "NH₃: 8 valence e⁻. C3v symmetry: 1a₁², 2a₁², 1e⁴, 3a₁² (lone pair).", construct: buildAmmonia },
    "Carbon Dioxide": { type: "Molecule", geometry: "Linear", hybridization: "sp", bondAngle: "180°", theory: "C sp hybridized, two sigma and two pi bonds. VSEPR: AX₂.", mo: "CO₂: 16 valence e⁻, linear. MO diagram: σg, σu, πu, πg orbitals.", construct: buildLinearCO2 },
    "Oxygen": { type: "Diatomic", geometry: "Linear", hybridization: "sp²", bondAngle: "N/A", theory: "O=O double bond, paramagnetic due to two unpaired electrons in π* orbitals.", mo: "O₂: 12 valence e⁻, bond order 2, two unpaired e⁻ in π* orbitals → paramagnetic.", construct: (g) => buildDiatomic(g, "O₂", 0x44aa55) },
    "Benzene": { type: "Aromatic", geometry: "Trigonal Planar", hybridization: "sp²", bondAngle: "120°", theory: "Delocalized π-system, resonance stability, sp² hybridized carbons.", mo: "Benzene: 6 π electrons, Hückel rule, degenerate bonding MOs (e₁g).", construct: buildBenzene },
    "Ethene": { type: "Alkene", geometry: "Trigonal Planar", hybridization: "sp²", bondAngle: "~121°", theory: "C=C double bond, one sigma one pi, planar structure.", mo: "Ethene: π bond from p-orbitals, HOMO = π bonding, LUMO = π*.", construct: buildEthene },
    "Sodium Chloride": { type: "Ionic", geometry: "Cubic lattice", hybridization: "ionic", bondAngle: "90°", theory: "Electrostatic attraction between Na⁺ and Cl⁻ ions.", mo: "Band theory: NaCl insulator, large band gap.", construct: buildIonicNaCl }
};

async function loadEntity(name) {
    const key = Object.keys(molecularDatabase).find(k => k.toLowerCase() === name.toLowerCase()) || name;
    const data = molecularDatabase[key];
    if (!data) {
        alert(`"${name}" not found. Try: Water, Methane, Ammonia, Carbon Dioxide, Oxygen, Benzene, Ethene, Sodium Chloride`);
        return;
    }
    if (currentModelGroup) scene.remove(currentModelGroup);
    const newGroup = new THREE.Group();
    data.construct(newGroup);
    scene.add(newGroup);
    currentModelGroup = newGroup;
    
    document.getElementById('entityTitle').innerHTML = `${key} <span class="badge">${data.type}</span>`;
    document.getElementById('entityProps').innerHTML = `
        <div class="prop-item"><strong>⚛️ Type</strong><br>${data.type}</div>
        <div class="prop-item"><strong>🔬 Geometry</strong><br>${data.geometry}</div>
        <div class="prop-item"><strong>🧬 Hybridization</strong><br>${data.hybridization}</div>
        <div class="prop-item"><strong>📐 Bond Angle</strong><br>${data.bondAngle}</div>
    `;
    document.getElementById('theoryText').innerHTML = data.theory;
    document.getElementById('detailTheoryText').innerHTML = data.theory + " " + (data.mo || "");
    document.getElementById('moDynamicDisplay').innerHTML = `<div class="mo-diagram">🎨 Molecular Orbital Insight:<br>${data.mo}</div>`;
    controls.target.set(0, 0, 0);
}

// Event listeners
document.getElementById('loadBtn').addEventListener('click', () => {
    const val = document.getElementById('entityInput').value.trim();
    if (val) loadEntity(val);
});
document.querySelectorAll('.common-chip').forEach(chip => {
    chip.addEventListener('click', () => loadEntity(chip.getAttribute('data-entity')));
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    labelRenderer.setSize(width, height);
});

// Initialize with default
loadEntity("Water");
