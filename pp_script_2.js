
    (function() {
        'use strict';

        // Heutiges Datum setzen
        var today = new Date().toISOString().split('T')[0];
        document.getElementById('pruefdatum').value = today;

        var tableBody = document.getElementById('tableBody');
        var rowCounter = document.getElementById('rowCounter');
        var rowCount = 0;
        var nextId = 1;

        // Beispieldaten für Auto-Fill
        var BEISPIEL_DATEN = [
            { inventar: 'Bohrmaschine Bosch PSB 750', rpe: '0.08', riso: '2.4', iea: '0.35', bemerkung: 'Beispiel – bitte anpassen' },
            { inventar: 'Verlängerungskabel 10m', rpe: '0.05', riso: '5.0', iea: '0.12', bemerkung: '' },
            { inventar: 'Winkelschleifer Metabo', rpe: '0.09', riso: '1.8', iea: '0.48', bemerkung: '' }
        ];

        function addMonths(dateStr, months) {
            if (!dateStr) return '';
            var parts = dateStr.split('-');
            var d = new Date(parseInt(parts[0],10), parseInt(parts[1],10)-1, parseInt(parts[2],10));
            d.setMonth(d.getMonth() + months);
            return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
        }

        function calculateNextPruefung(row) {
            var lastInput = row.querySelector('.letzte-pruefung');
            var intervallSelect = row.querySelector('.pruefintervall');
            var nextInput = row.querySelector('.naechste-pruefung');
            if (!lastInput || !intervallSelect || !nextInput) return;
            var lastDate = lastInput.value;
            var intervall = parseInt(intervallSelect.value, 10);
            nextInput.value = (!lastDate || isNaN(intervall)) ? '' : addMonths(lastDate, intervall);
        }

        function createRow(id, beispielIdx) {
            var tr = document.createElement('tr');
            tr.dataset.id = id;
            var beispiel = (beispielIdx !== undefined && BEISPIEL_DATEN[beispielIdx]) ? BEISPIEL_DATEN[beispielIdx] : null;

            var tdNr = document.createElement('td');
            tdNr.className = 'row-nr';
            tdNr.textContent = id;
            tr.appendChild(tdNr);

            var tdInv = document.createElement('td');
            var inpInv = document.createElement('input');
            inpInv.type = 'text';
            inpInv.placeholder = ppT('placeholder_inventar', 'z.B. 4711 / Gerät');
            inpInv.className = 'inventar';
            if (beispiel) inpInv.value = beispiel.inventar;
            tdInv.appendChild(inpInv);
            tr.appendChild(tdInv);

            // Sichtprüfung
            var tdSicht = document.createElement('td');
            var selSicht = document.createElement('select');
            selSicht.className = 'sichtpruefung';
            ['✓','✗'].forEach(function(v) {
                var o = document.createElement('option'); o.value = v; o.textContent = v; selSicht.appendChild(o);
            });
            tdSicht.appendChild(selSicht); tr.appendChild(tdSicht);
            selSicht.addEventListener('change', function() { updateStatusBadge(this); });
            updateStatusBadge(selSicht);

            // Funktionsprüfung
            var tdFunk = document.createElement('td');
            var selFunk = document.createElement('select');
            selFunk.className = 'funktionspruefung';
            ['✓','✗','-'].forEach(function(v) {
                var o = document.createElement('option'); o.value = v; o.textContent = v; selFunk.appendChild(o);
            });
            tdFunk.appendChild(selFunk); tr.appendChild(tdFunk);
            selFunk.addEventListener('change', function() { updateStatusBadge(this); });
            updateStatusBadge(selFunk);

            // R.PE
            var tdRpe = document.createElement('td');
            var inpRpe = document.createElement('input');
            inpRpe.type = 'text'; inpRpe.placeholder = 'Ω'; inpRpe.className = 'rpe';
            if (beispiel) inpRpe.value = beispiel.rpe;
            tdRpe.appendChild(inpRpe); tr.appendChild(tdRpe);

            // R.ISO
            var tdRiso = document.createElement('td');
            var inpRiso = document.createElement('input');
            inpRiso.type = 'text'; inpRiso.placeholder = 'MΩ'; inpRiso.className = 'riso';
            if (beispiel) inpRiso.value = beispiel.riso;
            tdRiso.appendChild(inpRiso); tr.appendChild(tdRiso);

            // I.EA
            var tdIea = document.createElement('td');
            var inpIea = document.createElement('input');
            inpIea.type = 'text'; inpIea.placeholder = 'mA'; inpIea.className = 'iea';
            if (beispiel) inpIea.value = beispiel.iea;
            tdIea.appendChild(inpIea); tr.appendChild(tdIea);

            // Letzte Prüfung
            var tdLast = document.createElement('td');
            var inpLast = document.createElement('input');
            inpLast.type = 'date'; inpLast.className = 'letzte-pruefung';
            if (beispiel) inpLast.value = today;
            tdLast.appendChild(inpLast); tr.appendChild(tdLast);

            // Prüfintervall
            var tdIntervall = document.createElement('td');
            var selIntervall = document.createElement('select');
            selIntervall.className = 'pruefintervall';
            var ivLabels = ppIntervalLabels();
            [{value:6,label:ivLabels['6']},{value:12,label:ivLabels['12']},{value:24,label:ivLabels['24']},{value:48,label:ivLabels['48']}].forEach(function(item) {
                var o = document.createElement('option'); o.value = item.value; o.textContent = item.label;
                if (item.value === 24) o.selected = true;
                selIntervall.appendChild(o);
            });
            tdIntervall.appendChild(selIntervall); tr.appendChild(tdIntervall);

            // Nächste Prüfung
            var tdNext = document.createElement('td');
            var inpNext = document.createElement('input');
            inpNext.type = 'date'; inpNext.className = 'naechste-pruefung'; inpNext.readOnly = true;
            inpNext.style.backgroundColor = 'rgba(255,255,255,0.02)';
            tdNext.appendChild(inpNext); tr.appendChild(tdNext);

            // Bemerkung
            var tdNote = document.createElement('td');
            var inpNote = document.createElement('input');
            inpNote.type = 'text'; inpNote.placeholder = ppT('placeholder_bemerkung', 'Bemerkung'); inpNote.className = 'bemerkung';
            if (beispiel) inpNote.value = beispiel.bemerkung || '';
            tdNote.appendChild(inpNote); tr.appendChild(tdNote);

            // QR Button
            var tdQr = document.createElement('td');
            tdQr.style.textAlign = 'center';
            var qrBtn = document.createElement('button');
            qrBtn.textContent = '⬇ QR';
            qrBtn.title = 'QR Code generieren & herunterladen';
            qrBtn.style.cssText = 'background:#D4AF37;border:none;color:#04162E;font-weight:700;font-size:0.65rem;padding:4px 8px;border-radius:8px;cursor:pointer;font-family:inherit;white-space:nowrap;';
            qrBtn.addEventListener('click', function() {
                var inventar = tr.querySelector('.inventar').value.trim();
                if (!inventar) { alert(ppT('alert_inventar_required', 'Bitte Inventarnummer / Bezeichnung eingeben.')); return; }
                var rowNr = tr.querySelector('.row-nr').textContent;
                var standort = document.getElementById('standort').value.trim() || 'PACDI';
                // Unique ID
                var uid = 'PACDI-' + standort.substring(0,6).replace(/[^a-zA-Z0-9]/g,'').toUpperCase() + '-' + String(rowNr).padStart(3,'0') + '-' + Date.now().toString(36).toUpperCase();
                var qrData = JSON.stringify({ id: uid, name: inventar, ts: new Date().toISOString().split('T')[0] });
                generateAndDownloadQR(uid, inventar, qrData);
                // Save to inventory
                var inv = JSON.parse(localStorage.getItem('pacdi_inventory') || '[]');
                var existing = inv.findIndex(function(x){ return x.rowNr == rowNr; });
                var entry = { uid: uid, rowNr: rowNr, name: inventar, ts: new Date().toISOString() };
                if (existing >= 0) inv[existing] = entry; else inv.push(entry);
                localStorage.setItem('pacdi_inventory', JSON.stringify(inv));
            });
            tdQr.appendChild(qrBtn);
            tr.appendChild(tdQr);

            // Checkbox
            var tdSel = document.createElement('td');
            tdSel.style.textAlign = 'center';
            var chk = document.createElement('input');
            chk.type = 'checkbox'; chk.className = 'row-select';
            tdSel.appendChild(chk); tr.appendChild(tdSel);

            inpLast.addEventListener('change', function() { calculateNextPruefung(tr); });
            selIntervall.addEventListener('change', function() { calculateNextPruefung(tr); });

            return tr;
        }

        function updateStatusBadge(select) {
            var td = select.parentNode;
            var val = select.value;
            var badge = td.querySelector('.status-badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'status-badge';
                td.insertBefore(badge, select);
                select.style.display = 'none';
            }
            badge.textContent = val;
            badge.className = 'status-badge' + (val === '✓' ? ' ok' : val === '✗' ? ' fail' : ' neutral');
        }

        function addRow() {
            var tr = createRow(nextId++);
            tableBody.appendChild(tr);
            rowCount++;
            updateRowCounter();
            calculateNextPruefung(tr);
            var sicht = tr.querySelector('.sichtpruefung');
            var funk = tr.querySelector('.funktionspruefung');
            if (sicht) updateStatusBadge(sicht);
            if (funk) updateStatusBadge(funk);
        }

        function deleteLastRow() {
            var rows = tableBody.querySelectorAll('tr');
            if (rows.length === 0) return;
            rows[rows.length-1].remove();
            rowCount--;
            updateRowCounter();
            renumberRows();
        }

        function deleteSelectedRows() {
            var checks = tableBody.querySelectorAll('.row-select:checked');
            if (checks.length === 0) return;
            if (!confirm(checks.length + ' Zeile(n) löschen?')) return;
            checks.forEach(function(chk) { var tr = chk.closest('tr'); if (tr) tr.remove(); });
            rowCount = tableBody.querySelectorAll('tr').length;
            updateRowCounter();
            renumberRows();
        }

        function renumberRows() {
            tableBody.querySelectorAll('tr').forEach(function(tr, idx) {
                var td = tr.querySelector('.row-nr');
                if (td) td.textContent = idx + 1;
            });
        }

        function updateRowCounter() {
            rowCounter.textContent = tableBody.querySelectorAll('tr').length + ' Geräte';
        }

        function saveToLocalStorage() {
            var data = {
                standort: document.getElementById('standort').value,
                raum: document.getElementById('raum').value,
                pruefdatum: document.getElementById('pruefdatum').value,
                pruefer: document.getElementById('pruefer').value,
                rows: []
            };
            tableBody.querySelectorAll('tr').forEach(function(tr) {
                data.rows.push({
                    inventar: tr.querySelector('.inventar').value,
                    sicht: tr.querySelector('.sichtpruefung').value,
                    funktion: tr.querySelector('.funktionspruefung').value,
                    rpe: tr.querySelector('.rpe').value,
                    riso: tr.querySelector('.riso').value,
                    iea: tr.querySelector('.iea').value,
                    letzte: tr.querySelector('.letzte-pruefung').value,
                    intervall: tr.querySelector('.pruefintervall').value,
                    naechste: tr.querySelector('.naechste-pruefung').value,
                    bemerkung: tr.querySelector('.bemerkung').value
                });
            });
            localStorage.setItem('dguv_protokoll', JSON.stringify(data));
            alert(ppT('alert_saved', 'Gespeichert!'));
        }

        function loadFromLocalStorage() {
            var raw = localStorage.getItem('dguv_protokoll');
            if (!raw) { alert(ppT('alert_no_data', 'Keine gespeicherten Daten gefunden.')); return; }
            try {
                var data = JSON.parse(raw);
                document.getElementById('standort').value = data.standort || '';
                document.getElementById('raum').value = data.raum || '';
                document.getElementById('pruefdatum').value = data.pruefdatum || '';
                document.getElementById('pruefer').value = data.pruefer || '';
                tableBody.innerHTML = '';
                nextId = 1;
                if (data.rows && data.rows.length) {
                    data.rows.forEach(function(r) {
                        var tr = createRow(nextId++);
                        tr.querySelector('.inventar').value = r.inventar || '';
                        tr.querySelector('.sichtpruefung').value = r.sicht || '✓';
                        tr.querySelector('.funktionspruefung').value = r.funktion || '✓';
                        tr.querySelector('.rpe').value = r.rpe || '';
                        tr.querySelector('.riso').value = r.riso || '';
                        tr.querySelector('.iea').value = r.iea || '';
                        tr.querySelector('.letzte-pruefung').value = r.letzte || '';
                        tr.querySelector('.pruefintervall').value = r.intervall || '24';
                        tr.querySelector('.naechste-pruefung').value = r.naechste || '';
                        tr.querySelector('.bemerkung').value = r.bemerkung || '';
                        tableBody.appendChild(tr);
                        var sicht = tr.querySelector('.sichtpruefung');
                        var funk = tr.querySelector('.funktionspruefung');
                        if (sicht) updateStatusBadge(sicht);
                        if (funk) updateStatusBadge(funk);
                        calculateNextPruefung(tr);
                    });
                    rowCount = data.rows.length;
                } else { rowCount = 0; }
                updateRowCounter();
                renumberRows();
                alert(ppT('alert_loaded', 'Geladen!'));
            } catch(e) { alert(ppT('alert_load_error','Fehler beim Laden') + ': ' + e.message); }
        }

        // ––– FREEMIUM PDF LOGIC –––
        function handlePDF() {
            var used = localStorage.getItem('pdf_export_used');
            if (!used) {
                // Erster Export: kostenlos
                generatePDF();
                localStorage.setItem('pdf_export_used', 'true');
            } else {
                // Paywall anzeigen
                document.getElementById('paywallModal').classList.add('active');
            }
        }

        function closePaywall() {
            document.getElementById('paywallModal').classList.remove('active');
            // Modal state reset
            setTimeout(function() {
                showModalState('info');
            }, 300);
        }

        function showModalState(state) {
            document.getElementById('modalStateInfo').style.display = state === 'info' ? 'block' : 'none';
            document.getElementById('modalStateForm').style.display = state === 'form' ? 'block' : 'none';
            document.getElementById('modalStateSuccess').style.display = state === 'success' ? 'block' : 'none';
        }

        function showEarlyAccess() {
            showModalState('form');
        }

        function goUpgrade() {
            showEarlyAccess();
        }

        function submitEarlyAccess() {
            var emailInput = document.getElementById('earlyAccessEmail');
            var msg = document.getElementById('earlyAccessMsg');
            var email = emailInput.value.trim();

            // Validierung
            if (!email || email.indexOf('@') < 1 || email.indexOf('.') < 2) {
                msg.style.color = '#F87171';
                msg.textContent = '⚠ Bitte gültige E-Mail eingeben';
                return;
            }

            msg.style.color = '#D4AF37';
            msg.textContent = '⏳ Wird gespeichert...';

            // EmailJS senden
            // !! SETUP: emailjs.com → kostenlos anmelden → Service + Template ID eintragen
            var EMAILJS_PUBLIC_KEY  = '9d7pOeBuMINaOmg_R';
            var EMAILJS_SERVICE_ID  = 'service_u8ta604';
            var EMAILJS_TEMPLATE_ID = 'template_pdzdt6h';

            emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                from_email: email,
                to_name: 'PACDI Team',
                message: 'Neuer Early Access Lead: ' + email,
                reply_to: email
            }).then(function() {
                // Lokal speichern (Backup)
                var leads = JSON.parse(localStorage.getItem('early_access_leads') || '[]');
                leads.push({ email: email, ts: new Date().toISOString() });
                localStorage.setItem('early_access_leads', JSON.stringify(leads));
                showModalState('success');
            }, function(error) {
                // Fallback: nur lokal speichern
                var leads = JSON.parse(localStorage.getItem('early_access_leads') || '[]');
                leads.push({ email: email, ts: new Date().toISOString() });
                localStorage.setItem('early_access_leads', JSON.stringify(leads));
                console.log('Lead gespeichert (lokal):', email, '| EmailJS Fehler:', error);
                showModalState('success');
            });
        }

        function generatePDF() {
            var doc = new jspdf.jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
            var pageWidth = doc.internal.pageSize.getWidth();
            var pageHeight = doc.internal.pageSize.getHeight();
            var margin = 14;
            var startY = 30;

            doc.setFontSize(16); doc.setFont('helvetica', 'bold');
            doc.setTextColor(212, 175, 55);
            doc.text(ppT('pdf_title', 'DGUV V3 Prüfprotokoll'), pageWidth / 2, startY, { align: 'center' });
            doc.setFontSize(10); doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 100, 100);
            doc.text(ppT('pdf_form_no', 'Formular Nr: 011/402'), pageWidth - margin, startY, { align: 'right' });

            var standort = document.getElementById('standort').value || '—';
            var raum = document.getElementById('raum').value || '—';
            var datum = document.getElementById('pruefdatum').value || '—';
            var pruefer = document.getElementById('pruefer').value || '—';

            doc.setFontSize(9); doc.setTextColor(50, 50, 50);
            var infoY = startY + 10;
            doc.text(ppT('pdf_standort', 'Standort') + ': ' + standort, margin, infoY);
            doc.text(ppT('pdf_raum', 'Raum') + ': ' + raum, margin + 70, infoY);
            doc.text(ppT('pdf_datum', 'Datum') + ': ' + datum, margin + 130, infoY);
            doc.text(ppT('pdf_pruefer', 'Prüfer') + ': ' + pruefer, margin + 200, infoY);

            var rows = tableBody.querySelectorAll('tr');
            var tableData = [];
            rows.forEach(function(tr) {
                tableData.push([
                    tr.querySelector('.row-nr').textContent,
                    tr.querySelector('.inventar').value || '',
                    tr.querySelector('.sichtpruefung').value || '✓',
                    tr.querySelector('.funktionspruefung').value || '✓',
                    tr.querySelector('.rpe').value || '',
                    tr.querySelector('.riso').value || '',
                    tr.querySelector('.iea').value || '',
                    tr.querySelector('.letzte-pruefung').value || '',
                    tr.querySelector('.pruefintervall').value || '24',
                    tr.querySelector('.naechste-pruefung').value || '',
                    tr.querySelector('.bemerkung').value || ''
                ]);
            });

            if (tableData.length === 0) { alert(ppT('alert_no_devices', 'Keine Geräte zum Exportieren.')); return; }

            var intervallLabels = ppIntervalLabels();
            var formattedData = tableData.map(function(row) {
                var newRow = row.slice();
                newRow[8] = intervallLabels[row[8]] || row[8] + ' ' + ppT('interval_24', 'Monate').replace(/^\d+\s*/, '');
                return newRow;
            });

            doc.autoTable({
                head: [[
                    ppT('pdf_th_nr','Nr'), ppT('pdf_th_inventar','Inventarnummer / Bezeichnung'),
                    ppT('pdf_th_sicht','Sicht'), ppT('pdf_th_funktion','Funktion'),
                    'R.PE', 'R.ISO', 'I.EA',
                    ppT('pdf_th_letzte','Letzte\nPrüfung'), ppT('pdf_th_intervall','Prüf-\nintervall'),
                    ppT('pdf_th_naechste','Nächste\nPrüfung'), ppT('pdf_th_bemerkung','Bemerkung')
                ]],
                body: formattedData,
                startY: infoY + 10,
                theme: 'grid',
                headStyles: { fillColor: [212,175,55], textColor: [10,22,40], fontStyle: 'bold', fontSize: 7, halign: 'center', valign: 'middle' },
                bodyStyles: { fontSize: 7, textColor: [30,30,30], lineColor: [200,200,200], lineWidth: 0.1 },
                columnStyles: {
                    0:{cellWidth:8,halign:'center'}, 1:{cellWidth:33}, 2:{cellWidth:13,halign:'center'},
                    3:{cellWidth:15,halign:'center'}, 4:{cellWidth:17,halign:'center'}, 5:{cellWidth:17,halign:'center'},
                    6:{cellWidth:17,halign:'center'}, 7:{cellWidth:24,halign:'center'}, 8:{cellWidth:22,halign:'center'},
                    9:{cellWidth:24,halign:'center'}, 10:{cellWidth:25}
                },
                margin: { left: margin, right: margin },
                didDrawPage: function() {
                    var pageCount = doc.internal.getNumberOfPages();
                    for (var i = 1; i <= pageCount; i++) {
                        doc.setPage(i);
                        doc.setFontSize(7); doc.setTextColor(150,150,150);
                        doc.text(ppT('pdf_page','Seite') + ' ' + i + ' / ' + pageCount, pageWidth - margin, pageHeight - 6, { align: 'right' });
                    }
                }
            });

            var finalY = doc.lastAutoTable.finalY + 14;
            if (finalY > pageHeight - 30) { doc.addPage(); finalY = 30; }
            doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(50,50,50);
            doc.text('_________________________', margin + 30, finalY);
            doc.text('_________________________', margin + 100, finalY);
            doc.text('_________________________', margin + 170, finalY);
            doc.setFontSize(8); doc.setTextColor(100,100,100);
            doc.text(ppT('pdf_sign_date','Datum'), margin + 30, finalY + 6);
            doc.text(ppT('pdf_sign_pruefer','Unterschrift Prüfer'), margin + 100, finalY + 6);
            doc.text(ppT('pdf_sign_fasi','Unterschrift FASI'), margin + 170, finalY + 6);

            var footerY = finalY + 20;
            if (footerY > pageHeight - 14) footerY = pageHeight - 14;
            doc.setFontSize(7); doc.setTextColor(150,150,150);
            doc.text(ppT('pdf_footer','Erstellt mit PACDI Digital · pacdi.io'), pageWidth / 2, footerY, { align: 'center' });

            doc.save('DGUV_Pruefprotokoll.pdf');

            // Erfolgs-Banner anzeigen
            document.getElementById('pdfSuccessBanner').classList.add('active');
        }

        function scrollToForm() {
            document.getElementById('formSection').scrollIntoView({ behavior: 'smooth' });
        }

        function generateAndDownloadQR(uid, name, qrData) {
            // Gizli div oluştur
            var hiddenDiv = document.createElement('div');
            hiddenDiv.style.cssText = 'position:fixed;left:-9999px;top:0;width:200px;height:200px;';
            document.body.appendChild(hiddenDiv);

            new QRCode(hiddenDiv, {
                text: qrData,
                width: 300,
                height: 300,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.M
            });

            setTimeout(function() {
                var srcCanvas = hiddenDiv.querySelector('canvas');
                if (!srcCanvas) { document.body.removeChild(hiddenDiv); alert(ppT('alert_qr_error','QR Fehler')); return; }

                // Label ekle
                var finalCanvas = document.createElement('canvas');
                finalCanvas.width = 300;
                finalCanvas.height = 360;
                var ctx = finalCanvas.getContext('2d');
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, 300, 360);
                ctx.drawImage(srcCanvas, 0, 0, 300, 300);

                // Cihaz adı
                ctx.fillStyle = '#000000';
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                var shortName = name.length > 30 ? name.substring(0,28) + '..' : name;
                ctx.fillText(shortName, 150, 325);
                ctx.font = '11px Arial';
                ctx.fillStyle = '#555555';
                ctx.fillText(uid, 150, 345);

                var pngBase64 = finalCanvas.toDataURL('image/png', 1.0);

                // Envantere base64 kaydet
                var inv = JSON.parse(localStorage.getItem('pacdi_inventory') || '[]');
                var existIdx = inv.findIndex(function(x){ return x.uid === uid; });
                var entry = { uid: uid, name: name, qrPng: pngBase64, ts: new Date().toISOString() };
                if (existIdx >= 0) inv[existIdx] = entry; else inv.push(entry);
                localStorage.setItem('pacdi_inventory', JSON.stringify(inv));

                // Bilgi mesajı
                var msg = document.createElement('div');
                msg.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#34D399;color:#04162E;padding:12px 24px;border-radius:12px;font-weight:700;font-size:0.85rem;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,0.3);';
                msg.innerHTML = '&#10003; QR gespeichert: ' + name.substring(0,25) + '<br><span style="font-weight:400;font-size:0.75rem;">Im Inventar verfügbar · optional herunterladen</span>';
                document.body.appendChild(msg);

                // Optionaler Download
                var dlBtn = document.createElement('button');
                dlBtn.textContent = '⬇ PNG herunterladen';
                dlBtn.style.cssText = 'display:block;margin:6px auto 0;background:rgba(0,0,0,0.2);border:1px solid rgba(0,0,0,0.3);color:#04162E;padding:4px 12px;border-radius:8px;cursor:pointer;font-size:0.72rem;font-family:inherit;';
                dlBtn.addEventListener('click', function() {
                    var safeName = name.replace(/[^a-zA-Z0-9]/g,'_').substring(0,30);
                    var filename = 'PACDI-QR-' + safeName + '.png';
                    // Web Share API: erlaubt direktes Speichern in Fotos/Dateien mit einem Tap
                    // (statt "lange drücken → Bild sichern" bei reiner data:-URI).
                    finalCanvas.toBlob(function(blob){
                        if (!blob) { fallbackDataUri(); return; }
                        try {
                            var file = new File([blob], filename, { type: 'image/png' });
                            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                                navigator.share({ files: [file], title: filename }).catch(function(){ fallbackDataUri(); });
                                return;
                            }
                        } catch(e) {}
                        fallbackDataUri();
                    }, 'image/png');
                    function fallbackDataUri(){
                        var link = document.createElement('a');
                        link.download = filename;
                        link.href = pngBase64;
                        link.click();
                    }
                });
                msg.appendChild(dlBtn);
                setTimeout(function() { if (msg.parentNode) msg.parentNode.removeChild(msg); }, 5000);

                document.body.removeChild(hiddenDiv);
            }, 300);
        }

        window.addRow = addRow;
        window.deleteLastRow = deleteLastRow;
        window.deleteSelectedRows = deleteSelectedRows;
        window.saveToLocalStorage = saveToLocalStorage;
        window.loadFromLocalStorage = loadFromLocalStorage;
        window.handlePDF = handlePDF;
        window.calculateNextPruefung = calculateNextPruefung;
        window.closePaywall = closePaywall;
        window.goUpgrade = goUpgrade;
        window.showEarlyAccess = showEarlyAccess;
        window.submitEarlyAccess = submitEarlyAccess;
        window.scrollToForm = scrollToForm;

        // Init: Beispieldaten laden falls kein localStorage
        function init() {
            var raw = localStorage.getItem('dguv_protokoll');
            if (raw) {
                try {
                    var data = JSON.parse(raw);
                    if (data.rows && data.rows.length > 0) { loadFromLocalStorage(); return; }
                } catch(e) {}
            }
            // Auto-Fill Beispiel-Zeilen
            for (var i = 0; i < 3; i++) {
                var tr = createRow(nextId++, i);
                tableBody.appendChild(tr);
                rowCount++;
                calculateNextPruefung(tr);
                var sicht = tr.querySelector('.sichtpruefung');
                var funk = tr.querySelector('.funktionspruefung');
                if (sicht) updateStatusBadge(sicht);
                if (funk) updateStatusBadge(funk);
            }
            updateRowCounter();
        }

        init();

    })();
