"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function TurningPointDepth() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 15, 25);
    camera.lookAt(0, 0, 0);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // Geographic topographic contour grid
    const gridHelper = new THREE.GridHelper(30, 24, 0x263d31, 0x819478);
    gridHelper.position.y = -2;
    gridHelper.material.opacity = 0.25;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Coordinate nodes (Quiet green, Caution amber, Crowded terracotta)
    const nodeGroup = new THREE.Group();
    const nodeData = [
      { pos: [-6, 0, -4], color: 0x263d31, radius: 0.6 },
      { pos: [0, 0, 2], color: 0x819478, radius: 0.7 },
      { pos: [6, 0, -2], color: 0xc58c5a, radius: 0.5 },
      { pos: [8, 0, 5], color: 0xb86e52, radius: 0.55 },
      { pos: [-7, 0, 6], color: 0x92958d, radius: 0.5 },
    ];

    nodeData.forEach((item) => {
      const geometry = new THREE.SphereGeometry(item.radius, 16, 16);
      const material = new THREE.MeshBasicMaterial({
        color: item.color,
        wireframe: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(item.pos[0], item.pos[1], item.pos[2]);

      // Subtle pulse ring below node
      const ringGeo = new THREE.RingGeometry(item.radius * 1.5, item.radius * 1.8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: item.color,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI * 0.5;
      ring.position.set(item.pos[0], item.pos[1] - 0.5, item.pos[2]);

      nodeGroup.add(mesh);
      nodeGroup.add(ring);
    });

    scene.add(nodeGroup);

    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      nodeGroup.rotation.y = t * 0.05;
      gridHelper.rotation.y = t * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40"
      aria-hidden="true"
    />
  );
}
