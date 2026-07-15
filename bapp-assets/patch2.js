const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'routes', 'api.js');
let src = fs.readFileSync(file, 'utf8');

// 1) ImageModule require ekle (Docxtemplater require satırının hemen altına)
const oldReq = "const Docxtemplater = require('docxtemplater');";
const newReq = `const Docxtemplater = require('docxtemplater');
const ImageModule = require('docxtemplater-image-module-free');

const LOGO_DIR = path.join(__dirname, '..', 'assets', 'logos');
const LOGO_PATHS = {
  zgs_logo: path.join(LOGO_DIR, 'zgs_logo.jpg'),
  bwk_logo: path.join(LOGO_DIR, 'bwk_logo_tam.jpg'),
  berlin_logo: path.join(LOGO_DIR, 'berlin_senat_logo.png')
};
const imageOpts = {
  getImage: (tagValue) => fs.readFileSync(tagValue),
  getSize: (img, tagValue, tagName) => {
    if (tagName === 'zgs_logo') return [55, 90];
    if (tagName === 'bwk_logo') return [160, 26];
    if (tagName === 'berlin_logo') return [220, 31];
    return [100, 60];
  }
};`;
if (src.includes(oldReq) && !src.includes('ImageModule')) {
  src = src.replace(oldReq, newReq);
  console.log('OK: ImageModule require + LOGO_PATHS eklendi');
} else {
  console.log('UYARI: require satırı bulunamadı / zaten var');
}

// 2) Docxtemplater örneğine modules ekle
const oldInit = "const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true, delimiters: { start: '{', end: '}' } });";
const newInit = "const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true, delimiters: { start: '{', end: '}' }, modules: [new ImageModule(imageOpts)] });";
if (src.includes(oldInit)) {
  src = src.replace(oldInit, newInit);
  console.log('OK: Docxtemplater modules eklendi');
} else {
  console.log('UYARI: Docxtemplater init satırı bulunamadı (farklı formatlanmış olabilir)');
}

// 3) render() verisine logo path'lerini ekle
const oldRenderTail = "teilnahme_zeitraum: req.body.teilnahme_zeitraum || '', tarih: today\n    });";
const newRenderTail = "teilnahme_zeitraum: req.body.teilnahme_zeitraum || '', tarih: today,\n      zgs_logo: LOGO_PATHS.zgs_logo, bwk_logo: LOGO_PATHS.bwk_logo, berlin_logo: LOGO_PATHS.berlin_logo\n    });";
if (src.includes(oldRenderTail)) {
  src = src.replace(oldRenderTail, newRenderTail);
  console.log('OK: render() verisine logo path\'leri eklendi');
} else {
  console.log('UYARI: render tail bulunamadı (whitespace farkı olabilir) - elle kontrol gerekebilir');
}

// 4) TEMPLATE_MAP'e teilnahmebescheinigung ekle
const oldMapEnd = "praktikumsbeurteilung: 'praktikumsbeurteilung.docx'";
const newMapEnd = "praktikumsbeurteilung: 'praktikumsbeurteilung.docx',\n  teilnahmebescheinigung: 'teilnahmebescheinigung.docx'";
if (src.includes(oldMapEnd) && !src.includes('teilnahmebescheinigung.docx')) {
  src = src.replace(oldMapEnd, newMapEnd);
  console.log('OK: TEMPLATE_MAP güncellendi');
} else {
  console.log('UYARI: TEMPLATE_MAP satırı bulunamadı / zaten var');
}

fs.writeFileSync(file, src, 'utf8');
console.log('Patch2 tamamlandı.');
