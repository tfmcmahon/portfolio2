import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { debounce, throttle } from "./utils/debounce";

import "./style.scss";

const frustumSize = 1.5;
const initAspect = window.innerWidth / window.innerHeight;

// Region: scene set up
const scene: THREE.Scene = new THREE.Scene();
// scene.add(new THREE.AxesHelper(5));

//window.innerWidth / window.innerHeight,
const camera = new THREE.OrthographicCamera(
  (frustumSize * initAspect) / -2,
  (frustumSize * initAspect) / 2,
  frustumSize / 2,
  frustumSize / -2,
  0.1,
  100
);

const canvas = document.querySelector("#bg") as HTMLCanvasElement;

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
  canvas,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap; // default THREE.PCFShadowMap
renderer.outputEncoding = THREE.sRGBEncoding;

camera.position.setZ(3);
camera.position.setY(1.775);
camera.rotation.x = -0.55;

const directionalLight = new THREE.DirectionalLight(0xfff3d7);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 4096;
directionalLight.shadow.mapSize.height = 4096;
directionalLight.shadow.camera.near = 11;
directionalLight.shadow.camera.far = 15;
directionalLight.position.x = -5;
directionalLight.position.y = 10;
directionalLight.position.z = 2;

const ambientLight = new THREE.AmbientLight(0xd7efff);

scene.add(ambientLight, directionalLight);

// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper);

let mouseX = window.innerWidth;
let mouseY = window.innerHeight;

const updateMouse = (event: any) => {
  mouseX = event.pageX;
  mouseY = event.pageY;
};

canvas?.addEventListener("mousemove", updateMouse, false);
canvas?.addEventListener("mouseenter", updateMouse, false);
canvas?.addEventListener("mouseleave", updateMouse, false);

// End region: scene set up

// Region: geometry

const transformControls = new TransformControls(camera, renderer.domElement);
scene.add(transformControls);

let campScene: THREE.Group = new THREE.Group();
let schoolScene: THREE.Group = new THREE.Group();
let officeScene: THREE.Group = new THREE.Group();

const loader = new GLTFLoader();

loader.load(
  "../assets/models/camp_site_01.glb",
  (gltf) => {
    gltf.scene.traverse(function (child) {
      if ((child as THREE.Mesh).isMesh) {
        const m = child as THREE.Mesh;
        m.receiveShadow = true;
        m.castShadow = true;
        // m.material = material;
        // @ts-ignore
        m.material.metalness = 0.2;
        // @ts-ignore
        m.material.roughness = 0.9;
        // @ts-ignore
        m.material.emissiveIntensity = 0;
        // @ts-ignore
        m.material.dithering = true;
        m.geometry.computeVertexNormals();
      }
    });
    scene.add(gltf.scene);
    campScene = gltf.scene;
    campScene.position.x = 20;
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "scene1 % loaded");
  },
  (error) => {
    console.log(error);
  }
);

loader.load(
  "../assets/models/school_01.glb",
  (gltf) => {
    gltf.scene.traverse(function (child) {
      if ((child as THREE.Mesh).isMesh) {
        const m = child as THREE.Mesh;
        m.receiveShadow = true;
        m.castShadow = true;
        // m.material = material;
        // @ts-ignore
        m.material.metalness = 0.1;
        // @ts-ignore
        m.material.roughness = 0.9;
        // @ts-ignore
        m.material.emissiveIntensity = 0;
        // @ts-ignore
        m.material.dithering = true;
        m.geometry.computeVertexNormals();
      }
    });
    scene.add(gltf.scene);
    schoolScene = gltf.scene;
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "scene 2 % loaded");
  },
  (error) => {
    console.log(error);
  }
);

// End region: geometry

// Region: animation
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  const aspect = window.innerWidth / window.innerHeight;
  // camera.aspect = window.innerWidth / window.innerHeight;
  camera.left = (frustumSize * aspect) / -2;
  camera.right = (frustumSize * aspect) / 2;
  camera.top = frustumSize / 2;
  camera.bottom = -frustumSize / 2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

let lastKnownScrollPosition = 0;
let sceneInView = 1;
let firstLoad = true;

