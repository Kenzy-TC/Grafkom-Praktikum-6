# Penjelasan `src/main.js`

Dokumen ini menjelaskan kode `src/main.js` secara berurutan. Bagian yang memiliki fungsi serupa dikelompokkan agar mudah dipakai sebagai naskah rekaman demo.

Secara umum, file ini membuat scene 3D dengan Three.js, mengatur objek dan pencahayaan, menghubungkan kontrol antarmuka, lalu menjalankan animasi dan memperbarui tampilannya.

## 1. Import dan referensi elemen HTML

- `import * as THREE from 'three';` mengimpor Three.js untuk membuat scene, kamera, objek, material, cahaya, dan renderer.
- `import { OrbitControls } ...` mengimpor kontrol untuk memutar kamera, menggeser pandangan, dan melakukan zoom dengan mouse.
- `import './style.css';` memuat gaya halaman.
- `const app` dan `const toast` mengambil elemen HTML tempat canvas dan pesan singkat akan ditampilkan.
- `const $ = ...` membuat fungsi pembantu untuk mencari satu elemen HTML berdasarkan selector CSS.
- `const info = {...}` menyimpan referensi ke elemen-elemen HUD, seperti statistik kamera, jumlah objek, FPS, material, bayangan, posisi, dan status animasi.

## 2. Membuat scene dan kamera

- `const scene = new THREE.Scene();` membuat wadah utama untuk semua objek 3D.
- `scene.background = ...` menetapkan warna latar belakang scene.
- `const sizes = ...` menyimpan lebar dan tinggi jendela browser.
- `initialTarget` menentukan titik yang pertama kali dipandang kamera.
- `initialPerspectivePosition` menyimpan posisi awal kamera.
- `orthographicFrustum` menentukan ukuran area pandang kamera ortografis.

### Perspective Camera

- `new THREE.PerspectiveCamera(...)` membuat kamera perspektif. Parameternya adalah sudut pandang, rasio lebar terhadap tinggi, serta jarak pandang minimum dan maksimum.
- `Math.max(1, sizes.height)` mencegah tinggi layar bernilai nol saat menghitung rasio.
- `.position.copy(...)` menempatkan kamera di posisi awal.
- `.lookAt(...)` mengarahkan kamera ke target awal.

### Orthographic Camera

- `initialAspect` menyimpan rasio ukuran layar.
- `new THREE.OrthographicCamera(...)` membuat kamera ortografis, yang membuat ukuran objek tampak tetap meskipun jaraknya berbeda.
- Empat parameter pertama menentukan batas kiri, kanan, atas, dan bawah area pandang. Dua parameter berikutnya mengatur jarak pandang.
- Kamera ini juga ditempatkan dan diarahkan ke target awal.
- `scene.add(...)` memasukkan kedua kamera ke scene.
- `activeCamera` menyimpan kamera yang sedang digunakan untuk merender.

## 3. Membuat renderer

- `new THREE.WebGLRenderer(...)` membuat renderer WebGL. `antialias: true` membantu menghaluskan tepi objek, sedangkan `powerPreference` meminta prioritas performa tinggi.
- `renderer.setSize(...)` menyesuaikan ukuran canvas dengan jendela.
- `renderer.setPixelRatio(...)` mengatur ketajaman gambar dan membatasi rasio piksel maksimum ke 2.
- `renderer.shadowMap.enabled = true` mengaktifkan bayangan.
- `renderer.shadowMap.type = ...` memilih tipe bayangan yang lebih halus.
- `setAttribute(...)` memberi label aksesibilitas pada canvas.
- `tabIndex = 0` membuat canvas bisa menerima fokus keyboard.
- `app.prepend(...)` memasukkan canvas ke dalam elemen `#app`.

## 4. Pengaturan OrbitControls

- `orbitSettings` menyimpan pilihan kontrol kamera, seperti aktif atau tidak, izin pan, damping, dan kecepatan gerakan.
- `let controls` menyiapkan variabel untuk objek OrbitControls.
- `attachControls(camera, target)` memasang kontrol pada kamera tertentu.
- Jika kontrol lama sudah ada, `dispose()` membersihkannya sebelum kontrol baru dibuat.
- `new OrbitControls(...)` menghubungkan kontrol kamera ke canvas.
- `controls.target.copy(target)` menetapkan titik yang menjadi pusat putaran kamera.
- Baris-baris `controls... = orbitSettings...` menerapkan pilihan kontrol yang tersimpan.
- `enableZoom`, `minDistance`, dan `maxDistance` mengatur zoom serta jarak kamera minimum dan maksimum.
- `maxPolarAngle` membatasi sudut kamera agar tidak berputar terlalu jauh ke bawah.
- `controls.update()` memperbarui kontrol.
- `saveState()` menyimpan kondisi kontrol saat ini.
- `syncOrbitControlsUI()` menyelaraskan nilai kontrol dengan tampilan UI.

