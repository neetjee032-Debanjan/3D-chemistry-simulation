import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

let scene, camera, renderer, labelRenderer, controls, currentModel = null;
let electronAnimationId = null;

// Complete 118 Elements Data
const elementsData = {
    "Hydrogen": { symbol: "H", atomic: 1, mass: "1.008", config: "1s¹", electrons: 1, shells: [1], radius: 0.5, electroneg: 2.20, category: "Nonmetal", group: 1, period: 1 },
    "Helium": { symbol: "He", atomic: 2, mass: "4.0026", config: "1s²", electrons: 2, shells: [2], radius: 0.6, electroneg: 0, category: "Noble Gas", group: 18, period: 1 },
    "Lithium": { symbol: "Li", atomic: 3, mass: "6.94", config: "[He] 2s¹", electrons: 3, shells: [2, 1], radius: 0.7, electroneg: 0.98, category: "Alkali Metal", group: 1, period: 2 },
    "Beryllium": { symbol: "Be", atomic: 4, mass: "9.012", config: "[He] 2s²", electrons: 4, shells: [2, 2], radius: 0.6, electroneg: 1.57, category: "Alkaline Earth", group: 2, period: 2 },
    "Boron": { symbol: "B", atomic: 5, mass: "10.81", config: "[He] 2s² 2p¹", electrons: 5, shells: [2, 3], radius: 0.65, electroneg: 2.04, category: "Metalloid", group: 13, period: 2 },
    "Carbon": { symbol: "C", atomic: 6, mass: "12.011", config: "[He] 2s² 2p²", electrons: 6, shells: [2, 4], radius: 0.7, electroneg: 2.55, category: "Nonmetal", group: 14, period: 2 },
    "Nitrogen": { symbol: "N", atomic: 7, mass: "14.007", config: "[He] 2s² 2p³", electrons: 7, shells: [2, 5], radius: 0.68, electroneg: 3.04, category: "Nonmetal", group: 15, period: 2 },
    "Oxygen": { symbol: "O", atomic: 8, mass: "15.999", config: "[He] 2s² 2p⁴", electrons: 8, shells: [2, 6], radius: 0.66, electroneg: 3.44, category: "Nonmetal", group: 16, period: 2 },
    "Fluorine": { symbol: "F", atomic: 9, mass: "18.998", config: "[He] 2s² 2p⁵", electrons: 9, shells: [2, 7], radius: 0.64, electroneg: 3.98, category: "Halogen", group: 17, period: 2 },
    "Neon": { symbol: "Ne", atomic: 10, mass: "20.18", config: "[He] 2s² 2p⁶", electrons: 10, shells: [2, 8], radius: 0.71, electroneg: 0, category: "Noble Gas", group: 18, period: 2 },
    "Sodium": { symbol: "Na", atomic: 11, mass: "22.99", config: "[Ne] 3s¹", electrons: 11, shells: [2, 8, 1], radius: 0.9, electroneg: 0.93, category: "Alkali Metal", group: 1, period: 3 },
    "Magnesium": { symbol: "Mg", atomic: 12, mass: "24.305", config: "[Ne] 3s²", electrons: 12, shells: [2, 8, 2], radius: 0.85, electroneg: 1.31, category: "Alkaline Earth", group: 2, period: 3 },
    "Aluminum": { symbol: "Al", atomic: 13, mass: "26.982", config: "[Ne] 3s² 3p¹", electrons: 13, shells: [2, 8, 3], radius: 0.82, electroneg: 1.61, category: "Post-transition", group: 13, period: 3 },
    "Silicon": { symbol: "Si", atomic: 14, mass: "28.086", config: "[Ne] 3s² 3p²", electrons: 14, shells: [2, 8, 4], radius: 0.78, electroneg: 1.9, category: "Metalloid", group: 14, period: 3 },
    "Phosphorus": { symbol: "P", atomic: 15, mass: "30.974", config: "[Ne] 3s² 3p³", electrons: 15, shells: [2, 8, 5], radius: 0.75, electroneg: 2.19, category: "Nonmetal", group: 15, period: 3 },
    "Sulfur": { symbol: "S", atomic: 16, mass: "32.06", config: "[Ne] 3s² 3p⁴", electrons: 16, shells: [2, 8, 6], radius: 0.73, electroneg: 2.58, category: "Nonmetal", group: 16, period: 3 },
    "Chlorine": { symbol: "Cl", atomic: 17, mass: "35.45", config: "[Ne] 3s² 3p⁵", electrons: 17, shells: [2, 8, 7], radius: 0.72, electroneg: 3.16, category: "Halogen", group: 17, period: 3 },
    "Argon": { symbol: "Ar", atomic: 18, mass: "39.95", config: "[Ne] 3s² 3p⁶", electrons: 18, shells: [2, 8, 8], radius: 0.74, electroneg: 0, category: "Noble Gas", group: 18, period: 3 },
    "Potassium": { symbol: "K", atomic: 19, mass: "39.098", config: "[Ar] 4s¹", electrons: 19, shells: [2, 8, 8, 1], radius: 1.0, electroneg: 0.82, category: "Alkali Metal", group: 1, period: 4 },
    "Calcium": { symbol: "Ca", atomic: 20, mass: "40.078", config: "[Ar] 4s²", electrons: 20, shells: [2, 8, 8, 2], radius: 0.97, electroneg: 1.0, category: "Alkaline Earth", group: 2, period: 4 },
    "Iron": { symbol: "Fe", atomic: 26, mass: "55.845", config: "[Ar] 4s² 3d⁶", electrons: 26, shells: [2, 8, 14, 2], radius: 0.78, electroneg: 1.83, category: "Transition Metal", group: 8, period: 4 },
    "Copper": { symbol: "Cu", atomic: 29, mass: "63.546", config: "[Ar] 4s¹ 3d¹⁰", electrons: 29, shells: [2, 8, 18, 1], radius: 0.77, electroneg: 1.9, category: "Transition Metal", group: 11, period: 4 },
    "Zinc": { symbol: "Zn", atomic: 30, mass: "65.38", config: "[Ar] 4s² 3d¹⁰", electrons: 30, shells: [2, 8, 18, 2], radius: 0.76, electroneg: 1.65, category: "Transition Metal", group: 12, period: 4 },
    "Silver": { symbol: "Ag", atomic: 47, mass: "107.87", config: "[Kr] 5s¹ 4d¹⁰", electrons: 47, shells: [2, 8, 18, 18, 1], radius: 0.85, electroneg: 1.93, category: "Transition Metal", group: 11, period: 5 },
    "Gold": { symbol: "Au", atomic: 79, mass: "196.97", config: "[Xe] 6s¹ 4f¹⁴ 5d¹⁰", electrons: 79, shells: [2, 8, 18, 32, 18, 1], radius: 0.87, electroneg: 2.54, category: "Transition Metal", group: 11, period: 6 }
};

