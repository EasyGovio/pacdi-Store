// assets/common.js

// ---------- DİL VERİLERİ ----------
const langData = {
  tr: {
    title: "PACDI Store",
    menu_home: "🏠 Ana Sayfa",
    menu_scanner: "📷 Tarayıcı",
    menu_shortener: "🔗 Kısa Link",
    menu_password: "🔐 Şifre",
    menu_pruef: "⚡ Prüfprotokoll",
    login: "Giriş Yap",
    logout: "Çıkış",
    pro: "⭐ PRO",
    dashboard: "📊 QR'larım",
    guest: "Misafir",
    user: "👤 Kullanıcı",
    upgrade: "⬆ Yükselt",
    already_pro: "Zaten Pro üyesisiniz!",
    login_prompt_email: "E-posta:",
    login_prompt_password: "Şifre:",
    login_success: "Giriş başarılı!",
    login_fail: "Giriş başarısız: ",
    logout_success: "Çıkış yapıldı.",
    need_login: "Lütfen önce giriş yapın.",
    pro_feature: "Bu özellik Pro aboneliği gerektirir.",
    paddle_vendor: 12345, // Değiştir
    paddle_token: "YOUR_PADDLE_CLIENT_TOKEN", // Değiştir
    paddle_priceId: "pri_xxxxxxxxxxxxx" // Değiştir
  },
  de: {
    title: "PACDI Store",
    menu_home: "🏠 Startseite",
    menu_scanner: "📷 Scanner",
    menu_shortener: "🔗 Kurzlink",
    menu_password: "🔐 Passwort",
    menu_pruef: "⚡ Prüfprotokoll",
    login: "Anmelden",
    logout: "Abmelden",
    pro: "⭐ PRO",
    dashboard: "📊 Meine QR-Codes",
    guest: "Gast",
    user: "👤 Benutzer",
    upgrade: "⬆ Upgrade",
    already_pro: "Sie sind bereits PRO-Mitglied!",
    login_prompt_email: "E-Mail:",
    login_prompt_password: "Passwort:",
    login_success: "Anmeldung erfolgreich!",
    login_fail: "Anmeldung fehlgeschlagen: ",
    logout_success: "Abgemeldet.",
    need_login: "Bitte melden Sie sich zuerst an.",
    pro_feature: "Dieses Feature erfordert ein PRO-Abonnement.",
    paddle_vendor: 12345,
    paddle_token: "YOUR_PADDLE_CLIENT_TOKEN",
    paddle_priceId: "pri_xxxxxxxxxxxxx"
  },
  en: {
    title: "PACDI Store",
    menu_home: "🏠 Home",
    menu_scanner: "📷 Scanner",
    menu_shortener: "🔗 Short Link",
    menu_password: "🔐 Password",
    menu_pruef: "⚡ Protocol",
    login: "Login",
    logout: "Logout",
    pro: "⭐ PRO",
    dashboard: "📊 My QR Codes",
    guest: "Guest",
    user: "👤 User",
    upgrade: "⬆ Upgrade",
    already_pro: "You are already a PRO member!",
    login_prompt_email: "Email:",
    login_prompt_password: "Password:",
    login_success: "Login successful!",
    login_fail: "Login failed: ",
    logout_success: "Logged out.",
    need_login: "Please login first.",
    pro_feature: "This feature requires a PRO subscription.",
    paddle_vendor: 12345,
    paddle_token: "YOUR_PADDLE_CLIENT_TOKEN",
    paddle_priceId: "pri_xxxxxxxxxxxxx"
  }
};

let currentLang = "tr";
let userToken = localStorage.getItem('token') || null;
let isPro = localStorage.getItem('isPro') === 'true';

// ---------- DİL FONKSİYONLARI ----------
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  updateUI();
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function getLang() {
  return currentLang;
}

function t(key) {
  return langData[currentLang][key] || key;
}

