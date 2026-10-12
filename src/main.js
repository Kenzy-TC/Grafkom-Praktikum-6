import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import './style.css';

// -----------------------------------------------------------------------------
// Pertemuan 6 — Mini 3D Scene. All challenges A–H are included below.
// A: extra geometry | B: material gallery | C: orthographic camera
// D: moving directional light | E: shadow quality | F: scene HUD
// G: pause/resume | H: continuous cube controls
// -----------------------------------------------------------------------------

const app = document.querySelector('#app');
const toast = document.querySelector('#toast');
const info = {
  camera: document.querySelector('#cameraStat'),
  objects: document.querySelector('#objectStat'),
  triangles: document.querySelector('#triangleStat'),
  fps: document.querySelector('#fpsStat'),
  material: document.querySelector('#materialStat'),
  shadow: document.querySelector('#shadowStat'),
  position: document.querySelector('#positionStat'),
  animation: document.querySelector('#animationStat'),
};

// Scene -----------------------------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x07111f);

const sizes = { width: window.innerWidth, height: window.innerHeight };
const initialTarget = new THREE.Vector3(0, 0.65, 0);
const initialPerspectivePosition = new THREE.Vector3(8, 7, 11);
const orthographicFrustum = 10;

// Camera: PerspectiveCamera + Challenge C OrthographicCamera ------------------
const perspectiveCamera = new THREE.PerspectiveCamera(
  60,
  sizes.width / sizes.height,
  0.1,
  100,
);
perspectiveCamera.position.copy(initialPerspectivePosition);
perspectiveCamera.lookAt(initialTarget);

const aspect = sizes.width / sizes.height;
const orthographicCamera = new THREE.OrthographicCamera(
  (-orthographicFrustum * aspect) / 2,
  (orthographicFrustum * aspect) / 2,
  orthographicFrustum / 2,
  -orthographicFrustum / 2,
  0.1,
  100,
);
orthographicCamera.position.copy(initialPerspectivePosition);
orthographicCamera.lookAt(initialTarget);
scene.add(perspectiveCamera, orthographicCamera);
let activeCamera = perspectiveCamera;

// Renderer --------------------------------------------------------------------
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.domElement.setAttribute('aria-label', 'Interactive Three.js 3D scene');
renderer.domElement.tabIndex = 0;
app.prepend(renderer.domElement);

// OrbitControls: orbit, zoom, pan, damping, and reset support ------------------
let controls;
function attachControls(camera, target = initialTarget) {
  if (controls) controls.dispose();
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(target);
  controls.enableDamping = true;
  controls.dampingFactor = 0.075;
  controls.enablePan = true;
  controls.enableZoom = true;
  controls.minDistance = 3.5;
  controls.maxDistance = 24;
  controls.maxPolarAngle = Math.PI * 0.485;
  controls.update();
  controls.saveState();
}
attachControls(activeCamera, initialTarget);

// Reusable materials ----------------------------------------------------------
const cubeLambertMaterial = new THREE.MeshLambertMaterial({ color: 0x2dd4bf });
const cubeBasicMaterial = new THREE.MeshBasicMaterial({ color: 0x2dd4bf });
let cubeUsesLambert = true;

// Main cube -------------------------------------------------------------------
const cubeGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
const cube = new THREE.Mesh(cubeGeometry, cubeLambertMaterial);
cube.name = 'Controllable Cube';
cube.position.set(-1.35, 0.66, 0.15);
cube.rotation.set(0.15, 0.25, 0);
cube.scale.set(1.0, 1.0, 1.0);
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);

// Main sphere -----------------------------------------------------------------
const sphereGeometry = new THREE.SphereGeometry(0.72, 32, 20);
const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x508dff, shininess: 70 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.name = 'Animated Sphere';
sphere.position.set(1.25, 0.76, 0.1);
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);
const sphereBaseY = 0.76;

// Ground ----------------------------------------------------------------------
const groundGeometry = new THREE.PlaneGeometry(18, 14);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x1b2b40 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.name = 'Ground';
ground.position.y = 0;
ground.receiveShadow = true;
scene.add(ground);

