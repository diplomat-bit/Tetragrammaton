# 🌐 Global Corporate Treasury & Open Banking Command Center

## 📖 The Epic Narrative: Reimagining Financial Infrastructure

Imagine stepping into the role of a modern Corporate Treasurer, Quantitative Analyst, or FinTech Developer. The traditional financial world is fragmented, relying on archaic portals, manual CSV exports, and delayed batch processing. You are sitting at a command center that shatters those limitations.

This application isn't just a static web interface or a mock prototype; it is a **live, fully-connected global financial sandbox**. By integrating directly with the **Open Bank Project (OBP)** network, this platform bypasses hardcoded dummy data and reaches straight into a sprawling ecosystem of simulated financial institutions worldwide.

When you boot up this system, it dynamically discovers the banking network. It maps out entities ranging from traditional tier-one banks like *The Royal Bank of Scotland*, *Banco Santander*, and *Deutsche Bank*, all the way to specialized test environments and regional simulated banks. You aren't just looking at data—you are interacting with an active API network that mimics real-world Open Banking (PSD2) standards.

### 🔐 The Authentication Matrix
Security and access control are paramount. You begin your session by injecting your Open Bank Project credentials directly into the platform. The application executes a secure `DirectLogin` sequence against the OBP servers, exchanging your API Key, Username, and Password for a cryptographic session token. From that moment on, every network request is signed, authenticated, and authorized to manipulate your specific corporate sandboxes.

### 📡 The Network Telemetry Inspector
True control requires absolute visibility. We built a live **Telemetry & Network Inspector** (accessible via the Terminal icon) that acts as an API heart monitor. Every time the dashboard whispers to a bank—whether it's fetching account balances or routing a cross-border payment—the inspector logs the raw truth. You see the exact HTTP statuses, latency in milliseconds, destination URLs, and the raw JSON payloads. We even generate 1-click copyable `cURL` commands so you can instantly drop into your own terminal and replay the network events.

### 💸 Programmatic Liquidity & Money Movement
Viewing balances is only half the equation; manipulating liquidity is where true power lies. The integrated **Transfer & Settlement Engine** allows you to initiate cross-institution transfers on the fly. Select a source account from your portfolio, pick an external destination bank from the live network, and dispatch the funds. The frontend instantly orchestrates the complex `POST` payloads required by the OBP Transaction Request API, executing programmatic money movement in real-time.

### 🛠️ Interactive API Workbench
Built by developers, for developers. Embedded within the Open Bank Project module is a Postman-style API workbench. You don't need to leave the app to debug a new endpoint. With one click, you can fire off custom `GET` and `POST` requests to specific bank routing addresses, instantly rendering and formatting the JSON response right inside your dashboard.

---

## 🚀 Core Architecture & Technology Stack

This platform is engineered using a robust, modern full-stack architecture designed for performance, security, and developer experience.

- **Frontend Ecosystem**: Built with **React 18** and **Vite** for lightning-fast HMR and optimized production builds.
- **Styling & UI**: Powered by **Tailwind CSS** for responsive, utility-first styling, paired with **Lucide Icons** and **Framer Motion** for fluid, professional animations and transitions.
- **Backend Proxy Engine**: A **Node.js** and **Express** server operates as a secure intermediary layer. This prevents CORS issues, protects sensitive API keys from being exposed to the client browser, and acts as the central hub for our Telemetry tracking.
- **API Integration**: Deep, native integration with the **Open Bank Project (v5.1.0 API)**, alongside specialized abstractions for simulated Modern Treasury clearing and Commercial Paper desks.

---

## 🛠️ Getting Started & Installation Guide

1. **Clone & Install**: Ensure you have Node.js installed. Run `npm install` to pull down all dependencies.
2. **Environment Configuration**: Duplicate `.env.example` to `.env` and configure your OBP credentials if running locally.
3. **Boot the Engines**: Run `npm run dev` to spin up both the Vite frontend and the Express API proxy simultaneously.
4. **Authenticate**: Open the application, click the **Credentials / Settings** button in the top right, and input your OBP API Key and login details.
5. **Explore**: Navigate to the Open Bank Project tab, open the Telemetry Inspector, and start interacting with the global sandbox.

---

## 🏦 The Complete Global Banking Directory

This platform is engineered to interact with the entire Open Bank Project sandbox network. Upon initialization, it dynamically fetches and indexes the available financial institutions.

Below is the comprehensive list of all **226** banks currently accessible and integrated within this command center:

