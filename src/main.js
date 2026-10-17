import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import './style.css';

// -----------------------------------------------------------------------------
// Three.js Mini 3D Scene — Pertemuan 6
// -----------------------------------------------------------------------------

const app = document.querySelector('#app');
const canvasFrame = document.querySelector('.canvas-frame');
const toast = document.querySelector('#toast');
const $ = (selector) => document.querySelector(selector);
const info = {
  camera: $('#cameraStat'),
  objects: $('#objectStat'),
  triangles: $('#triangleStat'),
  fps: $('#fpsStat'),
  material: $('#materialStat'),
  shadow: $('#shadowStat'),
  position: $('#positionStat'),
  animation: $('#animationStat'),
};

// Scene -----------------------------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x07111f);
const sizes = { width: window.innerWidth, height: window.innerHeight };
const initialTarget = new THREE.Vector3(0, 0.65, 0);
const initialPerspectivePosition = new THREE.Vector3(8, 7, 11);
const orthographicFrustum = 10;

// Camera: Perspective + Orthographic ------------------------------------------
const perspectiveCamera = new THREE.PerspectiveCamera(
  60, sizes.width / Math.max(1, sizes.height), 0.1, 100,
);
perspectiveCamera.position.copy(initialPerspectivePosition);
perspectiveCamera.lookAt(initialTarget);

const initialAspect = sizes.width / Math.max(1, sizes.height);
const orthographicCamera = new THREE.OrthographicCamera(
  (-orthographicFrustum * initialAspect) / 2,
  (orthographicFrustum * initialAspect) / 2,
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
canvasFrame.append(renderer.domElement);

// OrbitControls configuration is stored separately so it survives camera swap.
const orbitSettings = {
  enabled: true,
  allowPan: true,
  damping: true,
  dampingFactor: 0.075,
  rotateSpeed: 1,
  zoomSpeed: 1,
};
let controls;
function attachControls(camera, target = initialTarget) {
  if (controls) controls.dispose();
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(target);
  controls.enabled = orbitSettings.enabled;
  controls.enablePan = orbitSettings.allowPan;
  controls.enableDamping = orbitSettings.damping;
  controls.dampingFactor = orbitSettings.dampingFactor;
  controls.rotateSpeed = orbitSettings.rotateSpeed;
  controls.zoomSpeed = orbitSettings.zoomSpeed;
  controls.enableZoom = true;
  controls.minDistance = 3.5;
  controls.maxDistance = 24;
  controls.maxPolarAngle = Math.PI * 0.485;
  controls.update();
  controls.saveState();
  syncOrbitControlsUI();
}

// Shared geometry/materials ----------------------------------------------------
const cubeLambertMaterial = new THREE.MeshLambertMaterial({ color: 0x2dd4bf });
const cubeBasicMaterial = new THREE.MeshBasicMaterial({ color: 0x2dd4bf });
let cubeUsesLambert = true;

// Main controllable cube -------------------------------------------------------
const cubeGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
const cube = new THREE.Mesh(cubeGeometry, cubeLambertMaterial);
cube.name = 'Controllable Cube';
cube.position.set(-1.35, 0.66, 0.15);
cube.rotation.set(0.15, 0.25, 0);
cube.scale.set(1, 1, 1);
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);

// Main sphere -----------------------------------------------------------------
let sphereGeometry = new THREE.SphereGeometry(0.72, 32, 20);
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

// Challenge A — extra geometry: Cylinder, Cone, and Torus ----------------------
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