// Challenge A — extra geometry: CylinderGeometry, ConeGeometry, TorusGeometry --
const cylinder = new THREE.Mesh(
  new THREE.CylinderGeometry(0.42, 0.42, 1.3, 32),
  new THREE.MeshPhongMaterial({ color: 0xf59e0b, shininess: 45 }),
);
cylinder.name = 'Challenge A Cylinder';
cylinder.position.set(-4.2, 0.66, -1.6);
cylinder.rotation.y = 0.35;
cylinder.castShadow = true;
cylinder.receiveShadow = true;
scene.add(cylinder);

const cone = new THREE.Mesh(
  new THREE.ConeGeometry(0.55, 1.25, 32),
  new THREE.MeshLambertMaterial({ color: 0xfb7185 }),
);
cone.name = 'Challenge A Cone';
cone.position.set(4.15, 0.63, -1.6);
cone.rotation.y = -0.25;
cone.castShadow = true;
cone.receiveShadow = true;
scene.add(cone);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.53, 0.17, 16, 48),
  new THREE.MeshPhongMaterial({ color: 0xc084fc, shininess: 85 }),
);
torus.name = 'Challenge A Torus';
torus.position.set(0, 0.77, -2.5);
torus.rotation.x = Math.PI / 2;
torus.rotation.z = 0.25;
torus.castShadow = true;
torus.receiveShadow = true;
scene.add(torus);

// Challenge B — same geometry, four different materials -----------------------
const galleryGeometry = new THREE.SphereGeometry(0.36, 24, 16);
const galleryEntries = [
  { name: 'Basic', material: new THREE.MeshBasicMaterial({ color: 0x22d3ee }), x: -3.5 },
  { name: 'Normal', material: new THREE.MeshNormalMaterial(), x: -1.2 },
  { name: 'Lambert', material: new THREE.MeshLambertMaterial({ color: 0x86efac }), x: 1.2 },
  { name: 'Phong', material: new THREE.MeshPhongMaterial({ color: 0xf0abfc, shininess: 90 }), x: 3.5 },
];
for (const entry of galleryEntries) {
  const sample = new THREE.Mesh(galleryGeometry, entry.material);
  sample.name = `Material Gallery — ${entry.name}`;
  sample.position.set(entry.x, 0.38, -4.6);
  sample.castShadow = true;
  sample.receiveShadow = true;
  scene.add(sample);
}

