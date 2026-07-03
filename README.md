# PACDI Store — Ücretsiz İşletme Araçları

Küçük işletmeler ve zanaatkarlar için ücretsiz, kayıt gerektirmeyen web araçları:
QR/Barkod oluşturucu, DGUV V3 Prüfprotokoll, Quittung (makbuz) oluşturucu, envanter
yönetimi ve daha fazlası.

**Canlı site:** https://pacdi.store

## Mimari

Bu proje **tamamen statik** bir GitHub Pages sitesidir — sunucu, veritabanı veya
build adımı yoktur. Her araç tek bir bağımsız HTML dosyasıdır (inline CSS + JS,
ES5 uyumlu vanilla JavaScript). Dış bağımlılıklar yalnızca CDN üzerinden
(jsPDF, QRCode.js vb.) yüklenir.

```
/index.html              Ana sayfa ve araç dizini
/qr.html                 QR/Barkod oluşturucu
/scanner.html             QR/Barkod tarayıcı (kamera)
/quittung.html            Kleinbetragsrechnung / Quittung oluşturucu
/pruefprotokoll.html      DGUV V3 Prüfprotokoll oluşturucu
/envanter.html            Envanter yönetimi
/zeiterfassung.html       Zaman takibi
/backup.html              Google Drive yedekleme
/blog/                    SEO makaleleri
/assets/                  Paylaşılan common.css / common.js
```

## Yayınlama

Ayrı bir kurulum adımı yoktur. `main` dalına yapılan her push, GitHub Actions
(`inject-analytics.yml`) tarafından otomatik olarak işlenir: `inject.py`
Analytics/AdSense/canonical/PWA etiketlerini ilgili HTML dosyalarına ekler
ve değişiklikleri otomatik commit eder. GitHub Pages ardından siteyi
`pacdi.store` adresine otomatik yayınlar.

## Yeni Araç Ekleme

1. Kök dizine (ya da `/blog/`'a) tek dosyalık, ES5 uyumlu bir HTML dosyası ekleyin.
2. Kişisel/dahili kullanım için olan dosyalar public'e/sitemap'e girmemeli —
   dosya adını `mein-`, `private-`, `intern-` veya `ausbildung-` ile başlatın;
   `inject.py` bu önekleri otomatik olarak private/`noindex` sayar.
3. Push edin — geri kalanı otomasyon halleder.

## Lisans

Bkz. `LICENSE` — bu depo, sahibinin izni olmadan kullanılamaz/kopyalanamaz.
FSEK Tescil No: 2026/18897.
