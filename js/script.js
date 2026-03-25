import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


gsap.registerPlugin(ScrollTrigger);

function init3D(containerId, modelPath) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const sun = new THREE.DirectionalLight(0x0055ff, 2);
    sun.position.set(5, 5, 5);
    scene.add(sun);

    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        scene.add(model);

        function animate() {
            requestAnimationFrame(animate);
            model.rotation.y += 0.005;
            const scalePlus = Math.sin(Date.now() * 0.001) * 0.02;
            model.scale.set(1.5 + scalePlus, 1.5 + scalePlus, 1.5 + scalePlus);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
    }, undefined, (e) => console.error("Ошибка загрузки:", e));

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}


document.querySelectorAll('.toggle-info').forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        const infoBlock = document.getElementById(targetId);
        document.querySelectorAll('.description-block').forEach(block => {
            block.classList.remove('active');
        });

        infoBlock.classList.add('active');
        console.log(`DATA_RETRIEVAL: ${targetId} initialized...`);
    });
});

document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.target.parentElement.classList.remove('active');
    });
});


window.onload = () => {
    document.querySelectorAll('.model-entry').forEach(el => {
        gsap.to(el, {
            scrollTrigger: { trigger: el, start: "top 80%" },
            opacity: 1, y: 0, duration: 1.5
        });
    });
    init3D('canvas-history', './models/greek_warrior.glb');
    init3D('canvas-science', './models/16_physics.glb');
};