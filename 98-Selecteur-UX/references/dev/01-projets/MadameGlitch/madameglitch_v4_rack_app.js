// MadameGlitch V4 — Rack Modulaire (COMPLET)
// Core: Three.js + WebAudio + Module System + Câblage + TOUS LES NODES

import * as THREE from "https://unpkg.com/three@0.183.0/build/three.module.js";
import { EffectComposer } from "https://unpkg.com/three@0.183.0/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://unpkg.com/three@0.183.0/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://unpkg.com/three@0.183.0/examples/jsm/postprocessing/UnrealBloomPass.js";

// === STATE ===
const state = {
  rack: { nodes: [], cables: [] },
  audio: { ctx: null, analyser: null },
  three: { renderer: null, scene: null, camera: null, composer: null },
  midi: { access: null, map: {} },
  ws: { socket: null },
  switch: { detected: false, tilt: { x: 0, y: 0 } }
};

// === RACK ===
const rackContainer = document.getElementById("rack-container");
const rackGrid = { cols: 8, rows: 8 };

function initRack() {
  rackContainer.innerHTML = "";
  for (let i = 0; i < rackGrid.cols * rackGrid.rows; i++) {
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.dataset.slot = i;
    slot.textContent = `Slot ${i}`;
    slot.addEventListener("dragover", (e) => e.preventDefault());
    slot.addEventListener("drop", handleDrop);
    rackContainer.appendChild(slot);
  }
}

// === NODES ===
class Node {
  constructor(type, slot) {
    this.type = type;
    this.slot = slot;
    this.inputs = [];
    this.outputs = [];
    this.params = {};
    this.element = null;
  }

