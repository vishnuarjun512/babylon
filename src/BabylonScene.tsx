import { useEffect, useRef } from "react";
import { Engine, Scene, SceneLoader, Mesh } from "@babylonjs/core";
import "@babylonjs/loaders";
import { Vector3 } from "@babylonjs/core";
import {
  ArcRotateCamera,
  HemisphericLight,
  DirectionalLight,
} from "@babylonjs/core";
import { createRoom } from "./Babylon/Room";
import { useModel } from "./states/useModel";

const BabylonScene = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rootMeshRef = useRef<Mesh | null>(null);

  const { modelFileName, width, height } = useModel();

  // Function to scale the model based on the selected width (X-axis) and height (Y-axis)
  const scaleModelOnAxes = (selectedWidth: number, selectedHeight: number) => {
    const initialWidth = 1900; // Initial model width
    const initialHeight = 2100; // Initial model height

    if (rootMeshRef.current) {
      // Handle X-axis scaling based on width
      const widthScaleStep = 0.05;
      const widthDifference = selectedWidth - initialWidth;
      const newScaleX = 1 + (widthDifference / 100) * widthScaleStep;

      // Handle Y-axis scaling based on height
      const heightScaleStep = 0.05;
      const heightDifference = selectedHeight - initialHeight;
      const newScaleY = 1 + (heightDifference / 100) * heightScaleStep;

      // Apply the scaling to both X and Y axes
      rootMeshRef.current.scaling.x = newScaleX;
      rootMeshRef.current.scaling.y = newScaleY;
    }
  };

  useEffect(() => {
    // Only apply scaling when the model is loaded
    if (rootMeshRef.current) {
      scaleModelOnAxes(width, height);
    }
  }, [width, height]); // This will run whenever the size changes

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);

    // Create a camera
    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 3,
      4300,
      new Vector3(-480, 200, 0),
      scene
    );
    camera.attachControl(canvasRef.current, true);

    // Set alpha limits (horizontal rotation - X axis)
    const minAlpha = Math.PI / 4; // Min rotation (leftmost)
    const maxAlpha = (3 * Math.PI) / 4; // Max rotation (rightmost)

    // Set beta limits (vertical rotation - Y axis)
    const minBeta = Math.PI / 8; // 30 degrees
    const maxBeta = Math.PI / 1.5; // 90 degrees (level with the target)

    // Check alpha and beta limits on each render frame
    scene.onBeforeRenderObservable.add(() => {
      // Clamp alpha (X-axis rotation)
      if (camera.alpha < minAlpha) {
        camera.alpha = minAlpha;
      } else if (camera.alpha > maxAlpha) {
        camera.alpha = maxAlpha;
      }

      // Clamp beta (Y-axis rotation)
      if (camera.beta < minBeta) {
        camera.beta = minBeta;
      } else if (camera.beta > maxBeta) {
        camera.beta = maxBeta;
      }
    });

    // Create a hemispheric light (ambient light)
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, 0),
      scene
    );
    hemisphericLight.intensity = 0.8;

    // Create a directional light
    const directionalLight = new DirectionalLight(
      "directionalLight",
      new Vector3(-1, -2, -1),
      scene
    );

    directionalLight.position = new Vector3(0, 5, 0);
    directionalLight.intensity = 0.8;

    createRoom(scene);

    // Load the GLB model
    const loadGLB = async () => {
      try {
        const result = await SceneLoader.ImportMeshAsync(
          "1900",
          "/models/",
          `${modelFileName}.gltf`,
          scene
        );

        if (result && result.meshes.length > 0) {
          const rootMesh = result.meshes[0]; // Assuming first mesh is root
          // for left
          rootMesh.position = new Vector3(1500, -980, -320); // Modify the root mesh position

          //for right
          // rootMesh.position = new Vector3(300, -980, -320); // Modify the root mesh position
          rootMeshRef.current = rootMesh as Mesh; // Store the root mesh reference
          scaleModelOnAxes(width, height);
        }
      } catch (error) {
        console.error("Failed to load GLB model:", error);
      }
    };

    loadGLB();

    // Render loop
    engine.runRenderLoop(() => {
      scene.render();
    });

    // Handle window resize
    window.addEventListener("resize", () => {
      engine.resize();
    });

    return () => {
      engine.dispose();
      window.removeEventListener("resize", () => engine.resize());
    };
  }, [modelFileName]);

  return (
    <div>
      <canvas
        className="outline-none"
        ref={canvasRef}
        style={{ width: "100%", height: "100vh" }}
      />
    </div>
  );
};

export default BabylonScene;
