import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import "./Canvas.scss";

const Canvas = () => {
  // const controls = useRef<any>(null);
  const mount = useRef<HTMLDivElement | null>(null);
  const [isAnimating, setAnimating] = useState(true);

  useEffect(() => {
    let width = mount?.current?.clientWidth ?? 0;
    let height = mount?.current?.clientHeight ?? 0;
    let frameId: number;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    const cube = new THREE.Mesh(geometry, material);

    camera.position.z = 4;
    scene.add(cube);
    renderer.setClearColor("#000000");
    renderer.setSize(width, height);

    const renderScene = () => {
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      width = mount?.current?.clientWidth ?? 0;
      height = mount?.current?.clientHeight ?? 0;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderScene();
    };

    const animate = () => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderScene();
      frameId = window.requestAnimationFrame(animate);
    };

    const start = () => {
      if (!frameId) {
        frameId = requestAnimationFrame(animate);
      }
    };

    const stop = () => {
      cancelAnimationFrame(frameId);
      frameId = -1;
    };

    mount?.current?.appendChild(renderer.domElement);
    window.addEventListener("resize", handleResize);
    start();

    // controls.current = { start, stop };

    return () => {
      stop();
      window.removeEventListener("resize", handleResize);
      mount?.current?.removeChild(renderer.domElement);

      scene.remove(cube);
      geometry.dispose();
      material.dispose();
    };
  }, []);

  // useEffect(() => {
  //   if (isAnimating) {
  //     controls?.current?.start();
  //   } else {
  //     controls?.current?.stop();
  //   }
  // }, [isAnimating]);

  return (
    <div
      className="vis"
      ref={mount}
      onClick={() => setAnimating(!isAnimating)}
    />
  );
  //<canvas id="3d-canvas"></canvas>;
};

export default Canvas;
