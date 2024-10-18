import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"; // Import OrbitControls

// Option 1: Define GLTF type manually
type GLTF = {
  scene: THREE.Group;
};

const ThreeScene = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Set up scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }

    // Add lighting to the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // Instantiate the GLTF loader
    const loader = new GLTFLoader();

    // Load multiple models
    const models = [
      "/models/left.gltf",
      "/models/left.gltf",
      // Add more models as needed
    ];
    let xOffset = 0; // Base offset for positioning

    models.forEach((modelPath) => {
      loader.load(
        modelPath,
        (gltf: GLTF) => {
          console.log("Model loaded:", gltf);
          const model = gltf.scene;

          const bbox = new THREE.Box3().setFromObject(model);
          const size = bbox.getSize(new THREE.Vector3());

          // Center the model in the bounding box
          bbox.getCenter(model.position); // Center the model at its position
          model.position.x += xOffset; // Offset the model

          // Scale the model if necessary
          model.scale.set(0.05, 0.05, 0.05); // Adjust scaling based on model size

          // Add the model to the scene
          scene.add(model);

          // Update xOffset to position the next model
          xOffset += size.x * 0.05 + 1; // Adjust based on the scaling factor

          console.log("Scene after adding model:", scene.children);
        },
        undefined,
        (error) => {
          console.error("An error occurred loading the model:", error);
        }
      );
    });

    // Camera position and look at the center
    camera.position.set(0, 2, 5); // Adjust initial camera position
    camera.lookAt(0, 0, 0);

    // Initialize OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Enable damping for smooth controls
    controls.dampingFactor = 0.25; // Damping factor
    controls.enableZoom = true; // Allow zooming
    controls.minDistance = 200; // Minimum zoom distance
    controls.maxDistance = 10000; // Maximum zoom distance, adjust as needed

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // Update controls
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100vh", overflow: "hidden" }}
    ></div>
  );
};

export default ThreeScene;
