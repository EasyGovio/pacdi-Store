#!/usr/bin/env python3
# patch-share-bar.py
# pacdi.store'un inject.py'sine, her modül sayfasının altına (FSEK footer'ın
# hemen üstüne) o modüle özel bir paylaşım çubuğu ekler. WhatsApp/X/Facebook/
# LinkedIn butonları + mobilde native paylaşım menüsü (navigator.share —
# Instagram/TikTok dahil yüklü tüm uygulamaları kapsar) + kopyala butonu.
#
# Kullanım: python3 patch-share-bar.py
# (inject.py'nin bulunduğu dizinde çalıştır)

PATH = "inject.py"

with open(PATH, "r", encoding="utf-8") as f:
    content = f.read()

if "pacdiShareBar" in content:
    print("Zaten uygulanmış, çıkılıyor.")
    raise SystemExit(0)

SHARE_BAR_HEAD = """    <style>
    .pacdi-share-bar{margin-top:24px;padding:16px;background:rgba(246,180,95,0.05);border:1px solid rgba(246,180,95,0.15);border-radius:10px;text-align:center;font-family:-apple-system,BlinkMacSystemFont,sans-serif;box-sizing:border-box;}
    .pacdi-share-label{font-size:0.8rem;color:#7a9ab8;margin-bottom:10px;font-weight:600;}
    .pacdi-share-btns{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;}
    .pacdi-share-btn{display:inline-flex;align-items:center;gap:4px;font-size:0.78rem;padding:7px 14px;border-radius:20px;border:1px solid rgba(246,180,95,0.3);background:transparent;color:#F6B45F;text-decoration:none;cursor:pointer;font-family:inherit;}
    .pacdi-share-btn:hover{background:rgba(246,180,95,0.1);}
    </style>
"""

SHARE_BAR_SCRIPT = """<div class="pacdi-share-bar" id="pacdiShareBar"></div>
<script>
(function(){
  var pageTitle = (document.title.split('|')[0] || document.title).trim();
  var pageUrl = window.location.href;
  var shareText = 'Bu ' + pageTitle + ' aracını faydalı buldum, senin de işine yarayabilir:';

  var bar = document.getElementById('pacdiShareBar');
  if (!bar) return;
  bar.innerHTML =
    '<div class="pacdi-share-label">🔗 Bu aracı paylaş</div>' +
    '<div class="pacdi-share-btns">' +
      '<button class="pacdi-share-btn" id="pacdiShareNative" style="display:none;">📤 Paylaş</button>' +
      '<a class="pacdi-share-btn" target="_blank" rel="noopener" href="https://api.whatsapp.com/send?text=' + encodeURIComponent(shareText + ' ' + pageUrl) + '">💬 WhatsApp</a>' +
      '<a class="pacdi-share-btn" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText) + '&url=' + encodeURIComponent(pageUrl) + '">𝕏</a>' +
      '<a class="pacdi-share-btn" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(pageUrl) + '">Facebook</a>' +
      '<a class="pacdi-share-btn" target="_blank" rel="noopener" href="https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(pageUrl) + '">LinkedIn</a>' +
      '<button class="pacdi-share-btn" id="pacdiShareCopy">🔗 Kopyala</button>' +
    '</div>';

  if (navigator.share) {
    var nativeBtn = document.getElementById('pacdiShareNative');
    nativeBtn.style.display = 'inline-flex';
    nativeBtn.onclick = function(){
      navigator.share({ title: pageTitle, text: shareText, url: pageUrl }).catch(function(){});
    };
  }

  var copyBtn = document.getElementById('pacdiShareCopy');
  copyBtn.onclick = function(){
    navigator.clipboard.writeText(pageUrl).then(function(){
      var old = copyBtn.textContent;
      copyBtn.textContent = '✓ Kopyalandı!';
      setTimeout(function(){ copyBtn.textContent = old; }, 2000);
    }).catch(function(){});
  };
})();
</script>
"""

# 1) Sabitleri PWA_SCRIPT'ten hemen sonra ekle
marker_const = 'FSEK_FOOTER = """<div id="pacdi-fsek"'
if marker_const not in content:
    raise SystemExit("HATA: FSEK_FOOTER tanımı bulunamadı — dosya beklenenden farklı, elle kontrol et.")

const_block = (
    'SHARE_BAR_HEAD = ' + repr(SHARE_BAR_HEAD) + '\n\n'
    'SHARE_BAR_SCRIPT = ' + repr(SHARE_BAR_SCRIPT) + '\n\n'
)
content = content.replace(marker_const, const_block + marker_const, 1)

# 2) Head insert bloğuna paylaşım çubuğu CSS'ini ekle (betaUnlock satırından hemen sonra)
marker_head = "insert += '    ' + BETA_UNLOCK_SCRIPT\n"
if marker_head not in content:
    raise SystemExit("HATA: BETA_UNLOCK_SCRIPT insert satırı bulunamadı — dosya beklenenden farklı, elle kontrol et.")

new_head_insert = marker_head + (
    "            if 'pacdiShareBar' not in content and fname not in SKIP_FOOTER:\n"
    "                insert += SHARE_BAR_HEAD\n"
)
content = content.replace(marker_head, new_head_insert, 1)

# 3) Paylaşım çubuğunu FSEK footer'ın hemen üstüne ekle — footer ister yeni
#    eklenmiş olsun ister zaten var olsun, ikisinde de calisir.
marker_insert_point = "            if content != orig:\n                with open(fpath, 'w', encoding='utf-8') as f:"
if marker_insert_point not in content:
    raise SystemExit("HATA: dosya yazma bloğu bulunamadı — dosya beklenenden farklı, elle kontrol et.")

share_bar_logic = (
    "            # ── PACDI paylaşım çubuğu — her modülün altına, FSEK footer'ın hemen üstüne ──\n"
    "            if ('pacdiShareBar' not in content and fname not in SKIP_FOOTER\n"
    "                    and '<div id=\"pacdi-fsek\"' in content):\n"
    "                content = content.replace('<div id=\"pacdi-fsek\"', SHARE_BAR_SCRIPT + '\\n<div id=\"pacdi-fsek\"', 1)\n\n"
)
content = content.replace(marker_insert_point, share_bar_logic + marker_insert_point, 1)

with open(PATH, "w", encoding="utf-8") as f:
    f.write(content)

print("Tamamlandı: paylaşım çubuğu (SHARE_BAR_HEAD + SHARE_BAR_SCRIPT) eklendi.")