  render() {
    const slotEl = document.querySelector(`[data-slot="${this.slot}"]`);
    slotEl.innerHTML = "";

    const nodeEl = document.createElement("div");
    nodeEl.className = "node";
    nodeEl.innerHTML = `
      <h4>${this.type}</h4>
      <div class="node-controls"></div>
      <div class="node-outputs"></div>
      <div class="node-inputs"></div>
    `;

    const controlsEl = nodeEl.querySelector(".node-controls");

    // === NODE TYPES ===
    if (this.type === "deck") {
      this.params = { speed: 1, rotation: 0, glitch: 0, zoom: 1 };
      controlsEl.innerHTML = `
        <label>Speed<input type="range" min="0" max="2" step="0.01" value="1" data-param="speed" /></label>
        <label>Rotation<input type="range" min="0" max="6.28" step="0.01" value="0" data-param="rotation" /></label>
        <label>Glitch<input type="range" min="0" max="1" step="0.01" value="0" data-param="glitch" /></label>
        <label>Zoom<input type="range" min="0.5" max="2" step="0.01" value="1" data-param="zoom" /></label>
      `;
      this.outputs = ["video"];
    } else if (this.type === "mixer") {
      this.params = { crossfader: 0, bass: 0.5, mid: 0.5, treble: 0.5 };
      controlsEl.innerHTML = `
        <label>Crossfader<input type="range" min="0" max="1" step="0.01" value="0" data-param="crossfader" /></label>
        <label>Bass<input type="range" min="0" max="1" step="0.01" value="0.5" data-param="bass" /></label>
        <label>Mid<input type="range" min="0" max="1" step="0.01" value="0.5" data-param="mid" /></label>
        <label>Treble<input type="range" min="0" max="1" step="0.01" value="0.5" data-param="treble" /></label>
      `;
      this.inputs = ["audio", "video"];
      this.outputs = ["audio", "video"];
    } else if (this.type === "fx") {
      this.params = { reverb: 0, delay: 0, filter: 0.5, glitch: 0 };
      controlsEl.innerHTML = `
        <label>Reverb<input type="range" min="0" max="1" step="0.01" value="0" data-param="reverb" /></label>
        <label>Delay<input type="range" min="0" max="1" step="0.01" value="0" data-param="delay" /></label>
        <label>Filter<input type="range" min="0" max="1" step="0.01" value="0.5" data-param="filter" /></label>
        <label>Glitch<input type="range" min="0" max="1" step="0.01" value="0" data-param="glitch" /></label>
      `;
      this.inputs = ["audio", "video"];
      this.outputs = ["audio", "video"];
    } else if (this.type === "timeline") {
      this.params = { duration: 60, currentTime: 0, isPlaying: false };
      controlsEl.innerHTML = `
        <label>Duration<input type="range" min="10" max="120" step="1" value="60" data-param="duration" /></label>
        <button id="timeline-play">▶ Play</button>
        <button id="timeline-stop">⏹ Stop</button>
        <canvas id="timeline-canvas-${this.slot}" width="100" height="40" style="width:100%;margin-top:4px"></canvas>
      `;
      this.outputs = ["param"];
    } else if (this.type === "shader") {
      this.params = { vertex: "", fragment: "" };
      controlsEl.innerHTML = `
        <textarea placeholder="Vertex Shader" style="width:100%;height:60px;font-family:monospace;font-size:10px" data-param="vertex"></textarea>
        <textarea placeholder="Fragment Shader" style="width:100%;height:60px;font-family:monospace;font-size:10px" data-param="fragment"></textarea>
        <button id="shader-apply-${this.slot}">Apply</button>
      `;
      this.inputs = ["video"];
      this.outputs = ["video"];
    } else if (this.type === "presets") {
      this.params = { current: 0 };
      controlsEl.innerHTML = `
        <button id="preset-prev-${this.slot}">⏮</button>
        <button id="preset-next-${this.slot}">⏭</button>
        <div id="preset-list-${this.slot}" style="font-size:9px;margin-top:4px"></div>
      `;
      this.outputs = ["param"];
    } else if (this.type === "midi") {
      this.params = { note: 60, param: "opacity", deck: "a" };
      controlsEl.innerHTML = `
        <label>Note<input type="number" min="0" max="127" value="60" data-param="note" /></label>
        <select data-param="param"><option value="opacity">Opacity</option><option value="speed">Speed</option><option value="rotation">Rotation</option></select>
        <select data-param="deck"><option value="a">Deck A</option><option value="b">Deck B</option></select>
        <button id="midi-map-${this.slot}">Map</button>
      `;
      this.outputs = ["param"];
    } else if (this.type === "websocket") {
      this.params = { url: "ws://localhost:8080" };
      controlsEl.innerHTML = `
        <input type="text" placeholder="ws://localhost:8080" value="ws://localhost:8080" data-param="url" />
        <button id="ws-connect-${this.slot}">Connect</button>
        <div id="ws-status-${this.slot}" style="font-size:9px;margin-top:4px">Disconnected</div>
      `;
      this.inputs = ["param"];
      this.outputs = ["param"];
    } else if (this.type === "switch") {
      this.params = { tiltX: 0, tiltY: 0 };
      controlsEl.innerHTML = `
        <div>Tilt X: <span id="switch-tilt-x-${this.slot}">0</span></div>
        <div>Tilt Y: <span id="switch-tilt-y-${this.slot}">0</span></div>
        <button id="switch-save-${this.slot}">Save</button>
      `;
      this.outputs = ["param"];
    } else if (this.type === "export") {
      this.params = {};
      controlsEl.innerHTML = `
        <button id="export-zip-${this.slot}">ZIP</button>
        <button id="export-webcodecs-${this.slot}">WebCodecs</button>
        <button id="export-gif-${this.slot}">GIF</button>
      `;
      this.inputs = ["video"];
    } else if (this.type === "templates") {
      this.params = { template: "cracktro" };
      controlsEl.innerHTML = `
        <select data-param="template"><option value="cracktro">Cracktro</option><option value="intro">Intro</option><option value="demo">Demo</option></select>
        <button id="templates-load-${this.slot}">Load</button>
      `;
      this.outputs = ["video"];
    } else if (this.type === "plasma" || this.type === "glitch" || this.type === "bloom" || this.type === "crt" || this.type === "kaleidoscope" || this.type === "rotozoomer" || this.type === "sine-scroller" || this.type === "chrome-logo") {
      this.params = { speed: 1, intensity: 0.5 };
      controlsEl.innerHTML = `
        <label>Speed<input type="range" min="0" max="2" step="0.01" value="1" data-param="speed" /></label>
        <label>Intensity<input type="range" min="0" max="1" step="0.01" value="0.5" data-param="intensity" /></label>
      `;
      this.inputs = ["video"];
      this.outputs = ["video"];
    } else if (this.type === "output") {
      this.params = {};
      controlsEl.innerHTML = `<div style="font-size:9px">Output</div>`;
      this.inputs = ["video"];
    }

    // Outputs
    const outputsEl = nodeEl.querySelector(".node-outputs");
    if (this.outputs.includes("audio")) {
      outputsEl.innerHTML += `<div class="output audio" data-output="audio"></div>`;
    }
    if (this.outputs.includes("video")) {
      outputsEl.innerHTML += `<div class="output video" data-output="video"></div>`;
    }
    if (this.outputs.includes("param")) {
      outputsEl.innerHTML += `<div class="output param" data-output="param"></div>`;
    }

    // Inputs
    const inputsEl = nodeEl.querySelector(".node-inputs");
    if (this.inputs.includes("audio")) {
      inputsEl.innerHTML += `<div class="input audio" data-input="audio"></div>`;
    }
    if (this.inputs.includes("video")) {
      inputsEl.innerHTML += `<div class="input video" data-input="video"></div>`;
    }
    if (this.inputs.includes("param")) {
      inputsEl.innerHTML += `<div class="input param" data-input="param"></div>`;
    }

    slotEl.appendChild(nodeEl);
    this.element = nodeEl;

    // Events
    nodeEl.querySelectorAll("input[type='range'], input[type='number'], select, textarea").forEach(input => {
      input.addEventListener("input", (e) => {
        const param = e.target.dataset.param;
        if (param) {
          this.params[param] = e.target.type === "number" ? parseFloat(e.target.value) : e.target.value;
        }
        updateNode(this);
      });
    });

    // Buttons
    const playBtn = nodeEl.querySelector(`#timeline-play`);
    if (playBtn) {
      playBtn.addEventListener("click", () => {
        this.params.isPlaying = true;
        animateTimeline(this);
      });
    }
    const stopBtn = nodeEl.querySelector(`#timeline-stop`);
    if (stopBtn) {
      stopBtn.addEventListener("click", () => {
        this.params.isPlaying = false;
      });
    }
    const applyBtn = nodeEl.querySelector(`#shader-apply-${this.slot}`);
    if (applyBtn) {
      applyBtn.addEventListener("click", () => {
        applyShader(this);
      });
    }
    const mapBtn = nodeEl.querySelector(`#midi-map-${this.slot}`);
    if (mapBtn) {
      mapBtn.addEventListener("click", () => {
        state.midi.map[this.params.note] = { param: this.params.param, deck: this.params.deck };
      });
    }
    const connectBtn = nodeEl.querySelector(`#ws-connect-${this.slot}`);
    if (connectBtn) {
      connectBtn.addEventListener("click", () => {
        state.ws.socket = new WebSocket(this.params.url);
        state.ws.socket.onopen = () => {
          document.getElementById(`ws-status-${this.slot}`).textContent = "Connected";
        };
        state.ws.socket.onmessage = (e) => {
          const data = JSON.parse(e.data);
          console.log("WS message:", data);
        };
        state.ws.socket.onclose = () => {
          document.getElementById(`ws-status-${this.slot}`).textContent = "Disconnected";
        };
      });
    }
    const saveBtn = nodeEl.querySelector(`#switch-save-${this.slot}`);
    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        localStorage.setItem("madameglitch_switch", JSON.stringify(this.params));
      });
    }
    const zipBtn = nodeEl.querySelector(`#export-zip-${this.slot}`);
    if (zipBtn) {
      zipBtn.addEventListener("click", () => {
        exportZIP();
      });
    }
    const webcodecsBtn = nodeEl.querySelector(`#export-webcodecs-${this.slot}`);
    if (webcodecsBtn) {
      webcodecsBtn.addEventListener("click", () => {
        exportWebCodecs();
      });
    }
    const gifBtn = nodeEl.querySelector(`#export-gif-${this.slot}`);
    if (gifBtn) {
      gifBtn.addEventListener("click", () => {
        exportGif();
      });
    }
    const loadBtn = nodeEl.querySelector(`#templates-load-${this.slot}`);
    if (loadBtn) {
      loadBtn.addEventListener("click", () => {
        loadTemplate(this.params.template);
      });
    }
  }
}

