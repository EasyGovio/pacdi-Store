
(function() {
  var STORAGE_KEY = 'pacdi_inventory';
  var inventory = [];
  var qrInstance = null;
  var currentTab = 'tab-kayit';

  var i18n = {
    tr: {
      page_title: '📦 Envanter & Prüfkontrol',
      page_sub: 'Cihazları kaydet · QR oluştur · Kontrol listesi',
      tab1: '⚙️ Cihaz kaydet',
      tab2: '📄 Envanter listesi',
      tab3: '✅ Prüf kontrolü',
      card1_title: '⚙️ Yeni cihaz kaydet',
      lbl_name: 'Cihaz adı',
      lbl_standort: 'Konum / Alan',
      lbl_serial: 'Envanter kodu (otomatik)',
      lbl_nextcheck: 'Sonraki kontrol tarihi',
      btn_save: '💾 Envantere kaydet',
      card2_title: '📷 Cihaz etiketi önizleme',
      label_hint: 'Bu etiket cihaza yapıştırılacak. QR kod envanter kodunu içerir.',
      btn_print: '🖨️ Etiketi yazdır',
      btn_png: '⬇️ PNG olarak indir',
      list_hint: '💡 Bir kayda tıklayarak envanter kodunu otomatik olarak kontrol alanına aktarın.',
      list_title: '📄 Kayıtlı cihazlar',
      empty_list: 'Henüz cihaz kaydedilmedi.',
      btn_export: '📦 Envanteri dışa aktar (JSON)',
      control_hint: '📷 <strong>İş akışı:</strong> Cihazdaki QR kodu <a href="/scanner.html" style="color:#F6B45F;">Tarayıcı</a> ile okutun <strong>veya</strong> envanter kodunu manuel girin → Onaylayın.',
      control_title: '✅ Cihazı kontrol et ve onayla',
      lbl_checkcode: 'Envanter kodu (QR tarayıcıdan veya manuel)',
      lbl_pruefer: 'Denetçi (İsim / Kısaltma)',
      lbl_ergebnis: 'Denetim sonucu',
      btn_confirm: '✅ Denetimi onayla',
      pending_title: '⏳ Denetim bekleyenler',
      pending_empty: 'Bekleyen denetim yok.',
      legal: 'Yasal & Gizlilik',
      toast_saved: 'Kaydedildi: ',
      toast_updated: 'Güncellendi: ',
      toast_deleted: 'Cihaz silindi.',
      toast_exported: 'Envanter dışa aktarıldı ✓',
      toast_png: 'PNG indirildi ✓',
      toast_confirm: 'Denetim kaydedildi: ',
      toast_error: 'Lütfen cihaz adı ve kod girin.',
      toast_notfound: 'Bu kod envanterde kayıtlı değil.',
      toast_check_ok: '✅ Denetim onaylandı'
    },
    de: {
      page_title: '📦 Inventar & Prüfkontrolle',
      page_sub: 'Geräte erfassen · QR generieren · Kontrollübersicht',
      tab1: '⚙️ Gerät erfassen',
      tab2: '📄 Inventarliste',
      tab3: '✅ Prüfkontrolle',
      card1_title: '⚙️ Neues Gerät erfassen',
      lbl_name: 'Gerätebezeichnung',
      lbl_standort: 'Standort / Bereich',
      lbl_serial: 'Inventar-Code (automatisch generiert)',
      lbl_nextcheck: 'Nächste Prüfung fällig',
      btn_save: '💾 Im Inventar speichern',
      card2_title: '📷 Geräte-Etikett Vorschau',
      label_hint: 'Dieses Etikett wird am Gerät befestigt. QR-Code enthält den Inventar-Code.',
      btn_print: '🖨️ Etikett drucken',
      btn_png: '⬇️ Als PNG herunterladen',
      list_hint: '💡 Tippen Sie auf einen Eintrag, um den Inventar-Code automatisch in die Prüfkontrolle zu übertragen.',
      list_title: '📄 Gespeicherte Geräte',
      empty_list: 'Noch keine Geräte erfasst.',
      btn_export: '📦 Inventar exportieren (JSON)',
      control_hint: '📷 <strong>Workflow:</strong> QR-Code vom Gerät mit <a href="/scanner.html" style="color:#F6B45F;">Scanner</a> lesen <strong>oder</strong> Inventar-Code unten manuell eingeben → Bestätigen.',
      control_title: '✅ Gerät prüfen & bestätigen',
      lbl_checkcode: 'Inventar-Code (vom QR-Scanner oder manuell)',
      lbl_pruefer: 'Prüfer (Name / Kürzel)',
      lbl_ergebnis: 'Prüfergebnis',
      btn_confirm: '✅ Prüfung bestätigen',
      pending_title: '⏳ Prüfung fällig',
      pending_empty: 'Keine fälligen Prüfungen.',
      legal: 'Impressum & Datenschutz',
      toast_saved: 'Gespeichert: ',
      toast_updated: 'Aktualisiert: ',
      toast_deleted: 'Gerät gelöscht.',
      toast_exported: 'Inventar exportiert ✓',
      toast_png: 'PNG heruntergeladen ✓',
      toast_confirm: 'Prüfung gespeichert: ',
      toast_error: 'Bitte Gerätebezeichnung und Code ausfüllen.',
      toast_notfound: 'Dieser Code ist nicht im Inventar registriert.',
      toast_check_ok: '✅ Prüfung bestätigt'
    },
    en: {
      page_title: '📦 Inventory & Inspection Control',
      page_sub: 'Register devices · Generate QR · Inspection overview',
      tab1: '⚙️ Register device',
      tab2: '📄 Inventory list',
      tab3: '✅ Inspection control',
      card1_title: '⚙️ Register new device',
      lbl_name: 'Device name',
      lbl_standort: 'Location / Area',
      lbl_serial: 'Inventory code (auto-generated)',
      lbl_nextcheck: 'Next inspection due',
      btn_save: '💾 Save to inventory',
      card2_title: '📷 Device label preview',
      label_hint: 'This label will be attached to the device. QR code contains the inventory code.',
      btn_print: '🖨️ Print label',
      btn_png: '⬇️ Download as PNG',
      list_hint: '💡 Tap an entry to automatically transfer the inventory code to the inspection field.',
      list_title: '📄 Saved devices',
      empty_list: 'No devices registered yet.',
      btn_export: '📦 Export inventory (JSON)',
      control_hint: '📷 <strong>Workflow:</strong> Scan QR code from device with <a href="/scanner.html" style="color:#F6B45F;">Scanner</a> <strong>or</strong> enter inventory code manually below → Confirm.',
      control_title: '✅ Inspect & confirm device',
      lbl_checkcode: 'Inventory code (from QR scanner or manual)',
      lbl_pruefer: 'Inspector (Name / Abbreviation)',
      lbl_ergebnis: 'Inspection result',
      btn_confirm: '✅ Confirm inspection',
      pending_title: '⏳ Inspection due',
      pending_empty: 'No pending inspections.',
      legal: 'Legal & Privacy',
      toast_saved: 'Saved: ',
      toast_updated: 'Updated: ',
      toast_deleted: 'Device deleted.',
      toast_exported: 'Inventory exported ✓',
      toast_png: 'PNG downloaded ✓',
      toast_confirm: 'Inspection saved: ',
      toast_error: 'Please enter device name and code.',
      toast_notfound: 'This code is not registered in inventory.',
      toast_check_ok: '✅ Inspection confirmed'
    }
  };

  var currentLang = 'de';

  function setLanguage(lang) {
    currentLang = lang;
    var t = i18n[lang] || i18n.de;

    document.getElementById('page-title').textContent = t.page_title;
    document.getElementById('page-sub').textContent = t.page_sub;
    document.getElementById('tab1').textContent = t.tab1;
    document.getElementById('tab2').textContent = t.tab2;
    document.getElementById('tab3').textContent = t.tab3;
    document.getElementById('card1-title').textContent = t.card1_title;
    document.getElementById('lbl-name-field').textContent = t.lbl_name;
    document.getElementById('lbl-standort').textContent = t.lbl_standort;
    document.getElementById('lbl-serial-field').textContent = t.lbl_serial;
    document.getElementById('lbl-nextcheck').textContent = t.lbl_nextcheck;
    document.getElementById('btn-save').textContent = t.btn_save;
    document.getElementById('card2-title').textContent = t.card2_title;
    document.getElementById('label-hint').textContent = t.label_hint;
    document.getElementById('btn-print').textContent = t.btn_print;
    document.getElementById('btn-png').textContent = t.btn_png;
    document.getElementById('list-hint').innerHTML = t.list_hint;
    document.getElementById('list-title').innerHTML = t.list_title;
    document.getElementById('empty-list').textContent = t.empty_list;
    document.getElementById('btn-export').textContent = t.btn_export;
    document.getElementById('control-hint').innerHTML = t.control_hint;
    document.getElementById('control-title').textContent = t.control_title;
    document.getElementById('lbl-checkcode').textContent = t.lbl_checkcode;
    document.getElementById('lbl-pruefer').textContent = t.lbl_pruefer;
    document.getElementById('lbl-ergebnis').textContent = t.lbl_ergebnis;
    document.getElementById('btn-confirm').textContent = t.btn_confirm;
    document.getElementById('pending-title').textContent = t.pending_title;
    document.getElementById('pending-empty').textContent = t.pending_empty;
    document.getElementById('legal-link').textContent = t.legal;

    buildNav(lang);
    document.querySelectorAll('.lang-btn').forEach(function(b) {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
    document.documentElement.lang = lang;
    try { sessionStorage.setItem('autoLang', lang); } catch(e) {}
  }

  function buildNav(lang) {
    var nav = document.getElementById('mainNav');
    if (!nav) return;
    var items = [
      ['/', '🏠', {tr:'Ana Sayfa', de:'Startseite', en:'Home'}],
      ['/qr.html', '▣', {tr:'QR', de:'QR', en:'QR'}],
      ['/pruefprotokoll.html', '⚡', {tr:'Prüfprotokoll', de:'Prüfprotokoll', en:'Inspection'}],
      ['/scanner.html', '📷', {tr:'Tarayıcı', de:'Scanner', en:'Scanner'}],
      ['/envanter.html', '📦', {tr:'Envanter', de:'Inventar', en:'Inventory'}],
      ['/password.html', '🔐', {tr:'Şifre', de:'Passwort', en:'Password'}]
    ];
    var html = '';
    var page = (window.location.pathname.split('/').pop() || 'envanter.html');
    for (var i = 0; i < items.length; i++) {
      var href = items[i][0];
      var icon = items[i][1];
      var label = items[i][2][lang] || items[i][2]['de'];
      var isActive = (page === href.replace('/','') || (href==='/' && (page===''||page==='index.html')));
      var color = isActive ? '#F6B45F' : '#7a9ab8';
      var border = isActive ? '#F6B45F' : 'transparent';
      html += '<a href="' + href + '" style="color:' + color + ';text-decoration:none;font-size:0.7rem;padding:5px 10px;border-radius:16px;border:1px solid ' + border + ';white-space:nowrap;display:inline-flex;align-items:center;gap:3px;">'
        + '<span>' + icon + '</span>'
        + '<span>' + label + '</span>'
        + '</a>';
    }
    nav.innerHTML = html;
  }

  function load() {
    try { inventory = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch(e) { inventory = []; }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory)); } catch(e) {}
  }
  load();

  function toast(msg, isError) {
    var el = document.getElementById('toast');
    el.textContent = msg;
    el.className = 'toast show' + (isError ? ' error' : '');
    setTimeout(function() { el.className = 'toast'; }, 3000);
  }

  function makeUID(standort, count) {
    var s = (standort || 'PACDI').replace(/[^a-zA-Z0-9]/g,'').toUpperCase().substring(0,6);
    var nr = String(count + 1).padStart(3, '0');
    var rand = Date.now().toString(36).toUpperCase().slice(-6);
    return 'PACDI-' + s + '-' + nr + '-' + rand;
  }

  window.updateSerial = function() {
    var standort = document.getElementById('devStandort').value;
    var serial = makeUID(standort, inventory.length);
    document.getElementById('devSerial').value = serial;
    updatePreview();
  };

  function initQR(text) {
    var el = document.getElementById('qrcode-output');
    el.innerHTML = '';
    qrInstance = new QRCode(el, {
      text: text || 'PACDI',
      width: 180, height: 180,
      colorDark: '#000000', colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  window.updatePreview = function() {
    var name = document.getElementById('devName').value || 'Gerätebezeichnung';
    var serial = document.getElementById('devSerial').value || 'PACDI-XXXX-001-XXXXXX';
    document.getElementById('lbl-name').textContent = name;
    document.getElementById('lbl-serial').textContent = serial;
    if (qrInstance) {
      try { qrInstance.clear(); qrInstance.makeCode(serial || 'PACDI'); } catch(e) {}
    }
  };

  window.saveDevice = function() {
    var t = i18n[currentLang] || i18n.de;
    var name    = document.getElementById('devName').value.trim();
    var standort= document.getElementById('devStandort').value.trim();
    var serial  = document.getElementById('devSerial').value.trim();
    var nextCheck = document.getElementById('devNextCheck').value;

    if (!name || !serial) { toast(t.toast_error, true); return; }

    var exists = inventory.find(function(x){ return x.uid === serial; });
    if (exists) {
      exists.name = name; exists.standort = standort; exists.nextCheck = nextCheck;
      save();
      toast(t.toast_updated + name);
    } else {
      inventory.push({ uid: serial, name: name, standort: standort, nextCheck: nextCheck, status: 'Offen', checks: [], ts: new Date().toISOString() });
      save();
      toast(t.toast_saved + name);
    }

    renderLists();
    setTimeout(function() {
      document.getElementById('devName').value = '';
      document.getElementById('devSerial').value = makeUID(standort, inventory.length);
      updatePreview();
    }, 400);
  };

  window.deleteDevice = function(uid, e) {
    var t = i18n[currentLang] || i18n.de;
    e.stopPropagation();
    if (!confirm('Gerät löschen?')) return;
    inventory = inventory.filter(function(x){ return x.uid !== uid; });
    save();
    renderLists();
    toast(t.toast_deleted);
  };

  window.selectDevice = function(uid) {
    document.getElementById('checkCode').value = uid;
    switchTab('tab-kontrol', null);
    var btns = document.querySelectorAll('.tab-btn');
    btns[0].classList.remove('active');
    btns[1].classList.remove('active');
    btns[2].classList.add('active');
  };

  window.confirmCheck = function() {
    var t = i18n[currentLang] || i18n.de;
    var code     = document.getElementById('checkCode').value.trim();
    var pruefer  = document.getElementById('checkPruefer').value.trim();
    var ergebnis = document.getElementById('checkErgebnis').value.trim();
    var resultEl = document.getElementById('check-result');

    if (!code) { toast('Bitte Inventar-Code eingeben.', true); return; }

    var device = inventory.find(function(x){ return x.uid.toUpperCase() === code.toUpperCase(); });

    if (!device) {
      resultEl.innerHTML = '<div class="result-card error"><div class="result-label" style="color:#f87171;">❌ Nicht gefunden</div><div class="result-value" style="color:#f87171;">' + t.toast_notfound + '</div></div>';
      return;
    }

    var checkEntry = { date: new Date().toISOString(), pruefer: pruefer || '—', ergebnis: ergebnis || 'i.O.', uid: code };
    if (!device.checks) device.checks = [];
    device.checks.push(checkEntry);
    device.status = 'Geprüft';
    device.lastCheck = new Date().toISOString();
    save();
    renderLists();

    resultEl.innerHTML = '<div class="result-card"><div class="result-label" style="color:#34D399;">✅ ' + t.toast_check_ok + '</div><div class="result-value"><strong>' + device.name + '</strong><br><span style="font-size:0.78rem;color:#7a9ab8;">Standort: ' + (device.standort || '—') + ' · Prüfer: ' + (pruefer || '—') + ' · ' + new Date().toLocaleDateString('de-DE') + '</span></div></div>';
    toast(t.toast_confirm + device.name);

    document.getElementById('checkCode').value = '';
    document.getElementById('checkErgebnis').value = '';
  };

  function renderLists() {
    renderInvList();
    renderPendingList();
    document.getElementById('inv-count').textContent = inventory.length;
  }

  function renderInvList() {
    var t = i18n[currentLang] || i18n.de;
    var el = document.getElementById('inv-list');
    if (!inventory.length) { el.innerHTML = '<div class="empty">' + t.empty_list + '</div>'; return; }
    el.innerHTML = '';
    inventory.forEach(function(item) {
      var div = document.createElement('div');
      div.className = 'inv-item';
      div.onclick = function() { selectDevice(item.uid); };
      var badge = item.status === 'Geprüft'
        ? '<span class="badge badge-done">✅ Geprüft</span>'
        : '<span class="badge badge-pending">Offen</span>';
      div.innerHTML = '<div class="info"><div class="iname">' + item.name + '</div><div class="iserial">' + item.uid + (item.standort ? ' · ' + item.standort : '') + '</div></div>' +
        '<div class="actions">' + badge + '<button class="btn-sm btn-sm-red" onclick="deleteDevice(\'' + item.uid + '\', event)">🗑️</button></div>';
      el.appendChild(div);
    });
  }

  function renderPendingList() {
    var t = i18n[currentLang] || i18n.de;
    var el = document.getElementById('check-pending-list');
    var pending = inventory.filter(function(x){ return x.status !== 'Geprüft'; });
    if (!pending.length) { el.innerHTML = '<div class="empty">' + t.pending_empty + '</div>'; return; }
    el.innerHTML = '';
    pending.forEach(function(item) {
      var div = document.createElement('div');
      div.className = 'inv-item';
      div.onclick = function() { document.getElementById('checkCode').value = item.uid; };
      div.innerHTML = '<div class="info"><div class="iname">' + item.name + '</div><div class="iserial">' + item.uid + '</div></div><span class="badge badge-pending">Offen</span>';
      el.appendChild(div);
    });
  }

  window.switchTab = function(id, btn) {
    document.querySelectorAll('.tab-content').forEach(function(el){ el.classList.remove('active'); });
    document.getElementById(id).classList.add('active');
    currentTab = id;
    if (btn) {
      document.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
    }
    renderLists();
  };

  window.exportInventar = function() {
    var t = i18n[currentLang] || i18n.de;
    var json = JSON.stringify(inventory, null, 2);
    var filename = 'PACDI-Inventar-' + new Date().toISOString().split('T')[0] + '.json';
    // iOS Safari/Chrome/Firefox (alle WebKit) lassen a.click()-Downloads oft
    // stillschweigend fehlschlagen. Deshalb: Teilen/Kopieren-Dialog als
    // zuverlässiger Weg, plus klassischer Download für Desktop.
    showExportModal(json, filename, 'application/json');
    toast(t.toast_exported);
  };

  function showExportModal(content, filename, mime){
    var old = document.getElementById('exportModalOverlay');
    if (old) old.remove();

    var overlay = document.createElement('div');
    overlay.id = 'exportModalOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(4,22,46,0.94);z-index:9999;display:flex;align-items:center;justify-content:center;padding:14px;';

    var box = document.createElement('div');
    box.style.cssText = 'background:#0a1828;border:1px solid rgba(246,180,95,0.3);border-radius:12px;padding:16px;max-width:620px;width:100%;max-height:85vh;display:flex;flex-direction:column;gap:10px;';

    var title = document.createElement('div');
    title.style.cssText = 'color:#F6B45F;font-weight:700;font-size:0.85rem;';
    title.textContent = '📦 Export bereit: ' + filename;

    var hint = document.createElement('div');
    hint.style.cssText = 'color:#7a9ab8;font-size:0.7rem;line-height:1.6;';
    hint.textContent = 'iPhone/Android: "Teilen" für direktes Speichern in Dateien/Drive. Alternativ "Kopieren". Am Desktop funktioniert "Herunterladen" direkt.';

    var ta = document.createElement('textarea');
    ta.value = content;
    ta.readOnly = true;
    ta.style.cssText = 'flex:1;min-height:180px;background:#04162E;color:#eaf2fb;border:1px solid rgba(246,180,95,0.2);border-radius:8px;padding:10px;font-family:Courier New,monospace;font-size:0.62rem;line-height:1.5;';

    var btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;';

    var btnBase = 'padding:10px 16px;border-radius:20px;font-weight:700;font-size:0.78rem;cursor:pointer;font-family:inherit;border:none;';

    var shareBtn = document.createElement('button');
    shareBtn.style.cssText = btnBase + 'background:#F6B45F;color:#04162E;';
    shareBtn.textContent = '📤 Teilen / Speichern';
    shareBtn.onclick = function(){
      try {
        var blob = new Blob([content], { type: mime });
        var file = new File([blob], filename, { type: mime });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], title: filename }).catch(function(){});
        } else if (navigator.share) {
          navigator.share({ title: filename, text: content }).catch(function(){});
        } else {
          alert('Teilen wird von diesem Browser nicht unterstützt. Bitte "Kopieren" nutzen.');
        }
      } catch (e) {
        alert('Teilen fehlgeschlagen. Bitte "Kopieren" nutzen.');
      }
    };

    var copyBtn = document.createElement('button');
    copyBtn.style.cssText = btnBase + 'background:transparent;border:1px solid rgba(246,180,95,0.4);color:#F6B45F;';
    copyBtn.textContent = '📋 Kopieren';
    copyBtn.onclick = function(){
      function done(){ copyBtn.textContent = '✅ Kopiert!'; setTimeout(function(){ copyBtn.textContent = '📋 Kopieren'; }, 1800); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(content).then(done).catch(function(){
          ta.focus(); ta.select(); document.execCommand('copy'); done();
        });
      } else {
        ta.focus(); ta.select(); document.execCommand('copy'); done();
      }
    };

    var dlBtn = document.createElement('button');
    dlBtn.style.cssText = btnBase + 'background:transparent;border:1px solid rgba(246,180,95,0.4);color:#F6B45F;';
    dlBtn.textContent = '⬇️ Herunterladen (Desktop)';
    dlBtn.onclick = function(){
      var blob = new Blob([content], { type: mime });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function(){ URL.revokeObjectURL(url); }, 3000);
    };

    var closeBtn = document.createElement('button');
    closeBtn.style.cssText = btnBase + 'background:transparent;border:1px solid rgba(246,180,95,0.4);color:#F6B45F;';
    closeBtn.textContent = 'Schließen';
    closeBtn.onclick = function(){ overlay.remove(); };

    btnRow.appendChild(shareBtn);
    btnRow.appendChild(copyBtn);
    btnRow.appendChild(dlBtn);
    btnRow.appendChild(closeBtn);

    box.appendChild(title);
    box.appendChild(hint);
    box.appendChild(ta);
    box.appendChild(btnRow);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function(e){ if (e.target === overlay) overlay.remove(); });
  }

  window.downloadLabel = function() {
    var t = i18n[currentLang] || i18n.de;
    var canvas = document.querySelector('#qrcode-output canvas');
    if (!canvas) { toast('QR-Code nicht gefunden.', true); return; }

    var final = document.createElement('canvas');
    final.width = 300; final.height = 360;
    var ctx = final.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 300, 360);
    ctx.drawImage(canvas, 60, 10, 180, 180);

    var name = document.getElementById('devName').value || 'Gerät';
    var serial = document.getElementById('devSerial').value || '';
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    var short = name.length > 32 ? name.substring(0,30) + '..' : name;
    ctx.fillText(short, 150, 215);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#555555';
    ctx.fillText(serial, 150, 232);
    ctx.font = '9px Arial';
    ctx.fillStyle = '#cccccc';
    ctx.fillText('PACDI Store · pacdi.store', 150, 250);

    var a = document.createElement('a');
    var safeName = name.replace(/[^a-zA-Z0-9]/g,'_').substring(0,20);
    a.download = 'PACDI-QR-' + safeName + '.png';
    a.href = final.toDataURL('image/png', 1.0);
    a.click();
    toast(t.toast_png);
  };

  var defaultLang = null;
  try { defaultLang = sessionStorage.getItem('autoLang'); } catch(e) {}
  if (!defaultLang || !i18n[defaultLang]) {
    var navLang = (navigator.language || 'de').toLowerCase();
    defaultLang = navLang.indexOf('tr') === 0 ? 'tr' : (navLang.indexOf('en') === 0 ? 'en' : 'de');
  }
  setLanguage(defaultLang);

  renderLists();
  document.getElementById('devSerial').value = makeUID('', inventory.length);
  initQR(document.getElementById('devSerial').value);
  updatePreview();

  var d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  document.getElementById('devNextCheck').value = d.toISOString().split('T')[0];

})();
