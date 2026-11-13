# Federica Tebaldi Studio — V3

Avvio locale: `npm run dev` (Node.js e Python 3), poi http://localhost:8000. Non aprire direttamente i file HTML: i JSON richiedono HTTP. In alternativa `npm run build` e un server statico come Live Server.

Vercel: importare il repository, preset Other; vercel.json configura il build e la cartella di output. Nessuna dipendenza npm.

- `data/projects.json`: anagrafica, stato, ordine, traduzioni IT/EN/ES e crediti.
- `i18n/`: etichette dell'interfaccia.
- `images/projects/<categoria>/<id>/`: fotografie numerate, prima foto come copertina. JPG/JPEG/PNG/WebP/AVIF, anche maiuscole. `images/foto-dinamiche-home/`: stesso criterio.
- `npm run build` rigenera `data/images-manifest.json`; Vercel lo esegue a ogni deploy. In locale rieseguirlo dopo aggiunte. Non modificare manualmente il manifest.
- Nuovo progetto: aggiungere record JSON e cartella indicata in imageFolder. Le cartelle vuote possono non essere conservate da Git: ricrearle quando si aggiungono foto.
- M.PELLEGRINA non associato a S. SILVESTRO in assenza di conferma. Foto generiche precedenti conservate ma non usate nei progetti.
- Dati mancanti mostrati come INFO MANCANTE (tradotto nelle altre lingue). Social ancora generici; Futura Light locale con fallback, nessun font distribuito.

## V9 — Footer e privacy
Copyright con anno automatico, link privacy e credito studio su tutte le pagine. La pagina privacy è una bozza trilingue: completare i dati del titolare, i contatti e verificare configurazione hosting, conservazione e trasferimenti prima della pubblicazione. L'archivio ricevuto non contiene images/: conservare la cartella locale e il manifest. Nessun banner aggiunto; verificare i requisiti effettivi degli strumenti di memorizzazione prima del lancio.