function handleDrop(e) {
  e.preventDefault();
  const slot = parseInt(e.target.dataset.slot);
  const nodeType = e.dataTransfer.getData("text/plain");
  const node = new Node(nodeType, slot);
  state.rack.nodes.push(node);
  node.render();
}

// === CABLES ===
const cablesSvg = document.getElementById("cables-svg");
let draggingCable = null;
let cableStart = null;

let tempCableLine = null;

function initCables() {
  document.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("output")) {
      draggingCable = true;
      cableStart = e.target;
      tempCableLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      tempCableLine.setAttribute("stroke", "#888");
      tempCableLine.setAttribute("stroke-width", "2");
      tempCableLine.setAttribute("stroke-dasharray", "4 2");
      cablesSvg.appendChild(tempCableLine);
    }
  });

  document.addEventListener("mousemove", (e) => {
    if (draggingCable && tempCableLine && cableStart) {
      const fromRect = cableStart.getBoundingClientRect();
      tempCableLine.setAttribute("x1", fromRect.left + fromRect.width / 2);
      tempCableLine.setAttribute("y1", fromRect.top + fromRect.height / 2);
      tempCableLine.setAttribute("x2", e.clientX);
      tempCableLine.setAttribute("y2", e.clientY);
    }
  });

  document.addEventListener("mouseup", (e) => {
    if (tempCableLine) { tempCableLine.remove(); tempCableLine = null; }
    if (draggingCable && e.target.classList.contains("input")) {
      const cable = {
        from: cableStart,
        to: e.target,
        type: cableStart.classList.contains("audio") ? "audio" : cableStart.classList.contains("video") ? "video" : "param"
      };
      state.rack.cables.push(cable);
      renderCable(cable);
    }
    draggingCable = null;
    cableStart = null;
  });
}