## 5. Kubus utama

- `cubeLambertMaterial` dan `cubeBasicMaterial` membuat dua material berwarna sama, tetapi cara keduanya merespons cahaya berbeda.
- `cubeUsesLambert` mencatat material yang sedang dipakai.
- `BoxGeometry(...)` membuat geometri kubus.
- `new THREE.Mesh(...)` menggabungkan geometri dan material menjadi objek 3D.
- `cube.name` memberi nama untuk memudahkan identifikasi.
- `position`, `rotation`, dan `scale` mengatur posisi, rotasi, dan ukuran kubus.
- `castShadow` membuat kubus menghasilkan bayangan, sedangkan `receiveShadow` membuatnya dapat menerima bayangan.
- `scene.add(cube)` memasukkan kubus ke scene.

## 6. Bola utama

- `sphereGeometry` membuat geometri bola. Angka-angkanya menentukan ukuran dan tingkat detail.
- `sphereMaterial` membuat material Phong berwarna biru dengan tingkat kilau tertentu.
- `sphere` menggabungkan geometri dan material.
- `sphere.name`, `position`, `castShadow`, dan `receiveShadow` mengatur identitas, posisi, serta bayangannya.
- `scene.add(sphere)` memasukkan bola ke scene.
- `sphereBaseY` menyimpan tinggi awal bola. Nilai ini dipakai saat bola bergerak naik-turun.

## 7. Lantai

- `PlaneGeometry(...)` membuat bidang datar.
- `rotateX(-Math.PI / 2)` memutar bidang agar posisinya mendatar seperti lantai.
- `groundMaterial` menentukan warna dan respons lantai terhadap cahaya.
- `ground` menggabungkan geometri dan material.
- `ground.position.y = 0` menempatkan lantai pada ketinggian nol.
- `ground.receiveShadow = true` membuat lantai menerima bayangan.
- `scene.add(ground)` menambahkan lantai ke scene.

## 8. Objek tambahan: silinder, kerucut, dan torus

Bagian ini membuat tiga objek tambahan:

- `CylinderGeometry(...)` membuat silinder; objeknya diberi material Phong berwarna jingga.
- `ConeGeometry(...)` membuat kerucut; objeknya diberi material Lambert berwarna merah muda.
- `TorusGeometry(...)` membuat torus atau bentuk seperti cincin; objeknya diberi material Phong berwarna ungu.
- Pada setiap objek, `name`, `position`, dan `rotation` mengatur identitas, posisi, dan arah.
- `castShadow` serta `receiveShadow` mengatur apakah objek menghasilkan dan menerima bayangan.
- `scene.add(...)` memasukkan masing-masing objek ke dalam scene.
- Torus diputar pada sumbu X agar cincin tampak menghadap ke arah kamera.

## 9. Geometry Playground

- `geometryLabMaterial` membuat material bersama untuk objek playground.
- `geometryLabType`, `geometryLabDetail`, dan `geometryLabScale` menyimpan bentuk, tingkat detail, dan ukuran yang sedang dipilih.
- `buildPlaygroundGeometry(type, detail)` adalah fungsi pembuat geometri playground.
- `segments` membatasi nilai detail agar tetap di antara 8 dan 48.
- `switch (type)` memilih bentuk berdasarkan jenis yang diminta:
  - `box` membuat kubus dengan jumlah pembagian sisi yang disesuaikan dengan detail.
  - `cylinder` membuat silinder.
  - `cone` membuat kerucut.
  - `torus` membuat torus, dengan detail radial dan keliling yang disesuaikan.
  - `sphere` atau pilihan lain membuat bola sebagai bentuk bawaan.
- `geometryLab` membuat mesh dari bentuk dan material yang dipilih.
- `name`, `position`, pengaturan bayangan, dan `scale.setScalar(...)` mengatur nama, posisi, bayangan, dan ukuran objek.
- `scene.add(geometryLab)` memasukkannya ke scene.

