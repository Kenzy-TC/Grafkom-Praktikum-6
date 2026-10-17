# Three.js Mini 3D Scene — Praktikum Grafika Komputer Pertemuan 6

**Mata Kuliah:** EF234504 — Grafika Komputer  
**Topik:** Introduction to Three.js  
**Dosen:** Dr. Darlis Herumurti  
**Departemen:** Teknik Informatika

## Identitas Mahasiswa

**Nama:   Mario Napitupulu** 
**NRP :   5025241085**   
**Nama:   Nathanael Oliver** 
**NRP :   5025241109** 

## 1. Deskripsi Proyek

Proyek ini merupakan mini scene 3D interaktif yang dibuat menggunakan **Three.js**, **JavaScript ES Modules**, **Node.js**, dan **Vite**. Aplikasi menerapkan konsep grafika 3D dari praktikum WebGL sebelumnya dengan menggunakan abstraction Three.js untuk mengelola scene, kamera, geometry, material, transformasi, pencahayaan, shadow, dan rendering.

Scene memuat cube yang dapat dikendalikan, sphere yang bergerak naik-turun, ground, beberapa geometry tambahan, Geometry Playground, Material Gallery, AmbientLight, dan DirectionalLight. Panel kontrol interaktif memungkinkan pengguna mengubah FOV, intensitas cahaya, jenis serta detail geometry, pengaturan OrbitControls, kualitas shadow, visibilitas gallery, dan gerakan lampu.

## 2. Teknologi yang Digunakan

- **Three.js** untuk membuat dan merender objek 3D.
- **Vite** sebagai development server dan module bundler.
- **JavaScript ES Modules** untuk import Three.js dan OrbitControls.
- **HTML dan CSS** untuk struktur panel kontrol serta HUD.
- **WebGLRenderer** sebagai renderer berbasis WebGL.

Dependency aplikasi didefinisikan di `package.json`. Folder `node_modules/` tidak perlu dikumpulkan karena dapat dibuat ulang dengan menjalankan `npm install`.

## 3. Isi Scene

| Objek/komponen | Fungsi |
|---|---|
| Cube | Objek utama; dapat berotasi, dipindahkan dengan keyboard, dan memakai material Lambert atau Basic. |
| Sphere | Berotasi dan bergerak naik-turun menggunakan animasi berbasis waktu. |
| Ground | Plane horizontal sebagai permukaan tempat objek menerima shadow. |
| Cylinder, Cone, Torus | Geometry tambahan untuk Challenge A. |
| Geometry Playground | Objek pratinjau yang jenis, detail, dan skalanya bisa diubah melalui panel. |
| Material Gallery | Empat sphere untuk membandingkan Basic, Normal, Lambert, dan Phong. |
| AmbientLight | Memberikan pencahayaan dasar pada scene. |
| DirectionalLight | Memberikan cahaya berarah dan menghasilkan shadow; posisinya dapat mengorbit scene. |
| Light marker | Penanda visual untuk menunjukkan posisi DirectionalLight. |

## 4. Challenge A–H