// Lights + Challenge D moving light marker ------------------------------------
const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
ambientLight.name = 'AmbientLight';
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.8);
directionalLight.name = 'Animated DirectionalLight';
directionalLight.position.set(3.8, 5.5, 2.5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 24;
directionalLight.shadow.bias = -0.00015;
directionalLight.shadow.normalBias = 0.025;
scene.add(directionalLight);
scene.add(directionalLight.target);

const lightMarker = new THREE.Mesh(
  new THREE.SphereGeometry(0.12, 16, 12),
  new THREE.MeshBasicMaterial({ color: 0xfff2a6 }),
);
lightMarker.name = 'Moving Light Marker';
lightMarker.position.copy(directionalLight.position);
lightMarker.castShadow = false;
lightMarker.receiveShadow = false;
scene.add(lightMarker);

// Challenge E — shadow-map quality selection ---------------------------------
let shadowQuality = 1024;
function setShadowQuality(size) {
  shadowQuality = Number(size);
  if (directionalLight.shadow.map) {
    directionalLight.shadow.map.dispose();
    directionalLight.shadow.map = null;
  }
  directionalLight.shadow.mapSize.set(shadowQuality, shadowQuality);
  directionalLight.shadow.needsUpdate = true;
  document.querySelectorAll('.quality-button').forEach((button) => {
    button.classList.toggle('active', Number(button.dataset.quality) === shadowQuality);
    button.setAttribute('aria-pressed', String(Number(button.dataset.quality) === shadowQuality));
  });
  info.shadow.textContent = `${shadowQuality} × ${shadowQuality}`;
  showToast(`Shadow map: ${shadowQuality} × ${shadowQuality}`);
}
document.querySelectorAll('.quality-button').forEach((button) => {
  button.addEventListener('click', () => setShadowQuality(button.dataset.quality));
});

// Challenge C — switch active camera and rebuild controls cleanly --------------
function updateCameraButton() {
  const name = activeCamera === perspectiveCamera ? 'Perspective' : 'Orthographic';
  document.querySelector('#camera-button').textContent = `Camera: ${name} (P)`;
  info.camera.textContent = name;
}
function switchCamera() {
  const oldTarget = controls.target.clone();
  const nextCamera = activeCamera === perspectiveCamera ? orthographicCamera : perspectiveCamera;
  nextCamera.position.copy(activeCamera.position);
  nextCamera.quaternion.copy(activeCamera.quaternion);
  nextCamera.zoom = 1;
  if (nextCamera === perspectiveCamera) nextCamera.fov = 60;
  nextCamera.updateProjectionMatrix();
  activeCamera = nextCamera;
  attachControls(activeCamera, oldTarget);
  updateCameraButton();
  showToast(`${activeCamera === perspectiveCamera ? 'Perspective' : 'Orthographic'} camera`);
}
function resetCamera() {
  activeCamera = perspectiveCamera;
  perspectiveCamera.position.copy(initialPerspectivePosition);
  perspectiveCamera.fov = 60;
  perspectiveCamera.zoom = 1;
  perspectiveCamera.updateProjectionMatrix();
  orthographicCamera.position.copy(initialPerspectivePosition);
  orthographicCamera.zoom = 1;
  orthographicCamera.updateProjectionMatrix();
  attachControls(perspectiveCamera, initialTarget);
  updateCameraButton();
  showToast('Camera reset to initial Perspective view');
}
document.querySelector('#camera-button').addEventListener('click', switchCamera);
document.querySelector('#reset-camera-button').addEventListener('click', resetCamera);

// Challenge G — pause/resume animation ---------------------------------------
let animationEnabled = true;
function setAnimationEnabled(enabled) {
  animationEnabled = enabled;
  document.querySelector('#animation-button').textContent = animationEnabled
    ? 'Pause animation (Space)'
    : 'Resume animation (Space)';
  info.animation.textContent = animationEnabled ? 'Running' : 'Paused';
  showToast(animationEnabled ? 'Animation resumed' : 'Animation paused');
}
document.querySelector('#animation-button').addEventListener('click', () => {
  setAnimationEnabled(!animationEnabled);
});

// Main cube material toggle (helps compare lighting-dependent and basic material)
function toggleCubeMaterial() {
  cubeUsesLambert = !cubeUsesLambert;
  cube.material = cubeUsesLambert ? cubeLambertMaterial : cubeBasicMaterial;
  document.querySelector('#material-button').textContent = `Cube material: ${cubeUsesLambert ? 'Lambert' : 'Basic'} (M)`;
  info.material.textContent = cubeUsesLambert ? 'Lambert' : 'Basic';
  showToast(`Cube material: ${cubeUsesLambert ? 'MeshLambertMaterial' : 'MeshBasicMaterial'}`);
}
document.querySelector('#material-button').addEventListener('click', toggleCubeMaterial);

// Keyboard state — Challenge H uses state-based input + delta time -------------
const pressedKeys = new Set();
function isTypingTarget(target) {
  return target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(target.tagName);
}
window.addEventListener('keydown', (event) => {
  if (isTypingTarget(event.target)) return;
  const supported = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyQ', 'KeyE'];
  if (supported.includes(event.code)) {
    pressedKeys.add(event.code);
    event.preventDefault();
  }
  if (event.repeat) return;
  if (event.code === 'KeyP') switchCamera();
  if (event.code === 'KeyR') resetCamera();
  if (event.code === 'Space') {
    event.preventDefault();
    setAnimationEnabled(!animationEnabled);
  }
  if (event.code === 'KeyM') toggleCubeMaterial();
});
window.addEventListener('keyup', (event) => pressedKeys.delete(event.code));
window.addEventListener('blur', () => pressedKeys.clear());

// Challenge F — HUD statistics, including renderer.info triangles and FPS ------
function countMeshes() {
  let count = 0;
  scene.traverse((object) => { if (object.isMesh) count += 1; });
  return count;
}
let fpsFrameCount = 0;
let fpsElapsed = 0;
let fps = 0;
let hudElapsed = 0;
function updateHUD() {
  info.objects.textContent = String(countMeshes());
  info.triangles.textContent = renderer.info.render.triangles.toLocaleString();
  info.fps.textContent = fps ? String(fps) : '—';
  info.position.textContent = `${activeCamera.position.x.toFixed(1)}, ${activeCamera.position.y.toFixed(1)}, ${activeCamera.position.z.toFixed(1)}`;
  info.material.textContent = cubeUsesLambert ? 'Lambert' : 'Basic';
  info.animation.textContent = animationEnabled ? 'Running' : 'Paused';
}

// Toast feedback --------------------------------------------------------------
let toastTimeout;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove('visible'), 1400);
}

