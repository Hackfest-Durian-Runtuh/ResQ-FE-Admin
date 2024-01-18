
# Res-Q
Sistem Pemanggilan Layanan Darurat Terpadu ini dirancang untuk mempercepat dan meningkatkan efisiensi penanganan gawat darurat di berbagai negara berkembang seperti Indonesia.

## Deskripsi
Sistem ini memungkinkan pengguna untuk dapat mengakses nomor berbagai unit layanan darurat (ambulans, pemadam kebakaran, bantuan SAR, dan kepolisian) di setiap daerah. 

Aplikasi juga memungkinkan pengguna menyimpan informasi pribadi serta rekam medis yang telah diisi sebelumnya Pre-Filled Information. Informasi tersebut akan secara otomatis terkirim saat panggilan darurat dilakukan tanpa perlu penyampaian secara berulang.

Selain itu, terdapat fitur Live Tracking sehingga pengguna dan petugas lapangan dapat saling terhubung dan mendapatkan informasi update secara berkala terkait lokasi dan status penanganan.

## Tech Stack
Teknologi yang digunakan untuk App Client dan Driver:
- Firebase
- Kotlin (Jetpack Compose)
- Ktor untuk HTTP Client

Teknologi yang digunakan untuk Web Admin:
- Firebase
- NextJS

## Output

 - App Client: https://drive.google.com/file/d/1Vo8D_Az0xMTnkR7YVcAp2s6V3XpK2J2M/view?usp=sharing
 - App Driver: https://drive.google.com/file/d/1i2Dney8yWIY0H10hv9FczA_UdcSz8QWC/view?usp=sharing
 - Website Admin: https://resq-admin.vercel.app/

## Penggunaan
### > Client
Untuk penggunaan, registrasi sudah bisa dengan menggunakan nomor asli (OTP Sudah bekerja).  Namun jika ingin menggunakan nomor demo, dapat menggunakan:
 - nomor: +6281-553-993-193 
 - OTP: 123456

### > Driver
Masuk secara langsung dengan menekan tombol pada driver yang diinginkan

### > Admin
Masuk dengan meng-*copy* id dari penyedia layanan emergency, kemudian *paste* di form yang disediakan. Kemudian masuk.

## Screenshot dari Repository ini (Website Admin) 


<img src="https://github.com/Hackfest-Durian-Runtuh/ResQ-FE-Admin/blob/master/ss/login.JPG?raw=true" alt="drawing" width="1000"/>

<img src="https://github.com/Hackfest-Durian-Runtuh/ResQ-FE-Admin/blob/master/ss/logged_in.JPG?raw=true" alt="drawing" width="1000"/>

<img src="https://github.com/Hackfest-Durian-Runtuh/ResQ-FE-Admin/blob/master/ss/lihat_pemohon.JPG?raw=true" alt="drawing" width="1000"/>

<img src="https://github.com/Hackfest-Durian-Runtuh/ResQ-FE-Admin/blob/master/ss/kirim_petugas.JPG?raw=true" alt="drawing" width="1000"/>
