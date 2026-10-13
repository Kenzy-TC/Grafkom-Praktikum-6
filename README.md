# Three.js Mini 3D Scene — Pertemuan 6

**Mata kuliah:** EF234504 — Grafika Komputer  
**Topik:** Introduction to Three.js  
**Implementasi:** baseline praktikum dan seluruh Challenge A–H, dilengkapi panel kontrol interaktif.

## Deskripsi

Aplikasi membangun mini scene 3D menggunakan Three.js dan Vite. Scene berisi cube yang dapat dipindahkan dan diputar, sphere animasi, ground, geometry tambahan, Material Gallery, Geometry Playground, AmbientLight, serta DirectionalLight dengan orbit yang dapat diaktifkan/dinonaktifkan. Panel kontrol mencakup FOV, intensitas cahaya, detail/ukuran geometry, OrbitControls, light helpers, kualitas shadow, pergantian kamera, dan statistik rendering.

## Challenge A–H

| Challenge | Implementasi |
|---|---|
| A — Tambah Geometry | CylinderGeometry, ConeGeometry, dan TorusGeometry; masing-masing memiliki material, transform, dan posisi. |
| B — Material Gallery | Empat sphere memakai geometry sama dengan MeshBasicMaterial, MeshNormalMaterial, MeshLambertMaterial, dan MeshPhongMaterial. Tombol **Show/Hide material gallery** menampilkan atau menyembunyikannya. |
| C — OrthographicCamera | Tombol kamera atau **P** berpindah Perspective/Orthographic. Resize memperbarui projection matrix untuk kedua kamera. |
| D — Light Animation | DirectionalLight dapat bergerak mengorbit scene. Tombol **Light orbit: ON/OFF** mengontrol gerak ini. |
| E — Shadow Quality | Pilihan shadow map 512, 1024, atau 2048. Default 1024 agar beban render tetap moderat. |
| F — Scene Information | HUD menampilkan tipe kamera, jumlah mesh, triangle count, FPS, posisi kamera, material cube, status animasi, dan resolusi shadow. |
| G — Toggle Animation | Tombol atau **Space** pause/resume animasi object dan gerak light; navigasi kamera tetap bisa digunakan. |
| H — Continuous Object Control | Tahan tombol panah untuk memindahkan cube, **Q/E** untuk memutar cube. Gerakan berbasis delta time. |

## Panel kontrol tambahan

### Camera Lens
- Slider **Field of View (FOV)** mengubah FOV PerspectiveCamera dari 35° hingga 100°.
- FOV dinonaktifkan saat OrthographicCamera sedang aktif karena kamera ortografis tidak menggunakan parameter FOV.

### Lighting
- **Directional light intensity** mengatur intensitas DirectionalLight.
- **Ambient light intensity** mengatur pencahayaan dasar AmbientLight.
- **Show/Hide light helpers** menampilkan atau menyembunyikan DirectionalLightHelper dan CameraHelper untuk shadow camera.
- **Light orbit ON/OFF** menghidupkan atau menjeda gerak melingkar lampu.

### Geometry Playground
- Pilih **Sphere, Box, Cylinder, Cone,** atau **Torus**.
- Slider **Geometry detail / segments** mengubah jumlah segmen geometri. Detail yang lebih tinggi biasanya membuat bentuk melengkung lebih halus dengan lebih banyak vertex.
- Slider **Geometry scale** mengubah skala objek pratinjau.

### OrbitControls · Camera
- **Aktifkan kontrol kamera** mengaktifkan/nonaktifkan input OrbitControls.
- **Izinkan pan** mengaktifkan/nonaktifkan gerak geser kamera.
- **Damping** mengaktifkan/nonaktifkan efek gerak kamera yang lebih halus.
- Slider **Damping factor** mengatur kuatnya damping.
- Slider **Camera rotate speed** mengatur kecepatan orbit.
- Slider **Camera zoom speed** mengatur kecepatan zoom.
- Pengaturan OrbitControls dipertahankan ketika mode kamera diganti.

## Baseline yang juga disertakan

- Vite + Node.js dan dependency `three`.
- Scene, background, PerspectiveCamera, OrthographicCamera, dan WebGLRenderer.
- Antialias, pixel ratio maksimum 2, dan responsive rendering.
- BoxGeometry, SphereGeometry, PlaneGeometry untuk ground, serta minimal dua jenis material.
- Mesh, position, rotation, scale, AmbientLight, DirectionalLight, shadow map, `castShadow`, dan `receiveShadow`.
- `requestAnimationFrame()`, `THREE.Clock`, dan delta time.

## Cara menjalankan

Pastikan Node.js dan npm sudah terpasang. Buka folder proyek di VS Code, pilih **Terminal → New Terminal**, lalu jalankan:

```bash
npm install
npm run dev
```

Buka URL yang ditampilkan Vite, biasanya `http://localhost:5173/`. Di Windows PowerShell yang memblokir `npm.ps1`, gunakan:

```powershell
npm.cmd install
npm.cmd run dev
```

Jangan menjalankan file `index.html` langsung atau melalui Live Server; proyek ini menggunakan Vite untuk menyelesaikan import module Three.js.

Untuk build production:

```bash
npm run build
```

Folder `node_modules/` tidak perlu dikumpulkan karena dependency bisa di-install lagi dari `package.json`.

## Kontrol keyboard dan mouse

| Input | Fungsi |
|---|---|
| Drag kiri | Orbit kamera |
| Scroll | Zoom |
| Drag kanan | Pan (jika diizinkan) |
| **P** | Berpindah Perspective/Orthographic |
| **R** | Reset kamera ke Perspective awal dan FOV 60° |
| **Space** | Pause/resume animasi |
| **M** | Toggle material cube antara Lambert dan Basic |
| **Arrow keys** | Gerakkan cube |
| **Q / E** | Putar cube |

## Debugging

- `Failed to resolve import "three"`: jalankan `npm install` pada root folder proyek.
- Canvas kosong: jalankan lewat `npm run dev`, buka Console browser, dan periksa pesan error.
- Lambert/Phong gelap: pastikan lampu aktif dan intensitasnya cukup.
- Shadow tidak tampak: periksa `renderer.shadowMap.enabled`, `DirectionalLight.castShadow`, object `castShadow`, `ground.receiveShadow`, dan batas shadow camera.
- Rendering terlalu berat: turunkan shadow quality dan geometry detail.
- Tidak bisa menggerakkan kamera: aktifkan **Aktifkan kontrol kamera**; pan memerlukan opsi **Izinkan pan** aktif.

## Identitas mahasiswa

- **Nama:** [Isi nama]
- **NRP:** [Isi NRP]
