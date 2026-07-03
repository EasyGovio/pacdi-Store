
(function() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(function(){});
  }
  var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  var isInStandalone = ('standalone' in navigator && navigator.standalone);
  var shown = sessionStorage.getItem('pwa-banner-shown');
  if (shown || isInStandalone) return;
  if (isIOS) {
    setTimeout(function() {
      var bar = document.createElement('div');
      bar.id = 'pwa-banner';
      bar.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#04162E;border-top:2px solid #F6B45F;padding:14px 16px;z-index:9999;font-family:system-ui;';
      bar.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">' +
          '<div>' +
            '<div style="color:#F6B45F;font-size:0.82rem;font-weight:700;margin-bottom:4px;">📲 Ana ekrana ekle</div>' +
            '<div style="color:#b0b5bf;font-size:0.75rem;line-height:1.5;">Safari\'de <strong style="color:#eaf2fb;">&#11015; Paylaş</strong> butonuna bas, ardından <strong style="color:#eaf2fb;">Ana Ekrana Ekle</strong> seçeneğini seç.</div>' +
            '<div style="color:#4a6a88;font-size:0.68rem;margin-top:4px;">&#9432; iOS\'ta otomatik kurulum desteklenmiyor — bu adım gerekli.</div>' +
          '</div>' +
          '<button onclick="document.getElementById(\'pwa-banner\').remove();sessionStorage.setItem(\'pwa-banner-shown\',\'1\')" style="background:transparent;border:none;color:#7a9ab8;font-size:1.2rem;cursor:pointer;padding:0 4px;flex-shrink:0;">✕</button>' +
        '</div>';
      document.body.appendChild(bar);
      sessionStorage.setItem('pwa-banner-shown', '1');
    }, 3000);
    return;
  }
  var deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredPrompt = e;
    setTimeout(function() {
      if (!deferredPrompt) return;
      var bar = document.createElement('div');
      bar.id = 'pwa-banner';
      bar.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#04162E;border-top:2px solid #F6B45F;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;z-index:9999;font-family:system-ui;';
      bar.innerHTML =
        '<span style="color:#eaf2fb;font-size:0.85rem;">📲 Ana ekrana ekle &mdash; daha hızlı aç!</span>' +
        '<div style="display:flex;gap:8px;">' +
          '<button onclick="installPWA()" style="background:#F6B45F;border:none;color:#04162E;padding:6px 16px;border-radius:20px;font-weight:700;cursor:pointer;font-size:0.82rem;">Ekle</button>' +
          '<button onclick="document.getElementById(\'pwa-banner\').remove();sessionStorage.setItem(\'pwa-banner-shown\',\'1\')" style="background:transparent;border:1px solid rgba(246,180,95,0.3);color:#7a9ab8;padding:6px 12px;border-radius:20px;cursor:pointer;font-size:0.82rem;">Sonra</button>' +
        '</div>';
      document.body.appendChild(bar);
    }, 3000);
  });
  window.installPWA = function() {
    if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt.userChoice.then(function(){ deferredPrompt=null; }); }
    var b = document.getElementById('pwa-banner'); if (b) b.remove();
    sessionStorage.setItem('pwa-banner-shown', '1');
  };
})();
