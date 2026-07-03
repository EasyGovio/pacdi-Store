/**
 * PACDI Ausbildung-Takip — Apps Script Backend
 * ---------------------------------------------
 * Kurulum:
 * 1. Google Sheets'te yeni bir tablo oluştur (kontrolörün kendi hesabıyla).
 * 2. İki sekme ekle: "Kod-Eslestirme" ve "Takip-Verisi" (aşağıdaki başlıklarla).
 * 3. Uzantılar → Apps Script → bu dosyanın tamamını yapıştır.
 * 4. Dağıt → Yeni Dağıtım → Tür: Web Uygulaması
 *    - Yürütme: Ben (kontrolörün hesabı)
 *    - Erişim: Herkes (Anyone) — böylece işyeri/öğrenci Google hesabı gerektirmez
 * 5. Verilen Web App URL'sini kopyala, aşağıdaki HTML dosyalarındaki
 *    SCRIPT_URL değişkenine yapıştır.
 *
 * "Kod-Eslestirme" sekmesi başlıkları (A1:F1):
 *   Ogrenci_Kod | Ogrenci_Ad | Meslek_Dali | Isyeri_Kod | Isyeri_Ad | Kayit_Tarihi
 *
 * "Takip-Verisi" sekmesi başlıkları (A1:G1):
 *   Tarih | Ogrenci_Kod | Isyeri_Kod | Devam_Durumu | Performans_Notu | Yazili_Not | Girisi_Zamani
 */

var SHEET_ESLESTIRME = 'Kod-Eslestirme';
var SHEET_TAKIP = 'Takip-Verisi';

var SPREADSHEET_ID = '1-7EtPyDAq6cVrb_c0FX-sHtvjCLxIESyR6eilcSVW60';
function getSS() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}


function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;

    if (action === 'registerStudent') {
      return handleRegisterStudent(data);
    } else if (action === 'dailyEntry') {
      return handleDailyEntry(data);
    } else if (action === 'lookupStudent') {
      return handleLookupStudent(data);
    } else if (action === 'getAllOverview') {
      return handleGetAllOverview();
    }

    return jsonResponse({ ok: false, error: 'Bilinmeyen işlem: ' + action });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  // Basit sağlık kontrolü — tarayıcıdan URL'i açınca "OK" görürsün.
  return ContentService.createTextOutput('PACDI Ausbildung-Takip API çalışıyor.');
}

function handleRegisterStudent(data) {
  var sheet = getSS().getSheetByName(SHEET_ESLESTIRME);
  if (!sheet) return jsonResponse({ ok: false, error: 'Sekme bulunamadı: ' + SHEET_ESLESTIRME });

  // Basit doğrulama
  if (!data.ogrenciKod || !data.ogrenciAd || !data.isyeriKod || !data.isyeriAd) {
    return jsonResponse({ ok: false, error: 'Eksik alan var.' });
  }

  sheet.appendRow([
    data.ogrenciKod,
    data.ogrenciAd,
    data.meslekDali || '',
    data.isyeriKod,
    data.isyeriAd,
    new Date()
  ]);

  return jsonResponse({ ok: true, message: 'Öğrenci kaydedildi: ' + data.ogrenciKod });
}

function handleDailyEntry(data) {
  var sheet = getSS().getSheetByName(SHEET_TAKIP);
  if (!sheet) return jsonResponse({ ok: false, error: 'Sekme bulunamadı: ' + SHEET_TAKIP });

  if (!data.ogrenciKod || !data.isyeriKod || !data.devamDurumu) {
    return jsonResponse({ ok: false, error: 'Eksik alan var.' });
  }

  sheet.appendRow([
    data.tarih || Utilities.formatDate(new Date(), 'Europe/Berlin', 'yyyy-MM-dd'),
    data.ogrenciKod,
    data.isyeriKod,
    data.devamDurumu,
    data.performansNotu || '',
    data.yaziliNot || '',
    new Date()
  ]);

  return jsonResponse({ ok: true, message: 'Kayıt eklendi.' });
}

function handleLookupStudent(data) {
  // İşyerinin kendi kodunu girip, o işyerine bağlı öğrencileri görebilmesi için.
  var sheet = getSS().getSheetByName(SHEET_ESLESTIRME);
  if (!sheet) return jsonResponse({ ok: false, error: 'Sekme bulunamadı: ' + SHEET_ESLESTIRME });

  var values = sheet.getDataRange().getValues();
  var results = [];
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    if (String(row[3]) === String(data.isyeriKod)) {
      results.push({
        ogrenciKod: row[0],
        ogrenciAd: row[1],
        meslekDali: row[2]
      });
    }
  }

  return jsonResponse({ ok: true, students: results });
}

function handleGetAllOverview() {
  var ss = getSS();
  var sheetE = ss.getSheetByName(SHEET_ESLESTIRME);
  var sheetT = ss.getSheetByName(SHEET_TAKIP);
  if (!sheetE || !sheetT) return jsonResponse({ ok: false, error: 'Sekme(ler) bulunamadı.' });

  var students = [];
  var eValues = sheetE.getDataRange().getValues();
  for (var i = 1; i < eValues.length; i++) {
    var row = eValues[i];
    if (!row[0]) continue;
    students.push({
      ogrenciKod: row[0],
      ogrenciAd: row[1],
      meslekDali: row[2],
      isyeriKod: row[3],
      isyeriAd: row[4]
    });
  }

  var entries = [];
  var tValues = sheetT.getDataRange().getValues();
  for (var j = 1; j < tValues.length; j++) {
    var trow = tValues[j];
    if (!trow[1]) continue;
    var tarihVal = trow[0];
    var tarihStr = (tarihVal instanceof Date)
      ? Utilities.formatDate(tarihVal, 'Europe/Berlin', 'yyyy-MM-dd')
      : String(tarihVal);
    entries.push({
      tarih: tarihStr,
      ogrenciKod: trow[1],
      isyeriKod: trow[2],
      devamDurumu: trow[3],
      performansNotu: trow[4],
      yaziliNot: trow[5]
    });
  }

  return jsonResponse({ ok: true, students: students, entries: entries });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
