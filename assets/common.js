// assets/common.js — PACDI Store
// NOT: Dil (setLanguage) ve nav (buildMenu) mantığı buradan KALDIRILDI.
// Her sayfa kendi i18n sistemini ve nav'ını kendi <script> bloğunda yönetiyor.
// Bu dosya artık SADECE login/Pro/dashboard (userPanel) işlevlerinden sorumlu.

const langData = {
  tr: {
    login: "Giriş Yap", logout: "Çıkış", pro: "⭐ PRO",
    dashboard: "📊 QR'larım", guest: "Misafir", user: "👤 Kullanıcı",
    upgrade: "⬆ Yükselt", already_pro: "Zaten Pro üyesisiniz!",
    login_prompt_email: "E-posta:", login_prompt_password: "Şifre:",
    login_success: "Giriş başarılı!", login_fail: "Giriş başarısız: ",
    logout_success: "Çıkış yapıldı.", need_login: "Lütfen önce giriş yapın.",
    pro_feature: "Bu özellik Pro aboneliği gerektirir.",
    paddle_vendor: 12345, paddle_token: "YOUR_PADDLE_CLIENT_TOKEN", paddle_priceId: "pri_xxxxxxxxxxxxx"
  },
  de: {
    login: "Anmelden", logout: "Abmelden", pro: "⭐ PRO",
    dashboard: "📊 Meine QR-Codes", guest: "Gast", user: "👤 Benutzer",
    upgrade: "⬆ Upgrade", already_pro: "Sie sind bereits PRO-Mitglied!",
    login_prompt_email: "E-Mail:", login_prompt_password: "Passwort:",
    login_success: "Anmeldung erfolgreich!", login_fail: "Anmeldung fehlgeschlagen: ",
    logout_success: "Abgemeldet.", need_login: "Bitte melden Sie sich zuerst an.",
    pro_feature: "Dieses Feature erfordert ein PRO-Abonnement.",
    paddle_vendor: 12345, paddle_token: "YOUR_PADDLE_CLIENT_TOKEN", paddle_priceId: "pri_xxxxxxxxxxxxx"
  },
  en: {
    login: "Login", logout: "Logout", pro: "⭐ PRO",
    dashboard: "📊 My QR Codes", guest: "Guest", user: "👤 User",
    upgrade: "⬆ Upgrade", already_pro: "You are already a PRO member!",
    login_prompt_email: "Email:", login_prompt_password: "Password:",
    login_success: "Login successful!", login_fail: "Login failed: ",
    logout_success: "Logged out.", need_login: "Please login first.",
    pro_feature: "This feature requires a PRO subscription.",
    paddle_vendor: 12345, paddle_token: "YOUR_PADDLE_CLIENT_TOKEN", paddle_priceId: "pri_xxxxxxxxxxxxx"
  }
};

let userToken = localStorage.getItem('token') || null;
let isPro = localStorage.getItem('isPro') === 'true';

// ── Aktif dili sayfanın kendi sisteminden oku (sessionStorage.autoLang) ──
function getCommonLang() {
  try {
    var l = sessionStorage.getItem('autoLang');
    if (l && langData[l]) return l;
  } catch (e) {}
  return 'de';
}

function t(key) {
  var lang = getCommonLang();
  return (langData[lang] && langData[lang][key]) || key;
}

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
    if (proBtn) { proBtn.style.display = 'inline-block'; proBtn.innerText = isPro ? t('pro') : t('upgrade'); }
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

function enableProFeatures(enable) {}

function initPaddle() {
  if (typeof Paddle === 'undefined') return;
  var lang = getCommonLang();
  Paddle.Environment.set('sandbox');
  Paddle.Initialize({ vendor: langData[lang].paddle_vendor, token: langData[lang].paddle_token });
}

function openPaddleCheckout() {
  if (!userToken) { alert(t('need_login')); return; }
  if (typeof Paddle === 'undefined') { alert('Paddle yüklenemedi.'); return; }
  var lang = getCommonLang();
  Paddle.Checkout.open({
    items: [{ priceId: langData[lang].paddle_priceId, quantity: 1 }],
    successUrl: 'https://pacdi.store/success',
    cancelUrl: 'https://pacdi.store/cancel',
    customerEmail: 'user@example.com',
  });
}

// ── HAMBURGER MENÜ ──
window.toggleMenu = function() {
  var m = document.getElementById('mobile-menu');
  if (!m) return;
  m.style.display = m.style.display === 'block' ? 'none' : 'block';
};

document.addEventListener('click', function(e) {
  var header = document.getElementById('site-header');
  if (!header) return;
  if (!header.contains(e.target)) {
    var m = document.getElementById('mobile-menu');
    if (m) m.style.display = 'none';
  }
});

