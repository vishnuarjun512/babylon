import {
  Color3,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
  Vector3,
} from "@babylonjs/core";

export const createRoom = (scene: Scene) => {
  const roomDepth = 2000;
  const roomWidth = 3000;
  const height = 2700;
  const wallThickness = 10;

  const floorMat = new StandardMaterial("floorMat", scene);
  floorMat.diffuseTexture = new Texture(
    "https://www.babylonjs-playground.com/textures/wood.jpg",
    scene
  );

  const floor = MeshBuilder.CreateGround(
    "floor",
    { width: roomWidth, height: roomDepth },
    scene
  );
  floor.material = floorMat;
  floor.position.y = -1000;

  const wallMatLight = new StandardMaterial("wallMatLight", scene);
  wallMatLight.diffuseColor = new Color3(1.0, 1.0, 1.0);

  const wallParams = [
    {
      name: "backWall",
      width: roomWidth,
      height: height,
      depth: wallThickness,
      position: new Vector3(0, 350, -roomDepth / 2 - wallThickness / 2),
      rotation: Math.PI,
    },
    {
      name: "leftWall",
      width: roomDepth,
      height: height,
      depth: wallThickness,
      position: new Vector3(-roomWidth / 2 - wallThickness / 2, 350, 0),
      rotation: -Math.PI / 2,
    },
    {
      name: "rightWall",
      width: roomDepth,
      height: height,
      depth: wallThickness,
      position: new Vector3(roomWidth / 2 + wallThickness / 2, 350, 0),
      rotation: Math.PI / 2,
    },
  ];

  wallParams.forEach(({ name, width, height, depth, position, rotation }) => {
    const wall = MeshBuilder.CreateBox(name, { width, height, depth }, scene);
    wall.material = wallMatLight;
    wall.position = position;
    wall.rotation.y = rotation;
  });
};