// Geometry playground — selectable geometry + detail and scale sliders --------
const geometryLabMaterial = new THREE.MeshPhongMaterial({ color: 0x38bdf8, shininess: 75 });
let geometryLabType = 'sphere';
let geometryLabDetail = 24;
let geometryLabScale = 1;
function buildPlaygroundGeometry(type, detail) {
  const segments = Math.max(8, Math.min(48, Number(detail) || 24));
  switch (type) {
    case 'box': {
      const subdivisions = Math.max(1, Math.min(6, Math.floor(segments / 8)));
      return new THREE.BoxGeometry(1.05, 1.05, 1.05, subdivisions, subdivisions, subdivisions);
    }
    case 'cylinder':
      return new THREE.CylinderGeometry(0.52, 0.52, 1.15, segments);
    case 'cone':
      return new THREE.ConeGeometry(0.6, 1.25, segments);
    case 'torus':
      return new THREE.TorusGeometry(0.55, 0.19, Math.max(6, Math.floor(segments / 2)), segments);
    case 'sphere':
    default:
      return new THREE.SphereGeometry(0.64, segments, Math.max(4, Math.floor(segments / 2)));
  }
}
const geometryLab = new THREE.Mesh(buildPlaygroundGeometry(geometryLabType, geometryLabDetail), geometryLabMaterial);
geometryLab.name = 'Geometry Playground';
geometryLab.position.set(-5.45, 0.8, 1.55);
geometryLab.castShadow = true;
geometryLab.receiveShadow = true;
geometryLab.scale.setScalar(geometryLabScale);
scene.add(geometryLab);
function updateGeometryLab() {
  const replacement = buildPlaygroundGeometry(geometryLabType, geometryLabDetail);
  geometryLab.geometry.dispose();
  geometryLab.geometry = replacement;
  geometryLab.scale.setScalar(geometryLabScale);
  // A torus looks clearer when tilted slightly toward the camera.
  geometryLab.rotation.set(geometryLabType === 'torus' ? 0.35 : 0, 0.25, 0);
  $('#geometry-detail-value').textContent = String(geometryLabDetail);
  $('#geometry-scale-value').textContent = `${geometryLabScale.toFixed(2)}×`;
  showToast(`Geometry Playground: ${geometryLabType} · detail ${geometryLabDetail}`);
}
$('#geometry-type').addEventListener('change', (event) => {
  geometryLabType = event.target.value;
  updateGeometryLab();
});
$('#geometry-detail-slider').addEventListener('input', (event) => {
  geometryLabDetail = Number(event.target.value);
  updateGeometryLab();
});
$('#geometry-scale-slider').addEventListener('input', (event) => {
  geometryLabScale = Number(event.target.value);
  geometryLab.scale.setScalar(geometryLabScale);
  $('#geometry-scale-value').textContent = `${geometryLabScale.toFixed(2)}×`;
});

// Challenge B — Material Gallery grouped so it can be toggled ------------------
const galleryGroup = new THREE.Group();
galleryGroup.name = 'Material Gallery';
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
  galleryGroup.add(sample);
}
scene.add(galleryGroup);
let galleryVisible = true;
function setGalleryVisible(visible, notify = true) {
  galleryVisible = visible;
  galleryGroup.visible = visible;
  $('#gallery-button').textContent = visible ? 'Hide material gallery' : 'Show material gallery';
  $('#gallery-button').setAttribute('aria-pressed', String(visible));
  $('#gallery-note').hidden = !visible;
  if (notify) showToast(visible ? 'Material Gallery shown' : 'Material Gallery hidden');
}
$('#gallery-button').addEventListener('click', () => setGalleryVisible(!galleryVisible));

// Lights ----------------------------------------------------------------------
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
directionalLight.shadow.camera.updateProjectionMatrix();
directionalLight.shadow.bias = -0.00015;
directionalLight.shadow.normalBias = 0.025;
scene.add(directionalLight, directionalLight.target);

const lightMarker = new THREE.Mesh(
  new THREE.SphereGeometry(0.12, 16, 12),
  new THREE.MeshBasicMaterial({ color: 0xfff2a6 }),
);
lightMarker.name = 'Moving Light Marker';
lightMarker.position.copy(directionalLight.position);
lightMarker.castShadow = false;
lightMarker.receiveShadow = false;
scene.add(lightMarker);

// Toggleable light helpers: directional light + shadow camera frustum ----------
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.8, 0xffe39a);
const shadowCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
directionalLightHelper.visible = false;
shadowCameraHelper.visible = false;
scene.add(directionalLightHelper, shadowCameraHelper);
let lightHelpersVisible = false;
function setLightHelpersVisible(visible, notify = true) {
  lightHelpersVisible = visible;
  directionalLightHelper.visible = visible;
  shadowCameraHelper.visible = visible;
  $('#helpers-button').textContent = visible ? 'Hide light helpers' : 'Show light helpers';
  $('#helpers-button').setAttribute('aria-pressed', String(visible));
  directionalLightHelper.update();
  shadowCameraHelper.update();
  if (notify) showToast(visible ? 'Light helpers enabled' : 'Light helpers hidden');
}
$('#helpers-button').addEventListener('click', () => setLightHelpersVisible(!lightHelpersVisible));

let lightOrbitEnabled = true;
function setLightOrbitEnabled(enabled, notify = true) {
  lightOrbitEnabled = enabled;
  $('#light-orbit-button').textContent = `Light orbit: ${enabled ? 'ON' : 'OFF'}`;
  $('#light-orbit-button').setAttribute('aria-pressed', String(enabled));
  if (notify) showToast(enabled ? 'Directional light orbit enabled' : 'Directional light orbit paused');
}
$('#light-orbit-button').addEventListener('click', () => setLightOrbitEnabled(!lightOrbitEnabled));

