// modules/boumboum.js — Mode perform party

import { initScene, AudioEngine, animate, downloadCanvas, fullscreenToggle } from './core.js';
import { plasmaShader, tunnelShader, asciiShader, createFullscreenMesh } from './effects.js';
import { createHUD, setStatus, toggleActive, injectStyles } from './ui.js';

export async function start(container) {
  injectStyles();

  const { scene, camera, renderer } = await initScene(container);

  const shaders = [
    { name: 'plasma', desc: plasmaShader() },
    { name: 'tunnel', desc: tunnelShader() },
    { name: 'ascii', desc: asciiShader() }
  ];
  let current = 0;

  let mesh = createFullscreenMesh(window.THREE, shaders[current].desc);
  mesh.material.uniforms.uResolution.value = new window.THREE.Vector2(container.clientWidth, container.clientHeight);
  scene.add(mesh);

  const audio = new AudioEngine();
  const { controls } = createHUD({
    'btn-prev': '◀',
    'btn-next': '▶',
    'btn-audio': 'Micro',
    'btn-shot': 'Capture',
    'btn-fs': 'Plein écran'
  });

  document.getElementById('mode-label').textContent = 'BOUM BOUM';

  function setEffect(idx) {
    current = (idx + shaders.length) % shaders.length;
    scene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
    mesh = createFullscreenMesh(window.THREE, shaders[current].desc);
    mesh.material.uniforms.uResolution.value = new window.THREE.Vector2(container.clientWidth, container.clientHeight);
    scene.add(mesh);
    setStatus(shaders[current].name);
  }

  controls.querySelector('#btn-prev').onclick = () => setEffect(current - 1);
  controls.querySelector('#btn-next').onclick = () => setEffect(current + 1);

  const btnAudio = controls.querySelector('#btn-audio');
  btnAudio.onclick = async () => {
    if (audio.active) {
      audio.stop();
      toggleActive(btnAudio, false);
    } else {
      await audio.start();
      toggleActive(btnAudio, true);
    }
  };

  controls.querySelector('#btn-shot').onclick = () => {
    downloadCanvas(renderer.domElement, 'boumboum');
    setStatus('Capture sauvegardée');
    setTimeout(() => setStatus(shaders[current].name), 1500);
  };

  controls.querySelector('#btn-fs').onclick = fullscreenToggle;

  animate(renderer, scene, camera, (time) => {
    mesh.material.uniforms.uTime.value = time;
    mesh.material.uniforms.uAudio.value = audio.getLevel();
  });
}
