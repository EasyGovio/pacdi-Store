/**
 * PACDI BAPP — Aday Takip + Belge Üretici Backend
 * -------------------------------------------------
 * AYRI bir Google Sheets + Apps Script projesi olmalı —
 * Ausbildung-Takip'ten bağımsız, çünkü veri çok daha hassas.
 *
 * Kurulum:
 * 1. Yeni bir Google Sheets oluştur, "BAPP Aday Takip" gibi bir isim ver.
 * 2. Aşağıdaki sekmeleri ekle:
 *
 *    "Bewerber" (A1:S1):
 *      Nr | Name | Vorname | Geburtsdatum | Geburtsort | Adresse | PLZ_Ort |
 *      Handy | Email | Schulabschluss | Beruf1 | Beruf2 | Betrieb_Kod |
 *      Puan_Allg | Puan_Deutsch | Puan_Logik | Puan_Mathe | Puan_Erinnerung |
 *      Entscheidung
 *      (not: Gesamt puan otomatik hesaplanır, Sheets'e yazılmaz — sadece frontend'de gösterilir)
 *
 *    "Betriebe" (A1:E1):
 *      Kod | Name | Adresse | Ansprechpartner | Telefon
 *
 * 3. Uzantılar → Apps Script → bu dosyanın tamamını yapıştır.
 * 4. Dağıt → Web Uygulaması → Erişim: Herkes.
 *
 * ═══════════════════════════════════════════
 * BELGE ŞABLONLARI (Google Docs) — AYRICA HAZIRLANMALI:
 * ═══════════════════════════════════════════
 * Her belge için: Word dosyasını Google Docs'a yükle/dönüştür,
 * boş alanları aşağıdaki token'larla değiştir (birebir bu yazımla,
 * çift süslü parantez dahil). Doc'un ID'sini kopyala (URL'deki
 * /d/BURASI/edit kısmı), aşağıdaki TEMPLATE_IDS objesine ekle.
 *
 * Ortak token'lar (çoğu belgede geçer):
 *   {{AD}}              → Vorname
 *   {{SOYAD}}           → Name
 *   {{DOGUM_TARIHI}}    → Geburtsdatum
 *   {{DOGUM_YERI}}      → Geburtsort
 *   {{ADRES}}           → Adresse
 *   {{PLZ_ORT}}         → PLZ_Ort
 *   {{TELEFON}}         → Handy
 *   {{EMAIL}}           → Email
 *   {{MESLEK}}          → Beruf1
 *   {{BETRIEB_ADI}}     → Betriebe.Name
 *   {{BETRIEB_ADRES}}   → Betriebe.Adresse
 *   {{BETRIEB_ANSPRECHPARTNER}} → Betriebe.Ansprechpartner
 *   {{BETRIEB_TELEFON}} → Betriebe.Telefon
 *   {{BUGUNUN_TARIHI}}  → belge üretim tarihi (otomatik)
 */

var BAPP_SPREADSHEET_ID = 'BURAYA_YENİ_SHEET_ID_YAPISTIR';
var API_SECRET = 'pacdi-2026-guvenlik-anahtari-x7k2';

// Google Docs şablon ID'leri — hazırladıkça buraya ekle.
var TEMPLATE_IDS = {
  teilnahmeempfehlung: '',
  personalbogen: '',
  praktikumsvertrag: '',
  kooperationsvertrag: '',
  praktikumsbeurteilung: ''
};

// Üretilen belgelerin kaydedileceği Drive klasörü (isteğe bağlı, boşsa Drive kökü).
var OUTPUT_FOLDER_ID = '';