### Memperbarui Geometry Playground

- `updateGeometryLab()` membuat geometri pengganti sesuai pilihan terbaru.
- `geometryLab.geometry.dispose()` membersihkan geometri lama dari memori.
- `geometryLab.geometry = replacement` memasang geometri baru.
- Skala dan rotasi diperbarui. Jika bentuknya torus, rotasinya dibuat sedikit miring agar lebih mudah terlihat.
- `textContent` memperbarui angka detail dan skala pada UI.
- `showToast(...)` menampilkan pesan tentang bentuk dan detail yang dipilih.
- Event `change` pada `#geometry-type` mengganti bentuk.
- Event `input` pada slider detail mengganti tingkat detail.
- Event `input` pada slider skala memperbarui ukuran objek dan label skalanya.

## 10. Material Gallery

- `galleryGroup` adalah grup yang menampung semua contoh material agar bisa ditampilkan atau disembunyikan sekaligus.
- `galleryGeometry` membuat geometri bola yang digunakan bersama oleh contoh material.
- `galleryEntries` berisi empat contoh material: Basic, Normal, Lambert, dan Phong, beserta warna atau posisi horizontalnya.
- `for...of` mengulang setiap entri untuk membuat satu bola contoh.
- Setiap `sample` diberi nama dan posisi, lalu diatur agar menghasilkan serta menerima bayangan.
- `galleryGroup.add(sample)` memasukkan bola ke grup.
- `scene.add(galleryGroup)` memasukkan seluruh grup ke scene.
- `galleryVisible` menyimpan status tampil atau sembunyi.
- `setGalleryVisible(...)` memperbarui status grup, teks tombol, atribut aksesibilitas, catatan UI, dan—jika diminta—pesan toast.
- Event `click` pada tombol galeri membalik status tampilnya galeri.

## 11. Cahaya dan penanda cahaya

- `ambientLight` membuat cahaya lingkungan yang menerangi objek secara merata.
- `directionalLight` membuat cahaya terarah seperti cahaya matahari.
- Baris-baris setelahnya memberi nama, posisi, dan mengaktifkan bayangan dari cahaya terarah.
- `shadow.mapSize` mengatur resolusi peta bayangan.
- `shadow.camera.left/right/top/bottom/near/far` mengatur area yang diperiksa kamera bayangan.
- `updateProjectionMatrix()` menerapkan pengaturan kamera bayangan tersebut.
- `shadow.bias` dan `shadow.normalBias` membantu mengurangi artefak pada bayangan.
- `scene.add(...)` menambahkan cahaya terarah dan targetnya ke scene.
- `lightMarker` membuat bola kecil sebagai penanda posisi cahaya.
- Material Basic membuat penanda itu terlihat tanpa dipengaruhi cahaya.
- Posisi penanda disalin dari posisi cahaya.
- `castShadow` dan `receiveShadow` dimatikan karena penanda ini hanya berfungsi sebagai visualisasi posisi cahaya.
- `scene.add(lightMarker)` menambahkan penanda ke scene.

## 12. Helper cahaya dan animasi orbit cahaya

- `DirectionalLightHelper` menampilkan arah cahaya terarah.
- `CameraHelper` menampilkan batas kamera bayangan.
- Keduanya disembunyikan pada awalnya, kemudian ditambahkan ke scene.
- `lightHelpersVisible` mencatat apakah helper sedang tampil.
- `setLightHelpersVisible(...)` mengubah visibilitas helper, memperbarui tombol dan atribut aksesibilitas, menyegarkan helper, dan menampilkan toast jika diperlukan.
- Event `click` pada tombol helper membalik status tampilnya.
- `lightOrbitEnabled` menyimpan apakah cahaya bergerak mengorbit.
- `setLightOrbitEnabled(...)` mengubah status itu, memperbarui teks tombol dan atribut aksesibilitas, serta menampilkan toast.
- Event `click` pada tombol orbit menyalakan atau mematikan pergerakan cahaya.

## 13. Slider FOV dan intensitas cahaya

