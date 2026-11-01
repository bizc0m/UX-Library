// modules/live.js — Mode VJ / stream

import { initScene, AudioEngine, Webcam, Recorder, animate, downloadCanvas, fullscreenToggle } from './core.js';
import { plasmaShader, createFullscreenMesh } from './effects.js';
import { createHUD, setStatus, toggleActive, injectStyles } from './ui.js';

export async function start(container) {
  injectStyles();

  const { scene, camera, renderer } = await initScene(container);

  const mesh = createFullscreenMesh(window.THREE, plasmaShader());
  mesh.material.uniforms.uResolution.value = new window.THREE.Vector2(container.clientWidth, container.clientHeight);
  scene.add(mesh);

  const audio = new AudioEngine();
  const recorder = new Recorder(renderer.domElement);

  // Webcam PIP
  const pip = document.createElement('div');
  pip.id = 'pip';
  const video = document.createElement('video');
  video.id = 'cam-video';
  video.autoplay = true;
  video.playsInline = true;
  video.muted = true;
  pip.appendChild(video);
  document.body.appendChild(pip);

  // Audio meter
  const meter = document.createElement('div');
  meter.id = 'audio-meter';
  const bar = document.createElement('div');
  bar.className = 'bar';
  meter.appendChild(bar);
  document.body.appendChild(meter);

  const { controls } = createHUD({
    'btn-cam': 'Caméra',
    'btn-audio': 'Micro',
    'btn-record': 'Enregistrer',
    'btn-shot': 'Capture',
    'btn-fs': 'Plein écran'
  });

  document.getElementById('mode-label').textContent = 'LIVE';

  const webcam = new Webcam(video);
  const btnCam = controls.querySelector('#btn-cam');
  btnCam.onclick = async () => {
    if (webcam.stream) {
      webcam.stop();
      pip.classList.remove('visible');
      toggleActive(btnCam, false);
    } else {
      await webcam.start();
      pip.classList.add('visible');
      toggleActive(btnCam, true);
    }
  };

  const btnAudio = controls.querySelector('#btn-audio');
  btnAudio.onclick = async () => {
    if (audio.active) {
      audio.stop();
      meter.classList.remove('visible');
      toggleActive(btnAudio, false);
    } else {
      await audio.start();
      meter.classList.add('visible');
      toggleActive(btnAudio, true);
    }
  };

  const btnRecord = controls.querySelector('#btn-record');
  btnRecord.onclick = () => {
    if (recorder.isRecording) {
      recorder.stop();
      btnRecord.textContent = 'Enregistrer';
      toggleActive(btnRecord, false);
      setStatus('Prêt');
      setTimeout(() => setStatus('Prêt'), 2000);
    } else {
      recorder.start();
      btnRecord.textContent = 'Stop';
      toggleActive(btnRecord, true);
      setStatus('● Enregistrement…', 'recording');
    }
  };

  controls.querySelector('#btn-shot').onclick = () => {
    downloadCanvas(renderer.domElement, 'live');
    setStatus('Capture sauvegardée');
    setTimeout(() => setStatus(recorder.isRecording ? '● Enregistrement…' : 'Prêt'), 1500);
  };

  controls.querySelector('#btn-fs').onclick = fullscreenToggle;

  animate(renderer, scene, camera, (time) => {
    mesh.material.uniforms.uTime.value = time;
    const level = audio.getLevel();
    mesh.material.uniforms.uAudio.value = level;
    bar.style.width = `${level * 100}%`;
  });
}