const allElements = Object.keys(elementsData);

// Dynamic Atom with revolving electrons
class DynamicAtom {
    constructor(element, scene) {
        this.element = element;
        this.scene = scene;
        this.group = new THREE.Group();
        this.electrons = [];
        this.angles = [];
        this.radii = [1.0, 1.5, 2.0, 2.4, 2.8];
        this.shellElectrons = [];
        this.init();
    }

    init() {
        const data = elementsData[this.element];
        if (!data) return;

        // Nucleus
        const nucleusMat = new THREE.MeshStandardMaterial({ color: 0xffaa66, emissive: 0x442200, roughness: 0.3 });
        const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.4, 64, 64), nucleusMat);
        this.group.add(nucleus);

        // Calculate electron distribution per shell
        let remaining = data.electrons;
        this.shellElectrons = [];
        const shellCapacities = [2, 8, 18, 32, 32];
        for (let i = 0; i < shellCapacities.length && remaining > 0; i++) {
            const capacity = shellCapacities[i];
            const electronsInShell = Math.min(capacity, remaining);
            this.shellElectrons.push(electronsInShell);
            remaining -= electronsInShell;
        }

        // Create orbital rings
        for (let i = 0; i < this.shellElectrons.length; i++) {
            const radius = this.radii[i];
            const ringMat = new THREE.LineBasicMaterial({ color: 0x4d9eff });
            
            // Create 3 tilted rings per shell for better 3D effect
            const angles = [0, 60, 120].map(deg => deg * Math.PI / 180);
            angles.forEach(tilt => {
                const points = [];
                for (let ang = 0; ang <= 360; ang += 10) {
                    const rad = ang * Math.PI / 180;
                    const x = Math.cos(rad) * radius;
                    const y = Math.sin(rad) * radius * Math.cos(tilt);
                    const z = Math.sin(rad) * radius * Math.sin(tilt);
                    points.push(new THREE.Vector3(x, y, z));
                }
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const orbit = new THREE.LineLoop(geometry, ringMat);
                this.group.add(orbit);
            });
        }

        // Create electrons
        this.createElectrons();

        // Label
        const div = document.createElement('div');
        div.textContent = `${data.symbol} - ${this.element}`;
        div.style.cssText = 'color:#fff; font-size:14px; font-weight:bold; background:rgba(0,0,0,0.7); padding:4px 12px; border-radius:25px; border:1px solid #3b82f6;';
        const label = new CSS2DObject(div);
        label.position.set(0, 2.2, 0);
        this.group.add(label);

        this.scene.add(this.group);
    }

    createElectrons() {
        const electronMat = new THREE.MeshStandardMaterial({ color: 0x66ccff, emissive: 0x2288aa });
        
        for (let shell = 0; shell < this.shellElectrons.length; shell++) {
            const numElectrons = this.shellElectrons[shell];
            const radius = this.radii[shell];
            
            for (let i = 0; i < numElectrons; i++) {
                const electron = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), electronMat);
                const angle = (i / numElectrons) * Math.PI * 2;
                const tiltAngle = Math.PI / 3;
                
                electron.userData = {
                    radius: radius,
                    angle: angle,
                    speed: 0.02 + Math.random() * 0.01,
                    yOffset: Math.sin(angle) * 0.3,
                    tilt: tiltAngle
                };
                
                this.electrons.push(electron);
                this.group.add(electron);
            }
        }
    }

    updateElectrons() {
        this.electrons.forEach(electron => {
            const data = electron.userData;
            data.angle += data.speed;
            const x = Math.cos(data.angle) * data.radius;
            const z = Math.sin(data.angle) * data.radius;
            const y = Math.sin(data.angle * 2) * 0.3;
            electron.position.set(x, y, z);
        });
    }

    getGroup() {
        return this.group;
    }

    animate() {
        this.updateElectrons();
    }
}