| Challenge | Implementasi |
|---|---|
| **A — Tambah Geometry** | Menambahkan `CylinderGeometry`, `ConeGeometry`, dan `TorusGeometry`. Tiap objek memiliki material, transformasi, posisi, dan pengaturan shadow. Geometry Playground juga menyediakan Sphere, Box, Cylinder, Cone, dan Torus. |
| **B — Material Gallery** | Membandingkan `MeshBasicMaterial`, `MeshNormalMaterial`, `MeshLambertMaterial`, dan `MeshPhongMaterial` pada geometri sphere yang sama. Tombol **Show/Hide material gallery** menampilkan atau menyembunyikan kelompok gallery. |
| **C — OrthographicCamera** | Tombol **Camera** atau tombol keyboard **P** berpindah antara Perspective Camera dan Orthographic Camera. Kedua kamera diperbarui ketika ukuran jendela berubah. |
| **D — Light Animation** | DirectionalLight bergerak mengelilingi scene saat animasi dan fitur **Light orbit** aktif. Light marker mengikuti posisi lampu. |
| **E — Shadow Quality** | Pilihan resolusi shadow map **512 × 512**, **1024 × 1024**, atau **2048 × 2048** untuk membandingkan kualitas dan biaya rendering. Default-nya 1024 × 1024. |
| **F — Scene Information** | HUD menampilkan jenis kamera, jumlah mesh, jumlah triangle, FPS, material cube, resolusi shadow, posisi kamera, dan status animasi. |
| **G — Toggle Animation** | Tombol **Pause/Resume animation** atau tombol **Space** menghentikan dan melanjutkan animasi objek serta pergerakan lampu. Navigasi kamera tetap dapat digunakan saat animasi dijeda. |
| **H — Continuous Object Control** | Tombol panah menggerakkan cube dan tombol **Q/E** memutar cube. Gerak menggunakan delta time agar kecepatannya tidak langsung bergantung pada frame rate. |

## 5. Panel Kontrol Interaktif

### 5.1 Camera Lens — Field of View

- Slider **Field of View (FOV)** mengatur FOV Perspective Camera dari **35° sampai 100°**.
- Perubahan FOV langsung memperbarui projection matrix.
- Slider dinonaktifkan ketika Orthographic Camera aktif karena kamera ortografis tidak menggunakan parameter FOV.

### 5.2 Lighting

- **Directional light intensity:** mengatur intensitas DirectionalLight dari 0 sampai 5.
- **Ambient light intensity:** mengatur intensitas AmbientLight dari 0 sampai 1.5.
- **Show/Hide light helpers:** menampilkan atau menyembunyikan DirectionalLightHelper dan CameraHelper untuk shadow camera.
- **Light orbit ON/OFF:** mengaktifkan atau menjeda gerak melingkar DirectionalLight. Gerakan lampu juga berhenti ketika animasi utama dijeda.

### 5.3 Geometry Playground

- **Geometry:** memilih Sphere, Box, Cylinder, Cone, atau Torus.
- **Geometry detail / segments:** mengubah tingkat detail geometry dengan nilai 8–48. Jumlah segmen yang lebih besar umumnya membuat permukaan melengkung tampak lebih halus, tetapi menambah vertex yang perlu dirender.
- **Geometry scale:** mengatur skala objek pratinjau dari 0.50× sampai 1.80×.
- Perubahan jenis atau detail geometry membuat ulang geometry pratinjau; slider skala mengubah skala mesh.

### 5.4 OrbitControls · Camera

- **Aktifkan kontrol kamera:** mengaktifkan atau menonaktifkan input OrbitControls.
- **Izinkan pan:** mengaktifkan atau menonaktifkan geser kamera dan target.
- **Damping:** mengaktifkan atau menonaktifkan efek gerakan kamera yang lebih halus.
- **Damping factor:** mengatur faktor damping dari 0.01 sampai 0.20.
- **Camera rotate speed:** mengatur kecepatan orbit dari 0.2× sampai 3.0×.
- **Camera zoom speed:** mengatur kecepatan zoom dari 0.2× sampai 3.0×.
- Nilai pengaturan OrbitControls dipertahankan ketika berpindah antara Perspective Camera dan Orthographic Camera.

### 5.5 Gallery, Kamera, Animasi, dan Shadow

- **Hide/Show material gallery:** menyembunyikan atau menampilkan Material Gallery.
- **Camera: Perspective/Orthographic:** berganti mode kamera.
- **Reset camera:** kembali ke posisi kamera Perspective awal, target awal, dan FOV 60°.
- **Pause/Resume animation:** menjeda atau melanjutkan animasi objek dan light orbit.
- **Cube material:** mengganti material cube antara Lambert (merespons pencahayaan) dan Basic (tidak dipengaruhi light).
- **Shadow quality:** memilih resolusi shadow map 512, 1024, atau 2048.

