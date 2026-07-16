#!/usr/bin/env python3
"""
update_sitemap.py — batch_split_lang.py çalıştırıldıktan SONRA kullanılır.
sitemap.xml'deki eski kök URL'leri (örn. /kindergeld.html), artık gerçek
/de/kindergeld.html ve /tr/kindergeld.html olarak var olan sayfalarla
değiştirir. Dokunulmamış sayfaları (tek dilli bloglar, legal.html vb.)
olduğu gibi bırakır.

Kullanım (batch_split_lang.py --redirect'ten SONRA, aynı repo_root ile):
    python3 update_sitemap.py /path/to/repo
"""
import argparse
import datetime
from pathlib import Path
from xml.etree import ElementTree as ET

NS = "http://www.sitemaps.org/schemas/sitemap/0.9"
ET.register_namespace("", NS)


def find_domain(repo_root: Path) -> str:
    cname = repo_root / "CNAME"
    if cname.exists():
        return cname.read_text(encoding="utf-8").strip()
    return "example.com"


def detect_lang_dirs(repo_root: Path):
    """Repo kökünde bulunan dil klasörlerini (de, tr, en, ru...) bul."""
    known = {"de", "tr", "en", "ru"}
    return sorted(d.name for d in repo_root.iterdir() if d.is_dir() and d.name in known)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("repo_root")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    repo_root = Path(args.repo_root).resolve()
    domain = find_domain(repo_root)
    lang_dirs = detect_lang_dirs(repo_root)
    sitemap_path = repo_root / "sitemap.xml"
    today = datetime.date.today().isoformat()

    tree = ET.parse(sitemap_path)
    root = tree.getroot()

    updated, unchanged, removed = [], [], []

    for url_el in list(root.findall(f"{{{NS}}}url")):
        loc_el = url_el.find(f"{{{NS}}}loc")
        loc = loc_el.text.strip()
        rel = loc.replace(f"https://{domain}/", "").lstrip("/")

        if rel.split("/")[0] in lang_dirs and rel != "":
            unchanged.append(loc)
            continue

        target_rel = "index.html" if rel == "" else rel
        matches = [lang for lang in lang_dirs if (repo_root / lang / target_rel).exists()]
        if not matches:
            unchanged.append(loc)
            continue

        changefreq_el = url_el.find(f"{{{NS}}}changefreq")
        priority_el = url_el.find(f"{{{NS}}}priority")
        changefreq = changefreq_el.text if changefreq_el is not None else "monthly"
        priority = priority_el.text if priority_el is not None else "0.7"

        if rel == "":
            # Kök "/" girdisini koru (sunucu bunu index.html'e çözer / yönlendirme stub'u),
            # ayrıca dile özel index sayfalarını da ekle.
            unchanged.append(loc)
        else:
            root.remove(url_el)
            removed.append(loc)

        for lang in matches:
            new_url = ET.SubElement(root, f"{{{NS}}}url")
            ET.SubElement(new_url, f"{{{NS}}}loc").text = f"https://{domain}/{lang}/{target_rel}"
            ET.SubElement(new_url, f"{{{NS}}}lastmod").text = today
            ET.SubElement(new_url, f"{{{NS}}}changefreq").text = changefreq
            ET.SubElement(new_url, f"{{{NS}}}priority").text = priority
            updated.append(f"https://{domain}/{lang}/{target_rel}")

    print(f"🌐 Domain: {domain}  |  Dil klasörleri: {', '.join(lang_dirs)}")
    print(f"\n➖ Kaldırılan eski URL'ler ({len(removed)}):")
    for u in removed:
        print(f"  {u}")
    print(f"\n➕ Eklenen yeni URL'ler ({len(updated)}):")
    for u in updated:
        print(f"  {u}")
    print(f"\n= Değişmeyen URL'ler: {len(unchanged)}")

    if not args.dry_run:
        ET.indent(tree, space="  ")
        tree.write(sitemap_path, encoding="UTF-8", xml_declaration=True)
        print(f"\n✓ {sitemap_path} güncellendi.")
    else:
        print("\n(--dry-run modundaydı, sitemap.xml yazılmadı)")


if __name__ == "__main__":
    main()
