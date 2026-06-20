# PACDI Store - QR Kod Oluşturucu (Freemium)

Bu proje, statik ve dinamik QR kod oluşturma, renk/logo/boyut özelleştirme, vCard/WiFi/Sosyal Medya şablonları, Paddle ile abonelik yönetimi, detaylı analitik (ülke, tarayıcı, cihaz) ve kullanıcı paneline sahiptir.

## Kurulum

1. Backend klasörüne gidin: `cd backend`
2. `.env` dosyasını oluşturun ve gerekli değişkenleri doldurun.
3. `npm install`
4. `npm start` (veya `npm run dev`)

## Frontend

- `index.html` dosyasını Vercel'e deploy edin.
- `vercel.json` ile API yönlendirmelerini ayarlayın.

## Paddle

- Paddle vendor ID, client token ve API key'ini `.env`'ye ekleyin.
- Webhook URL'ini Paddle dashboard'da ayarlayın: `https://backend-url.onrender.com/webhook/paddle`

## Özellikler

- **Şablonlar**: URL, vCard, WiFi, Sosyal Medya (Link-in-Bio)
- **Dinamik QR**: Hedef URL'yi panelden değiştirebilme
- **Analitik**: Tıklama, ülke, tarayıcı, cihaz bilgileri
- **Rate Limiting**: Ücretsiz kullanıcılar günde 5 QR oluşturabilir
- **Dashboard**: QR'ları listeleme, düzenleme, silme
- **Paddle Abonelik**: Aylık 1.99€ / Yıllık 14.90€

## Lisans

MIT