function getSS() {
  return SpreadsheetApp.openById(BAPP_SPREADSHEET_ID);
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput('PACDI BAPP Backend çalışıyor.');
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (data.apiKey !== API_SECRET) {
      return jsonResponse({ ok: false, error: 'Yetkisiz istek.' });
    }
    var action = data.action;

    if (action === 'addBewerber') return handleAddBewerber(data);
    if (action === 'listBewerber') return handleListBewerber();
    if (action === 'updateEntscheidung') return handleUpdateEntscheidung(data);
    if (action === 'listBetriebe') return handleListBetriebe();
    if (action === 'addBetrieb') return handleAddBetrieb(data);
    if (action === 'generateDocument') return handleGenerateDocument(data);

    return jsonResponse({ ok: false, error: 'Bilinmeyen işlem: ' + action });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

var SHEET_BEWERBER = 'Bewerber';
var SHEET_BETRIEBE = 'Betriebe';

function nextRowNumber(sheet) {
  var values = sheet.getDataRange().getValues();
  return values.length; // header + n data rows → next Nr = row count (1-index'te doğru sıra)
}

function handleAddBewerber(data) {
  var sheet = getSS().getSheetByName(SHEET_BEWERBER);
  if (!sheet) return jsonResponse({ ok: false, error: 'Sekme bulunamadı: ' + SHEET_BEWERBER });

  if (!data.name || !data.vorname) {
    return jsonResponse({ ok: false, error: 'İsim/soyisim gerekli.' });
  }

  var nr = nextRowNumber(sheet);

  sheet.appendRow([
    nr,
    data.name,
    data.vorname,
    data.geburtsdatum || '',
    data.geburtsort || '',
    data.adresse || '',
    data.plzOrt || '',
    data.handy || '',
    data.email || '',
    data.schulabschluss || '',
    data.beruf1 || '',
    data.beruf2 || '',
    data.betriebKod || '',
    data.puanAllg || 0,
    data.puanDeutsch || 0,
    data.puanLogik || 0,
    data.puanMathe || 0,
    data.puanErinnerung || 0,
    '' // Entscheidung — hep boş başlar, elle doldurulur
  ]);

  return jsonResponse({ ok: true, nr: nr });
}

function handleListBewerber() {
  var sheet = getSS().getSheetByName(SHEET_BEWERBER);
  if (!sheet) return jsonResponse({ ok: false, error: 'Sekme bulunamadı: ' + SHEET_BEWERBER });

  var values = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    if (!row[1]) continue; // Name boşsa atla
    var puanToplam = (Number(row[13]) || 0) + (Number(row[14]) || 0) + (Number(row[15]) || 0) +
                      (Number(row[16]) || 0) + (Number(row[17]) || 0);
    list.push({
      nr: row[0],
      name: row[1],
      vorname: row[2],
      geburtsdatum: row[3],
      geburtsort: row[4],
      adresse: row[5],
      plzOrt: row[6],
      handy: row[7],
      email: row[8],
      schulabschluss: row[9],
      beruf1: row[10],
      beruf2: row[11],
      betriebKod: row[12],
      puanAllg: row[13],
      puanDeutsch: row[14],
      puanLogik: row[15],
      puanMathe: row[16],
      puanErinnerung: row[17],
      puanToplam: puanToplam,
      entscheidung: row[18] || ''
    });
  }
  return jsonResponse({ ok: true, bewerber: list });
}

function handleUpdateEntscheidung(data) {
  if (!data.nr || !data.entscheidung) {
    return jsonResponse({ ok: false, error: 'Nr ve karar gerekli.' });
  }
  var sheet = getSS().getSheetByName(SHEET_BEWERBER);
  if (!sheet) return jsonResponse({ ok: false, error: 'Sekme bulunamadı: ' + SHEET_BEWERBER });

  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(data.nr)) {
      sheet.getRange(i + 1, 19).setValue(data.entscheidung); // Entscheidung sütunu = 19
      return jsonResponse({ ok: true });
    }
  }
  return jsonResponse({ ok: false, error: 'Aday bulunamadı.' });
}