// ---------- KULLANICI İŞLEMLERİ ----------
function updateUI() {
  const userStatus = document.getElementById('userStatus');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const proBtn = document.getElementById('proBtn');
  const dashboardToggle = document.getElementById('dashboardToggle');

  if (!userStatus) return;

  if (userToken) {
    userStatus.innerText = t('user');
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
    if (dashboardToggle) dashboardToggle.style.display = 'inline-block';
    if (proBtn) {
      proBtn.style.display = 'inline-block';
      proBtn.innerText = isPro ? t('pro') : t('upgrade');
    }
    // Pro özelliklerini aktif/pasif yap (sayfa özelinde)
    enableProFeatures(isPro);
  } else {
    userStatus.innerText = t('guest');
    if (loginBtn) loginBtn.style.display = 'inline-block';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (proBtn) proBtn.style.display = 'none';
    if (dashboardToggle) dashboardToggle.style.display = 'none';
    enableProFeatures(false);
  }
}

function enableProFeatures(enable) {
  // Bu fonksiyon her sayfada override edilebilir
  // Varsayılan olarak hiçbir şey yapmaz
}

// ---------- PADDLE ----------
function initPaddle() {
  if (typeof Paddle === 'undefined') return;
  Paddle.Environment.set('sandbox'); // canlıda 'production'
  Paddle.Initialize({
    vendor: langData[currentLang].paddle_vendor,
    token: langData[currentLang].paddle_token,
  });
}

function openPaddleCheckout() {
  if (!userToken) {
    alert(t('need_login'));
    return;
  }
  if (typeof Paddle === 'undefined') {
    alert('Paddle yüklenemedi, lütfen sayfayı yenileyin.');
    return;
  }
  const items = [{
    priceId: langData[currentLang].paddle_priceId,
    quantity: 1
  }];
  Paddle.Checkout.open({
    items: items,
    successUrl: 'https://pacdi.store/success',
    cancelUrl: 'https://pacdi.store/cancel',
    customerEmail: 'user@example.com',
  });
}

// ---------- MENÜ ----------
function buildMenu() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  nav.innerHTML = `
    <a href="/index.html" class="${currentPage === 'index.html' ? 'active' : ''}">${t('menu_home')}</a>
    <a href="/scanner.html" class="${currentPage === 'scanner.html' ? 'active' : ''}">${t('menu_scanner')}</a>
    <a href="/shortener.html" class="${currentPage === 'shortener.html' ? 'active' : ''}">${t('menu_shortener')}</a>
    <a href="/password.html" class="${currentPage === 'password.html' ? 'active' : ''}">${t('menu_password')}</a>
    <a href="/qr.html" class="${currentPage === 'qr.html' ? 'active' : ''">${t('menu_qr')}</a>
    <a href="/pruefprotokoll.html" class="${currentPage === 'pruefprotokoll.html' ? 'active' : ''}">${t('menu_pruef')}</a>
  `;
}

// ---------- LOGIN / LOGOUT ----------
function loginUser() {
  const email = prompt(t('login_prompt_email'));
  if (!email) return;
  const password = prompt(t('login_prompt_password'));
  if (!password) return;

  fetch('/api/user/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        userToken = data.token;
        isPro = data.isPro || false;
        localStorage.setItem('token', userToken);
        localStorage.setItem('isPro', JSON.stringify(isPro));
        updateUI();
        alert(t('login_success'));
        if (typeof loadDashboard === 'function') loadDashboard();
      } else {
        alert(t('login_fail') + (data.error || ''));
      }
    })
    .catch(err => alert('Sunucu hatası: ' + err.message));
}

function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('isPro');
  userToken = null;
  isPro = false;
  updateUI();
  const dashboardSection = document.getElementById('dashboardSection');
  if (dashboardSection) dashboardSection.style.display = 'none';
  alert(t('logout_success'));
}