- `fovSlider` mengambil slider untuk sudut pandang kamera.
- `syncFOVUI()` menampilkan nilai FOV kamera perspektif pada slider dan label.
- Slider dinonaktifkan jika kamera aktif bukan Perspective.
- Teks petunjuk berubah sesuai kamera yang aktif.
- Event `input` pada slider FOV mengubah `perspectiveCamera.fov`, memperbarui matriks proyeksi, dan menyegarkan label.
- Event `input` pada slider intensitas directional light mengubah kekuatan cahaya dan labelnya.
- Event `input` pada slider ambient light melakukan hal serupa untuk cahaya lingkungan. `toFixed(2)` membatasi angka menjadi dua desimal, lalu `.replace(...)` merapikan tampilan angka.

## 14. Kontrol Orbit melalui UI

- `syncOrbitControlsUI()` menyamakan checkbox dan slider UI dengan nilai dalam `orbitSettings`.
- `applyOrbitSettings()` menerapkan pengaturan itu ke OrbitControls yang aktif. Jika kontrol belum tersedia, fungsi langsung berhenti.
- Event `change` untuk checkbox enable, pan, dan damping memperbarui pengaturan, menerapkannya, lalu menampilkan pesan.
- Event `input` untuk slider damping, kecepatan rotasi, dan kecepatan zoom memperbarui nilai dan label, lalu menerapkannya ke kontrol aktif.

## 15. Kualitas bayangan

- `shadowQuality` menyimpan resolusi bayangan yang aktif.
- `setShadowQuality(size, notify)` mengubah resolusi berdasarkan nilai yang diterima.
- Jika peta bayangan lama sudah dibuat, `dispose()` membersihkannya dan nilainya diatur ulang agar dibuat ulang.
- `shadow.mapSize.set(...)` mengatur lebar dan tinggi peta bayangan.
- `shadow.needsUpdate = true` memberi tahu Three.js bahwa bayangan perlu diperbarui.
- `querySelectorAll('.quality-button')` mengambil semua tombol kualitas.
- `forEach(...)` menandai tombol yang sesuai sebagai aktif dan memperbarui `aria-pressed`.
- `info.shadow.textContent` memperbarui statistik resolusi bayangan.
- Toast menampilkan resolusi baru jika notifikasi diaktifkan.
- Event `click` pada setiap tombol kualitas memanggil fungsi tersebut dengan resolusi dari atribut `data-quality`.

## 16. Berpindah dan mereset kamera

- `updateCameraButton()` menentukan apakah kamera aktif adalah Perspective atau Orthographic, lalu memperbarui teks tombol, statistik, dan tampilan FOV.
- `switchCamera()` menyimpan target kontrol saat ini, memilih kamera satunya, lalu menyalin posisi dan arah kamera aktif ke kamera pengganti agar tampilan tidak meloncat.
- Zoom kamera pengganti direset ke `1`, lalu matriks proyeksinya diperbarui.
- Kamera pengganti ditetapkan sebagai kamera aktif.
- `attachControls(...)` memasang ulang OrbitControls pada kamera baru dengan target sebelumnya.
- Tombol dan toast diperbarui sesuai kamera yang aktif.
- `resetCamera()` mengaktifkan kembali Perspective Camera dan mengembalikan posisi, FOV, serta zoom kedua kamera ke nilai awal.
- Setelah matriks proyeksi diperbarui, kontrol dipasang kembali dengan target awal, lalu UI dan toast diperbarui.
- Event `click` menghubungkan tombol kamera dan reset dengan fungsi masing-masing.

## 17. Mengatur animasi dan material kubus

- `animationEnabled` menyimpan apakah animasi berjalan.
- `setAnimationEnabled(...)` mengubah status animasi, teks tombol, dan statistik HUD, lalu menampilkan pesan.
- Event `click` pada tombol animasi membalik status tersebut.
- `toggleCubeMaterial()` berganti antara material Lambert dan Basic.
- Fungsi itu juga memperbarui material kubus, label tombol, statistik, dan pesan toast.
- Event `click` menghubungkan tombol material dengan fungsi tersebut.

## 18. Input keyboard

- `pressedKeys` adalah `Set` yang mencatat tombol gerak yang sedang ditekan.
- `isTypingTarget(target)` memeriksa apakah fokus sedang berada pada elemen input, tombol, atau elemen UI lain, supaya tombol pintasan tidak mengganggu interaksi tersebut.
- Event `keydown` mengabaikan input jika fokus berada pada elemen UI tersebut.
- `supported` berisi tombol panah serta Q dan E untuk menggerakkan atau memutar kubus.
- Jika salah satu tombol gerak ditekan, kodenya dimasukkan ke `pressedKeys` dan aksi bawaan browser dicegah.
- `event.repeat` mencegah tombol pintasan satu kali—seperti P, R, Space, dan M—terpicu berulang saat tombol ditahan.
- `KeyP` mengganti kamera.
- `KeyR` mereset kamera.
- `Space` menghentikan atau melanjutkan animasi.
- `KeyM` mengganti material kubus.
- Event `keyup` menghapus tombol dari `pressedKeys` saat dilepas.
- Event `blur` mengosongkan semua tombol saat jendela kehilangan fokus, agar gerakan tidak terus berlangsung.

