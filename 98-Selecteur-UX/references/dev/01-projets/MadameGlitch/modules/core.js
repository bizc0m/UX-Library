// modules/core.js — Moteur commun MadameGlitch

const THREE_MODULE = '../assets/three.module.js';
let THREE = null;

export async function loadThree() {
  if (!THREE) {
    THREE = await import(THREE_MODULE);
    window.THREE = THREE;
  }
  return THREE;
}

export async function initScene(container) {
  THREE = await loadThree();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 1;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  resize();
  renderer.domElement.style.position = 'fixed';
  renderer.domElement.style.inset = '0';
  renderer.domElement.style.zIndex = '0';
  document.body.appendChild(renderer.domElement);
  window.addEventListener('resize', resize);

  // Ensure size is correct after layout reflow
  await new Promise(r => requestAnimationFrame(() => {
    resize();
    r();
  }));

  const clock = new THREE.Clock();

  return { scene, camera, renderer, clock, resize };
}

export function animate(renderer, scene, camera, updateFn) {
  const clock = new window.THREE.Clock();
  function loop() {
    requestAnimationFrame(loop);
    updateFn(clock.getElapsedTime());
    renderer.render(scene, camera);
  }
  loop();
}

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.analyser = null;
    this.data = null;
    this.active = false;
  }

  async start() {
    if (this.active) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const src = this.ctx.createMediaStreamSource(stream);
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;
    src.connect(this.analyser);
    this.data = new Uint8Array(this.analyser.frequencyBinCount);
    this.active = true;
  }

  stop() {
    if (!this.active) return;
    this.ctx.close();
    this.ctx = null;
    this.analyser = null;
    this.data = null;
    this.active = false;
  }

  getLevel() {
    if (!this.analyser) return 0;
    this.analyser.getByteFrequencyData(this.data);
    let sum = 0;
    for (const v of this.data) sum += v;
    return (sum / this.data.length / 255);
  }
}

export class Webcam {
  constructor(videoEl) {
    this.video = videoEl;
    this.stream = null;
  }

  async start() {
    if (this.stream) return;
    this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    this.video.srcObject = this.stream;
  }

  stop() {
    if (!this.stream) return;
    this.stream.getTracks().forEach(t => t.stop());
    this.stream = null;
    this.video.srcObject = null;
  }
}

export class Recorder {
  constructor(canvas, audioStream = null) {
    this.canvas = canvas;
    this.audioStream = audioStream;
    this.recorder = null;
    this.chunks = [];
  }

  start() {
    const stream = this.canvas.captureStream(30);
    if (this.audioStream) {
      this.audioStream.getAudioTracks().forEach(t => stream.addTrack(t));
    }
    this.recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    this.chunks = [];
    this.recorder.ondataavailable = e => { if (e.data.size) this.chunks.push(e.data); };
    this.recorder.onstop = () => {
      const blob = new Blob(this.chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `madameglitch_${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    };
    this.recorder.start();
  }

  stop() {
    if (this.recorder && this.recorder.state === 'recording') this.recorder.stop();
  }

  get isRecording() {
    return this.recorder && this.recorder.state === 'recording';
  }
}

export function downloadCanvas(canvas, prefix = 'shot') {
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = `${prefix}_${Date.now()}.png`;
  a.click();
}

export function fullscreenToggle() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
}