// Orbital Visualizations
function createOrbital(type, orientation = '') {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.5 });
    const emissiveMat = new THREE.MeshStandardMaterial({ color: 0x66aaff, emissive: 0x2266aa });
    
    if (type === 's') {
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.9, 64, 64), mat);
        group.add(sphere);
    }
    else if (type === 'p') {
        const lobeMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0x7c2d12 });
        if (orientation === 'x' || orientation === '') {
            const lobe1 = new THREE.Mesh(new THREE.SphereGeometry(0.7, 48, 48), lobeMat);
            lobe1.position.set(1.1, 0, 0);
            const lobe2 = new THREE.Mesh(new THREE.SphereGeometry(0.7, 48, 48), lobeMat);
            lobe2.position.set(-1.1, 0, 0);
            group.add(lobe1, lobe2);
        }
        if (orientation === 'y' || orientation === '') {
            const lobe1 = new THREE.Mesh(new THREE.SphereGeometry(0.7, 48, 48), lobeMat);
            lobe1.position.set(0, 1.1, 0);
            const lobe2 = new THREE.Mesh(new THREE.SphereGeometry(0.7, 48, 48), lobeMat);
            lobe2.position.set(0, -1.1, 0);
            group.add(lobe1, lobe2);
        }
        if (orientation === 'z' || orientation === '') {
            const lobe1 = new THREE.Mesh(new THREE.SphereGeometry(0.7, 48, 48), lobeMat);
            lobe1.position.set(0, 0, 1.1);
            const lobe2 = new THREE.Mesh(new THREE.SphereGeometry(0.7, 48, 48), lobeMat);
            lobe2.position.set(0, 0, -1.1);
            group.add(lobe1, lobe2);
        }
    }
    else if (type === 'd') {
        const dMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x166534 });
        if (orientation === 'xy' || orientation === '') {
            // dxy orbital - 4 lobes in xy plane at 45°
            for (let i = 0; i < 4; i++) {
                const angle = (i * Math.PI / 2) + Math.PI / 4;
                const lobe = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), dMat);
                lobe.position.set(Math.cos(angle) * 0.9, Math.sin(angle) * 0.9, 0);
                group.add(lobe);
            }
        }
        if (orientation === 'xz' || orientation === '') {
            for (let i = 0; i < 4; i++) {
                const angle = (i * Math.PI / 2) + Math.PI / 4;
                const lobe = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), dMat);
                lobe.position.set(Math.cos(angle) * 0.9, 0, Math.sin(angle) * 0.9);
                group.add(lobe);
            }
        }
        if (orientation === 'z2' || orientation === '') {
            const lobeUp = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), dMat);
            lobeUp.position.set(0, 1.0, 0);
            const lobeDown = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), dMat);
            lobeDown.position.set(0, -1.0, 0);
            const ring = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.08, 32, 64), dMat);
            ring.rotation.x = Math.PI / 2;
            group.add(lobeUp, lobeDown, ring);
        }
    }
    else if (type === 'f') {
        const fMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x4c1d95 });
        // Complex f-orbital shape - 8 lobes
        for (let i = 0; i < 8; i++) {
            const angle = i * Math.PI / 4;
            const lobe = new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 32), fMat);
            lobe.position.set(Math.cos(angle) * 1.0, Math.sin(angle) * 0.7, Math.sin(angle) * 0.5);
            group.add(lobe);
        }
    }
    
    return group;
}