| Bank ID | Short Name | Full Name | Primary Routing Scheme |
|---------|------------|-----------|------------------------|
| `rbs` | The Royal Bank of Scotland | The Royal Bank of Scotland | `OBP` |
| `test-bank` | TB | Test Bank | `OBP` |
| `testowy_bank_id` | TB | Testowy bank | `OBP` |
| `nordea` | Nordea | Nordea Bank AB | `OBP` |
| `nordeaab` | Nordea | Nordea Bank AB | `OBP` |
| `hsbc-test` | HSBC Test | Hongkong and Shanghai Bank | `OBP` |
| `erste-test` | Erste Bank Test | Erste Bank Test | `OBP` |
| `deutche-test` | Deutche Bank Test | Deutche Bank Test | `OBP` |
| `obp-bankx-m` | Bank X | The Bank of X | `OBP` |
| `obp-banky-m` | Bank Y | The Bank of Y | `OBP` |
| `obp-bankx-n` | Bank X | The Bank of X | `OBP` |
| `obp-banky-n` | Bank Y | The Bank of Y | `OBP` |
| `obp-bankx-q` | Bank X | The Bank of X | `OBP` |
| `obp-banky-q` | Bank Y | The Bank of Y | `OBP` |
| `obp-bank-x-r` | Bank X | The Bank of X | `OBP` |
| `obp-bank-y-r` | Bank Y | The Bank of Y | `OBP` |
| `obp-bank-x-g` | Bank X | The Bank of X | `OBP` |
| `obp-bank-y-g` | Bank Y | The Bank of Y | `OBP` |
| `in-bank-x-1` | India Bank X | The India Bank of X | `OBP` |
| `in-bank-y-1` | India Bank Y | The India Bank of Y | `OBP` |
| `in-bank-x-2` | India Bank X | The India Bank of X | `OBP` |
| `in-bank-y-2` | India Bank Y | The India Bank of Y | `OBP` |
| `at02-bank-x--01` | Bank X | The Bank of X | `OBP` |
| `at02-bank-y--01` | Bank Y | The Bank of Y | `OBP` |
| `at02-2080--01` | Abanca | ABANCA CORPORACION BANCARIA, S.A. | `OBP` |
| `at02-0061--01` | Banca March | BANCA MARCH, S.A. | `OBP` |
| `at02-0049--01` | Banco Santander | BANCO SANTANDER, S.A. | `OBP` |
| `at02-0238--01` | Banco Pastor | BANCO PASTOR, S.A. | `OBP` |
| `at02-0075--01` | Banco Popular | BANCO POPULAR ESPAÑOL, S.A. | `OBP` |
| `at02-2038--01` | Bankia | BANKIA, S.A | `OBP` |
| `at02-0128--01` | Bankinter | BANKINTER, S.A. | `OBP` |
| `at02-0182--01` | BBVA | BANCO BILBAO VIZCAYA ARGENTARIA, S.A. | `OBP` |
| `at02-0487--01` | BMN | BANCO MARE NOSTRUM, S.A. | `OBP` |
| `at02-2100--01` | CaixaBank | CAIXABANK, S.A. | `OBP` |
| `at02-0225--01` | Cetelem | BANCO CETELEM, S.A. | `OBP` |
| `at02-0019--01` | Deutsche Bank | DEUTSCHE BANK, SOCIEDAD ANONIMA ESPAÑOLA | `OBP` |
| `at02-2085--01` | Ibercaja | IBERCAJA BANCO, S.A. | `OBP` |
| `at02-1465--01` | ING | ING BANK, N.V. SUCURSAL EN ESPAÑA | `OBP` |
| `at02-2095--01` | Kutxabank | KUTXABANK, S.A | `OBP` |
| `at02-2048--01` | Liberbank | LIBERBANK, S.A. | `OBP` |
| `at02-0073--01` | Open Bank | OPEN BANK, S.A. | `OBP` |
| `at02-0081--01` | Sabadell | BANCO DE SABADELL, S.A. | `OBP` |
| `at02-2103--01` | Unicaja | UNICAJA BANCO, S.A. | `OBP` |
| `at03-bank-x` | Bank X | The Bank of X | `OBP` |
| `at03-bank-y` | Bank Y | The Bank of Y | `OBP` |
| `at03-2080` | Abanca | ABANCA CORPORACION BANCARIA, S.A. | `OBP` |
| `at03-0061` | Banca March | BANCA MARCH, S.A. | `OBP` |
| `at03-0049` | Banco Santander | BANCO SANTANDER, S.A. | `OBP` |
| `at03-0238` | Banco Pastor | BANCO PASTOR, S.A. | `OBP` |
| `at03-0075` | Banco Popular | BANCO POPULAR ESPAÑOL, S.A. | `OBP` |
| `at03-2038` | Bankia | BANKIA, S.A | `OBP` |
| `at03-0128` | Bankinter | BANKINTER, S.A. | `OBP` |
| `at03-0182` | BBVA | BANCO BILBAO VIZCAYA ARGENTARIA, S.A. | `OBP` |
| `at03-0487` | BMN | BANCO MARE NOSTRUM, S.A. | `OBP` |
| `at03-2100` | CaixaBank | CAIXABANK, S.A. | `OBP` |
| `at03-0225` | Cetelem | BANCO CETELEM, S.A. | `OBP` |
| `at03-0019` | Deutsche Bank | DEUTSCHE BANK, SOCIEDAD ANONIMA ESPAÑOLA | `OBP` |
| `at03-2085` | Ibercaja | IBERCAJA BANCO, S.A. | `OBP` |
| `at03-1465` | ING | ING BANK, N.V. SUCURSAL EN ESPAÑA | `OBP` |
| `at03-2095` | Kutxabank | KUTXABANK, S.A | `OBP` |
| `at03-2048` | Liberbank | LIBERBANK, S.A. | `OBP` |
| `at03-0073` | Open Bank | OPEN BANK, S.A. | `OBP` |
| `at03-0081` | Sabadell | BANCO DE SABADELL, S.A. | `OBP` |
| `at03-2103` | Unicaja | UNICAJA BANCO, S.A. | `OBP` |
| `at.03.bank-x.uk` | Bank X | The Bank of X | `OBP` |
| `at.03.bank-y.uk` | Bank Y | The Bank of Y | `OBP` |
| `at.03.2080.uk` | Abanca | ABANCA CORPORACION BANCARIA, S.A. | `OBP` |
| `at.03.0061.es` | Banca March | BANCA MARCH, S.A. | `OBP` |
| `at.03.0049.es` | Banco Santander | BANCO SANTANDER, S.A. | `OBP` |
| `at.03.0238.es` | Banco Pastor | BANCO PASTOR, S.A. | `OBP` |
| `at.03.0075.es` | Banco Popular | BANCO POPULAR ESPAÑOL, S.A. | `OBP` |
| `at.03.2038.es` | Bankia | BANKIA, S.A | `OBP` |
| `at.03.0128.es` | Bankinter | BANKINTER, S.A. | `OBP` |
| `at.03.0182.es` | BBVA | BANCO BILBAO VIZCAYA ARGENTARIA, S.A. | `OBP` |
| `at.03.0487.es` | BMN | BANCO MARE NOSTRUM, S.A. | `OBP` |
| `at.03.2100.es` | CaixaBank | CAIXABANK, S.A. | `OBP` |
| `at.03.0225.es` | Cetelem | BANCO CETELEM, S.A. | `OBP` |
| `at.03.0019.es` | Deutsche Bank | DEUTSCHE BANK, SOCIEDAD ANONIMA ESPAÑOLA | `OBP` |
| `at.03.2085.es` | Ibercaja | IBERCAJA BANCO, S.A. | `OBP` |
| `at.03.1465.es` | ING | ING BANK, N.V. SUCURSAL EN ESPAÑA | `OBP` |
| `at.03.2095.es` | Kutxabank | KUTXABANK, S.A | `OBP` |
| `at.03.2048.es` | Liberbank | LIBERBANK, S.A. | `OBP` |
| `at.03.0073.es` | Open Bank | OPEN BANK, S.A. | `OBP` |
| `at.03.0081.es` | Sabadell | BANCO DE SABADELL, S.A. | `OBP` |
| `at.03.2103.es` | Unicaja | UNICAJA BANCO, S.A. | `OBP` |
| `op.01.uk` | uk | uk | `OBP` |
| `op.01.fr` | FR | FR | `OBP` |
| `op.01.it` | it | it | `OBP` |
| `op.01.us` | US | US | `OBP` |
| `op.01.tr` | Tr | TR | `OBP` |
| `op.01.be` | be | be | `OBP` |
| `op.01.de` | de | de | `OBP` |
| `op.01.fi` | fi | fi | `OBP` |
| `op.02.uk` | uk | uk | `OBP` |
| `op.02.fr` | FR | FR | `OBP` |
| `op.02.it` | it | it | `OBP` |
| `op.02.us` | US | US | `OBP` |
| `op.02.tr` | Tr | TR | `OBP` |
| `op.02.be` | be | be | `OBP` |
| `op.02.de` | de | de | `OBP` |
| `op.02.fi` | fi | fi | `OBP` |
| `gh.29.fr` | FR | FR | `OBP` |
| `gh.29.it` | it | it | `OBP` |
| `gh.29.us` | US | US | `OBP` |
| `gh.29.tr` | Tr | TR | `OBP` |
| `gh.29.be` | be | be | `OBP` |
| `gh.29.de` | de | de | `OBP` |
| `gh.29.fi` | fi | fi | `OBP` |
| `importbank0` | Import Bank 0 | The Import Bank of 0 | `OBP` |
| `importbank1` | Import Bank 1 | The Import Bank of 1 | `OBP` |
| `Bank 85SP7Q` | Bank New | The Bank of New | `OBP` |
| `au.01.aus.aus` | aus | aus | `OBP` |
| `au.01.aum.aum` | aum | aum | `OBP` |
| `au.01.uk.uk` | uk | uk | `OBP` |
| `gh.42.uk.uk` | uk | uk | `OBP` |
| `gh.42.fr.lbp` | LA BANQUE POSTALE | LA BANQUE POSTALE | `OBP` |
| `fcb` | fcb | Ford Credit Bank | `BIC` |
| `chase` | cb | Chase Bank | `BIC` |
| `inv.01.uk.uk` | uk | uk | `OBP` |
| `inv.01.us.inv` | inv | INV | `OBP` |
| `somo.55.uk.uk` | uk | uk | `OBP` |
| `Bank of Pune` | Pune | Pune | `OBP` |
| `Bank-of-Pune` | BOP | Bank-of-Pune | `OBP` |
| `bb.01.de` | Bank of Berlin | Bank of Berlin | `OBP` |
| `gh.29.uk.x` | uk | uk | `OBP` |
| `rxw` | rxw | rxw | `BIC` |
| `IVRSolution` | ivr | IVR | `OBP` |
| `ibb` | IBB | Iron Bank of Braavos | `OBP` |
| `1001` | In | In | `OBP` |
| `1002` | sbi | state bank | `OBP` |
| `1003` | rbi | reserve bank | `OBP` |
| `1005` | ind | ind | `OBP` |
| `1006` | gh | gh | `OBP` |
| `tb.brl.1` | brl1 | Brazilian Bank 1 | `OBP` |
| `mac.20.in.x` | mac | machint bank | `OBP` |
| `machint.in.01` | Machint | Machint Bank | `OBP` |
| `shalcom1` | shalcom_bank | shalcom_bank | `OBP` |
| `esw.uk.x` | ZeeBank | Bank Eswatini | `OBP` |
| `obpexpleo` | obp | expleo | `OBP` |
| `obpexpleo1` | obp | expleo | `OBP` |
| `westpac` | westpac  | Westpac Banking Corporation | `OBP` |
| `anz.au` | anz  | Australia and New Zealand Banking Group | `OBP` |
| `riseup` | riseupB | riseup_bank | `OBP` |
| `xpay123` | xpay | X Pay | `OBP` |
| `our_test_bank` | test_bank | our_test_bank | `OBP` |
| `gh.29.uk` | short_name  | full_name | `OBP` |
| `hdfc00` | hdfc | HDFC Financial Bank Private Limited | `OBP` |
| `pnbin00` | pnbin | Punjab National Bank | `OBP` |
| `aksisd` | aksis | Punjab National Bank | `OBP` |
| `App.1.Bank` | A1B  | App1Bank | `OBP` |
| `App.2.Bank` | App | App | `OBP` |
| `App.3.Bank` | App | App | `OBP` |
| `DaveBank1` | DaveBank1 | DaveBank1 | `OBP` |
| `postbank` | Post Bank | Deutsche Post Bank | `OBP` |
| `simonsays` | Simon Says | Simon Says Bank | `OBP` |
| `nv.mx.01` | Mexican Nova Bank  | Nova Solution Fintech | `OBP` |
| `hdfcltd` | hdfc | HDFC Financial Bank Private Limited | `OBP` |
| `obp.testing.01` | obp.test  | Raman_Aheer | `OBP` |
| `carlobank` | carlo | carlobank | `OBP` |
| `wmbank.us` | wmbank  | BankofWM | `OBP` |
| `mbx.1.us` | MBX | The Bank of MBX | `OBP` |
| `QK.29.ER` | TMZVibe  | Brave_Like | `OBP` |
| `TL.01.USA` | ToLight  | Light_Like_Wise | `OBP` |
| `bhd.01.dr` | BHD | Banco BHD | `OBP` |
| `test.bank` | TestBank  | TestBank | `OBP` |
| `test.bank.1` | testbank1  | testbanking | `OBP` |
| `persistent.bank` | Persistent | Persistent Bank | `OBP` |
| `50426c02-4663-4610-96f7-aa8eec2ea809` | MLCNT | Millicent | `OBP` |
| `d8839721-ad8f-45dd-9f78-2080414b93f9` | OBP | OBP Bank | `OBP` |
| `5e796a24-3975-11ee-be56-0242ac120002` | ENRAEL | Enzo Israel Bank | `OBP` |
| `metaverse-bank` | MTVB | Metaverse Bank | `OBP` |
| `Test_Bank_01` | CGHZ | full name string | `OBP` |
| `Ctest` | CB | Test_Kp | `OBP` |
| `Ctest1` | CB | Test_Kp | `OBP` |
| `P_IT` | CBIT | PERIFERIA_TEST | `OBP` |
| `PERIF_IT` | CBIT | PERIFERIA_TEST | `OBP` |
| `PERIF_IT1` | CBIT | PERIFERIA_TEST | `OBP` |
| `testkp` | CGHZ | full name string | `OBP` |
| `BancoTest` | OPBT | Banco test | `OBP` |
| `Periferia_Test` | OPBT | Banco test | `OBP` |
| `BancoStar` | BCST | Banco Star | `OBP` |
| `BancoStarTest` | BCSTT | Banco Star | `OBP` |
| `minka` | minka | Minka Bank | `OBP` |
| `wl.1.uk` | DEMO | wl-bank | `OBP` |
| `BancoStarTest1` | BCSTT | Banco Star | `OBP` |
| `Algo` | ALGO | Algoritmica bank | `OBP` |
| `gr.bank` | GRB | GRBank | `OBP` |
| `DanielBank` | danielbank | Daniel Bank | `OBP` |
| `daniels_bank` | Daniels Bank | full name string | `OBP` |
| `OPEY` | OPEY | Bank of Opey | `BIC` |
| `kenneth.test` | KLT | full name string | `OBP` |
| `hat.test` | HATT | HAT_test | `OBP` |
| `grt-1474` | GRTWB | Gringotts Wizarding Bank | `OBP` |
| `bank_a` | BANKA | Bank A | `OBP` |
| `issuria` | Issuria Bank | Issuria Simulated Investment Bank | `OBP` |
| `ac.bank.uk` | ACBK | Afternoon Coffee Bank | `OBP` |
| `mifos-x-openbank` | MXOB | Mifos-X-Open-Bank | `OBP` |
| `neon.bank.eu` | NEON | Neon Bank EU | `BIC` |
| `test.app2.bank` | TST2 | Test App2 Bank (updated) | `BIC` |
| `e5a1e49d-7a7a-41f4-b619-f636b46eb617` | tvg.db.germany | The Void Group AG | `OBP` |
| `9fe92a33-1e7e-499b-a986-3b0d666b292b` | tvg.db.germany | The Void Group AG | `OBP` |
| `bcbf5e65-b4f0-4379-b107-dfd00709b336` | tvg.db.germany | The Void Group AG | `OBP` |
| `4f099740-6398-47d4-8e5f-4ea32e7d19f4` | tvg.db.germany | The Void Group AG | `OBP` |
| `050b0656-e4a8-4e87-8e8a-c0a76e662ccc` | tvg.db.germany | The Void Group AG | `OBP` |
| `393c0f1a-fe31-47f0-bc0c-f62b79ae0e33` | tvg.db.germany | The Void Group AG | `OBP` |
| `6ad9c6dd-c299-41d9-b04e-e15c80ea53bc` | tvg.db.germany | The Void Group AG | `OBP` |
| `82bfdb31-d542-4596-b3d3-7f0bccd60fc1` | tvg.db.germany | The Void Group AG | `OBP` |
| `tvg.db.germany` | TVGG | The Void Group | `OBP` |
| `f3445544-824d-44c3-990e-ef9d08c8d301` | tvg.db.germany | The Void Group AG | `OBP` |
| `eb68f011-fa29-4b10-8f5c-fdcb882b15fc` | tvg.db.germany | The Void Group AG | `OBP` |
| `e4b1ea54-12d0-4c7d-a24d-2a4a06c482df` | tvg.db.germany | The Void Group AG | `OBP` |
| `fbf50fbe-dbc8-4f5a-8dda-454bb4375ce4` | tvg.db.germany | The Void Group AG | `OBP` |
| `67588acf-d854-466a-90ca-f547c8773eaf` | tvg.db.germany | The Void Group AG | `OBP` |
| `be158f1b-1147-4b9b-bcce-44cbecf234d1` | tvg.db.germany | The Void Group AG | `OBP` |
| `47de8a6e-7054-4c41-9f53-ea1ea57a0285` | tvg.db.germany | The Void Group AG | `OBP` |
| `26aa134b-105b-4703-a3f2-055f7f5efcea` | tvg.db.germany | The Void Group AG | `OBP` |
| `80e6ea27-fff2-4bc0-914a-c7a9eb6bafb1` | tvg.db.germany | The Void Group AG | `OBP` |
| `33c62318-303e-48a6-b256-2b02696e46da` | tvg.db.germany | The Void Group AG | `OBP` |
| `909c60b4-77a9-4116-8abc-5d58b47b733e` | tvg.db.germany.v7 | The Void Group AG | `OBP` |
| `98f1c6c1-4044-4b7d-9aed-f7d7af8467e9` | tvg.db.germany.v8 | The Void Group AG | `OBP` |
| `35a861a5-6afe-4eda-8b7a-2f5032095bcc` | tvg.db.germany | The Void Group AG | `OBP` |
| `d2585035-cf17-4637-be76-07ba2aa3ce9e` | tvg.db.germany | The Void Group AG | `OBP` |
| `da517293-b069-44ae-b6fb-2fb485ecf7de` | tvg.db.germany | The Void Group AG | `OBP` |
| `4fce62a1-510d-4d9e-bb49-a8c25185d8cf` | tvg.db.germany | The Void Group AG | `OBP` |
| `b02a13e9-2015-4f1c-b19c-5996fb496bb6` | tvg.db.germany | The Void Group AG | `OBP` |
| `4dafc4c4-6e07-4b1c-9045-41e3a06bf8d2` | tvg.db.germany | The Void Group AG | `OBP` |

