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

// Complete 118 Elements Data (All 118 elements with full details)
const elementsData = {
    "Hydrogen": { symbol: "H", atomic: 1, mass: "1.008", config: "1s¹", electrons: 1, shells: [1], radius: 0.5, electroneg: 2.20, category: "Nonmetal", block: "s", period: 1 },
    "Helium": { symbol: "He", atomic: 2, mass: "4.0026", config: "1s²", electrons: 2, shells: [2], radius: 0.6, electroneg: 0, category: "Noble Gas", block: "s", period: 1 },
    "Lithium": { symbol: "Li", atomic: 3, mass: "6.94", config: "[He] 2s¹", electrons: 3, shells: [2, 1], radius: 0.7, electroneg: 0.98, category: "Alkali Metal", block: "s", period: 2 },
    "Beryllium": { symbol: "Be", atomic: 4, mass: "9.012", config: "[He] 2s²", electrons: 4, shells: [2, 2], radius: 0.6, electroneg: 1.57, category: "Alkaline Earth", block: "s", period: 2 },
    "Boron": { symbol: "B", atomic: 5, mass: "10.81", config: "[He] 2s² 2p¹", electrons: 5, shells: [2, 3], radius: 0.65, electroneg: 2.04, category: "Metalloid", block: "p", period: 2 },
    "Carbon": { symbol: "C", atomic: 6, mass: "12.011", config: "[He] 2s² 2p²", electrons: 6, shells: [2, 4], radius: 0.7, electroneg: 2.55, category: "Nonmetal", block: "p", period: 2 },
    "Nitrogen": { symbol: "N", atomic: 7, mass: "14.007", config: "[He] 2s² 2p³", electrons: 7, shells: [2, 5], radius: 0.68, electroneg: 3.04, category: "Nonmetal", block: "p", period: 2 },
    "Oxygen": { symbol: "O", atomic: 8, mass: "15.999", config: "[He] 2s² 2p⁴", electrons: 8, shells: [2, 6], radius: 0.66, electroneg: 3.44, category: "Nonmetal", block: "p", period: 2 },
    "Fluorine": { symbol: "F", atomic: 9, mass: "18.998", config: "[He] 2s² 2p⁵", electrons: 9, shells: [2, 7], radius: 0.64, electroneg: 3.98, category: "Halogen", block: "p", period: 2 },
    "Neon": { symbol: "Ne", atomic: 10, mass: "20.18", config: "[He] 2s² 2p⁶", electrons: 10, shells: [2, 8], radius: 0.71, electroneg: 0, category: "Noble Gas", block: "p", period: 2 },
    "Sodium": { symbol: "Na", atomic: 11, mass: "22.99", config: "[Ne] 3s¹", electrons: 11, shells: [2, 8, 1], radius: 0.9, electroneg: 0.93, category: "Alkali Metal", block: "s", period: 3 },
    "Magnesium": { symbol: "Mg", atomic: 12, mass: "24.305", config: "[Ne] 3s²", electrons: 12, shells: [2, 8, 2], radius: 0.85, electroneg: 1.31, category: "Alkaline Earth", block: "s", period: 3 },
    "Aluminum": { symbol: "Al", atomic: 13, mass: "26.982", config: "[Ne] 3s² 3p¹", electrons: 13, shells: [2, 8, 3], radius: 0.82, electroneg: 1.61, category: "Post-transition", block: "p", period: 3 },
    "Silicon": { symbol: "Si", atomic: 14, mass: "28.086", config: "[Ne] 3s² 3p²", electrons: 14, shells: [2, 8, 4], radius: 0.78, electroneg: 1.9, category: "Metalloid", block: "p", period: 3 },
    "Phosphorus": { symbol: "P", atomic: 15, mass: "30.974", config: "[Ne] 3s² 3p³", electrons: 15, shells: [2, 8, 5], radius: 0.75, electroneg: 2.19, category: "Nonmetal", block: "p", period: 3 },
    "Sulfur": { symbol: "S", atomic: 16, mass: "32.06", config: "[Ne] 3s² 3p⁴", electrons: 16, shells: [2, 8, 6], radius: 0.73, electroneg: 2.58, category: "Nonmetal", block: "p", period: 3 },
    "Chlorine": { symbol: "Cl", atomic: 17, mass: "35.45", config: "[Ne] 3s² 3p⁵", electrons: 17, shells: [2, 8, 7], radius: 0.72, electroneg: 3.16, category: "Halogen", block: "p", period: 3 },
    "Argon": { symbol: "Ar", atomic: 18, mass: "39.95", config: "[Ne] 3s² 3p⁶", electrons: 18, shells: [2, 8, 8], radius: 0.74, electroneg: 0, category: "Noble Gas", block: "p", period: 3 },
    "Potassium": { symbol: "K", atomic: 19, mass: "39.098", config: "[Ar] 4s¹", electrons: 19, shells: [2, 8, 8, 1], radius: 1.0, electroneg: 0.82, category: "Alkali Metal", block: "s", period: 4 },
    "Calcium": { symbol: "Ca", atomic: 20, mass: "40.078", config: "[Ar] 4s²", electrons: 20, shells: [2, 8, 8, 2], radius: 0.97, electroneg: 1.0, category: "Alkaline Earth", block: "s", period: 4 },
    "Scandium": { symbol: "Sc", atomic: 21, mass: "44.956", config: "[Ar] 4s² 3d¹", electrons: 21, shells: [2, 8, 9, 2], radius: 0.75, electroneg: 1.36, category: "Transition Metal", block: "d", period: 4 },
    "Titanium": { symbol: "Ti", atomic: 22, mass: "47.867", config: "[Ar] 4s² 3d²", electrons: 22, shells: [2, 8, 10, 2], radius: 0.75, electroneg: 1.54, category: "Transition Metal", block: "d", period: 4 },
    "Vanadium": { symbol: "V", atomic: 23, mass: "50.942", config: "[Ar] 4s² 3d³", electrons: 23, shells: [2, 8, 11, 2], radius: 0.75, electroneg: 1.63, category: "Transition Metal", block: "d", period: 4 },
    "Chromium": { symbol: "Cr", atomic: 24, mass: "51.996", config: "[Ar] 4s¹ 3d⁵", electrons: 24, shells: [2, 8, 13, 1], radius: 0.75, electroneg: 1.66, category: "Transition Metal", block: "d", period: 4 },
    "Manganese": { symbol: "Mn", atomic: 25, mass: "54.938", config: "[Ar] 4s² 3d⁵", electrons: 25, shells: [2, 8, 13, 2], radius: 0.75, electroneg: 1.55, category: "Transition Metal", block: "d", period: 4 },
    "Iron": { symbol: "Fe", atomic: 26, mass: "55.845", config: "[Ar] 4s² 3d⁶", electrons: 26, shells: [2, 8, 14, 2], radius: 0.78, electroneg: 1.83, category: "Transition Metal", block: "d", period: 4 },
    "Cobalt": { symbol: "Co", atomic: 27, mass: "58.933", config: "[Ar] 4s² 3d⁷", electrons: 27, shells: [2, 8, 15, 2], radius: 0.75, electroneg: 1.88, category: "Transition Metal", block: "d", period: 4 },
    "Nickel": { symbol: "Ni", atomic: 28, mass: "58.693", config: "[Ar] 4s² 3d⁸", electrons: 28, shells: [2, 8, 16, 2], radius: 0.75, electroneg: 1.91, category: "Transition Metal", block: "d", period: 4 },
    "Copper": { symbol: "Cu", atomic: 29, mass: "63.546", config: "[Ar] 4s¹ 3d¹⁰", electrons: 29, shells: [2, 8, 18, 1], radius: 0.77, electroneg: 1.9, category: "Transition Metal", block: "d", period: 4 },
    "Zinc": { symbol: "Zn", atomic: 30, mass: "65.38", config: "[Ar] 4s² 3d¹⁰", electrons: 30, shells: [2, 8, 18, 2], radius: 0.76, electroneg: 1.65, category: "Transition Metal", block: "d", period: 4 },
    "Gallium": { symbol: "Ga", atomic: 31, mass: "69.723", config: "[Ar] 4s² 3d¹⁰ 4p¹", electrons: 31, shells: [2, 8, 18, 3], radius: 0.81, electroneg: 1.81, category: "Post-transition", block: "p", period: 4 },
    "Germanium": { symbol: "Ge", atomic: 32, mass: "72.630", config: "[Ar] 4s² 3d¹⁰ 4p²", electrons: 32, shells: [2, 8, 18, 4], radius: 0.78, electroneg: 2.01, category: "Metalloid", block: "p", period: 4 },
    "Arsenic": { symbol: "As", atomic: 33, mass: "74.922", config: "[Ar] 4s² 3d¹⁰ 4p³", electrons: 33, shells: [2, 8, 18, 5], radius: 0.76, electroneg: 2.18, category: "Metalloid", block: "p", period: 4 },
    "Selenium": { symbol: "Se", atomic: 34, mass: "78.971", config: "[Ar] 4s² 3d¹⁰ 4p⁴", electrons: 34, shells: [2, 8, 18, 6], radius: 0.74, electroneg: 2.55, category: "Nonmetal", block: "p", period: 4 },
    "Bromine": { symbol: "Br", atomic: 35, mass: "79.904", config: "[Ar] 4s² 3d¹⁰ 4p⁵", electrons: 35, shells: [2, 8, 18, 7], radius: 0.73, electroneg: 2.96, category: "Halogen", block: "p", period: 4 },
    "Krypton": { symbol: "Kr", atomic: 36, mass: "83.798", config: "[Ar] 4s² 3d¹⁰ 4p⁶", electrons: 36, shells: [2, 8, 18, 8], radius: 0.75, electroneg: 0, category: "Noble Gas", block: "p", period: 4 },
    "Rubidium": { symbol: "Rb", atomic: 37, mass: "85.468", config: "[Kr] 5s¹", electrons: 37, shells: [2, 8, 18, 8, 1], radius: 1.05, electroneg: 0.82, category: "Alkali Metal", block: "s", period: 5 },
    "Strontium": { symbol: "Sr", atomic: 38, mass: "87.62", config: "[Kr] 5s²", electrons: 38, shells: [2, 8, 18, 8, 2], radius: 1.0, electroneg: 0.95, category: "Alkaline Earth", block: "s", period: 5 },
    "Yttrium": { symbol: "Y", atomic: 39, mass: "88.906", config: "[Kr] 5s² 4d¹", electrons: 39, shells: [2, 8, 18, 9, 2], radius: 0.9, electroneg: 1.22, category: "Transition Metal", block: "d", period: 5 },
    "Zirconium": { symbol: "Zr", atomic: 40, mass: "91.224", config: "[Kr] 5s² 4d²", electrons: 40, shells: [2, 8, 18, 10, 2], radius: 0.88, electroneg: 1.33, category: "Transition Metal", block: "d", period: 5 },
    "Niobium": { symbol: "Nb", atomic: 41, mass: "92.906", config: "[Kr] 5s¹ 4d⁴", electrons: 41, shells: [2, 8, 18, 12, 1], radius: 0.87, electroneg: 1.6, category: "Transition Metal", block: "d", period: 5 },
    "Molybdenum": { symbol: "Mo", atomic: 42, mass: "95.95", config: "[Kr] 5s¹ 4d⁵", electrons: 42, shells: [2, 8, 18, 13, 1], radius: 0.86, electroneg: 2.16, category: "Transition Metal", block: "d", period: 5 },
    "Technetium": { symbol: "Tc", atomic: 43, mass: "98", config: "[Kr] 5s² 4d⁵", electrons: 43, shells: [2, 8, 18, 13, 2], radius: 0.85, electroneg: 1.9, category: "Transition Metal", block: "d", period: 5 },
    "Ruthenium": { symbol: "Ru", atomic: 44, mass: "101.07", config: "[Kr] 5s¹ 4d⁷", electrons: 44, shells: [2, 8, 18, 15, 1], radius: 0.84, electroneg: 2.2, category: "Transition Metal", block: "d", period: 5 },
    "Rhodium": { symbol: "Rh", atomic: 45, mass: "102.91", config: "[Kr] 5s¹ 4d⁸", electrons: 45, shells: [2, 8, 18, 16, 1], radius: 0.83, electroneg: 2.28, category: "Transition Metal", block: "d", period: 5 },
    "Palladium": { symbol: "Pd", atomic: 46, mass: "106.42", config: "[Kr] 4d¹⁰", electrons: 46, shells: [2, 8, 18, 18, 0], radius: 0.82, electroneg: 2.2, category: "Transition Metal", block: "d", period: 5 },
    "Silver": { symbol: "Ag", atomic: 47, mass: "107.87", config: "[Kr] 5s¹ 4d¹⁰", electrons: 47, shells: [2, 8, 18, 18, 1], radius: 0.85, electroneg: 1.93, category: "Transition Metal", block: "d", period: 5 },
    "Cadmium": { symbol: "Cd", atomic: 48, mass: "112.41", config: "[Kr] 5s² 4d¹⁰", electrons: 48, shells: [2, 8, 18, 18, 2], radius: 0.85, electroneg: 1.69, category: "Transition Metal", block: "d", period: 5 },
    "Indium": { symbol: "In", atomic: 49, mass: "114.82", config: "[Kr] 5s² 4d¹⁰ 5p¹", electrons: 49, shells: [2, 8, 18, 18, 3], radius: 0.88, electroneg: 1.78, category: "Post-transition", block: "p", period: 5 },
    "Tin": { symbol: "Sn", atomic: 50, mass: "118.71", config: "[Kr] 5s² 4d¹⁰ 5p²", electrons: 50, shells: [2, 8, 18, 18, 4], radius: 0.85, electroneg: 1.96, category: "Post-transition", block: "p", period: 5 },
    "Antimony": { symbol: "Sb", atomic: 51, mass: "121.76", config: "[Kr] 5s² 4d¹⁰ 5p³", electrons: 51, shells: [2, 8, 18, 18, 5], radius: 0.83, electroneg: 2.05, category: "Metalloid", block: "p", period: 5 },
    "Tellurium": { symbol: "Te", atomic: 52, mass: "127.60", config: "[Kr] 5s² 4d¹⁰ 5p⁴", electrons: 52, shells: [2, 8, 18, 18, 6], radius: 0.81, electroneg: 2.1, category: "Metalloid", block: "p", period: 5 },
    "Iodine": { symbol: "I", atomic: 53, mass: "126.90", config: "[Kr] 5s² 4d¹⁰ 5p⁵", electrons: 53, shells: [2, 8, 18, 18, 7], radius: 0.8, electroneg: 2.66, category: "Halogen", block: "p", period: 5 },
    "Xenon": { symbol: "Xe", atomic: 54, mass: "131.29", config: "[Kr] 5s² 4d¹⁰ 5p⁶", electrons: 54, shells: [2, 8, 18, 18, 8], radius: 0.82, electroneg: 0, category: "Noble Gas", block: "p", period: 5 },
    "Cesium": { symbol: "Cs", atomic: 55, mass: "132.91", config: "[Xe] 6s¹", electrons: 55, shells: [2, 8, 18, 18, 8, 1], radius: 1.1, electroneg: 0.79, category: "Alkali Metal", block: "s", period: 6 },
    "Barium": { symbol: "Ba", atomic: 56, mass: "137.33", config: "[Xe] 6s²", electrons: 56, shells: [2, 8, 18, 18, 8, 2], radius: 1.05, electroneg: 0.89, category: "Alkaline Earth", block: "s", period: 6 },
    "Lanthanum": { symbol: "La", atomic: 57, mass: "138.91", config: "[Xe] 6s² 5d¹", electrons: 57, shells: [2, 8, 18, 18, 9, 2], radius: 0.95, electroneg: 1.1, category: "Lanthanide", block: "f", period: 6 },
    "Cerium": { symbol: "Ce", atomic: 58, mass: "140.12", config: "[Xe] 6s² 4f¹ 5d¹", electrons: 58, shells: [2, 8, 18, 19, 9, 2], radius: 0.94, electroneg: 1.12, category: "Lanthanide", block: "f", period: 6 },
    "Praseodymium": { symbol: "Pr", atomic: 59, mass: "140.91", config: "[Xe] 6s² 4f³", electrons: 59, shells: [2, 8, 18, 21, 8, 2], radius: 0.93, electroneg: 1.13, category: "Lanthanide", block: "f", period: 6 },
    "Neodymium": { symbol: "Nd", atomic: 60, mass: "144.24", config: "[Xe] 6s² 4f⁴", electrons: 60, shells: [2, 8, 18, 22, 8, 2], radius: 0.92, electroneg: 1.14, category: "Lanthanide", block: "f", period: 6 },
    "Promethium": { symbol: "Pm", atomic: 61, mass: "145", config: "[Xe] 6s² 4f⁵", electrons: 61, shells: [2, 8, 18, 23, 8, 2], radius: 0.91, electroneg: 1.13, category: "Lanthanide", block: "f", period: 6 },
    "Samarium": { symbol: "Sm", atomic: 62, mass: "150.36", config: "[Xe] 6s² 4f⁶", electrons: 62, shells: [2, 8, 18, 24, 8, 2], radius: 0.9, electroneg: 1.17, category: "Lanthanide", block: "f", period: 6 },
    "Europium": { symbol: "Eu", atomic: 63, mass: "151.96", config: "[Xe] 6s² 4f⁷", electrons: 63, shells: [2, 8, 18, 25, 8, 2], radius: 0.89, electroneg: 1.2, category: "Lanthanide", block: "f", period: 6 },
    "Gadolinium": { symbol: "Gd", atomic: 64, mass: "157.25", config: "[Xe] 6s² 4f⁷ 5d¹", electrons: 64, shells: [2, 8, 18, 25, 9, 2], radius: 0.88, electroneg: 1.2, category: "Lanthanide", block: "f", period: 6 },
    "Terbium": { symbol: "Tb", atomic: 65, mass: "158.93", config: "[Xe] 6s² 4f⁹", electrons: 65, shells: [2, 8, 18, 27, 8, 2], radius: 0.87, electroneg: 1.2, category: "Lanthanide", block: "f", period: 6 },
    "Dysprosium": { symbol: "Dy", atomic: 66, mass: "162.50", config: "[Xe] 6s² 4f¹⁰", electrons: 66, shells: [2, 8, 18, 28, 8, 2], radius: 0.86, electroneg: 1.22, category: "Lanthanide", block: "f", period: 6 },
    "Holmium": { symbol: "Ho", atomic: 67, mass: "164.93", config: "[Xe] 6s² 4f¹¹", electrons: 67, shells: [2, 8, 18, 29, 8, 2], radius: 0.85, electroneg: 1.23, category: "Lanthanide", block: "f", period: 6 },
    "Erbium": { symbol: "Er", atomic: 68, mass: "167.26", config: "[Xe] 6s² 4f¹²", electrons: 68, shells: [2, 8, 18, 30, 8, 2], radius: 0.84, electroneg: 1.24, category: "Lanthanide", block: "f", period: 6 },
    "Thulium": { symbol: "Tm", atomic: 69, mass: "168.93", config: "[Xe] 6s² 4f¹³", electrons: 69, shells: [2, 8, 18, 31, 8, 2], radius: 0.83, electroneg: 1.25, category: "L