// NOT: buildMenu() KALDIRILDI.
// Her sayfanın kendi inline script'i #mainNav'ı kendi i18n sistemiyle dolduruyor.
// common.js artık nav'a hiç dokunmuyor — çakışma riski sıfırlandı.

function loginUser() {
  const email = prompt(t('login_prompt_email')); if (!email) return;
  const password = prompt(t('login_prompt_password')); if (!password) return;
  fetch('/api/user/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        userToken = data.token; isPro = data.isPro || false;
        localStorage.setItem('token', userToken); localStorage.setItem('isPro', JSON.stringify(isPro));
        updateUI(); alert(t('login_success'));
        if (typeof loadDashboard === 'function') loadDashboard();
      } else { alert(t('login_fail') + (data.error || '')); }
    }).catch(err => alert('Sunucu hatası: ' + err.message));
}

function logoutUser() {
  localStorage.removeItem('token'); localStorage.removeItem('isPro');
  userToken = null; isPro = false; updateUI();
  const ds = document.getElementById('dashboardSection');
  if (ds) ds.style.display = 'none';
  alert(t('logout_success'));
}

function loadDashboard() {
  if (!userToken) return;
  const qrList = document.getElementById('qrList'); if (!qrList) return;
  fetch('/api/qr/list', { headers: { 'Authorization': 'Bearer ' + userToken } })
    .then(res => res.json())
    .then(qrs => {
      if (!qrs.length) { qrList.innerHTML = '<p style="color:#9bb7d4;font-size:0.8rem;">Henüz QR oluşturmadınız.</p>'; return; }
      qrList.innerHTML = qrs.map(qr => `<div class="qr-list-item"><div class="info"><strong>${qr.type==='dynamic'?'🔗 Dinamik':'📄 Statik'}</strong><span>${new Date(qr.createdAt).toLocaleDateString()}</span>${qr.shortCode?`<span>🔗 /s/${qr.shortCode}</span>`:''}</div><div class="actions">${qr.type==='dynamic'?`<button onclick="editQR('${qr._id}')">✏️</button>`:''}<button class="delete" onclick="deleteQR('${qr._id}')">🗑️</button></div></div>`).join('');
    }).catch(err => console.error('Dashboard yüklenemedi:', err));
}

window.editQR = function(id) {
  const newUrl = prompt('Yeni hedef URL girin:'); if (!newUrl) return;
  fetch(`/api/qr/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + userToken }, body: JSON.stringify({ destinationUrl: newUrl }) })
    .then(res => res.json()).then(data => { if (data.success) { alert('Güncellendi!'); loadDashboard(); } else alert('Hata: ' + data.error); })
    .catch(err => alert('Sunucu hatası: ' + err.message));
};

window.deleteQR = function(id) {
  if (!confirm('Bu QR kodunu silmek istediğinize emin misiniz?')) return;
  fetch(`/api/qr/${id}`, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + userToken } })
    .then(res => res.json()).then(data => { if (data.success) { alert('Silindi.'); loadDashboard(); } else alert('Hata: ' + data.error); })
    .catch(err => alert('Sunucu hatası: ' + err.message));
};

function initCommon() {
  // ── setLanguage(savedLang) ve buildMenu() ARTIK ÇAĞRILMIYOR ──
  const userPanel = document.getElementById('userPanel');
  if (userPanel) {
    userPanel.innerHTML = `
      <span id="userStatus">${t('guest')}</span>
      <button id="loginBtn" class="btn-sm">${t('login')}</button>
      <button id="logoutBtn" class="btn-sm logout" style="display:none;">${t('logout')}</button>
      <button id="proBtn" class="btn-sm" style="display:none;background:#F6B45F;color:#04162E;border:none;font-weight:bold;">${t('pro')}</button>
      <button id="dashboardToggle" class="btn-sm" style="display:none;background:#0a1018;border:1px solid #3498DB;color:#3498DB;">${t('dashboard')}</button>
    `;
    document.getElementById('loginBtn').addEventListener('click', loginUser);
    document.getElementById('logoutBtn').addEventListener('click', logoutUser);
    document.getElementById('proBtn').addEventListener('click', function() {
      if (isPro) alert(t('already_pro')); else openPaddleCheckout();
    });
    document.getElementById('dashboardToggle').addEventListener('click', function() {
      const ds = document.getElementById('dashboardSection');
      if (ds) { ds.style.display = ds.style.display === 'none' ? 'block' : 'none'; if (ds.style.display === 'block') loadDashboard(); }
    });
  }
  initPaddle();
  updateUI();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCommon);
} else {
  initCommon();
}

window.initCommon = initCommon;