## 19. Statistik HUD

- `countMeshes()` menelusuri isi scene dan menghitung objek yang merupakan mesh.
- `fpsFrameCount`, `fpsElapsed`, dan `fps` dipakai untuk menghitung FPS.
- `hudElapsed` mencatat waktu sejak HUD terakhir diperbarui.
- `updateHUD()` memperbarui jumlah mesh, jumlah segitiga yang dirender, FPS, dan posisi kamera.
- Fungsi ini juga menyegarkan informasi material kubus dan status animasi.

## 20. Toast dan penyesuaian ukuran jendela

- `toastTimeout` menyimpan ID timer pesan toast.
- `showToast(message)` mengubah isi pesan, menampilkan toast, membatalkan timer sebelumnya, lalu menyembunyikan pesan setelah 1,5 detik.
- `handleResize()` membaca ulang ukuran jendela dan memastikan tingginya minimal 1.
- Rasio layar yang baru dipakai untuk memperbarui kamera perspektif dan batas kamera ortografis.
- Kedua matriks proyeksi diperbarui dan ukuran renderer disesuaikan.
- Rasio piksel juga disesuaikan dengan batas maksimum 2.
- Event `resize` memanggil fungsi tersebut setiap kali ukuran jendela berubah.

## 21. Animation loop

- `clock` mengukur waktu antartampilan frame.
- `elapsed` mencatat waktu total yang dipakai dalam animasi.
- `animate()` meminta browser memanggil fungsi itu lagi pada frame berikutnya.
- `rawDelta` menyimpan jarak waktu antar-frame, sedangkan `delta` membatasinya hingga maksimal 0,05 detik agar animasi tidak meloncat jauh setelah jeda.
- `controls.update()` memperbarui OrbitControls setiap frame.
- Jika animasi aktif:
  - waktu total bertambah;
  - kubus dan bola berotasi;
  - posisi vertikal bola berubah mengikuti fungsi sinus, sehingga bola terlihat naik-turun;
  - torus berotasi;
  - jika orbit cahaya aktif, posisi cahaya bergerak melingkar, penandanya mengikuti, dan target cahaya diarahkan ke scene.
- Setelah itu, kecepatan gerak dan rotasi kubus dihitung berdasarkan `delta`.
- Pemeriksaan `pressedKeys.has(...)` memindahkan kubus dengan tombol panah dan memutarnya dengan Q atau E.
- Jika helper cahaya terlihat, tampilannya diperbarui.
- `fpsFrameCount` dan `fpsElapsed` mengumpulkan data FPS. Setiap setengah detik, FPS dihitung lalu penghitungnya direset.
- `renderer.render(scene, activeCamera)` menggambar scene menggunakan kamera aktif.
- `hudElapsed` menghitung waktu untuk pembaruan HUD. Setiap 0,25 detik, `updateHUD()` dipanggil.

## 22. Kondisi awal dan mulai

Bagian terakhir menyiapkan kondisi awal halaman:

- `attachControls(...)` memasang kontrol pada kamera aktif.
- `setShadowQuality(1024, false)` menetapkan kualitas bayangan awal tanpa toast.
- `setGalleryVisible(true, false)` menampilkan galeri material tanpa toast.
- `setLightHelpersVisible(false, false)` menyembunyikan helper cahaya tanpa toast.
- `setLightOrbitEnabled(true, false)` mengaktifkan orbit cahaya tanpa toast.
- `syncFOVUI()` dan `syncOrbitControlsUI()` menyamakan UI dengan nilai awal.
- `updateHUD()` mengisi statistik awal.
- `animate()` memulai loop animasi.

## Ringkasan untuk penutup demo

File ini membangun scene Three.js, menyediakan kontrol interaktif lewat UI dan keyboard, lalu memperbarui animasi serta statistik secara terus-menerus di dalam animation loop.