function renderCable(cable) {
  const fromRect = cable.from.getBoundingClientRect();
  const toRect = cable.to.getBoundingClientRect();

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", fromRect.left + fromRect.width / 2);
  line.setAttribute("y1", fromRect.top + fromRect.height / 2);
  line.setAttribute("x2", toRect.left + toRect.width / 2);
  line.setAttribute("y2", toRect.top + toRect.height / 2);
  line.setAttribute("stroke", cable.type === "audio" ? "#f00" : cable.type === "video" ? "#00f" : "#0f0");
  line.setAttribute("stroke-width", "2");

  cablesSvg.appendChild(line);
}

// === SHADERS ===
const rackVertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const rackFragmentShader = `
  uniform float time;
  uniform vec2 resolution;
  uniform float deckSpeed;
  uniform float deckRotation;
  uniform float deckGlitch;
  uniform float deckZoom;
  uniform float effectMode; // 0 plasma, 1 tunnel, 2 glitch, 3 starfield, 4 rotozoomer, 5 copper, 6 sine, 7 matrix, 8 ansi
  uniform float effectIntensity;
  uniform float mixerCrossfade;
  uniform float fxReverb;
  uniform float fxDelay;
  uniform float fxFilter;
  uniform float fxGlitch;
  varying vec2 vUv;

  float rand(vec2 co){ return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453); }

  void main(){
    vec2 uv = vUv;
    float t = time * deckSpeed;
    float a = deckRotation;
    vec2 rot = vec2(uv.x*cos(a)-uv.y*sin(a), uv.x*sin(a)+uv.y*cos(a));
    uv = mix(uv, rot / deckZoom, 0.5);

    vec3 col = vec3(0.0);
    int mode = int(effectMode + 0.5);

    if(mode == 0){ // plasma
      float c = sin(uv.x*12.0+t)+sin(uv.y*10.0+t*1.3)+sin((uv.x+uv.y)*8.0+t*0.7);
      c = c/3.0*0.5+0.5; col = vec3(c*1.2,c*0.5,c*0.9);
    }
    else if(mode == 1){ // tunnel
      vec2 p = uv*2.0-1.0; float c = 1.0/(length(p)*2.5+0.05); col = vec3(c*0.4,c*0.7,c*1.2);
    }
    else if(mode == 2){ // glitch
      float g = sin(uv.x*80.0+t*20.0)*deckGlitch; float g2 = sin(uv.y*60.0-t*15.0)*deckGlitch;
      col = vec3(fract(uv.x+g+t), fract(uv.y-g2), fract(t*1.3));
    }
    else if(mode == 3){ // starfield
      vec2 p = uv-0.5; float c = 0.0;
      for(float i=0.0;i<30.0;i++){
        float z = fract(i/30.0+t*0.1*effectIntensity);
        float x = fract(sin(i*12.0)*0.5)/z; float y = fract(cos(i*13.0)*0.5)/z;
        float d = length(p-vec2(x,y)*0.3); c += smoothstep(0.02,0.0,d)*z;
      } col = vec3(c);
    }
    else if(mode == 4){ // rotozoomer
      vec2 r = vec2(uv.x*cos(t)-uv.y*sin(t), uv.x*sin(t)+uv.y*cos(t));
      float c = step(0.5, fract(r.x*10.0)) * step(0.5, fract(r.y*10.0));
      col = vec3(c*0.8,c*0.2,c*0.5);
    }
    else if(mode == 5){ // copper
      float c = sin(uv.y*20.0+t)*0.5+0.5; col = vec3(c,c*0.3,c*0.1);
    }
    else if(mode == 6){ // sine
      float wave = sin(uv.x*30.0+t+uv.y*20.0)*0.1;
      float c = smoothstep(0.02,0.0,abs(uv.y-0.5+wave)); col = vec3(0.0,c,0.5);
    }
    else if(mode == 7){ // matrix
      float cols = 40.0; float x = floor(uv.x*cols); float y = fract(uv.y*20.0-t+fract(x*0.3));
      float c = step(0.9,y)*step(fract(sin(x)*43758.0),0.3); col = vec3(0.0,c,0.0);
    }
    else if(mode == 8){ // ansi
      float rows=24.0, cols=40.0; float y=floor(uv.y*rows); float x=floor(uv.x*cols);
      float blink = mod(time*10.0+y*0.7+x*0.3,2.0)>1.0?1.0:0.0; col = vec3(0.0,blink,0.0);
    }

    // FX glitch overlay
    if(fxGlitch > 0.01){
      float rg = rand(uv + time) * fxGlitch;
      col.r = fract(col.r + rg); col.b = fract(col.b - rg);
    }

    // Vignette
    float vig = 1.0 - length(vUv - 0.5) * 0.8;
    col *= vig;

    col *= effectIntensity;
    gl_FragColor = vec4(col, 1.0);
  }
`;