// FOV and lighting intensity sliders ------------------------------------------
const fovSlider = $('#fov-slider');
function syncFOVUI() {
  fovSlider.value = String(perspectiveCamera.fov);
  $('#fov-value').textContent = `${Math.round(perspectiveCamera.fov)}°`;
  fovSlider.disabled = activeCamera !== perspectiveCamera;
  $('#fov-hint').textContent = activeCamera === perspectiveCamera
    ? 'FOV mengubah sudut pandang Perspective Camera.'
    : 'Aktifkan Perspective Camera untuk mengubah FOV.';
}
fovSlider.addEventListener('input', (event) => {
  perspectiveCamera.fov = Number(event.target.value);
  perspectiveCamera.updateProjectionMatrix();
  $('#fov-value').textContent = `${perspectiveCamera.fov}°`;
});

$('#light-intensity-slider').addEventListener('input', (event) => {
  directionalLight.intensity = Number(event.target.value);
  $('#light-intensity-value').textContent = directionalLight.intensity.toFixed(1);
});
$('#ambient-intensity-slider').addEventListener('input', (event) => {
  ambientLight.intensity = Number(event.target.value);
  $('#ambient-intensity-value').textContent = ambientLight.intensity.toFixed(2).replace(/0$/, '');
});

// OrbitControls · Camera UI ----------------------------------------------------
function syncOrbitControlsUI() {
  $('#orbit-enabled').checked = orbitSettings.enabled;
  $('#orbit-pan').checked = orbitSettings.allowPan;
  $('#orbit-damping').checked = orbitSettings.damping;
  $('#damping-factor-slider').value = String(orbitSettings.dampingFactor);
  $('#damping-factor-value').textContent = orbitSettings.dampingFactor.toFixed(3);
  $('#rotate-speed-slider').value = String(orbitSettings.rotateSpeed);
  $('#rotate-speed-value').textContent = `${orbitSettings.rotateSpeed.toFixed(1)}×`;
  $('#zoom-speed-slider').value = String(orbitSettings.zoomSpeed);
  $('#zoom-speed-value').textContent = `${orbitSettings.zoomSpeed.toFixed(1)}×`;
}
function applyOrbitSettings() {
  if (!controls) return;
  controls.enabled = orbitSettings.enabled;
  controls.enablePan = orbitSettings.allowPan;
  controls.enableDamping = orbitSettings.damping;
  controls.dampingFactor = orbitSettings.dampingFactor;
  controls.rotateSpeed = orbitSettings.rotateSpeed;
  controls.zoomSpeed = orbitSettings.zoomSpeed;
}
$('#orbit-enabled').addEventListener('change', (event) => {
  orbitSettings.enabled = event.target.checked;
  applyOrbitSettings();
  showToast(orbitSettings.enabled ? 'Camera controls enabled' : 'Camera controls disabled');
});
$('#orbit-pan').addEventListener('change', (event) => {
  orbitSettings.allowPan = event.target.checked;
  applyOrbitSettings();
  showToast(orbitSettings.allowPan ? 'Camera pan allowed' : 'Camera pan disabled');
});
$('#orbit-damping').addEventListener('change', (event) => {
  orbitSettings.damping = event.target.checked;
  applyOrbitSettings();
  showToast(orbitSettings.damping ? 'Orbit damping enabled' : 'Orbit damping disabled');
});
$('#damping-factor-slider').addEventListener('input', (event) => {
  orbitSettings.dampingFactor = Number(event.target.value);
  $('#damping-factor-value').textContent = orbitSettings.dampingFactor.toFixed(3);
  applyOrbitSettings();
});
$('#rotate-speed-slider').addEventListener('input', (event) => {
  orbitSettings.rotateSpeed = Number(event.target.value);
  $('#rotate-speed-value').textContent = `${orbitSettings.rotateSpeed.toFixed(1)}×`;
  applyOrbitSettings();
});
$('#zoom-speed-slider').addEventListener('input', (event) => {
  orbitSettings.zoomSpeed = Number(event.target.value);
  $('#zoom-speed-value').textContent = `${orbitSettings.zoomSpeed.toFixed(1)}×`;
  applyOrbitSettings();
});