const checkScroll = (): void => {
  const top = window.scrollY;

  const sceneMoveMap: Record<
    number,
    Record<string, number | string | Element | null>
  > = {
    1: {
      //cameraPosition: 0,
      class: "background-scene-one",
      element: document.querySelector(".background-scene-one"),
      lightX: -5,
      lightY: 10,
      lightZ: 2,
      schoolX: 0,
      officeX: -10,
      campX: 20,
    },
    2: {
      //cameraPosition: 10,
      class: "background-scene-two",
      element: document.querySelector(".background-scene-two"),
      light: null,
      lightX: 5,
      lightY: 10,
      lightZ: 2,
      schoolX: -10,
      officeX: 0,
      campX: 10,
    },
    3: {
      //cameraPosition: 20,
      class: "background-scene-three",
      element: document.querySelector(".background-scene-three"),
      lightX: -7,
      lightY: 9,
      lightZ: 1,
      schoolX: -20,
      officeX: -10,
      campX: 0,
    },
  };

  // compare the current scroll position with the last known position
  if (top > lastKnownScrollPosition + 20) {
    // scroll down
    // We want to move to the next scene, max of 3
    sceneInView = Math.min(sceneInView + 1, 3);
  } else if (top < lastKnownScrollPosition - 20) {
    // scroll up
    // We want to move to the previous scene, min of 1
    sceneInView = Math.max(sceneInView - 1, 1);
  }
  firstLoad && (sceneInView = 1);

  // scroll to the new scene
  // move school scene
  new TWEEN.Tween(schoolScene.position)
    .to(
      {
        x: sceneMoveMap[sceneInView].schoolX,
      },
      1500
    )
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start();

  // move office scene
  new TWEEN.Tween(officeScene.position)
    .to(
      {
        x: sceneMoveMap[sceneInView].officeX,
      },
      1500
    )
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start();

  // move campScene
  new TWEEN.Tween(campScene.position)
    .to(
      {
        x: sceneMoveMap[sceneInView].campX,
      },
      1500
    )
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start();

  // update light
  new TWEEN.Tween(directionalLight.position)
    .to(
      {
        x: sceneMoveMap[sceneInView].lightX,
        y: sceneMoveMap[sceneInView].lightY,
        z: sceneMoveMap[sceneInView].lightZ,
      },
      1500
    )
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start();

  // set background based on scene
  for (let key in sceneMoveMap) {
    (sceneMoveMap[key].element as Element).classList.remove(
      `${sceneMoveMap[key].class}--visible`
    );
  }

  (sceneMoveMap[sceneInView].element as Element)?.classList.add(
    `${sceneMoveMap[sceneInView].class as string}--visible`
  );

  // update the last known scroll position
  lastKnownScrollPosition = top;
  firstLoad = false;
};

document.body.onscroll = debounce(checkScroll, 200);
checkScroll();

const stats = Stats();
document.body.appendChild(stats.dom);

const clock = new THREE.Clock();

const animate = () => {
  requestAnimationFrame(animate);

  TWEEN.update();

  const time = clock.getElapsedTime();
  campScene.position.y = Math.cos(time) * 0.01;
  schoolScene.position.y = Math.cos(time) * 0.01;

  // mouse move animations
  campScene.rotation.y = THREE.MathUtils.lerp(
    0,
    ((mouseX - window.innerWidth / 3) * Math.PI) / 20000,
    0.1
  );
  campScene.rotation.x = THREE.MathUtils.lerp(
    0,
    ((mouseY - window.innerHeight - 1000) * Math.PI) / 20000,
    0.1
  );

  schoolScene.rotation.y = THREE.MathUtils.lerp(
    0,
    ((mouseX - window.innerWidth / 3) * Math.PI) / 20000,
    0.1
  );
  schoolScene.rotation.x = THREE.MathUtils.lerp(
    0,
    ((mouseY - window.innerHeight - 1000) * Math.PI) / 20000,
    0.1
  );

  stats.update();
  render();
};

const render = () => {
  // renderer.setClearColorHex( 0xffffff, 1 )
  renderer.render(scene, camera);
};

animate();

//End region: animation
