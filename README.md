# PACDI Store – Freemium QR Platform

Bu proje modüler yapıdadır. `index.html` ana QR oluşturucu, `scanner.html` ise QR/Barkod tarayıcıdır.

## Kurulum
1. Backend'i `backend/` klasöründe `.env` ile yapılandırıp `npm install && npm start` çalıştırın.
2. Frontend dosyalarını Vercel'e deploy edin.
3. `vercel.json` ile API yönlendirmelerini ayarlayın.

## Yeni Araç Ekleme
- `assets/common.js` ve `common.css` ortak kullanılır.
- Yeni bir HTML dosyası oluşturup, `initCommon()` çağırın.

## Lisans
MIT
