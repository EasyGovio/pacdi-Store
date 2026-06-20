# PACDI Store - QR Kod Oluşturucu (Freemium)

Bu proje, statik ve dinamik QR kod oluşturma, renk/logo/boyut özelleştirme, Paddle ile abonelik yönetimi ve kullanıcı paneline sahiptir.

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

## Lisans

MIT