// ---------- DASHBOARD (QR listeleme) ----------
function loadDashboard() {
  if (!userToken) return;
  const qrList = document.getElementById('qrList');
  if (!qrList) return;
  fetch('/api/qr/list', {
    headers: { 'Authorization': 'Bearer ' + userToken }
  })
    .then(res => res.json())
    .then(qrs => {
      if (!qrs.length) {
        qrList.innerHTML = '<p style="color:#9bb7d4; font-size:0.8rem;">Henüz QR oluşturmadınız.</p>';
        return;
      }
      qrList.innerHTML = qrs.map(qr => `
        <div class="qr-list-item">
          <div class="info">
            <strong>${qr.type === 'dynamic' ? '🔗 Dinamik' : '📄 Statik'}</strong>
            <span>${new Date(qr.createdAt).toLocaleDateString()}</span>
            ${qr.shortCode ? `<span>🔗 /s/${qr.shortCode}</span>` : ''}
          </div>
          <div class="actions">
            ${qr.type === 'dynamic' ? `<button onclick="editQR('${qr._id}')">✏️</button>` : ''}
            <button class="delete" onclick="deleteQR('${qr._id}')">🗑️</button>
          </div>
        </div>
      `).join('');
    })
    .catch(err => console.error('Dashboard yüklenemedi:', err));
}

// ---------- QR DÜZENLEME / SİLME (global) ----------
window.editQR = function(id) {
  const newUrl = prompt('Yeni hedef URL girin:');
  if (!newUrl) return;
  fetch(`/api/qr/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userToken
    },
    body: JSON.stringify({ destinationUrl: newUrl })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Güncellendi!');
        loadDashboard();
      } else {
        alert('Hata: ' + data.error);
      }
    })
    .catch(err => alert('Sunucu hatası: ' + err.message));
};

window.deleteQR = function(id) {
  if (!confirm('Bu QR kodunu silmek istediğinize emin misiniz?')) return;
  fetch(`/api/qr/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + userToken }
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Silindi.');
        loadDashboard();
      } else {
        alert('Hata: ' + data.error);
      }
    })
    .catch(err => alert('Sunucu hatası: ' + err.message));
};

// ---------- ORTAK BAŞLANGIÇ ----------
function initCommon() {
  // Dil
  const savedLang = localStorage.getItem('lang') || 'tr';
  setLanguage(savedLang);

  // Menü
  buildMenu();

  // Kullanıcı panelini oluştur
  const userPanel = document.getElementById('userPanel');
  if (userPanel) {
    userPanel.innerHTML = `
      <span id="userStatus">${t('guest')}</span>
      <button id="loginBtn">${t('login')}</button>
      <button id="logoutBtn" class="logout" style="display:none;">${t('logout')}</button>
      <button id="proBtn" style="display:none; background:#F6B45F; color:#04162E; border:none; font-weight:bold;">${t('pro')}</button>
      <button id="dashboardToggle" style="display:none; background:#0a1018; border:1px solid #3498DB; color:#3498DB;">${t('dashboard')}</button>
    `;
    // Olayları bağla
    document.getElementById('loginBtn').addEventListener('click', loginUser);
    document.getElementById('logoutBtn').addEventListener('click', logoutUser);
    document.getElementById('proBtn').addEventListener('click', function() {
      if (isPro) {
        alert(t('already_pro'));
      } else {
        openPaddleCheckout();
      }
    });
    document.getElementById('dashboardToggle').addEventListener('click', function() {
      const ds = document.getElementById('dashboardSection');
      if (ds) {
        if (ds.style.display === 'none') {
          ds.style.display = 'block';
          loadDashboard();
        } else {
          ds.style.display = 'none';
        }
      }
    });
  }

  // Paddle
  initPaddle();

  // UI güncelle
  updateUI();
}

// Sayfa yüklendiğinde otomatik çalışsın
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCommon);
} else {
  initCommon();
}