const templates = {
  cracktro: { fs: `uniform float time; uniform vec2 resolution; varying vec2 vUv; void main(){ vec2 uv=vUv; float c=sin(uv.x*20.0+time)*0.5+0.5; gl_FragColor=vec4(c,0.0,c,1.0); }` },
  intro: { fs: `uniform float time; uniform vec2 resolution; varying vec2 vUv; void main(){ vec2 uv=vUv-0.5; float c=1.0/(length(uv)*3.0+0.1); gl_FragColor=vec4(c*0.2,c*0.5,c*1.0,1.0); }` },
  demo: { fs: `uniform float time; uniform vec2 resolution; varying vec2 vUv; void main(){ vec2 uv=vUv; float c=step(0.5,fract(uv.x*10.0+time))*step(0.5,fract(uv.y*10.0)); gl_FragColor=vec4(c,c*0.2,c*0.8,1.0); }` }
};

// === THREE.JS ===
function initThree() {
  const canvas = document.getElementById("canvas-container");
  const w = canvas.clientWidth || 400;
  const h = canvas.clientHeight || 300;
  state.three.renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance", canvas });
  state.three.renderer.setSize(w, h);

  state.three.scene = new THREE.Scene();
  state.three.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(w, h) },
      deckSpeed: { value: 1 },
      deckRotation: { value: 0 },
      deckGlitch: { value: 0 },
      deckZoom: { value: 1 },
      effectMode: { value: 0 },
      effectIntensity: { value: 0.8 },
      mixerCrossfade: { value: 0 },
      fxReverb: { value: 0 },
      fxDelay: { value: 0 },
      fxFilter: { value: 0.5 },
      fxGlitch: { value: 0 }
    },
    vertexShader: rackVertexShader,
    fragmentShader: rackFragmentShader
  });

  const mesh = new THREE.Mesh(geometry, material);
  state.three.scene.add(mesh);
  state.three.material = material;

  state.three.composer = new EffectComposer(state.three.renderer);
  state.three.composer.addPass(new RenderPass(state.three.scene, state.three.camera));

  const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 0.5, 0.4, 0.85);
  state.three.composer.addPass(bloomPass);
}

