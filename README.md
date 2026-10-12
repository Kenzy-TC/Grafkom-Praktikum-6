# Three.js Mini 3D Scene — Pertemuan 6

**Mata kuliah:** EF234504 — Grafika Komputer  
**Topik:** Introduction to Three.js  
**Implementasi:** seluruh Challenge A–H dari modul Pertemuan 6.

| Detail | Keterangan |
| --- | --- |
| **Nama Anggota 1** | Mario Napitupulu |
| **NRP Anggota 1** | 5025241085 |
| **Nama Anggota 2** | Nathanael Oliver Amadhika Yuswana |
| **NRP Anggota 2** | 5025241109 |

## Deskripsi

Scene interaktif berisi cube yang dapat dikontrol, sphere animasi, ground, material gallery, cylinder, cone, torus, AmbientLight, serta DirectionalLight bergerak. Scene memakai `OrbitControls`, shadow map, HUD statistik, dua mode kamera, dan animasi berbasis delta time.

## Challenge yang dikerjakan

| Challenge | Implementasi |
|---|---|
| A — Tambah Geometry | CylinderGeometry, ConeGeometry, dan TorusGeometry; masing-masing menggunakan material, transform, dan posisi tersendiri. |
| B — Material Gallery | Empat sphere memakai geometry yang sama dengan MeshBasicMaterial, MeshNormalMaterial, MeshLambertMaterial, dan MeshPhongMaterial. |
| C — OrthographicCamera | Tekan **P** atau tombol kamera untuk berpindah Perspective/Orthographic. Posisi dan target kontrol kamera dipertahankan. Resize memperbarui kedua projection matrix. |
| D — Light Animation | DirectionalLight bergerak mengelilingi scene dan penanda kecil mengikuti posisinya. |
| E — Shadow Quality | Tombol 512, 1024, dan 2048 mengubah resolusi shadow map. Default 1024 agar beban rendering tetap moderat. |
| F — Scene Information | HUD menampilkan jenis kamera, mesh count, triangle count dari `renderer.info`, FPS sederhana, posisi kamera, material cube, status animasi, dan resolusi shadow. |
| G — Toggle Animation | Tombol atau **Space** menjeda/melanjutkan animasi objek dan lampu; navigasi kamera tetap aktif. |
| H — Continuous Object Control | Tahan tombol panah untuk memindahkan cube, **Q/E** untuk memutar cube. Gerakan memakai delta time. |

## Fitur baseline yang juga disertakan

- Scene dan background.
- PerspectiveCamera dengan FOV, aspect, near, dan far yang ditentukan.
- WebGLRenderer dengan antialias, pixel ratio dibatasi maksimal 2, dan responsive resize.
- BoxGeometry, SphereGeometry, dan PlaneGeometry sebagai ground.
- Material yang merespons cahaya dan material yang tidak bergantung pada cahaya.
- AmbientLight, DirectionalLight, `castShadow`, dan `receiveShadow`.
- OrbitControls untuk orbit, zoom, pan, damping, dan reset kamera.
- `requestAnimationFrame()`, `THREE.Clock`, delta time, dan HUD.

## Cara menjalankan

Pastikan Node.js dan npm telah terpasang. Buka terminal di direktori proyek, lalu jalankan:

```bash
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan Vite di browser. Untuk memeriksa build production:

```bash
npm run build
```

Folder `node_modules/` tidak perlu dikumpulkan karena dapat dibuat ulang dengan `npm install`.

## Kontrol

| Input | Fungsi |
|---|---|
| Drag tombol kiri | Orbit kamera |
| Scroll | Zoom |
| Drag tombol kanan | Pan |
| **P** | Toggle Perspective/Orthographic |
| **R** | Reset ke kamera Perspective awal |
| **Space** | Pause/resume animasi |
| **M** | Toggle material cube antara Lambert dan Basic |
| **Arrow keys** | Gerakkan cube |
| **Q / E** | Putar cube |
| Tombol 512 / 1024 / 2048 | Ubah kualitas shadow map |

## Catatan debugging

- Jika muncul `Failed to resolve import "three"`, jalankan `npm install` dari root proyek.
- Jika canvas kosong, periksa Console browser dan pastikan Vite berjalan.
- Material Lambert/Phong memerlukan Light; Basic tidak bergantung pada Light.
- Jika shadow tidak terlihat, periksa `renderer.shadowMap.enabled`, `DirectionalLight.castShadow`, properti `castShadow` pada object, `ground.receiveShadow`, serta batas shadow camera.
- Resolusi shadow 2048 lebih berat daripada 512/1024. Pilih resolusi yang sesuai dengan kemampuan perangkat.
- Bila tombol keyboard tidak merespons, klik area scene dahulu dan pastikan fokus tidak berada pada tombol panel.

## Refleksi (contoh yang dapat disesuaikan)

Three.js menyederhanakan pekerjaan grafika 3D yang sebelumnya dilakukan langsung melalui WebGL. Geometry dan Material dapat digabungkan menjadi Mesh tanpa mengatur buffer dan shader satu per satu, tetapi data vertex, transform, dan proses rendering tetap dikelola di belakang layar. Material Basic tidak memerlukan pencahayaan, sedangkan Lambert dan Phong bereaksi terhadap Light. Shadow membutuhkan pengaturan pada renderer, sumber cahaya, object, dan ground sekaligus. Delta time membantu menjaga kecepatan animasi lebih konsisten pada frame rate yang berbeda. OrbitControls dan pergantian kamera memudahkan inspeksi scene dari berbagai sudut.

