// PACDI Store – Ortak JavaScript

(function() {
  // ---------- Dil verileri ----------
  const langData = {
    tr: {
      title:"QR KOD", back:"← Geri", generate:"🔳 QR Kod Oluştur",
      placeholder:"Metin veya link girin...", empty:"QR kod burada görünecek",
      footer:"PACDI Store · Hızlı QR kod oluşturucu.", downloadLabel:"İndir",
      purposeLabel:"Bu QR kodu ne için kullanıyorsunuz?",
      p1:"🏪 İşletmem", p2:"📅 Etkinlik", p3:"👤 Kişisel", p4:"🔧 Diğer",
      emailTitle:"📧 Yeni araçlardan haberdar ol",
      emailSub:"İsteğe bağlı — reklam yok, sadece faydalı güncellemeler.",
      emailPlaceholder:"e-posta@adresiniz.com",
      emailBtn:"Katıl", emailSkip:"Şimdi değil",
      emailSuccess:"✓ Teşekkürler! Sizi ekledik.",
      emailPrivacy:"🔒 E-postanız saklanmaz, üçüncü taraflarla paylaşılmaz.",
      businessLabel:"🏪 İşletme sahibiyim — dijital çözümler hakkında bilgi almak istiyorum"
    },
    de: {
      title:"QR CODE", back:"← Zurück", generate:"🔳 QR Code erstellen",
      placeholder:"Text oder Link eingeben...", empty:"QR Code erscheint hier",
      footer:"PACDI Store · Schneller QR Code Generator.", downloadLabel:"Herunterladen",
      purposeLabel:"Wofür verwenden Sie diesen QR Code?",
      p1:"🏪 Geschäft", p2:"📅 Event", p3:"👤 Privat", p4:"🔧 Sonstiges",
      emailTitle:"📧 Über neue Tools informiert bleiben",
      emailSub:"Optional — kein Spam, nur nützliche Updates.",
      emailPlaceholder:"ihre@email.de",
      emailBtn:"Eintragen", emailSkip:"Nicht jetzt",
      emailSuccess:"✓ Danke! Sie wurden eingetragen.",
      emailPrivacy:"🔒 Ihre E-Mail wird nicht gespeichert oder weitergegeben.",
      businessLabel:"🏪 Ich bin Unternehmer — ich möchte Infos zu digitalen Lösungen erhalten"
    },
    en: {
      title:"QR CODE", back:"← Back", generate:"🔳 Generate QR Code",
      placeholder:"Enter text or link...", empty:"QR code will appear here",
      footer:"PACDI Store · Fast QR code generator.", downloadLabel:"Download",
      purposeLabel:"What will you use this QR code for?",
      p1:"🏪 Business", p2:"📅 Event", p3:"👤 Personal", p4:"🔧 Other",
      emailTitle:"📧 Stay updated on new tools",
      emailSub:"Optional — no spam, just useful updates.",
      emailPlaceholder:"your@email.com",
      emailBtn:"Join", emailSkip:"Not now",
      emailSuccess:"✓ Thank you! You're added.",
      emailPrivacy:"🔒 Your email is never stored or shared.",
      businessLabel:"🏪 I\'m a business owner — I\'d like info on digital solutions"
    }
  };

  let currentLang = "tr";
  let userToken = localStorage.getItem('token') || null;
  let isPro = localStorage.getItem('isPro') === 'true';

  // ---------- Dil fonksiyonları ----------
  function updateLanguage() {
    const t = langData[currentLang];
    document.querySelectorAll('[data-lang-key]').forEach(el => {
      const key = el.getAttribute('data-lang-key');
      if (t[key] !== undefined) el.innerText = t[key];
    });
    // placeholder için özel işlem
    const placeholderEl = document.querySelector('[data-lang-placeholder]');
    if (placeholderEl) {
      const key = placeholderEl.getAttribute('data-lang-placeholder');
      if (t[key] !== undefined) placeholderEl.placeholder = t[key];
    }
  }

  function setLanguage(lang) {
    currentLang = lang;
    updateLanguage();
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    localStorage.setItem('lang', lang);
  }

  // ---------- Kullanıcı oturumu ----------
  function updateUserUI() {
    const userStatus = document.getElementById('userStatus');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const proBtn = document.getElementById('proBtn');
    const dashboardToggle = document.getElementById('dashboardToggle');

    if (userToken) {
      userStatus.innerText = '👤 Kullanıcı';
      if (loginBtn) loginBtn.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'inline-block';
      if (dashboardToggle) dashboardToggle.style.display = 'inline-block';
      if (proBtn) {
        proBtn.style.display = 'inline-block';
        proBtn.innerText = isPro ? '⭐ PRO' : '⬆ Yükselt';
      }
      // Pro özelliklerini aktif/pasif yap (sayfa içinde ayrıca kontrol edilecek)
    } else {
      userStatus.innerText = 'Misafir';
      if (loginBtn) loginBtn.style.display = 'inline-block';
      if (logoutBtn) logoutBtn.style.display = 'none';
      if (proBtn) proBtn.style.display = 'none';
      if (dashboardToggle) dashboardToggle.style.display = 'none';
    }
  }

  // ---------- Paddle ----------
  function initPaddle() {
    if (typeof Paddle !== 'undefined') {
      Paddle.Environment.set('sandbox'); // canlıda 'production'
      Paddle.Initialize({
        vendor: 12345, // Değiştirilecek
        token: 'YOUR_PADDLE_CLIENT_TOKEN',
      });
    }
  }

  function openPaddleCheckout() {
    if (!userToken) {
      alert('Lütfen önce giriş yapın.');
      return;
    }
    const items = [{
      priceId: 'pri_xxxxxxxxxxxxx', // Değiştirilecek
      quantity: 1
    }];
    Paddle.Checkout.open({
      items: items,
      successUrl: 'https://pacdi.store/success',
      cancelUrl: 'https://pacdi.store/cancel',
      customerEmail: 'user@example.com',
    });
  }

  // ---------- Dashboard (tüm sayfalarda kullanılabilir) ----------
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
            ${qr.type === 'dynamic' ? `<button onclick="window.editQR('${qr._id}')">✏️</button>` : ''}
            <button class="delete" onclick="window.deleteQR('${qr._id}')">🗑️</button>
          </div>
        </div>
      `).join('');
    })
    .catch(err => console.error('Dashboard yüklenemedi:', err));
  }

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

  // ---------- Menü oluşturma ----------
  function buildMenu() {
    const nav = document.getElementById('mainNav');
    if (!nav) return;
    nav.innerHTML = `
      <div class="top-bar">
        <div class="logo" data-lang-key="title">QR KOD</div>
        <div style="display:flex; gap:6px;">
          <a href="/" class="back-link">🏠</a>
          <a href="/scanner.html" class="back-link">📷</a>
          <a href="/shortener.html" class="back-link">🔗</a>
        </div>
      </div>
      <div class="lang-selector">
        <button class="lang-btn active" data-lang="tr">TR</button>
        <button class="lang-btn" data-lang="de">DE</button>
        <button class="lang-btn" data-lang="en">EN</button>
      </div>
    `;
    // Dil butonlarını bağla
    nav.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const lang = this.dataset.lang;
        if (lang !== currentLang) setLanguage(lang);
      });
    });
    // Mevcut dili aktif yap
    setLanguage(currentLang);
  }

  // ---------- Giriş/Çıkış (event'leri bağla) ----------
  function setupAuthEvents() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const proBtn = document.getElementById('proBtn');
    const dashboardToggle = document.getElementById('dashboardToggle');

    if (loginBtn) {
      loginBtn.addEventListener('click', function() {
        const email = prompt('E-posta:');
        if (!email) return;
        const password = prompt('Şifre:');
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
            updateUserUI();
            alert('Giriş başarılı!');
            loadDashboard();
          } else {
            alert('Giriş başarısız: ' + (data.error || ''));
          }
        })
        .catch(err => alert('Sunucu hatası: ' + err.message));
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('token');
        localStorage.removeItem('isPro');
        userToken = null;
        isPro = false;
        updateUserUI();
        const dashboardSection = document.getElementById('dashboardSection');
        if (dashboardSection) dashboardSection.style.display = 'none';
        alert('Çıkış yapıldı.');
      });
    }

    if (proBtn) {
      proBtn.addEventListener('click', function() {
        if (isPro) {
          alert('Zaten Pro üyesisiniz!');
        } else {
          openPaddleCheckout();
        }
      });
    }

    if (dashboardToggle) {
      dashboardToggle.addEventListener('click', function() {
        const section = document.getElementById('dashboardSection');
        if (section) {
          if (section.style.display === 'none') {
            section.style.display = 'block';
            loadDashboard();
          } else {
            section.style.display = 'none';
          }
        }
      });
    }
  }

  // ---------- E-posta aboneliği (tüm sayfalarda) ----------
  function setupEmailSubscription() {
    const emailBtn = document.getElementById('emailBtn');
    if (!emailBtn) return;
    emailBtn.addEventListener('click', function() {
      const emailInput = document.getElementById('emailInput');
      const email = emailInput ? emailInput.value.trim() : '';
      if (!email || email.indexOf('@') === -1) return;
      const purpose = document.querySelector('.purpose-btn.selected')?.dataset?.purpose || '';
      fetch('/api/user/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose, lang: currentLang })
      })
      .then(res => res.json())
      .then(() => {
        const successEl = document.getElementById('emailSuccess');
        if (successEl) successEl.style.display = 'block';
        if (emailInput) emailInput.value = '';
        const skipEl = document.getElementById('emailSkip');
        if (skipEl) skipEl.style.display = 'none';
      })
      .catch(err => console.error('E-posta hatası:', err));
    });
  }

  // ---------- Genel başlatma ----------
  window.initCommon = function() {
    // Dil
    const savedLang = localStorage.getItem('lang') || 'tr';
    setLanguage(savedLang);

    // Kullanıcı
    updateUserUI();

    // Paddle
    initPaddle();

    // Menü
    buildMenu();

    // Auth event'leri
    setupAuthEvents();

    // E-posta
    setupEmailSubscription();

    // Dil değişimini yakala (menü içindeki butonlar zaten bağlı)
  };

})();