function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  const dt = (now - lastFrameTime) / 1000;
  lastFrameTime = now;
  if (state.three.material) state.three.material.uniforms.time.value += dt;
  state.three.composer.render();
  const fpsEl = document.getElementById("fps-counter");
  if (fpsEl) fpsEl.textContent = `FPS: ${Math.round(1 / dt)}`;
}
let lastFrameTime = performance.now();

// === NODE PALETTE ===
function initNodePalette() {
  document.querySelectorAll(".palette-node").forEach(nodeEl => {
    nodeEl.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", nodeEl.dataset.node);
    });
    nodeEl.addEventListener("click", () => {
      const emptySlot = Array.from(document.querySelectorAll(".slot")).find(s => !s.querySelector(".node"));
      if (!emptySlot) return;
      const node = new Node(nodeEl.dataset.node, parseInt(emptySlot.dataset.slot));
      state.rack.nodes.push(node);
      node.render();
    });
  });
}

// === EFFECT MAP ===
const effectModes = {
  plasma: 0, tunnel: 1, glitch: 2, starfield: 3, rotozoomer: 4,
  copper: 5, "sine-scroller": 6, matrix: 7, ansi: 8
};

// === HELPERS ===
function updateNode(node) {
  const mat = state.three.material;
  if (!mat) return;

  if (node.type === "deck") {
    mat.uniforms.deckSpeed.value = node.params.speed ?? 1;
    mat.uniforms.deckRotation.value = node.params.rotation ?? 0;
    mat.uniforms.deckGlitch.value = node.params.glitch ?? 0;
    mat.uniforms.deckZoom.value = node.params.zoom ?? 1;
  }
  else if (node.type === "mixer") {
    mat.uniforms.mixerCrossfade.value = node.params.crossfader ?? 0;
    // Map bass/mid/treble to intensity/filter/glitch
    mat.uniforms.effectIntensity.value = 0.5 + (node.params.bass ?? 0.5) * 0.5;
    mat.uniforms.fxFilter.value = node.params.mid ?? 0.5;
    mat.uniforms.fxGlitch.value = node.params.treble ?? 0.5;
  }
  else if (node.type === "fx") {
    mat.uniforms.fxGlitch.value = node.params.glitch ?? 0;
  }
  else if (effectModes[node.type] !== undefined) {
    mat.uniforms.effectMode.value = effectModes[node.type];
    mat.uniforms.effectIntensity.value = node.params.intensity ?? 0.8;
    mat.uniforms.deckSpeed.value = node.params.speed ?? 1;
  }
}

