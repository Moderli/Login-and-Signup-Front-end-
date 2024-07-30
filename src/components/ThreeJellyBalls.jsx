// src/components/ThreeJellyBalls.js

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ShaderMaterial } from 'three';

const ThreeJellyBalls = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float time;
      varying vec2 vUv;
      void main() {
        float r = 0.5 + 0.5 * cos(3.0 * vUv.x + time);
        float g = 0.5 + 0.5 * cos(3.0 * vUv.y + time + 2.0);
        float b = 0.5 + 0.5 * cos(3.0 * (vUv.x + vUv.y) + time + 4.0);
        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `;

    const uniforms = {
      time: { value: 0 }
    };

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms
    });

    const geometry = new THREE.SphereGeometry(0.7,20,30);
    const jellyBalls = [];

    for (let i = 0; i < 20; i++) {
      const ball = new THREE.Mesh(geometry, material);
      ball.position.set(
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5
      );
      scene.add(ball);
      jellyBalls.push(ball);
    }

    const light1 = new THREE.PointLight(0xffffff, 1, 100);
    light1.position.set(10, 10, 10);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xffffff, 1, 100);
    light2.position.set(-10, -10, -10);
    scene.add(light2);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      uniforms.time.value += 0.01;

      jellyBalls.forEach(ball => {
        ball.position.x -= 0.01; // Move left
        if (ball.position.x < -5) { // Reset position when out of view
          ball.position.x = 5;
        }
        ball.position.x += (Math.random() - 0.5) * 0.01;
        ball.position.y += (Math.random() - 0.5) * 0.01;
        ball.position.z += (Math.random() - 0.5) * 0.01;
        ball.scale.x = 1 + 0.3 * Math.sin(uniforms.time.value * 3);
        ball.scale.y = 1 + 0.3 * Math.cos(uniforms.time.value * 3);
        ball.scale.z = 1 + 0.3 * Math.sin(uniforms.time.value * 3);
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
};

export default ThreeJellyBalls;