// Challenge E — shadow-map quality --------------------------------------------
let shadowQuality = 1024;
function setShadowQuality(size, notify = true) {
  shadowQuality = Number(size);
  if (directionalLight.shadow.map) {
    directionalLight.shadow.map.dispose();
    directionalLight.shadow.map = null;
  }
  directionalLight.shadow.mapSize.set(shadowQuality, shadowQuality);
  directionalLight.shadow.needsUpdate = true;
  document.querySelectorAll('.quality-button').forEach((button) => {
    const isActive = Number(button.dataset.quality) === shadowQuality;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
  info.shadow.textContent = `${shadowQuality} × ${shadowQuality}`;
  if (notify) showToast(`Shadow map: ${shadowQuality} × ${shadowQuality}`);
}
document.querySelectorAll('.quality-button').forEach((button) => {
  button.addEventListener('click', () => setShadowQuality(button.dataset.quality));
});

// Challenge C — camera switching and reset ------------------------------------
function updateCameraButton() {
  const name = activeCamera === perspectiveCamera ? 'Perspective' : 'Orthographic';
  $('#camera-button').textContent = `Camera: ${name} (P)`;
  info.camera.textContent = name;
  syncFOVUI();
}
function switchCamera() {
  const oldTarget = controls.target.clone();
  const nextCamera = activeCamera === perspectiveCamera ? orthographicCamera : perspectiveCamera;
  nextCamera.position.copy(activeCamera.position);
  nextCamera.quaternion.copy(activeCamera.quaternion);
  nextCamera.zoom = 1;
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
$('#camera-button').addEventListener('click', switchCamera);
$('#reset-camera-button').addEventListener('click', resetCamera);

// Challenge G — pause/resume object and light animation ------------------------
let animationEnabled = true;
function setAnimationEnabled(enabled) {
  animationEnabled = enabled;
  $('#animation-button').textContent = animationEnabled ? 'Pause animation (Space)' : 'Resume animation (Space)';
  info.animation.textContent = animationEnabled ? 'Running' : 'Paused';
  showToast(animationEnabled ? 'Animation resumed' : 'Animation paused');
}
$('#animation-button').addEventListener('click', () => setAnimationEnabled(!animationEnabled));

// Main cube material toggle ----------------------------------------------------
function toggleCubeMaterial() {
  cubeUsesLambert = !cubeUsesLambert;
  cube.material = cubeUsesLambert ? cubeLambertMaterial : cubeBasicMaterial;
  $('#material-button').textContent = `Cube material: ${cubeUsesLambert ? 'Lambert' : 'Basic'} (M)`;
  info.material.textContent = cubeUsesLambert ? 'Lambert' : 'Basic';
  showToast(`Cube material: ${cubeUsesLambert ? 'MeshLambertMaterial' : 'MeshBasicMaterial'}`);
}
$('#material-button').addEventListener('click', toggleCubeMaterial);

// Keyboard input — Challenge H continuous cube movement/rotation ---------------
const pressedKeys = new Set();
function isTypingTarget(target) {
  return target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT|BUTTON|SUMMARY)$/.test(target.tagName);
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

// Challenge F — HUD statistics -------------------------------------------------
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
  toastTimeout = window.setTimeout(() => toast.classList.remove('visible'), 1500);
}

// Responsive rendering — refresh both camera projection matrices --------------
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

// Animation loop — camera remains navigable while objects are paused ------------
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

    if (lightOrbitEnabled) {
      directionalLight.position.set(
        Math.cos(elapsed * 0.55) * 4.5,
        5.5,
        Math.sin(elapsed * 0.55) * 4.5,
      );
      lightMarker.position.copy(directionalLight.position);
      directionalLight.target.position.set(0, 0.4, 0);
    }
  }

  // Challenge H: delta-time-based continuous input.
  const moveSpeed = 2.4 * delta;
  const rotateSpeed = 1.8 * delta;
  if (pressedKeys.has('ArrowLeft')) cube.position.x -= moveSpeed;
  if (pressedKeys.has('ArrowRight')) cube.position.x += moveSpeed;
  if (pressedKeys.has('ArrowUp')) cube.position.z -= moveSpeed;
  if (pressedKeys.has('ArrowDown')) cube.position.z += moveSpeed;
  if (pressedKeys.has('KeyQ')) cube.rotation.y -= rotateSpeed;
  if (pressedKeys.has('KeyE')) cube.rotation.y += rotateSpeed;

  if (lightHelpersVisible) {
    directionalLightHelper.update();
    shadowCameraHelper.update();
  }

  fpsFrameCount += 1;
  fpsElapsed += rawDelta;
  if (fpsElapsed >= 0.5) {
    fps = Math.round(fpsFrameCount / Math.max(0.001, fpsElapsed));
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

// Initial UI state -------------------------------------------------------------
attachControls(activeCamera, initialTarget);
setShadowQuality(1024, false);
setGalleryVisible(true, false);
setLightHelpersVisible(false, false);
setLightOrbitEnabled(true, false);
syncFOVUI();
syncOrbitControlsUI();
updateHUD();
animate();
