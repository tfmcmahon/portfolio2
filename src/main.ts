import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { debounce } from "debounce";

import "./style.scss";
import { sceneMoveMap } from "./constants/scene-to-move-map";
import {
  campTranslation,
  officeTranslation,
  sceneScale,
  schoolTranslation,
} from "./constants/scene-translations";

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

window?.addEventListener("mousemove", updateMouse, false);
window?.addEventListener("mouseenter", updateMouse, false);
window?.addEventListener("mouseleave", updateMouse, false);

// End region: scene set up

// Region: geometry

const transformControls = new TransformControls(camera, renderer.domElement);
scene.add(transformControls);

let schoolScene: THREE.Group = new THREE.Group();
let campScene: THREE.Group = new THREE.Group();
let officeScene: THREE.Group = new THREE.Group();

const loader = new GLTFLoader();

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
        m.material.dithering = true;
        m.geometry.computeVertexNormals();
      }
    });
    scene.add(gltf.scene);
    schoolScene = gltf.scene;
    schoolScene.position.x = schoolTranslation[1];
    schoolScene.position.z = -0.3;
    schoolScene.scale.x = sceneScale.school;
    schoolScene.scale.y = sceneScale.school;
    schoolScene.scale.z = sceneScale.school;
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "school % loaded");
  },
  (error) => {
    console.log(error);
  }
);

loader.load(
  "../assets/models/office_01.glb",
  (gltf) => {
    gltf.scene.traverse(function (child) {
      if ((child as THREE.Mesh).isMesh) {
        const m = child as THREE.Mesh;
        m.receiveShadow = true;
        m.castShadow = true;
        // m.material = material;
        // @ts-ignore
        m.material.metalness = 0.4;
        // @ts-ignore
        m.material.roughness = 0.7;
        // @ts-ignore
        m.material.dithering = true;
        m.geometry.computeVertexNormals();
      }
    });
    scene.add(gltf.scene);
    officeScene = gltf.scene;
    officeScene.position.x = officeTranslation[1];
    officeScene.position.z = 0.2;
    officeScene.scale.x = 0.85;
    officeScene.scale.y = 0.85;
    officeScene.scale.z = 0.85;
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "office % loaded");
  },
  (error) => {
    console.log(error);
  }
);

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
        m.material.dithering = true;
        m.geometry.computeVertexNormals();
      }
    });
    scene.add(gltf.scene);
    campScene = gltf.scene;
    campScene.position.x = campTranslation[1];
    campScene.position.z = 0.1;
    // campScene.scale.x = 0.95;
    // campScene.scale.y = 0.95;
    // campScene.scale.z = 0.95;
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "campsite % loaded");
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

let sceneInView = 1;
// let firstLoad = true;

const checkScroll = (direction: 0 | 1 | -1): void => {
  // compare the current scroll position with the last known position
  if (direction === -1) {
    // scroll down
    // We want to move to the next scene, max of 3
    sceneInView = Math.min(sceneInView + 1, 3);
  } else if (direction === 1) {
    // scroll up
    // We want to move to the previous scene, min of 1
    sceneInView = Math.max(sceneInView - 1, 1);
  } else {
    // first load
    sceneInView = 1;
  }

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

  // move camp scene
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
    (sceneMoveMap[key].backgroundElement as Element).classList.remove(
      `${sceneMoveMap[key].backgroundClass}--visible`
    );
    (sceneMoveMap[key].contentElement as Element).classList.remove(
      `${sceneMoveMap[key].contentClass}--visible`
    );
    
  }

  (sceneMoveMap[sceneInView].backgroundElement as Element)?.classList.add(
    `${sceneMoveMap[sceneInView].backgroundClass as string}--visible`
  );

  (sceneMoveMap[sceneInView].contentElement as Element)?.classList.add(
    `${sceneMoveMap[sceneInView].contentClass as string}--visible`
  );

  if (sceneInView === 1) {
    //add from one class to scene two
    (sceneMoveMap[2].contentElement as Element)?.classList.add(
      `${sceneMoveMap[2].contentClass as string}--from-one`
    );
    (sceneMoveMap[2].contentElement as Element)?.classList.remove(
      `${sceneMoveMap[2].contentClass as string}--from-three`
    );
  } else if (sceneInView === 3) {
    //add from three class to scene two
    (sceneMoveMap[2].contentElement as Element)?.classList.add(
      `${sceneMoveMap[2].contentClass as string}--from-three`
    );
    (sceneMoveMap[2].contentElement as Element)?.classList.remove(
      `${sceneMoveMap[2].contentClass as string}--from-one`
    );
  }
};

const handleScroll = (event: any) => {
  let direction: 0 | 1 | -1 = 0;

  if (event.wheelDelta >= 0) {
    direction = 1;
  } else {
    direction = -1;
  }

  checkScroll(direction);
};

window?.addEventListener("wheel", debounce(handleScroll, 1000));

checkScroll(0);

//const stats = Stats();
//document.body.appendChild(stats.dom);

const clock = new THREE.Clock();

const animate = () => {
  requestAnimationFrame(animate);

  TWEEN.update();

  const time = clock.getElapsedTime();

  // hover animations
  schoolScene.position.y = Math.cos(time) * 0.015;
  officeScene.position.y = Math.cos(time) * 0.015;
  campScene.position.y = Math.cos(time) * 0.015;

  // mouse move animations
  schoolScene.rotation.y = THREE.MathUtils.lerp(
    0,
    ((mouseX - window.innerWidth / 3) * Math.PI) / 20000,
    0.5
  );
  schoolScene.rotation.x = THREE.MathUtils.lerp(
    0,
    ((mouseY - window.innerHeight - 1000) * Math.PI) / 20000,
    0.5
  );

  campScene.rotation.y = THREE.MathUtils.lerp(
    0,
    ((mouseX - window.innerWidth / 3) * Math.PI) / 20000,
    0.5
  );
  campScene.rotation.x = THREE.MathUtils.lerp(
    0,
    ((mouseY - window.innerHeight - 1000) * Math.PI) / 20000,
    0.5
  );

  officeScene.rotation.y = THREE.MathUtils.lerp(
    0,
    ((mouseX - window.innerWidth / 3) * Math.PI) / 20000,
    0.5
  );
  officeScene.rotation.x = THREE.MathUtils.lerp(
    0,
    ((mouseY - window.innerHeight - 1000) * Math.PI) / 20000,
    0.5
  );

  //stats.update();
  render();
};

const render = () => {
  // renderer.setClearColorHex( 0xffffff, 1 )
  renderer.render(scene, camera);
};

animate();

//End region: animation
