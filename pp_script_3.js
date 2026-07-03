
(function() {
  // ── i18n: Parça 1 (Paywall Modal + Nav) ──
  var i18nP1 = {
    tr: {
      modal_title_1: 'Denetim protokolünüz hazır',
      modal_text_1: 'İndirmek için Pro sürüm gereklidir.',
      modal_soon: '🚀 Yakında başlıyor',
      modal_permonth: '/ ay',
      modal_feat_1: 'Sınırsız PDF çıktısı',
      modal_feat_2: 'Tüm denetim kategorileri',
      modal_feat_3: 'İmza alanları & firma logosu',
      modal_feat_4: 'Bulutta veri yedekleme',
      modal_feat_5: 'Öncelikli destek',
      btn_early_access: '🎯 Erken erişim + indirim al',
      btn_cancel_1: 'İptal',
      modal_title_2: 'Erken erişimi güvence altına al',
      modal_ea_1: 'Herkesten önce erken erişim',
      modal_ea_2: 'Resmi lansmanda indirim',
      modal_ea_3: 'Pro planında sınırsız kullanım',
      btn_submit_ea: '✔ Şimdi erken erişimi güvence altına al',
      btn_cancel_2: 'Belki daha sonra',
      modal_title_3: 'Teşekkürler!',
      modal_success_text: 'E-postanızı aldık.<br>Pro sürüm yayınlandığında ilk siz haberdar olacaksınız —<br><strong style="color:#D4AF37;">indiriminiz dahil.</strong>',
      modal_registered: '✔ Erken erişim kaydedildi',
      btn_continue: 'Çalışmaya devam et',
      nav_store: 'Mağaza',
      nav_qr: 'QR',
      nav_blog: 'Blog',
      nav_pruef: 'Prüfprotokoll',
      nav_scanner: 'Tarayıcı',
      nav_envanter: 'Envanter'
    },
    de: {
      modal_title_1: 'Ihr Prüfprotokoll ist fertig',
      modal_text_1: 'Für den Download benötigen Sie die Pro-Version.',
      modal_soon: '🚀 Startet in Kürze',
      modal_permonth: '/ Monat',
      modal_feat_1: 'Unbegrenzte PDF-Exporte',
      modal_feat_2: 'Alle Prüfkategorien',
      modal_feat_3: 'Signaturfelder & Firmenlogo',
      modal_feat_4: 'Datensicherung in der Cloud',
      modal_feat_5: 'Priorit&auml;ts-Support',
      btn_early_access: '🎯 Frühzugang + Rabatt sichern',
      btn_cancel_1: 'Abbrechen',
      modal_title_2: 'Early Access sichern',
      modal_ea_1: 'Frühzugang vor allen anderen',
      modal_ea_2: 'Rabatt zum offiziellen Start',
      modal_ea_3: 'Unbegrenzte Nutzung im Pro-Plan',
      btn_submit_ea: '✔ Jetzt Frühzugang sichern',
      btn_cancel_2: 'Vielleicht später',
      modal_title_3: 'Danke!',
      modal_success_text: 'Wir haben Ihre E-Mail erhalten.<br>Sie werden als Erste informiert, wenn die Pro-Version live geht —<br><strong style="color:#D4AF37;">inklusive Ihres Rabatts.</strong>',
      modal_registered: '✔ Frühzugang registriert',
      btn_continue: 'Weiter arbeiten',
      nav_store: 'Store',
      nav_qr: 'QR',
      nav_blog: 'Blog',
      nav_pruef: 'Prüfprotokoll',
      nav_scanner: 'Scanner',
      nav_envanter: 'Inventar'
    },
    en: {
      modal_title_1: 'Your inspection protocol is ready',
      modal_text_1: 'You need the Pro version to download.',
      modal_soon: '🚀 Launching soon',
      modal_permonth: '/ month',
      modal_feat_1: 'Unlimited PDF exports',
      modal_feat_2: 'All inspection categories',
      modal_feat_3: 'Signature fields & company logo',
      modal_feat_4: 'Cloud data backup',
      modal_feat_5: 'Priority support',
      btn_early_access: '🎯 Get early access + discount',
      btn_cancel_1: 'Cancel',
      modal_title_2: 'Secure Early Access',
      modal_ea_1: 'Early access before everyone else',
      modal_ea_2: 'Discount at official launch',
      modal_ea_3: 'Unlimited use in Pro plan',
      btn_submit_ea: '✔ Secure early access now',
      btn_cancel_2: 'Maybe later',
      modal_title_3: 'Thank you!',
      modal_success_text: 'We received your e-mail.<br>You will be the first to know when the Pro version goes live —<br><strong style="color:#D4AF37;">including your discount.</strong>',
      modal_registered: '✔ Early access registered',
      btn_continue: 'Continue working',
      nav_store: 'Store',
      nav_qr: 'QR',
      nav_blog: 'Blog',
      nav_pruef: 'Inspection',
      nav_scanner: 'Scanner',
      nav_envanter: 'Inventory'
    }
  };

  window.currentPPLang = 'de';

  // ── Parça 2: Form & Tablo i18n verisi ──
  var i18nP2 = {
    tr: {
      hero_title: '⚡ DGUV V3 Prüfprotokolü 2 dakikada',
      hero_desc: "Excel'siz — doğrudan telefon veya bilgisayarda. Profesyonel PDF çıktısı tek tuşla.",
      hero_badge: '✔ İlk denetim ücretsiz',
      hero_btn: 'Şimdi ücretsiz dene →',
      hero_hint: 'Hesap gerekmez',
      free_plan_name: 'Ücretsiz',
      free_plan_period: '/ süresiz',
      free_feat_1: 'Cihaz başına 1 PDF çıktısı',
      free_feat_2: '10 cihaza kadar',
      free_feat_3: 'Yerel veri depolama',
      pro_plan_name: '⭐ Pro',
      pro_plan_period: '/ ay',
      pro_feat_1: 'Sınırsız PDF çıktısı',
      pro_feat_2: 'Sınırsız cihaz',
      pro_feat_3: 'Bulut yedekleme',
      pro_feat_4: "PDF'de firma logosu",
      pro_feat_5: 'Öncelikli destek',
      btn_upgrade: "Pro'ya geç",
      market_compare_title: 'Piyasa karşılaştırması',
      market_1: 'Klasik sağlayıcılar',
      market_2: 'Gereksiz karmaşıklık',
      market_3: 'Pahalı yıllık lisanslar',
      pdf_success_text: '✅ Denetim protokolünüz hazır!',
      pdf_success_hint: 'PDF olarak dışa aktar? (Sonraki çıktılar için Pro gerekli)',
      btn_export_pro: '📄 PDF olarak dışa aktar →',
      qr_workflow_title: '📷 QR Tarayıcı İş Akışı',
      qr_workflow_1: '<strong style="color:#e8edf2;">1.</strong> Cihaz girin → <strong style="color:#F6B45F;">⬇ QR</strong> tuşuna basın → QR otomatik olarak envantere kaydedilir',
      qr_workflow_2: '<strong style="color:#e8edf2;">2.</strong> Taramak için: <a href="/scanner.html" style="color:#F6B45F;text-decoration:none;">📷 Tarayıcıyı aç</a> → <strong style="color:#F6B45F;">Galeriden Seç</strong> → kaydedilen QR-PNG\'i seçin',
      qr_workflow_3: '<strong style="color:#e8edf2;">3.</strong> Cihaz otomatik olarak tanınır ve eşleştirilir ✓',
      form_title: 'Denetim Protokolü – Form',
      form_no: 'Form No: 011/402',
      lbl_standort: 'Konum / Alan',
      lbl_raum: 'Oda',
      lbl_datum: 'Tarih',
      lbl_pruefer: 'Denetleyen / Denetçi',
      btn_add_row: '➕ Cihaz ekle',
      btn_del_last: '🗑️ Son satırı sil',
      btn_del_selected: '🗑️ Seçilenleri sil',
      btn_save_local: '💾 Kaydet',
      btn_load_local: '📂 Yükle',
      btn_pdf: '📄 PDF oluştur',
      th_inventar: 'Envanter No / Ad',
      th_sicht: 'Görsel kontrol',
      th_funktion: 'Fonksiyon kontrolü',
      th_letzte: 'Son denetim',
      th_intervall: 'Denetim aralığı',
      th_naechste: 'Sonraki denetim',
      th_bemerkung: 'Açıklama',
      th_qr: '⬇ QR',
      footer_made: 'Şununla oluşturuldu:',
      footer_legal: 'Yasal & Gizlilik',
      placeholder_inventar: 'örn. 4711 / Cihaz',
      placeholder_bemerkung: 'Açıklama',
      alert_inventar_required: 'Lütfen envanter numarası / ad girin.',
      alert_saved: 'Kaydedildi!',
      alert_no_data: 'Kayıtlı veri bulunamadı.',
      alert_loaded: 'Yüklendi!',
      alert_no_devices: 'Dışa aktarılacak cihaz yok.',
      alert_load_error: 'Yükleme hatası',
      alert_qr_error: 'QR hatası',
      row_counter_suffix: 'cihaz',
      interval_6: '6 Ay',
      interval_12: '12 Ay',
      interval_24: '24 Ay',
      interval_48: '48 Ay',
      pdf_title: 'DGUV V3 Denetim Protokolü',
      pdf_form_no: 'Form No: 011/402',
      pdf_standort: 'Konum',
      pdf_raum: 'Oda',
      pdf_datum: 'Tarih',
      pdf_pruefer: 'Denetçi',
      pdf_th_nr: 'No',
      pdf_th_inventar: 'Envanter No / Ad',
      pdf_th_sicht: 'Görsel',
      pdf_th_funktion: 'Fonksiyon',
      pdf_th_letzte: 'Son denetim',
      pdf_th_intervall: 'Denetim aralığı',
      pdf_th_naechste: 'Sonraki denetim',
      pdf_th_bemerkung: 'Açıklama',
      pdf_page: 'Sayfa',
      pdf_sign_date: 'Tarih',
      pdf_sign_pruefer: 'Denetçi imzası',
      pdf_sign_fasi: 'FASI imzası',
      pdf_footer: 'PACDI Digital ile oluşturuldu · pacdi.io'
    },
    de: {
      hero_title: '⚡ DGUV V3 Prüfprotokoll in 2 Minuten',
      hero_desc: 'Ohne Excel – direkt am Handy oder PC. Professioneller PDF-Export auf Knopfdruck.',
      hero_badge: '✔ Erste Prüfung kostenlos',
      hero_btn: 'Jetzt kostenlos testen →',
      hero_hint: 'Kein Account erforderlich',
      free_plan_name: 'Free',
      free_plan_period: '/ dauerhaft',
      free_feat_1: '1 PDF-Export pro Gerät',
      free_feat_2: 'Bis zu 10 Geräte',
      free_feat_3: 'Lokale Datenspeicherung',
      pro_plan_name: '⭐ Pro',
      pro_plan_period: '/ Monat',
      pro_feat_1: 'Unbegrenzte PDF-Exporte',
      pro_feat_2: 'Unbegrenzte Geräte',
      pro_feat_3: 'Cloud-Backup',
      pro_feat_4: 'Firmenlogo im PDF',
      pro_feat_5: 'Priorit&auml;ts-Support',
      btn_upgrade: 'Upgrade auf Pro',
      market_compare_title: 'Vergleich Markt',
      market_1: 'Klassische Anbieter',
      market_2: 'Unn&ouml;tige Komplexit&auml;t',
      market_3: 'Teure Jahreslizenzen',
      pdf_success_text: '✅ Ihr Prüfprotokoll ist fertig!',
      pdf_success_hint: 'Als PDF exportieren? (Pro erforderlich für weitere Exporte)',
      btn_export_pro: '📄 Als PDF exportieren →',
      qr_workflow_title: '&#128247; QR-Scanner Workflow',
      qr_workflow_1: '<strong style="color:#e8edf2;">1.</strong> Gerät eingeben &rarr; <strong style="color:#F6B45F;">&#11015; QR</strong> dr&uuml;cken &rarr; QR wird automatisch im Inventar gespeichert',
      qr_workflow_2: '<strong style="color:#e8edf2;">2.</strong> Zum Scannen: <a href="/scanner.html" style="color:#F6B45F;text-decoration:none;">&#128247; Scanner &ouml;ffnen</a> &rarr; <strong style="color:#F6B45F;">Choose from Gallery</strong> &rarr; gespeichertes QR-PNG w&auml;hlen',
      qr_workflow_3: '<strong style="color:#e8edf2;">3.</strong> Ger&auml;t wird automatisch erkannt und zugeordnet &#10003;',
      form_title: 'Prüfprotokoll – Formular',
      form_no: 'Formular Nr: 011/402',
      lbl_standort: 'Standort / Bereich',
      lbl_raum: 'Raum',
      lbl_datum: 'Datum',
      lbl_pruefer: 'Durch: / Prüfer',
      btn_add_row: '➕ Gerät hinzufügen',
      btn_del_last: '🗑️ Letzte Zeile löschen',
      btn_del_selected: '🗑️ Ausgewählte löschen',
      btn_save_local: '💾 Speichern',
      btn_load_local: '📂 Laden',
      btn_pdf: '📄 PDF erstellen',
      th_inventar: 'Inventarnummer / Bezeichnung',
      th_sicht: 'Sichtprüfung',
      th_funktion: 'Funktionsprüfung',
      th_letzte: 'Letzte Prüfung',
      th_intervall: 'Prüfintervall',
      th_naechste: 'Nächste Prüfung',
      th_bemerkung: 'Bemerkung',
      th_qr: '⬇ QR',
      footer_made: 'Erstellt mit',
      footer_legal: 'Impressum &amp; Datenschutz',
      placeholder_inventar: 'z.B. 4711 / Gerät',
      placeholder_bemerkung: 'Bemerkung',
      alert_inventar_required: 'Bitte Inventarnummer / Bezeichnung eingeben.',
      alert_saved: 'Gespeichert!',
      alert_no_data: 'Keine gespeicherten Daten gefunden.',
      alert_loaded: 'Geladen!',
      alert_no_devices: 'Keine Geräte zum Exportieren.',
      alert_load_error: 'Fehler beim Laden',
      alert_qr_error: 'QR Fehler',
      row_counter_suffix: 'Geräte',
      interval_6: '6 Monate',
      interval_12: '12 Monate',
      interval_24: '24 Monate',
      interval_48: '48 Monate',
      pdf_title: 'DGUV V3 Prüfprotokoll',
      pdf_form_no: 'Formular Nr: 011/402',
      pdf_standort: 'Standort',
      pdf_raum: 'Raum',
      pdf_datum: 'Datum',
      pdf_pruefer: 'Prüfer',
      pdf_th_nr: 'Nr',
      pdf_th_inventar: 'Inventarnummer / Bezeichnung',
      pdf_th_sicht: 'Sicht',
      pdf_th_funktion: 'Funktion',
      pdf_th_letzte: 'Letzte Prüfung',
      pdf_th_intervall: 'Prüfintervall',
      pdf_th_naechste: 'Nächste Prüfung',
      pdf_th_bemerkung: 'Bemerkung',
      pdf_page: 'Seite',
      pdf_sign_date: 'Datum',
      pdf_sign_pruefer: 'Unterschrift Prüfer',
      pdf_sign_fasi: 'Unterschrift FASI',
      pdf_footer: 'Erstellt mit PACDI Digital · pacdi.io'
    },
    en: {
      hero_title: '⚡ DGUV V3 inspection protocol in 2 minutes',
      hero_desc: 'No Excel — directly on phone or PC. Professional PDF export at the push of a button.',
      hero_badge: '✔ First inspection free',
      hero_btn: 'Try free now →',
      hero_hint: 'No account required',
      free_plan_name: 'Free',
      free_plan_period: '/ forever',
      free_feat_1: '1 PDF export per device',
      free_feat_2: 'Up to 10 devices',
      free_feat_3: 'Local data storage',
      pro_plan_name: '⭐ Pro',
      pro_plan_period: '/ month',
      pro_feat_1: 'Unlimited PDF exports',
      pro_feat_2: 'Unlimited devices',
      pro_feat_3: 'Cloud backup',
      pro_feat_4: 'Company logo in PDF',
      pro_feat_5: 'Priority support',
      btn_upgrade: 'Upgrade to Pro',
      market_compare_title: 'Market comparison',
      market_1: 'Classic providers',
      market_2: 'Unnecessary complexity',
      market_3: 'Expensive annual licenses',
      pdf_success_text: '✅ Your inspection protocol is ready!',
      pdf_success_hint: 'Export as PDF? (Pro required for further exports)',
      btn_export_pro: '📄 Export as PDF →',
      qr_workflow_title: '📷 QR Scanner Workflow',
      qr_workflow_1: '<strong style="color:#e8edf2;">1.</strong> Enter device → press <strong style="color:#F6B45F;">⬇ QR</strong> → QR is automatically saved to inventory',
      qr_workflow_2: '<strong style="color:#e8edf2;">2.</strong> To scan: <a href="/scanner.html" style="color:#F6B45F;text-decoration:none;">📷 Open Scanner</a> → <strong style="color:#F6B45F;">Choose from Gallery</strong> → select saved QR PNG',
      qr_workflow_3: '<strong style="color:#e8edf2;">3.</strong> Device is automatically recognized and matched ✓',
      form_title: 'Inspection Protocol – Form',
      form_no: 'Form No: 011/402',
      lbl_standort: 'Location / Area',
      lbl_raum: 'Room',
      lbl_datum: 'Date',
      lbl_pruefer: 'Inspector',
      btn_add_row: '➕ Add device',
      btn_del_last: '🗑️ Delete last row',
      btn_del_selected: '🗑️ Delete selected',
      btn_save_local: '💾 Save',
      btn_load_local: '📂 Load',
      btn_pdf: '📄 Generate PDF',
      th_inventar: 'Inventory No. / Name',
      th_sicht: 'Visual inspection',
      th_funktion: 'Function test',
      th_letzte: 'Last inspection',
      th_intervall: 'Inspection interval',
      th_naechste: 'Next inspection',
      th_bemerkung: 'Remark',
      th_qr: '⬇ QR',
      footer_made: 'Made with',
      footer_legal: 'Legal & Privacy',
      placeholder_inventar: 'e.g. 4711 / Device',
      placeholder_bemerkung: 'Remark',
      alert_inventar_required: 'Please enter inventory number / name.',
      alert_saved: 'Saved!',
      alert_no_data: 'No saved data found.',
      alert_loaded: 'Loaded!',
      alert_no_devices: 'No devices to export.',
      alert_load_error: 'Loading error',
      alert_qr_error: 'QR error',
      row_counter_suffix: 'devices',
      interval_6: '6 months',
      interval_12: '12 months',
      interval_24: '24 months',
      interval_48: '48 months',
      pdf_title: 'DGUV V3 Inspection Protocol',
      pdf_form_no: 'Form No: 011/402',
      pdf_standort: 'Location',
      pdf_raum: 'Room',
      pdf_datum: 'Date',
      pdf_pruefer: 'Inspector',
      pdf_th_nr: 'No.',
      pdf_th_inventar: 'Inventory No. / Name',
      pdf_th_sicht: 'Visual',
      pdf_th_funktion: 'Function',
      pdf_th_letzte: 'Last inspection',
      pdf_th_intervall: 'Inspection interval',
      pdf_th_naechste: 'Next inspection',
      pdf_th_bemerkung: 'Remark',
      pdf_page: 'Page',
      pdf_sign_date: 'Date',
      pdf_sign_pruefer: 'Inspector signature',
      pdf_sign_fasi: 'FASI signature',
      pdf_footer: 'Made with PACDI Digital · pacdi.io'
    }
  };

  window.ppT = function(key, fallback) {
    var lang = window.currentPPLang || 'de';
    var t = i18nP2[lang] || i18nP2.de;
    return t[key] || fallback || key;
  };

  window.ppIntervalLabels = function() {
    var lang = window.currentPPLang || 'de';
    var t = i18nP2[lang] || i18nP2.de;
    return { '6': t.interval_6, '12': t.interval_12, '24': t.interval_24, '48': t.interval_48 };
  };

  window.applyPPFormLang = function(lang) {
    var t = i18nP2[lang] || i18nP2.de;
    var el;
    if (el = document.getElementById('hero-title')) el.textContent = t.hero_title;
    if (el = document.getElementById('hero-desc')) el.textContent = t.hero_desc;
    if (el = document.getElementById('hero-badge')) el.textContent = t.hero_badge;
    if (el = document.getElementById('hero-btn')) el.textContent = t.hero_btn;
    if (el = document.getElementById('hero-hint')) el.textContent = t.hero_hint;
    if (el = document.getElementById('free-plan-name')) el.textContent = t.free_plan_name;
    if (el = document.getElementById('free-plan-period')) el.textContent = t.free_plan_period;
    if (el = document.getElementById('free-feat-1')) el.textContent = t.free_feat_1;
    if (el = document.getElementById('free-feat-2')) el.textContent = t.free_feat_2;
    if (el = document.getElementById('free-feat-3')) el.textContent = t.free_feat_3;
    if (el = document.getElementById('pro-plan-name')) el.textContent = t.pro_plan_name;
    if (el = document.getElementById('pro-plan-period')) el.textContent = t.pro_plan_period;
    if (el = document.getElementById('pro-feat-1')) el.textContent = t.pro_feat_1;
    if (el = document.getElementById('pro-feat-2')) el.textContent = t.pro_feat_2;
    if (el = document.getElementById('pro-feat-3')) el.textContent = t.pro_feat_3;
    if (el = document.getElementById('pro-feat-4')) el.textContent = t.pro_feat_4;
    if (el = document.getElementById('pro-feat-5')) el.innerHTML = t.pro_feat_5;
    if (el = document.getElementById('btn-upgrade')) el.textContent = t.btn_upgrade;
    if (el = document.getElementById('market-compare-title')) el.textContent = t.market_compare_title;
    if (el = document.getElementById('market-1')) el.innerHTML = t.market_1;
    if (el = document.getElementById('market-2')) el.innerHTML = t.market_2;
    if (el = document.getElementById('market-3')) el.textContent = t.market_3;
    if (el = document.getElementById('pdf-success-text')) el.textContent = t.pdf_success_text;
    if (el = document.getElementById('pdf-success-hint')) el.textContent = t.pdf_success_hint;
    if (el = document.getElementById('btn-export-pro')) el.textContent = t.btn_export_pro;
    if (el = document.getElementById('qr-workflow-title')) el.innerHTML = t.qr_workflow_title;
    if (el = document.getElementById('qr-workflow-1')) el.innerHTML = t.qr_workflow_1;
    if (el = document.getElementById('qr-workflow-2')) el.innerHTML = t.qr_workflow_2;
    if (el = document.getElementById('qr-workflow-3')) el.innerHTML = t.qr_workflow_3;
    if (el = document.getElementById('form-title')) el.textContent = t.form_title;
    if (el = document.getElementById('form-no')) el.textContent = t.form_no;
    if (el = document.getElementById('lbl-standort')) el.textContent = t.lbl_standort;
    if (el = document.getElementById('lbl-raum')) el.textContent = t.lbl_raum;
    if (el = document.getElementById('lbl-datum')) el.textContent = t.lbl_datum;
    if (el = document.getElementById('lbl-pruefer')) el.textContent = t.lbl_pruefer;
    if (el = document.getElementById('btn-add-row')) el.textContent = t.btn_add_row;
    if (el = document.getElementById('btn-del-last')) el.textContent = t.btn_del_last;
    if (el = document.getElementById('btn-del-selected')) el.textContent = t.btn_del_selected;
    if (el = document.getElementById('btn-save-local')) el.textContent = t.btn_save_local;
    if (el = document.getElementById('btn-load-local')) el.textContent = t.btn_load_local;
    if (el = document.getElementById('btn-pdf')) el.textContent = t.btn_pdf;
    if (el = document.getElementById('th-inventar')) el.textContent = t.th_inventar;
    if (el = document.getElementById('th-sicht')) el.textContent = t.th_sicht;
    if (el = document.getElementById('th-funktion')) el.textContent = t.th_funktion;
    if (el = document.getElementById('th-letzte')) el.textContent = t.th_letzte;
    if (el = document.getElementById('th-intervall')) el.textContent = t.th_intervall;
    if (el = document.getElementById('th-naechste')) el.textContent = t.th_naechste;
    if (el = document.getElementById('th-bemerkung')) el.textContent = t.th_bemerkung;
    if (el = document.getElementById('th-qr')) el.textContent = t.th_qr;
    if (el = document.getElementById('footer-made')) el.textContent = t.footer_made;
    if (el = document.getElementById('footer-legal')) el.innerHTML = t.footer_legal;

    // Mevcut satırlardaki placeholder ve interval label'larını güncelle
    document.querySelectorAll('.inventar').forEach(function(inp) { inp.placeholder = t.placeholder_inventar; });
    document.querySelectorAll('.bemerkung').forEach(function(inp) { inp.placeholder = t.placeholder_bemerkung; });
    document.querySelectorAll('.pruefintervall').forEach(function(sel) {
      var currentVal = sel.value;
      var ivMap = { '6': t.interval_6, '12': t.interval_12, '24': t.interval_24, '48': t.interval_48 };
      Array.prototype.forEach.call(sel.options, function(opt) {
        if (ivMap[opt.value]) opt.textContent = ivMap[opt.value];
      });
      sel.value = currentVal;
    });

    // Cihaz sayacı (rowCounter zaten sayıyla başlıyor, sadece sonek değişir)
    var rc = document.getElementById('rowCounter');
    if (rc) {
      var num = (rc.textContent.match(/\d+/) || ['0'])[0];
      rc.textContent = num + ' ' + t.row_counter_suffix;
    }
  };


  function buildPPNav(lang) {
    var nav = document.getElementById('mainNav');
    if (!nav) return;
    var t = i18nP1[lang] || i18nP1.de;
    var items = [
      ['/index.html', '🏠', t.nav_store, false],
      ['/qr.html', '🔳', t.nav_qr, false],
      ['/blog/', '📚', t.nav_blog, false],
      ['/pruefprotokoll.html', '⚡', t.nav_pruef, true],
      ['/scanner.html', '📷', t.nav_scanner, false],
      ['/envanter.html', '📦', t.nav_envanter, false]
    ];
    var html = '';
    for (var i = 0; i < items.length; i++) {
      var active = items[i][3];
      var style = active
        ? 'color:#D4AF37;text-decoration:none;font-size:0.7rem;padding:5px 10px;border-radius:16px;border:1px solid rgba(212,175,55,0.4);background:rgba(212,175,55,0.06);white-space:nowrap;'
        : 'color:#7a9ab8;text-decoration:none;font-size:0.7rem;padding:5px 10px;border-radius:16px;border:1px solid transparent;white-space:nowrap;';
      html += '<a href="' + items[i][0] + '" style="' + style + '">' + items[i][1] + ' ' + items[i][2] + '</a>';
    }
    nav.innerHTML = html;
  }

  window.setLanguage = function(lang) {
    window.currentPPLang = lang;
    var t = i18nP1[lang] || i18nP1.de;

    var el;
    if (el = document.getElementById('modal-title-1')) el.textContent = t.modal_title_1;
    if (el = document.getElementById('modal-text-1')) {
      el.innerHTML = t.modal_text_1 + '<br><strong style="color:#D4AF37;">' + t.modal_soon + '</strong>';
    }
    if (el = document.getElementById('modal-permonth')) el.textContent = t.modal_permonth;
    if (el = document.getElementById('modal-feat-1')) el.textContent = t.modal_feat_1;
    if (el = document.getElementById('modal-feat-2')) el.textContent = t.modal_feat_2;
    if (el = document.getElementById('modal-feat-3')) el.textContent = t.modal_feat_3;
    if (el = document.getElementById('modal-feat-4')) el.textContent = t.modal_feat_4;
    if (el = document.getElementById('modal-feat-5')) el.textContent = t.modal_feat_5;
    if (el = document.getElementById('btn-early-access')) el.textContent = t.btn_early_access;
    if (el = document.getElementById('btn-cancel-1')) el.textContent = t.btn_cancel_1;
    if (el = document.getElementById('modal-title-2')) el.textContent = t.modal_title_2;
    if (el = document.getElementById('modal-ea-1')) el.textContent = t.modal_ea_1;
    if (el = document.getElementById('modal-ea-2')) el.textContent = t.modal_ea_2;
    if (el = document.getElementById('modal-ea-3')) el.textContent = t.modal_ea_3;
    if (el = document.getElementById('btn-submit-ea')) el.textContent = t.btn_submit_ea;
    if (el = document.getElementById('btn-cancel-2')) el.textContent = t.btn_cancel_2;
    if (el = document.getElementById('modal-title-3')) el.textContent = t.modal_title_3;
    if (el = document.getElementById('modal-success-text')) el.innerHTML = t.modal_success_text;
    if (el = document.getElementById('modal-registered')) el.textContent = t.modal_registered;
    if (el = document.getElementById('btn-continue')) el.textContent = t.btn_continue;

    var emailInput = document.getElementById('earlyAccessEmail');
    if (emailInput) emailInput.placeholder = (lang === 'tr' ? 'E-posta adresiniz' : (lang === 'en' ? 'Your e-mail address' : 'Ihre E-Mail-Adresse'));

    buildPPNav(lang);

    document.querySelectorAll('.lang-btn').forEach(function(b) {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
    document.documentElement.lang = lang;
    try { sessionStorage.setItem('autoLang', lang); } catch(e) {}

    // Parça 2/3 i18n fonksiyonları varsa onları da tetikle (ileride eklenecek)
    if (typeof window.applyPPFormLang === 'function') window.applyPPFormLang(lang);
    if (typeof window.applyPPPdfLang === 'function') window.applyPPPdfLang(lang);
  };

  var defaultLang = null;
  try { defaultLang = sessionStorage.getItem('autoLang'); } catch(e) {}
  if (!defaultLang || !i18nP1[defaultLang]) {
    var navLang = (navigator.language || 'de').toLowerCase();
    defaultLang = navLang.indexOf('tr') === 0 ? 'tr' : (navLang.indexOf('en') === 0 ? 'en' : 'de');
  }
  setLanguage(defaultLang);
})();