function handleListBetriebe() {
  var sheet = getSS().getSheetByName(SHEET_BETRIEBE);
  if (!sheet) return jsonResponse({ ok: false, error: 'Sekme bulunamadı: ' + SHEET_BETRIEBE });

  var values = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    if (!row[0]) continue;
    list.push({ kod: row[0], name: row[1], adres: row[2], ansprechpartner: row[3], telefon: row[4] });
  }
  return jsonResponse({ ok: true, betriebe: list });
}

function handleAddBetrieb(data) {
  var sheet = getSS().getSheetByName(SHEET_BETRIEBE);
  if (!sheet) return jsonResponse({ ok: false, error: 'Sekme bulunamadı: ' + SHEET_BETRIEBE });
  if (!data.kod || !data.name) return jsonResponse({ ok: false, error: 'Kod ve isim gerekli.' });

  sheet.appendRow([data.kod, data.name, data.adres || '', data.ansprechpartner || '', data.telefon || '']);
  return jsonResponse({ ok: true });
}

function findBewerberByNr(nr) {
  var sheet = getSS().getSheetByName(SHEET_BEWERBER);
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(nr)) return values[i];
  }
  return null;
}

function findBetriebByKod(kod) {
  var sheet = getSS().getSheetByName(SHEET_BETRIEBE);
  if (!sheet) return null;
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(kod)) return values[i];
  }
  return null;
}

function handleGenerateDocument(data) {
  if (!data.nr || !data.templateKey) {
    return jsonResponse({ ok: false, error: 'Aday numarası ve belge tipi gerekli.' });
  }
  var templateId = TEMPLATE_IDS[data.templateKey];
  if (!templateId) {
    return jsonResponse({ ok: false, error: 'Bu belge tipi için şablon henüz tanımlanmadı: ' + data.templateKey });
  }

  var row = findBewerberByNr(data.nr);
  if (!row) return jsonResponse({ ok: false, error: 'Aday bulunamadı.' });

  var betriebRow = findBetriebByKod(row[12]); // Betrieb_Kod

  var tokens = {
    '{{AD}}': row[2] || '',
    '{{SOYAD}}': row[1] || '',
    '{{DOGUM_TARIHI}}': row[3] || '',
    '{{DOGUM_YERI}}': row[4] || '',
    '{{ADRES}}': row[5] || '',
    '{{PLZ_ORT}}': row[6] || '',
    '{{TELEFON}}': row[7] || '',
    '{{EMAIL}}': row[8] || '',
    '{{MESLEK}}': row[10] || '',
    '{{BETRIEB_ADI}}': betriebRow ? betriebRow[1] : '',
    '{{BETRIEB_ADRES}}': betriebRow ? betriebRow[2] : '',
    '{{BETRIEB_ANSPRECHPARTNER}}': betriebRow ? betriebRow[3] : '',
    '{{BETRIEB_TELEFON}}': betriebRow ? betriebRow[4] : '',
    '{{BUGUNUN_TARIHI}}': Utilities.formatDate(new Date(), 'Europe/Berlin', 'dd.MM.yyyy')
  };

  try {
    var copyName = data.templateKey + '_' + row[1] + '_' + row[2] + '_' + tokens['{{BUGUNUN_TARIHI}}'];
    var sourceFile = DriveApp.getFileById(templateId);
    var newFile;
    if (OUTPUT_FOLDER_ID) {
      newFile = sourceFile.makeCopy(copyName, DriveApp.getFolderById(OUTPUT_FOLDER_ID));
    } else {
      newFile = sourceFile.makeCopy(copyName);
    }

    var doc = DocumentApp.openById(newFile.getId());
    var body = doc.getBody();
    for (var key in tokens) {
      body.replaceText(key.replace(/[{}]/g, '\\$&'), tokens[key]);
    }
    doc.saveAndClose();

    return jsonResponse({ ok: true, docUrl: newFile.getUrl(), docId: newFile.getId() });
  } catch (err) {
    return jsonResponse({ ok: false, error: 'Belge üretilemedi: ' + String(err) });
  }
}