function animateTimeline(node) {
  if (!node.params.isPlaying) return;
  const canvas = document.getElementById(`timeline-canvas-${node.slot}`);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f0f";
  ctx.fillRect(node.params.currentTime % node.params.duration, 0, 2, canvas.height);
  node.params.currentTime += 0.016;
  requestAnimationFrame(() => animateTimeline(node));
}

function applyShader(node) {
  const mat = state.three.material;
  if (!mat) return;
  const vs = node.params.vertex || rackVertexShader;
  const fs = node.params.fragment || rackFragmentShader;
  try {
    const newMat = new THREE.ShaderMaterial({
      uniforms: mat.uniforms,
      vertexShader: vs,
      fragmentShader: fs
    });
    state.three.scene.children[0].material = newMat;
    state.three.material = newMat;
  } catch (err) {
    console.error("Shader compile error:", err);
    alert("Shader compile error: " + err.message);
  }
}

function exportZIP() {
  // Export as standalone HTML since JSZip is not loaded
  const html = document.documentElement.outerHTML;
  const blob = new Blob([html], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "madameglitch-v4-rack-standalone.html";
  a.click();
}

function exportWebCodecs() {
  const canvas = document.getElementById("canvas-container");
  const stream = canvas.captureStream(60);
  const opts = { mimeType: "video/webm;codecs=vp9" };
  if (!MediaRecorder.isTypeSupported(opts.mimeType)) opts.mimeType = "video/webm";
  const recorder = new MediaRecorder(stream, opts);
  const chunks = [];
  recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "madameglitch-v4-rack.webm";
    a.click();
  };
  recorder.start(100);
  setTimeout(() => recorder.stop(), 5000);
  alert("Recording 5 seconds...");
}

function exportGif() {
  alert("Export GIF requires gif.js library. Use WebM export instead.");
}

function loadTemplate(template) {
  const t = templates[template];
  if (!t) return;
  const mat = state.three.material;
  if (!mat) return;
  try {
    const newMat = new THREE.ShaderMaterial({
      uniforms: mat.uniforms,
      vertexShader: rackVertexShader,
      fragmentShader: t.fs
    });
    state.three.scene.children[0].material = newMat;
    state.three.material = newMat;
  } catch (err) {
    console.error("Template shader error:", err);
  }
}

// === EVENTS ===
document.getElementById("btn-new-rack").addEventListener("click", () => {
  state.rack.nodes = [];
  state.rack.cables = [];
  initRack();
  cablesSvg.innerHTML = "";
});

document.getElementById("btn-save-rack").addEventListener("click", () => {
  const rackData = {
    nodes: state.rack.nodes.map(n => ({ type: n.type, slot: n.slot, params: n.params })),
    cables: state.rack.cables.map(c => ({ from: c.from.dataset.slot, to: c.to.dataset.slot, type: c.type }))
  };
  localStorage.setItem("madameglitch_rack", JSON.stringify(rackData));
  alert("Rack saved!");
});

document.getElementById("btn-load-rack").addEventListener("click", () => {
  const rackData = JSON.parse(localStorage.getItem("madameglitch_rack"));
  if (rackData) {
    state.rack.nodes = rackData.nodes.map(n => {
      const node = new Node(n.type, n.slot);
      node.params = n.params;
      return node;
    });
    state.rack.cables = rackData.cables;
    initRack();
    state.rack.nodes.forEach(node => node.render());
    cablesSvg.innerHTML = "";
    state.rack.cables.forEach(cable => renderCable(cable));
  }
});

document.getElementById("btn-export").addEventListener("click", () => {
  alert("Export: ZIP, WebCodecs, gif.js — à implmenter");
});

// === INIT ===
initRack();
initCables();
initThree();
initNodePalette();
animate();