---

*This architecture is continuously evolving. As the Open Bank Project expands its sandbox, this dashboard will automatically ingest, map, and expose the new financial routing nodes in real-time.*


## Complete List of Simulated Banks

The following 226 institutions are fully supported in this interactive sandbox environment:

- **The Royal Bank of Scotland** (rbs) - Routing: `OBP:rbs`
- **Test Bank** (test-bank) - Routing: `OBP:test-bank`
- **Testowy bank** (testowy_bank_id) - Routing: `OBP:testowy_bank_id`
- **Nordea Bank AB** (nordea) - Routing: `OBP:nordea`
- **Nordea Bank AB** (nordeaab) - Routing: `OBP:nordeaab`
- **Hongkong and Shanghai Bank** (hsbc-test) - Routing: `OBP:hsbc-test`
- **Erste Bank Test** (erste-test) - Routing: `OBP:erste-test`
- **Deutche Bank Test** (deutche-test) - Routing: `OBP:deutche-test`
- **The Bank of X** (obp-bankx-m) - Routing: `OBP:obp-bankx-m`
- **The Bank of Y** (obp-banky-m) - Routing: `OBP:obp-banky-m`
- **The Bank of X** (obp-bankx-n) - Routing: `OBP:obp-bankx-n`
- **The Bank of Y** (obp-banky-n) - Routing: `OBP:obp-banky-n`
- **The Bank of X** (obp-bankx-q) - Routing: `OBP:obp-bankx-q`
- **The Bank of Y** (obp-banky-q) - Routing: `OBP:obp-banky-q`
- **The Bank of X** (obp-bank-x-r) - Routing: `OBP:obp-bank-x-r`
- **The Bank of Y** (obp-bank-y-r) - Routing: `OBP:obp-bank-y-r`
- **The Bank of X** (obp-bank-x-g) - Routing: `OBP:obp-bank-x-g`
- **The Bank of Y** (obp-bank-y-g) - Routing: `OBP:obp-bank-y-g`
- **The India Bank of X** (in-bank-x-1) - Routing: `OBP:in-bank-x-1`
- **The India Bank of Y** (in-bank-y-1) - Routing: `OBP:in-bank-y-1`
- **The India Bank of X** (in-bank-x-2) - Routing: `OBP:in-bank-x-2`
- **The India Bank of Y** (in-bank-y-2) - Routing: `OBP:in-bank-y-2`
- **The Bank of X** (at02-bank-x--01) - Routing: `OBP:at02-bank-x--01`
- **The Bank of Y** (at02-bank-y--01) - Routing: `OBP:at02-bank-y--01`
- **ABANCA CORPORACION BANCARIA, S.A.** (at02-2080--01) - Routing: `OBP:at02-2080--01`
- **BANCA MARCH, S.A.** (at02-0061--01) - Routing: `OBP:at02-0061--01`
- **BANCO SANTANDER, S.A.** (at02-0049--01) - Routing: `OBP:at02-0049--01`
- **BANCO PASTOR, S.A.** (at02-0238--01) - Routing: `OBP:at02-0238--01`
- **BANCO POPULAR ESPAÑOL, S.A.** (at02-0075--01) - Routing: `OBP:at02-0075--01`
- **BANKIA, S.A** (at02-2038--01) - Routing: `OBP:at02-2038--01`
- **BANKINTER, S.A.** (at02-0128--01) - Routing: `OBP:at02-0128--01`
- **BANCO BILBAO VIZCAYA ARGENTARIA, S.A.** (at02-0182--01) - Routing: `OBP:at02-0182--01`
- **BANCO MARE NOSTRUM, S.A.** (at02-0487--01) - Routing: `OBP:at02-0487--01`
- **CAIXABANK, S.A.** (at02-2100--01) - Routing: `OBP:at02-2100--01`
- **BANCO CETELEM, S.A.** (at02-0225--01) - Routing: `OBP:at02-0225--01`
- **DEUTSCHE BANK, SOCIEDAD ANONIMA ESPAÑOLA** (at02-0019--01) - Routing: `OBP:at02-0019--01`
- **IBERCAJA BANCO, S.A.** (at02-2085--01) - Routing: `OBP:at02-2085--01`
- **ING BANK, N.V. SUCURSAL EN ESPAÑA** (at02-1465--01) - Routing: `OBP:at02-1465--01`
- **KUTXABANK, S.A** (at02-2095--01) - Routing: `OBP:at02-2095--01`
- **LIBERBANK, S.A.** (at02-2048--01) - Routing: `OBP:at02-2048--01`
- **OPEN BANK, S.A.** (at02-0073--01) - Routing: `OBP:at02-0073--01`
- **BANCO DE SABADELL, S.A.** (at02-0081--01) - Routing: `OBP:at02-0081--01`
- **UNICAJA BANCO, S.A.** (at02-2103--01) - Routing: `OBP:at02-2103--01`
- **The Bank of X** (at03-bank-x) - Routing: `OBP:at03-bank-x`
- **The Bank of Y** (at03-bank-y) - Routing: `OBP:at03-bank-y`
- **ABANCA CORPORACION BANCARIA, S.A.** (at03-2080) - Routing: `OBP:at03-2080`
- **BANCA MARCH, S.A.** (at03-0061) - Routing: `OBP:at03-0061`
- **BANCO SANTANDER, S.A.** (at03-0049) - Routing: `OBP:at03-0049`
- **BANCO PASTOR, S.A.** (at03-0238) - Routing: `OBP:at03-0238`
- **BANCO POPULAR ESPAÑOL, S.A.** (at03-0075) - Routing: `OBP:at03-0075`
- **BANKIA, S.A** (at03-2038) - Routing: `OBP:at03-2038`
- **BANKINTER, S.A.** (at03-0128) - Routing: `OBP:at03-0128`
- **BANCO BILBAO VIZCAYA ARGENTARIA, S.A.** (at03-0182) - Routing: `OBP:at03-0182`
- **BANCO MARE NOSTRUM, S.A.** (at03-0487) - Routing: `OBP:at03-0487`
- **CAIXABANK, S.A.** (at03-2100) - Routing: `OBP:at03-2100`
- **BANCO CETELEM, S.A.** (at03-0225) - Routing: `OBP:at03-0225`
- **DEUTSCHE BANK, SOCIEDAD ANONIMA ESPAÑOLA** (at03-0019) - Routing: `OBP:at03-0019`
- **IBERCAJA BANCO, S.A.** (at03-2085) - Routing: `OBP:at03-2085`
- **ING BANK, N.V. SUCURSAL EN ESPAÑA** (at03-1465) - Routing: `OBP:at03-1465`
- **KUTXABANK, S.A** (at03-2095) - Routing: `OBP:at03-2095`
- **LIBERBANK, S.A.** (at03-2048) - Routing: `OBP:at03-2048`
- **OPEN BANK, S.A.** (at03-0073) - Routing: `OBP:at03-0073`
- **BANCO DE SABADELL, S.A.** (at03-0081) - Routing: `OBP:at03-0081`
- **UNICAJA BANCO, S.A.** (at03-2103) - Routing: `OBP:at03-2103`
- **The Bank of X** (at.03.bank-x.uk) - Routing: `OBP:at.03.bank-x.uk`
- **The Bank of Y** (at.03.bank-y.uk) - Routing: `OBP:at.03.bank-y.uk`
- **ABANCA CORPORACION BANCARIA, S.A.** (at.03.2080.uk) - Routing: `OBP:at.03.2080.uk`
- **BANCA MARCH, S.A.** (at.03.0061.es) - Routing: `OBP:at.03.0061.es`
- **BANCO SANTANDER, S.A.** (at.03.0049.es) - Routing: `OBP:at.03.0049.es`
- **BANCO PASTOR, S.A.** (at.03.0238.es) - Routing: `OBP:at.03.0238.es`
- **BANCO POPULAR ESPAÑOL, S.A.** (at.03.0075.es) - Routing: `OBP:at.03.0075.es`
- **BANKIA, S.A** (at.03.2038.es) - Routing: `OBP:at.03.2038.es`
- **BANKINTER, S.A.** (at.03.0128.es) - Routing: `OBP:at.03.0128.es`
- **BANCO BILBAO VIZCAYA ARGENTARIA, S.A.** (at.03.0182.es) - Routing: `OBP:at.03.0182.es`
- **BANCO MARE NOSTRUM, S.A.** (at.03.0487.es) - Routing: `OBP:at.03.0487.es`
- **CAIXABANK, S.A.** (at.03.2100.es) - Routing: `OBP:at.03.2100.es`
- **BANCO CETELEM, S.A.** (at.03.0225.es) - Routing: `OBP:at.03.0225.es`
- **DEUTSCHE BANK, SOCIEDAD ANONIMA ESPAÑOLA** (at.03.0019.es) - Routing: `OBP:at.03.0019.es`
- **IBERCAJA BANCO, S.A.** (at.03.2085.es) - Routing: `OBP:at.03.2085.es`
- **ING BANK, N.V. SUCURSAL EN ESPAÑA** (at.03.1465.es) - Routing: `OBP:at.03.1465.es`
- **KUTXABANK, S.A** (at.03.2095.es) - Routing: `OBP:at.03.2095.es`
- **LIBERBANK, S.A.** (at.03.2048.es) - Routing: `OBP:at.03.2048.es`
- **OPEN BANK, S.A.** (at.03.0073.es) - Routing: `OBP:at.03.0073.es`
- **BANCO DE SABADELL, S.A.** (at.03.0081.es) - Routing: `OBP:at.03.0081.es`
- **UNICAJA BANCO, S.A.** (at.03.2103.es) - Routing: `OBP:at.03.2103.es`
- **uk** (op.01.uk) - Routing: `OBP:op.01.uk`
- **FR** (op.01.fr) - Routing: `OBP:op.01.fr`
- **it** (op.01.it) - Routing: `OBP:op.01.it`
- **US** (op.01.us) - Routing: `OBP:op.01.us`
- **TR** (op.01.tr) - Routing: `OBP:op.01.tr`
- **be** (op.01.be) - Routing: `OBP:op.01.be`
- **de** (op.01.de) - Routing: `OBP:op.01.de`
- **fi** (op.01.fi) - Routing: `OBP:op.01.fi`
- **uk** (op.02.uk) - Routing: `OBP:op.02.uk`
- **FR** (op.02.fr) - Routing: `OBP:op.02.fr`
- **it** (op.02.it) - Routing: `OBP:op.02.it`
- **US** (op.02.us) - Routing: `OBP:op.02.us`
- **TR** (op.02.tr) - Routing: `OBP:op.02.tr`
- **be** (op.02.be) - Routing: `OBP:op.02.be`
- **de** (op.02.de) - Routing: `OBP:op.02.de`
- **fi** (op.02.fi) - Routing: `OBP:op.02.fi`
- **FR** (gh.29.fr) - Routing: `OBP:gh.29.fr`
- **it** (gh.29.it) - Routing: `OBP:gh.29.it`
- **US** (gh.29.us) - Routing: `OBP:gh.29.us`
- **TR** (gh.29.tr) - Routing: `OBP:gh.29.tr`
- **be** (gh.29.be) - Routing: `OBP:gh.29.be`
- **de** (gh.29.de) - Routing: `OBP:gh.29.de`
- **fi** (gh.29.fi) - Routing: `OBP:gh.29.fi`
- **The Import Bank of 0** (importbank0) - Routing: `OBP:importbank0`
- **The Import Bank of 1** (importbank1) - Routing: `OBP:importbank1`
- **The Bank of New** (Bank 85SP7Q) - Routing: `OBP:Bank 85SP7Q`
- **aus** (au.01.aus.aus) - Routing: `OBP:au.01.aus.aus`
- **aum** (au.01.aum.aum) - Routing: `OBP:au.01.aum.aum`
- **uk** (au.01.uk.uk) - Routing: `OBP:au.01.uk.uk`
- **uk** (gh.42.uk.uk) - Routing: `OBP:gh.42.uk.uk`
- **LA BANQUE POSTALE** (gh.42.fr.lbp) - Routing: `OBP:gh.42.fr.lbp`
- **Ford Credit Bank** (fcb) - Routing: `BIC:fcb112233`
- **Chase Bank** (chase) - Routing: `BIC:cb112233`
- **uk** (inv.01.uk.uk) - Routing: `OBP:inv.01.uk.uk`
- **INV** (inv.01.us.inv) - Routing: `OBP:inv.01.us.inv`
- **uk** (somo.55.uk.uk) - Routing: `OBP:somo.55.uk.uk`
- **Pune** (Bank of Pune) - Routing: `OBP:Bank of Pune`
- **Bank-of-Pune** (Bank-of-Pune) - Routing: `OBP:Bank-of-Pune`
- **Bank of Berlin** (bb.01.de) - Routing: `OBP:bb.01.de`
- **uk** (gh.29.uk.x) - Routing: `OBP:gh.29.uk.x`
- **rxw** (rxw) - Routing: `BIC:IIIGGB22`
- **IVR** (IVRSolution) - Routing: `OBP:IVRSolution`
- **Iron Bank of Braavos** (ibb) - Routing: `OBP:ibb`
- **In** (1001) - Routing: `OBP:1001`
- **state bank** (1002) - Routing: `OBP:1002`
- **reserve bank** (1003) - Routing: `OBP:1003`
- **ind** (1005) - Routing: `OBP:1005`
- **gh** (1006) - Routing: `OBP:1006`
- **Brazilian Bank 1** (tb.brl.1) - Routing: `OBP:tb.brl.1`
- **machint bank** (mac.20.in.x) - Routing: `OBP:mac.20.in.x`
- **Machint Bank** (machint.in.01) - Routing: `OBP:machint.in.01`
- **shalcom_bank** (shalcom1) - Routing: `OBP:shalcom1`
- **Bank Eswatini** (esw.uk.x) - Routing: `OBP:esw.uk.x`
- **expleo** (obpexpleo) - Routing: `OBP:obpexpleo`
- **expleo** (obpexpleo1) - Routing: `OBP:obpexpleo1`
- **Westpac Banking Corporation** (westpac) - Routing: `OBP:westpac`
- **Australia and New Zealand Banking Group** (anz.au) - Routing: `OBP:anz.au`
- **riseup_bank** (riseup) - Routing: `OBP:riseup`
- **X Pay** (xpay123) - Routing: `OBP:xpay123`
- **our_test_bank** (our_test_bank) - Routing: `OBP:our_test_bank`
- **full_name** (gh.29.uk) - Routing: `OBP:gh.29.uk`
- **HDFC Financial Bank Private Limited** (hdfc00) - Routing: `OBP:hdfc00`
- **Punjab National Bank** (pnbin00) - Routing: `OBP:pnbin00`
- **Punjab National Bank** (aksisd) - Routing: `OBP:aksisd`
- **App1Bank** (App.1.Bank) - Routing: `OBP:App.1.Bank`
- **App** (App.2.Bank) - Routing: `OBP:App.2.Bank`
- **App** (App.3.Bank) - Routing: `OBP:App.3.Bank`
- **DaveBank1** (DaveBank1) - Routing: `OBP:DaveBank1`
- **Deutsche Post Bank** (postbank) - Routing: `OBP:postbank`
- **Simon Says Bank** (simonsays) - Routing: `OBP:simonsays`
- **Nova Solution Fintech** (nv.mx.01) - Routing: `OBP:nv.mx.01`
- **HDFC Financial Bank Private Limited** (hdfcltd) - Routing: `OBP:hdfcltd`
- **Raman_Aheer** (obp.testing.01) - Routing: `OBP:obp.testing.01`
- **carlobank** (carlobank) - Routing: `OBP:bisb_test`
- **BankofWM** (wmbank.us) - Routing: `OBP:wmbank.us`
- **The Bank of MBX** (mbx.1.us) - Routing: `OBP:mbx.1.us`
- **Brave_Like** (QK.29.ER) - Routing: `OBP:QK.29.ER`
- **Light_Like_Wise** (TL.01.USA) - Routing: `OBP:TL.01.USA`
- **Banco BHD** (bhd.01.dr) - Routing: `OBP:bhd.01.dr`
- **TestBank** (test.bank) - Routing: `OBP:test.bank`
- **testbanking** (test.bank.1) - Routing: `OBP:test.bank.1`
- **Persistent Bank** (persistent.bank) - Routing: `OBP:persistent.bank`
- **Millicent** (50426c02-4663-4610-96f7-aa8eec2ea809) - Routing: `OBP:50426c02-4663-4610-96f7-aa8eec2ea809`
- **OBP Bank** (d8839721-ad8f-45dd-9f78-2080414b93f9) - Routing: `OBP:d8839721-ad8f-45dd-9f78-2080414b93f9`
- **Enzo Israel Bank** (5e796a24-3975-11ee-be56-0242ac120002) - Routing: `OBP:5e796a24-3975-11ee-be56-0242ac120002`
- **Metaverse Bank** (metaverse-bank) - Routing: `OBP:metaverse-bank`
- **full name string** (Test_Bank_01) - Routing: `OBP:Test_Bank_01`
- **Test_Kp** (Ctest) - Routing: `OBP:Ctest`
- **Test_Kp** (Ctest1) - Routing: `OBP:Ctest`
- **PERIFERIA_TEST** (P_IT) - Routing: `OBP:Ctest`
- **PERIFERIA_TEST** (PERIF_IT) - Routing: `OBP:Ctest`
- **PERIFERIA_TEST** (PERIF_IT1) - Routing: `OBP:Ctest`
- **full name string** (testkp) - Routing: `OBP:testkp`
- **Banco test** (BancoTest) - Routing: `OBP:BancoTest`
- **Banco test** (Periferia_Test) - Routing: `OBP:Periferia_Test`
- **Banco Star** (BancoStar) - Routing: `OBP:BancoStar`
- **Banco Star** (BancoStarTest) - Routing: `OBP:BancoStarTest`
- **Minka Bank** (minka) - Routing: `OBP:minka`
- **wl-bank** (wl.1.uk) - Routing: `OBP:wl.1.uk`
- **Banco Star** (BancoStarTest1) - Routing: `OBP:BancoStarTest1`
- **Algoritmica bank** (Algo) - Routing: `OBP:Algo`
- **GRBank** (gr.bank) - Routing: `OBP:gr.bank`
- **Daniel Bank** (DanielBank) - Routing: `OBP:DanielBank`
- **full name string** (daniels_bank) - Routing: `OBP:daniels_bank`
- **Bank of Opey** (OPEY) - Routing: `BIC:OPEYGB24`
- **full name string** (kenneth.test) - Routing: `OBP:kenneth.test`
- **HAT_test** (hat.test) - Routing: `OBP:hat.test`
- **Gringotts Wizarding Bank** (grt-1474) - Routing: `OBP:grt-1474`
- **Bank A** (bank_a) - Routing: `OBP:bank_a`
- **Issuria Simulated Investment Bank** (issuria) - Routing: `OBP:issuria`
- **Afternoon Coffee Bank** (ac.bank.uk) - Routing: `OBP:ac.bank.uk`
- **Mifos-X-Open-Bank** (mifos-x-openbank) - Routing: `OBP:mifos-x-openbank`
- **Neon Bank EU** (neon.bank.eu) - Routing: `BIC:NEONDEBB`
- **Test App2 Bank (updated)** (test.app2.bank) - Routing: `BIC:TESTGB2L`
- **The Void Group AG** (e5a1e49d-7a7a-41f4-b619-f636b46eb617) - Routing: `OBP:e5a1e49d-7a7a-41f4-b619-f636b46eb617`
- **The Void Group AG** (9fe92a33-1e7e-499b-a986-3b0d666b292b) - Routing: `OBP:9fe92a33-1e7e-499b-a986-3b0d666b292b`
- **The Void Group AG** (bcbf5e65-b4f0-4379-b107-dfd00709b336) - Routing: `OBP:bcbf5e65-b4f0-4379-b107-dfd00709b336`
- **The Void Group AG** (4f099740-6398-47d4-8e5f-4ea32e7d19f4) - Routing: `OBP:4f099740-6398-47d4-8e5f-4ea32e7d19f4`
- **The Void Group AG** (050b0656-e4a8-4e87-8e8a-c0a76e662ccc) - Routing: `OBP:050b0656-e4a8-4e87-8e8a-c0a76e662ccc`
- **The Void Group AG** (393c0f1a-fe31-47f0-bc0c-f62b79ae0e33) - Routing: `OBP:393c0f1a-fe31-47f0-bc0c-f62b79ae0e33`
- **The Void Group AG** (6ad9c6dd-c299-41d9-b04e-e15c80ea53bc) - Routing: `OBP:6ad9c6dd-c299-41d9-b04e-e15c80ea53bc`
- **The Void Group AG** (82bfdb31-d542-4596-b3d3-7f0bccd60fc1) - Routing: `OBP:82bfdb31-d542-4596-b3d3-7f0bccd60fc1`
- **The Void Group** (tvg.db.germany) - Routing: `OBP:tvg.db.germany`
- **The Void Group AG** (f3445544-824d-44c3-990e-ef9d08c8d301) - Routing: `OBP:f3445544-824d-44c3-990e-ef9d08c8d301`
- **The Void Group AG** (eb68f011-fa29-4b10-8f5c-fdcb882b15fc) - Routing: `OBP:eb68f011-fa29-4b10-8f5c-fdcb882b15fc`
- **The Void Group AG** (e4b1ea54-12d0-4c7d-a24d-2a4a06c482df) - Routing: `OBP:e4b1ea54-12d0-4c7d-a24d-2a4a06c482df`
- **The Void Group AG** (fbf50fbe-dbc8-4f5a-8dda-454bb4375ce4) - Routing: `OBP:fbf50fbe-dbc8-4f5a-8dda-454bb4375ce4`
- **The Void Group AG** (67588acf-d854-466a-90ca-f547c8773eaf) - Routing: `OBP:67588acf-d854-466a-90ca-f547c8773eaf`
- **The Void Group AG** (be158f1b-1147-4b9b-bcce-44cbecf234d1) - Routing: `OBP:be158f1b-1147-4b9b-bcce-44cbecf234d1`
- **The Void Group AG** (47de8a6e-7054-4c41-9f53-ea1ea57a0285) - Routing: `OBP:47de8a6e-7054-4c41-9f53-ea1ea57a0285`
- **The Void Group AG** (26aa134b-105b-4703-a3f2-055f7f5efcea) - Routing: `OBP:26aa134b-105b-4703-a3f2-055f7f5efcea`
- **The Void Group AG** (80e6ea27-fff2-4bc0-914a-c7a9eb6bafb1) - Routing: `OBP:80e6ea27-fff2-4bc0-914a-c7a9eb6bafb1`
- **The Void Group AG** (33c62318-303e-48a6-b256-2b02696e46da) - Routing: `OBP:33c62318-303e-48a6-b256-2b02696e46da`
- **The Void Group AG** (909c60b4-77a9-4116-8abc-5d58b47b733e) - Routing: `OBP:909c60b4-77a9-4116-8abc-5d58b47b733e`
- **The Void Group AG** (98f1c6c1-4044-4b7d-9aed-f7d7af8467e9) - Routing: `OBP:98f1c6c1-4044-4b7d-9aed-f7d7af8467e9`
- **The Void Group AG** (35a861a5-6afe-4eda-8b7a-2f5032095bcc) - Routing: `OBP:35a861a5-6afe-4eda-8b7a-2f5032095bcc`
- **The Void Group AG** (d2585035-cf17-4637-be76-07ba2aa3ce9e) - Routing: `OBP:d2585035-cf17-4637-be76-07ba2aa3ce9e`
- **The Void Group AG** (da517293-b069-44ae-b6fb-2fb485ecf7de) - Routing: `OBP:da517293-b069-44ae-b6fb-2fb485ecf7de`
- **The Void Group AG** (4fce62a1-510d-4d9e-bb49-a8c25185d8cf) - Routing: `OBP:4fce62a1-510d-4d9e-bb49-a8c25185d8cf`
- **The Void Group AG** (b02a13e9-2015-4f1c-b19c-5996fb496bb6) - Routing: `OBP:b02a13e9-2015-4f1c-b19c-5996fb496bb6`
- **The Void Group AG** (4dafc4c4-6e07-4b1c-9045-41e3a06bf8d2) - Routing: `OBP:4dafc4c4-6e07-4b1c-9045-41e3a06bf8d2`