## 6. Geometry, Material, dan Lighting

### Geometry

- `BoxGeometry` digunakan oleh cube.
- `SphereGeometry` digunakan oleh sphere dan sampel Material Gallery.
- `PlaneGeometry` digunakan sebagai ground dan diputar pada sumbu X agar horizontal.
- `CylinderGeometry`, `ConeGeometry`, dan `TorusGeometry` memenuhi challenge geometry tambahan.

### Material

- `MeshBasicMaterial`: tidak merespons pencahayaan.
- `MeshNormalMaterial`: warna permukaan ditentukan berdasarkan normal.
- `MeshLambertMaterial`: merespons pencahayaan diffuse.
- `MeshPhongMaterial`: merespons pencahayaan dan menampilkan highlight specular.

### Shadow

Shadow memerlukan konfigurasi beberapa bagian sekaligus:

1. `renderer.shadowMap.enabled = true`.
2. DirectionalLight mengaktifkan `castShadow`.
3. Objek yang membentuk shadow mengaktifkan `castShadow`.
4. Ground mengaktifkan `receiveShadow`.
5. Area shadow camera harus mencakup objek dalam scene.

## 7. Transformasi, Kamera, dan Rendering Responsif

Objek menggunakan `position`, `rotation`, dan `scale`. Three.js menangani transformasi tersebut untuk membentuk Model Matrix saat rendering.

Perspective Camera menggunakan FOV, aspect ratio, near plane, dan far plane. Orthographic Camera disediakan sebagai perbandingan proyeksi. Ketika ukuran browser berubah, aplikasi memperbarui ukuran renderer, pixel ratio (dibatasi maksimal 2), aspect ratio Perspective Camera, batas Orthographic Camera, dan projection matrix keduanya.

## 8. Animasi dan Delta Time

Animasi berjalan melalui `requestAnimationFrame()` dan `THREE.Clock`. Selisih waktu antar-frame (`delta time`) dipakai untuk mengatur kecepatan rotasi, gerak naik-turun sphere, gerak DirectionalLight, dan kontrol cube berbasis keyboard. Delta yang sangat besar dibatasi untuk menghindari lonjakan gerakan setelah frame terlambat.

## 9. Cara Menjalankan Proyek

### Prasyarat

- Node.js versi modern.
- npm.
- VS Code atau editor kode lainnya.
- Browser modern dengan dukungan WebGL.

### Menjalankan di VS Code

1. Ekstrak repository atau clone proyek, lalu buka folder `praktikum-threejs-06` di VS Code.
2. Pilih **Terminal → New Terminal**. Pastikan terminal berada di folder yang berisi `package.json`.
3. Instal dependency:

   ```bash
   npm install
   ```

4. Jalankan development server:

   ```bash
   npm run dev
   ```

5. Buka alamat yang ditampilkan Vite, biasanya `http://localhost:5173/`.

**Khusus Windows PowerShell:** jika muncul pesan bahwa `npm.ps1` tidak dapat dijalankan karena execution policy, gunakan perintah berikut:

```powershell
npm.cmd install
npm.cmd run dev
```

Jangan membuka `index.html` secara langsung atau menggunakan tombol **Go Live / Live Server**. Proyek ini menggunakan Vite untuk menyelesaikan import package `three` dan addon `OrbitControls`.

### Build production

Untuk membuat build production, jalankan:

```bash
npm run build
```

Untuk menguji hasil build secara lokal setelah proses tersebut selesai, gunakan:

```bash
npm run preview
```

## 10. Kontrol Keyboard dan Mouse

| Input | Fungsi |
|---|---|
| Drag tombol kiri | Orbit kamera, bila kontrol kamera aktif. |
| Scroll mouse | Zoom kamera. |
| Drag tombol kanan | Pan kamera, bila **Izinkan pan** aktif. |
| **P** | Berpindah Perspective/Orthographic Camera. |
| **R** | Reset kamera ke tampilan Perspective awal. |
| **Space** | Pause/resume animasi. |
| **M** | Mengganti material cube antara Lambert dan Basic. |
| **Arrow keys** | Menggerakkan cube di bidang horizontal. |
| **Q / E** | Memutar cube. |