// Responsive rendering — update both projection matrices on every resize ------
function handleResize() {
  sizes.width = window.innerWidth;
  sizes.height = Math.max(1, window.innerHeight);
  const nextAspect = sizes.width / sizes.height;

  perspectiveCamera.aspect = nextAspect;
  perspectiveCamera.updateProjectionMatrix();

  orthographicCamera.left = (-orthographicFrustum * nextAspect) / 2;
  orthographicCamera.right = (orthographicFrustum * nextAspect) / 2;
  orthographicCamera.top = orthographicFrustum / 2;
  orthographicCamera.bottom = -orthographicFrustum / 2;
  orthographicCamera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
}
window.addEventListener('resize', handleResize);

// Animation loop — camera controls continue to work while objects are paused --
const clock = new THREE.Clock();
let elapsed = 0;
function animate() {
  requestAnimationFrame(animate);
  const rawDelta = clock.getDelta();
  const delta = Math.min(rawDelta, 0.05);
  controls.update();

  if (animationEnabled) {
    elapsed += delta;
    cube.rotation.x += 0.28 * delta;
    cube.rotation.y += 0.8 * delta;
    sphere.rotation.y += 0.5 * delta;
    sphere.position.y = sphereBaseY + Math.sin(elapsed * 2) * 0.15;
    torus.rotation.z += 0.25 * delta;

    // Challenge D: the directional light moves around the scene; marker follows it.
    directionalLight.position.set(
      Math.cos(elapsed * 0.55) * 4.5,
      5.5,
      Math.sin(elapsed * 0.55) * 4.5,
    );
    lightMarker.position.copy(directionalLight.position);
    directionalLight.target.position.set(0, 0.4, 0);
  }

  // Challenge H: continuous translation/rotation controlled by held keys.
  const moveSpeed = 2.4 * delta;
  const rotateSpeed = 1.8 * delta;
  if (pressedKeys.has('ArrowLeft')) cube.position.x -= moveSpeed;
  if (pressedKeys.has('ArrowRight')) cube.position.x += moveSpeed;
  if (pressedKeys.has('ArrowUp')) cube.position.z -= moveSpeed;
  if (pressedKeys.has('ArrowDown')) cube.position.z += moveSpeed;
  if (pressedKeys.has('KeyQ')) cube.rotation.y -= rotateSpeed;
  if (pressedKeys.has('KeyE')) cube.rotation.y += rotateSpeed;

  // Measure FPS without tying object speed to frame count.
  fpsFrameCount += 1;
  fpsElapsed += rawDelta;
  if (fpsElapsed >= 0.5) {
    fps = Math.round(fpsFrameCount / fpsElapsed);
    fpsFrameCount = 0;
    fpsElapsed = 0;
  }

  renderer.render(scene, activeCamera);
  hudElapsed += rawDelta;
  if (hudElapsed >= 0.25) {
    updateHUD();
    hudElapsed = 0;
  }
}

updateCameraButton();
setShadowQuality(1024);
updateHUD();
animate();