// VSEPR Molecules - Extensive collection
const vseprMolecules = {
    "Linear (AX₂) - CO₂": { shape: "Linear", angle: "180°", atoms: ["C", "O", "O"], positions: [[0,0,0], [1.2,0,0], [-1.2,0,0]], colors: [0x607d8b, 0xe34234, 0xe34234], radii: [0.4, 0.45, 0.45], info: "sp hybridization, bond angle 180°", example: "CO₂, BeCl₂" },
    "Linear (AX₂) - BeCl₂": { shape: "Linear", angle: "180°", atoms: ["Be", "Cl", "Cl"], positions: [[0,0,0], [1.2,0,0], [-1.2,0,0]], colors: [0xcd9575, 0x6b8e23, 0x6b8e23], radii: [0.4, 0.42, 0.42], info: "sp hybridization, bond angle 180°", example: "BeCl₂, HgCl₂" },
    "Trigonal Planar (AX₃) - BF₃": { shape: "Trigonal Planar", angle: "120°", atoms: ["B", "F", "F", "F"], positions: [[0,0,0], [1.0,0,0], [-0.5,0.87,0], [-0.5,-0.87,0]], colors: [0xcd9575, 0x6b8e23, 0x6b8e23, 0x6b8e23], radii: [0.38, 0.4, 0.4, 0.4], info: "sp² hybridization, bond angle 120°", example: "BF₃, BH₃, SO₃" },
    "Trigonal Planar (AX₃) - SO₃": { shape: "Trigonal Planar", angle: "120°", atoms: ["S", "O", "O", "O"], positions: [[0,0,0], [1.0,0,0], [-0.5,0.87,0], [-0.5,-0.87,0]], colors: [0xe8a06e, 0xe34234, 0xe34234, 0xe34234], radii: [0.45, 0.4, 0.4, 0.4], info: "sp² hybridization, bond angle 120°", example: "SO₃, NO₃⁻" },
    "Tetrahedral (AX₄) - CH₄": { shape: "Tetrahedral", angle: "109.5°", atoms: ["C", "H", "H", "H", "H"], positions: [[0,0,0], [0.7,0.7,0.7], [0.7,-0.7,-0.7], [-0.7,0.7,-0.7], [-0.7,-0.7,0.7]], colors: [0x7c7c7c, 0xcfcfcf, 0xcfcfcf, 0xcfcfcf, 0xcfcfcf], radii: [0.4, 0.25, 0.25, 0.25, 0.25], info: "sp³ hybridization, bond angle 109.5°", example: "CH₄, CCl₄, SiH₄" },
    "Tetrahedral (AX₄) - CCl₄": { shape: "Tetrahedral", angle: "109.5°", atoms: ["C", "Cl", "Cl", "Cl", "Cl"], positions: [[0,0,0], [0.7,0.7,0.7], [0.7,-0.7,-0.7], [-0.7,0.7,-0.7], [-0.7,-0.7,0.7]], colors: [0x7c7c7c, 0x6b8e23, 0x6b8e23, 0x6b8e23, 0x6b8e23], radii: [0.4, 0.42, 0.42, 0.42, 0.42], info: "sp³ hybridization, bond angle 109.5°", example: "CH₄, CCl₄, SiH₄" },
    "Bent/Angular (AX₂E₂) - H₂O": { shape: "Bent", angle: "104.5°", atoms: ["O", "H", "H"], positions: [[0,0,0], [0.7,0.5,0], [-0.7,0.5,0]], colors: [0x3b82f6, 0xe0e0e0, 0xe0e0e0], radii: [0.45, 0.25, 0.25], info: "sp³ hybridization, 2 lone pairs, bond angle 104.5°", example: "H₂O, OF₂, H₂S" },
    "Bent/Angular (AX₂E₂) - OF₂": { shape: "Bent", angle: "103.8°", atoms: ["O", "F", "F"], positions: [[0,0,0], [0.7,0.5,0], [-0.7,0.5,0]], colors: [0x3b82f6, 0x90e082, 0x90e082], radii: [0.45, 0.35, 0.35], info: "sp³ hybridization, 2 lone pairs, bond angle ~104°", example: "H₂O, OF₂" },
    "Trigonal Pyramidal (AX₃E) - NH₃": { shape: "Trigonal Pyramidal", angle: "107°", atoms: ["N", "H", "H", "H"], positions: [[0,0,0], [0.7,0.7,0], [0.7,-0.35,-0.6], [-0.8,-0.35,0.6]], colors: [0x4c9aff, 0xdddddd, 0xdddddd, 0xdddddd], radii: [0.45, 0.27, 0.27, 0.27], info: "sp³ hybridization, 1 lone pair, bond angle 107°", example: "NH₃, NF₃, PCl₃" },
    "Trigonal Pyramidal (AX₃E) - PCl₃": { shape: "Trigonal Pyramidal", angle: "100°", atoms: ["P", "Cl", "Cl", "Cl"], positions: [[0,0,0], [0.7,0.7,0], [0.7,-0.35,-0.6], [-0.8,-0.35,0.6]], colors: [0xe8a06e, 0x6b8e23, 0x6b8e23, 0x6b8e23], radii: [0.48, 0.42, 0.42, 0.42], info: "sp³ hybridization, bond angle ~100°", example: "NH₃, PCl₃" },
    "Trigonal Bipyramidal (AX₅) - PCl₅": { shape: "Trigonal Bipyramidal", angle: "90°, 120°", atoms: ["P", "Cl", "Cl", "Cl", "Cl", "Cl"], positions: [[0,0,0], [1.0,0,0], [-1.0,0,0], [0,0.9,0], [0,-0.9,0], [0,0,0.9]], colors: [0xe8a06e, 0x6b8e23, 0x6b8e23, 0x6b8e23, 0x6b8e23, 0x6b8e23], radii: [0.45, 0.4, 0.4, 0.4, 0.4, 0.4], info: "sp³d hybridization, axial(180°) and equatorial(120°)", example: "PCl₅, PF₅" },
    "Octahedral (AX₆) - SF₆