Untuk gerakan cube yang kontinu, tahan tombol panah atau Q/E. Jika keyboard sedang fokus pada input, tombol, atau dropdown di panel, shortcut global tidak dijalankan agar tidak mengganggu kontrol tersebut.

## 11. Struktur Proyek

```text
praktikum-threejs-06/
├── index.html
├── package.json
├── package-lock.json      # dibuat/diperbarui oleh npm install
├── README.md
└── src/
    ├── main.js
    └── style.css
```

Folder `node_modules/` tidak perlu disertakan ketika mengumpulkan atau mengunggah source code. Dependency dapat diinstal kembali melalui `npm install`.

## 12. Debugging

- **`npm` diblokir PowerShell:** gunakan `npm.cmd install` dan `npm.cmd run dev`.
- **`Failed to resolve import "three"`:** jalankan `npm install` dari folder yang berisi `package.json`, kemudian ulangi `npm run dev`.
- **Canvas kosong atau objek tidak terlihat:** jalankan melalui Vite, buka DevTools → Console, dan periksa apakah ada error. Pastikan browser mendukung WebGL.
- **Objek dengan Lambert/Phong tampak gelap:** pastikan light aktif dan intensitasnya cukup; bandingkan dengan MeshBasicMaterial.
- **Shadow tidak tampak:** periksa shadow map renderer, `DirectionalLight.castShadow`, `mesh.castShadow`, `ground.receiveShadow`, dan area shadow camera.
- **Kontrol kamera tidak merespons:** pastikan checkbox **Aktifkan kontrol kamera** tercentang. Untuk pan, centang juga **Izinkan pan**.
- **Rendering terlalu berat:** turunkan shadow quality atau detail geometry.
- **Bentuk tampak terdistorsi setelah resize:** pastikan aplikasi berjalan melalui Vite dan resize handler memperbarui camera projection matrix.

## 13. Checklist Pengujian

- [ ] `npm install` berhasil.
- [ ] `npm run dev` berjalan dan scene tampil di browser.
- [ ] Cube, sphere, ground, serta geometry tambahan terlihat.
- [ ] FOV slider mengubah sudut pandang Perspective Camera.
- [ ] Slider intensitas cahaya mengubah pencahayaan.
- [ ] Geometry type, detail, dan scale mengubah Geometry Playground.
- [ ] Orbit, zoom, pan, damping, rotate speed, dan zoom speed dapat diatur.
- [ ] Light helpers, Light orbit, dan Material Gallery dapat di-toggle.
- [ ] Pergantian Perspective/Orthographic Camera dan reset kamera bekerja.
- [ ] Shadow quality berubah sesuai opsi.
- [ ] Pause/resume, kontrol keyboard cube, dan animasi berbasis delta time bekerja.
- [ ] Scene tetap responsif ketika ukuran browser berubah.
- [ ] Tidak ada error Console selama penggunaan normal.
- [ ] Screenshot scene akhir sudah disimpan untuk dokumentasi praktikum.

## 14. Refleksi Praktikum

Praktikum ini menunjukkan bagaimana Three.js menyederhanakan pekerjaan grafika yang sebelumnya perlu dikelola secara manual di WebGL, seperti buffer, shader, matrix, dan draw call. Geometry menyimpan data vertex, sedangkan material menentukan cara permukaan dirender dan apakah material merespons lighting. Scene menggabungkan objek, kamera, dan light agar dapat dirender oleh WebGLRenderer. Penggunaan delta time membantu menjaga kecepatan animasi agar lebih konsisten, sementara responsive rendering memastikan proyeksi kamera menyesuaikan ukuran jendela. Pengaturan shadow memperlihatkan bahwa bayangan memerlukan konfigurasi pada renderer, sumber cahaya, objek, dan ground.
