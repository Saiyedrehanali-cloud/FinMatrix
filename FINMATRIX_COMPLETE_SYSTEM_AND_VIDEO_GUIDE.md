# FinMatrix — Complete System Architecture, Page Guide & AI Video Production Blueprint
> **Smart India Hackathon 2026** · Problem Statement ID: **SIH26265**  
> **Organization:** All India Council for Technical Education (AICTE), Ministry of Education, Govt. of India  
> **System Name:** FinMatrix — Security Deposit & Fixed Deposit Receipt (FDR) Regulatory Clearinghouse  
> **Tagline:** *Every Deposit. Tracked. Verified. Secured.*

---

## 🎬 How to Use This Document with Video Generation AI
This document is engineered to be fed directly into AI Video & Voiceover engines (such as **HeyGen**, **InVideo AI**, **Synthesia**, **Descript**, **Runway**, or **OpenAI ChatGPT/Claude Prompt-to-Video workflows**).
- **Sections 1–3**: System foundation, core value proposition, and role definitions for AI context setting.
- **Section 4**: Step-by-step breakdown of **every single page**, its visual UI components, user actions, and backend functions.
- **Section 5**: Complete API and cryptographic functions dictionary.
- **Section 6**: Production-ready **2-Minute High-Impact Pitch Script** and **5-Minute Technical Deep-Dive Script** with exact timestamps, voiceover transcripts, and visual screen-recording cues.

---

## 1. 🏛️ Project Overview & The Real-World Problem

### 1.1 The Challenge at AICTE
Technical institutions nationwide (engineering colleges, management institutes, polytechnics, pharmacy colleges) must pledge Fixed Deposit Receipts (FDRs) as mandatory security deposits to AICTE as a prerequisite for academic approvals.
Historically, this has suffered from:
1. **Spreadsheet Fragmentation:** Manual tracking across regional offices led to expired instruments sitting unrenewed for months without automated alerts.
2. **Verification Black Holes:** Institutions could submit fraudulent or forged FDR copies with no real-time cross-referencing against Core Banking Systems (CBS).
3. **Premature Encashment Risk:** Banks occasionally allowed institutes to prematurely encash pledged FDRs without AICTE's mandatory Discharge Certificate / No Objection Certificate.
4. **Audit Vulnerability:** Paper and email records lacked verifiable cryptographic non-repudiation.

### 1.2 The FinMatrix Solution
**FinMatrix** transforms AICTE into an automated, dual-source regulatory clearinghouse:
- **Dual-Source Presentation:** Every FDR juxtaposes institutional claims against live mock Core Banking System (Finacle / BaNCS CBS) records with color-coded verification badges.
- **5-Stage Countdown Matrix:** Automated surveillance scans deposits at 90, 60, 30, 15, and 7-day maturity horizons with automatic escalation to Senior Administration.
- **Cryptographic HMAC-SHA256 Audit Chain:** An immutable, chained ledger guarantees that every status change, inspection, and verification cannot be doctored.
- **AES-256-GCM Encrypted Document Enclave:** Deposit certificates are stored in an encrypted private vault and streamed strictly through authenticated RBAC pipelines.
- **End-to-End Governance Steppers:** Digital renewal chaining and 4-stage release pipelines with automated official discharge vouchers.

---

## 2. 👥 User Personas & Access Roles

| Role Key | Persona Title | Seeded Email & Default Password | Scope of Authority |
|---|---|---|---|
| `ADMIN` | **AICTE Central Administrator** | `admin@finmatrix.gov.in`<br>`Admin@1234` | Full regulation bureau access: Surveillance dashboard, verification queue, bank cross-checks, discrepancy flagging, release processing, college registry, reports. |
| `SENIOR_ADMIN` | **Senior Bureau Advisor** | `senior@finmatrix.gov.in`<br>`Admin@1234` | High-level regulatory oversight: Critical overdue escalations, policy overrides, and cryptographic HMAC-SHA256 audit chain integrity verification. |
| `INSTITUTION` | **College Nodal Officer** | `nodal@dtu.ac.in`<br>`College@1234` | College self-service: View deposit health meter, register new institutions, submit fresh FDRs with encrypted PDF uploads, track renewal workflows, request releases. |

---

## 3. 🎨 Design System & Visual Hierarchy

- **Primary Brand Colors:**
  - `Deep Sea Teal` (`#006675`): Authority, government trust, institutional stability (Navigation, headers).
  - `Aqua Teal` (`#00959C`): Verified state, positive actions, high-tech modernization.
  - `Burnt Orange` (`#EB5A11`): Primary call-to-action buttons, warnings, discrepancies.
  - `Sunburst Yellow` (`#FF9D2D`): High-alert countdown badges, warning thresholds.
- **Typography:**
  - Headings: `DM Serif Display` — Refined, editorial, official regulatory prestige.
  - Body & Data: `Plus Jakarta Sans` — Modern, clean, high legibility for financial tables.
- **Verification Status Badges:**
  - `Submitted` (Slate Gray): Institution has uploaded; pending bank verification.
  - `Bank-confirmed` (Teal): Parameter-matched with Core Banking System (CBS).
  - `Mismatch` (Burnt Orange): Divergence detected between claim and CBS record.

---

## 4. 🖥️ Comprehensive Page-by-Page Breakdown

---

### Page 1: Unified Authentication & College Registration
- **Route:** `/login`
- **Access Level:** Public / Unauthenticated
- **Page Purpose:** Secure entry point serving both AICTE regulatory officials and institutional nodal officers, featuring 1-click test credentials and a self-registration portal for new universities.
- **Key Visual Elements:**
  - Left hero branding panel showcasing FinMatrix mission, security badges (AES-256, HMAC-SHA256, AICTE Ministry seal).
  - Mode toggle tab: **"Sign In to Account"** vs. **"Register New College"**.
  - Login form with email, password, and animated loading indicators.
  - **Quick Access Chips:** 1-Click login buttons for `AICTE Central Admin` and `DTU College Portal`.
  - Registration modal form: AICTE ID, College Name, Discipline/Category, City, State, Nodal Officer Name, Email, Phone, and Required Security Deposit.
- **User Actions:**
  1. Click quick login chips or type credentials to sign in.
  2. Toggle to "Register New College" to onboard a new institution in real-time.
- **Backend Operations & APIs:**
  - `POST /api/auth/login`: Authenticates password via `bcrypt`, generates stateless JWT cookie (`fdr_session`), and auto-routes admins to `/admin` and colleges to `/portal`. Includes cold-start resilient credentials fallback for uninterrupted hackathon demos.
  - `POST /api/auth/register`: Validates uniqueness of AICTE ID, hashes password, inserts into `Institution` and `User` tables, and creates a `COLLEGE_REGISTERED` audit block.

---

### Page 2: AICTE Admin Executive Command Dashboard
- **Route:** `/admin`
- **Access Level:** `ADMIN`, `SENIOR_ADMIN`
- **Page Purpose:** High-level command center displaying real-time financial exposure, compliance rates, upcoming maturity countdowns, and active risk alerts across all technical institutes in India.
- **Key Visual Elements:**
  - **Top KPI Cards:**
    - *Total Pledged Deposits* (Rupees formatted in Crores/Lakhs with currency symbol ₹).
    - *Verified Deposits Rate* (Percentage with progress indicator).
    - *Expiring Soon (≤30 Days)* (Critical warning counter).
    - *Active Discrepancies* (Flagged deposit anomalies).
  - **Interactive Analytics Charts (Recharts):**
    - *Regional Deposit Distribution* (Bar chart: Northern, Western, Southern, Eastern, Central).
    - *Monthly Maturity Horizon* (Area/Line chart showing upcoming cash-flow exposure).
  - **Priority Surveillance Table:** List of urgent FDRs approaching expiry with countdown badges (`Critical ≤7d`, `Urgent 15d`, `Warning 30d`).
  - **1-Click Actions:** "Run Surveillance Scan" triggering immediate alert evaluation.
- **Backend Operations & APIs:**
  - `GET /api/dashboard/summary`: Aggregates total sum, active count, verified ratio, and pending count.
  - `GET /api/dashboard/charts`: Computes time-series and regional breakdowns.
  - `GET /api/dashboard/priority-fdrs`: Queries deposits expiring within 30 days sorted ascending by maturity date.

---

### Page 3: Regulatory Verification Queue & Core Banking Cross-Check
- **Route:** `/admin/verification`
- **Access Level:** `ADMIN`, `SENIOR_ADMIN`
- **Page Purpose:** The regulatory clearinghouse core. Regulatory officers cross-examine newly submitted FDR certificates against simulated Core Banking Systems (CBS) before granting approved status.
- **Key Visual Elements:**
  - Status filter tabs: `Pending Verification`, `Discrepancy Flagged`, `Verified`.
  - Comprehensive data grid displaying: FDR Number, Institution Name, Bank Name, Deposit Amount, Maturity Date, and Current Verification Badge.
  - **Dual-Source Comparison Modal:** Opens side-by-side view showing Institutional Submission vs. CBS Bank Records.
  - Action buttons:
    - **"Query Core Banking System"** (Simulates automated CBS API ping).
    - **"Mark Verified"** (Approves FDR and updates validity).
    - **"Flag Discrepancy"** (Flags mismatch with required explanation comment).
- **Backend Operations & APIs:**
  - `GET /api/verification/queue`: Returns all unverified deposits sorted by submission date.
  - `POST /api/fdrs/:id/verify-bank`: Mock Bank Adapter queries simulated Finacle/BaNCS core, detects parameter deviations (amount, maturity, lien status), and stores `BankVerification` record.
  - `POST /api/fdrs/:id/verify`: Commits official verification approval and records cryptographically hashed audit entry.
  - `POST /api/fdrs/:id/discrepancy`: Flags anomaly, changes status to `FLAGGED`, and dispatches notification.

---

### Page 4: All FDRs National Repository & Advanced Search
- **Route:** `/admin/fdrs`
- **Access Level:** `ADMIN`, `SENIOR_ADMIN`
- **Page Purpose:** Universal searchable database of every security deposit ever pledged to AICTE.
- **Key Visual Elements:**
  - Multi-faceted filter bar: Search by FDR Number, Bank Name, or AICTE ID.
  - Dropdown filters: Filter by Bank (`SBI`, `HDFC`, `PNB`, `Canara`, `Bank of Baroda`), Verification Status (`VERIFIED`, `PENDING`, `FLAGGED`, `RENEWED`, `RELEASED`), and Maturity Horizon (`≤7 Days`, `≤30 Days`, `Overdue`).
  - Interactive table with sorting, pagination, and color-coded status badges.
  - Direct "Inspect" button linking to FDR Detail view.
- **Backend Operations & APIs:**
  - `GET /api/fdrs`: Server-side filtered query with search term matching, pagination, and relationship expansion (`institution`, `bankVerification`, `discrepancyFlag`).

---

### Page 5: FDR Detailed Inspection & Encrypted Document Enclave
- **Route:** `/admin/fdrs/[id]`
- **Access Level:** `ADMIN`, `SENIOR_ADMIN`
- **Page Purpose:** Microscopic forensic inspection of a specific fixed deposit instrument, its scanned certificate, CBS match state, and audit timeline.
- **Key Visual Elements:**
  - Header with breadcrumbs, instrument title, and master lifecycle status banner.
  - **Dual-Source Parameter Matrix:**
    - Left Column: College Stated Details (Amount, Bank, Branch, IFSC, Issue Date, Maturity Date, Lien to AICTE).
    - Right Column: Bank CBS Returned Data (CBS Account, Confirmed Principal, Lien Flagged in CBS, Interest Rate).
    - Discrepancy Alert Banner if deviations exist.
  - **Secure PDF Document Viewer:** Inline encrypted document preview served via `/api/documents/:id`.
  - **Remarks & Official Note Sheet:** Timestamped comments thread between AICTE scrutiny officers.
  - **Instrument Audit Mini-Timeline:** History of state transitions for this specific deposit.
- **Backend Operations & APIs:**
  - `GET /api/fdrs/:id`: Retrieves full instrument details, bank verification records, remarks, and audit chain fragments.
  - `GET /api/documents/:id`: Authenticated streaming route that decrypts the AES-256-GCM ciphertext on-the-fly and logs a `DOCUMENT_VIEWED` audit entry.
  - `POST /api/fdrs/:id/remarks`: Appends scrutiny note sheet comment.

---

### Page 6: Security Deposit Release & Refund Stepper
- **Route:** `/admin/releases`
- **Access Level:** `ADMIN`, `SENIOR_ADMIN`
- **Page Purpose:** Governs the formal release and lien cancellation of FDRs when an institution closes a course, completes statutory lock-in periods, or replaces deposits.
- **Key Visual Elements:**
  - **4-Stage Visual Progress Stepper:**
    1. `REQUESTED` — College lodged formal release application.
    2. `UNDER_SCRUTINY` — AICTE bureau validating compliance clearances.
    3. `APPROVED` — Executive approval granted; discharge voucher generated.
    4. `RELEASED` — Bank lien formally discharged and deposit released.
  - Table of pending release requests with applicant details, reason, and claimed amount.
  - **Approval Modal:** Scrutiny checklist (No pending student dues, course closure sanctioned, zero compliance deficiencies).
  - Official Discharge Voucher Preview with auto-generated serial: `AICTE/REL/2026/XXXX`.
- **Backend Operations & APIs:**
  - `GET /api/releases`: Fetches release requests with status filters.
  - `PATCH /api/releases/:id`: Progresses stepper stage, sets `dischargedAt`, triggers audit log, and marks the parent FDR as `RELEASED`.

---

### Page 7: 5-Stage Automated Surveillance & Alerts Engine
- **Route:** `/admin/alerts`
- **Access Level:** `ADMIN`, `SENIOR_ADMIN`
- **Page Purpose:** Regulatory early warning system monitoring maturity timelines to prevent unintended deposit expiry or lapses in legal custody.
- **Key Visual Elements:**
  - **5-Stage Countdown Matrix Grid:** Cards highlighting counts for:
    - `90 Days Notice`
    - `60 Days Notice`
    - `30 Days Notice`
    - `15 Days Notice (Urgent)`
    - `7 Days Notice (Critical Escalation)`
    - `Overdue (Lapsed)`
  - Alert stream table with severity badges (Green, Yellow, Orange, Red, Purple for Senior Escalation).
  - **"Run Instant Scan" Button:** Manually executes the background scan routine on demand.
  - Filter by Alert Type: `EXPIRING`, `OVERDUE`, `DISCREPANCY_UNRESOLVED`, `STALE_PENDING`.
- **Backend Operations & APIs:**
  - `GET /api/alerts`: Returns active alerts with severity and read/unread status.
  - `POST /api/alerts/scan`: Idempotent evaluation engine scanning all active FDRs against statutory thresholds. If an FDR is within 7 days or overdue, an escalated alert is automatically dispatched to `SENIOR_ADMIN`.
  - `PATCH /api/alerts/:id`: Acknowledges or dismisses individual alert.

---

### Page 8: Affiliated Institutions Directory & Compliance Ledger
- **Route:** `/admin/institutions`
- **Access Level:** `ADMIN`, `SENIOR_ADMIN`
- **Page Purpose:** Manages all AICTE-affiliated colleges, their nodal officers, regional bureau, and compares total pledged deposits against required security deposits.
- **Key Visual Elements:**
  - Search bar by College Name, AICTE ID, or State.
  - Regional filter (Northern, Western, Southern, Eastern, Central).
  - Summary KPI cards: Total Registered Institutions, Fully Compliant, In Deficit.
  - Institution Card / Data Table:
    - AICTE Permanent ID
    - Institution Name & Type
    - Nodal Officer & Contact
    - Required Deposit vs. Actually Pledged Active Deposits (Visual progress bar: Green for ≥100% compliant, Red for deficit).
- **Backend Operations & APIs:**
  - `GET /api/institutions`: Fetches registered institutions and computes aggregate active pledged sum per college.
  - `POST /api/institutions`: Admin-level institution registration endpoint.

---

### Page 9: Statutory Regulatory Reports & Data Export
- **Route:** `/admin/reports`
- **Access Level:** `ADMIN`, `SENIOR_ADMIN`
- **Page Purpose:** Generates institutional compliance digests, bank-wise FDR concentration reports, and auditable data exports for parliamentary and ministry queries.
- **Key Visual Elements:**
  - Report Generator card: Select Date Range, Report Type (Maturity Forecast, Bank Concentration, Non-Compliance Deficit, Discrepancy Log).
  - Live preview data tables and distribution charts.
  - **"Export to CSV"** and **"Print / Save PDF"** buttons for official executive distribution.
- **Backend Operations & APIs:**
  - `GET /api/reports`: Aggregates dynamic metrics based on requested parameters and formats data for client-side CSV generation.

---

### Page 10: Cryptographic HMAC-SHA256 Tamper-Evident Audit Trail
- **Route:** `/admin/audit`
- **Access Level:** `ADMIN`, `SENIOR_ADMIN`
- **Page Purpose:** Forensic ledger guaranteeing non-repudiation. Every modification, document inspection, bank query, and approval is cryptographically chained using HMAC-SHA256.
- **Key Visual Elements:**
  - **"Verify Chain Integrity" Action Button:** Triggers real-time cryptographic verification of the entire hash chain from the Genesis block to current head.
  - **Chain Status Indicator:** Green glowing badge ("Chain Valid — 100% Tamper Free") or Red badge with exact broken block index if tampering is detected.
  - **Simulate Tamper Test Button:** Demonstrates security resilience by temporarily corrupting a test record to prove the algorithm detects unauthorized database tampering immediately.
  - Audit log table: Timestamp (UTC/IST), Actor Name & Role, Action Code (`FDR_SUBMITTED`, `CBS_VERIFIED`, `DOCUMENT_VIEWED`, `RELEASE_APPROVED`), Target Entity, and Cryptographic Hash (`prevHash` -> `hash`).
- **Backend Operations & APIs:**
  - `GET /api/audit`: Returns paginated audit logs with hash values.
  - `GET /api/audit/verify`: Recomputes HMAC-SHA256 across all records from genesis to verify mathematical chain integrity.
  - `POST /api/audit/tamper`: Demonstration endpoint used in presentations to show tamper detection in action.

---

### Page 11: System Policies & Surveillance Matrix Configuration
- **Route:** `/admin/settings`
- **Access Level:** `ADMIN`, `SENIOR_ADMIN`
- **Page Purpose:** Allows administrators to configure regulatory surveillance countdown thresholds, escalation parameters, and mock CBS banking simulation parameters.
- **Key Visual Elements:**
  - Alert Threshold Configuration (Configurable notification days: default `90, 60, 30, 15, 7`).
  - Senior Admin Escalation Days (Default: escalate if unaddressed within 7 days).
  - Mock Bank Latency & Anomaly Injection settings (for mock demonstration scenarios).
- **Backend Operations & APIs:**
  - `GET /api/settings`: Retrieves active system parameters and alert rules.
  - `POST /api/settings`: Persists updated alert thresholds to the database.

---

### Page 12: College Nodal Officer Self-Service Portal
- **Route:** `/portal`
- **Access Level:** `INSTITUTION`, `ADMIN`
- **Page Purpose:** College-facing dashboard showing their institutional security deposit standing, active FDRs, pending renewals, and direct submission shortcuts.
- **Key Visual Elements:**
  - Institutional Header: College Name, AICTE Permanent ID, Nodal Officer Name.
  - **Deposit Health Meter:** Visual compliance bar comparing Total Pledged FDRs against AICTE Required Deposit (e.g., ₹35,00,000 / ₹35,00,000 — 100% Compliant).
  - Summary Cards: Active FDRs, Pending Scrutiny, Expiring in 60 Days, Action Needed.
  - Quick Action Buttons: **"Submit New FDR"** & **"Request Release"**.
  - Institutional FDR Table: Shows status, maturity countdown, and renewal status.
- **Backend Operations & APIs:**
  - `GET /api/portal/summary`: Returns college-specific compliance percentage, active FDR count, and pending alerts.

---

### Page 13: 3-Step Guided Deposit Submission Wizard
- **Route:** `/portal/fdrs/new`
- **Access Level:** `INSTITUTION`, `ADMIN`
- **Page Purpose:** Intuitive, error-guarded wizard for college nodal officers to submit new FDRs or chain renewals of maturing FDRs.
- **Key Visual Elements:**
  - **3-Step Stepper Progress Bar:**
    - Step 1: Instrument & Bank Information
    - Step 2: Financial Terms & Validity Dates
    - Step 3: Encrypted Document Upload & Review
  - **Form Validation & Guards:**
    - Blocks non-PDF documents.
    - Limits file size to 10 MB.
    - Prevents maturity date from being earlier than issue date.
    - Validates 11-character IFSC codes and standard bank names.
  - **Drag-and-Drop Document Zone:** Visual dropzone with file preview and encryption indicator ("File will be encrypted with AES-256-GCM before storage").
  - **Renewal Linking Dropdown:** Allows linking this submission to an existing maturing FDR to form an unbroken audit chain (`oldFDR -> newFDR`).
- **Backend Operations & APIs:**
  - `POST /api/fdrs`: Receives multipart form data, validates inputs, generates AES-256-GCM encryption key, saves encrypted file in `/storage/fdr-documents`, creates database records, and appends a `FDR_SUBMITTED` audit entry.

---

### Page 14: College FDR List & Instrument Detail
- **Route:** `/portal/fdrs` & `/portal/fdrs/[id]`
- **Access Level:** `INSTITUTION`, `ADMIN`
- **Page Purpose:** Enables colleges to inspect their deposit instruments, view bank confirmation statuses, read AICTE remarks, and initiate renewal or release requests.
- **Key Visual Elements:**
  - Status badges showing whether the instrument has been confirmed by the bank CBS or flagged.
  - Action buttons: "Apply for Renewal" (pre-populates renewal wizard) or "Request Release".
  - Secure document view link to preview uploaded certificate.
- **Backend Operations & APIs:**
  - `GET /api/fdrs/:id`: Retrieves instrument data strictly guarded to the authenticated institution's `institutionId`.
  - `POST /api/portal/releases`: Submits formal refund/release request with college justification.

---

### Page 15: Institutional Expiry Alerts Feed
- **Route:** `/portal/alerts`
- **Access Level:** `INSTITUTION`, `ADMIN`
- **Page Purpose:** College notification feed displaying upcoming maturity dates and instructions from AICTE for timely renewals.
- **Key Visual Elements:**
  - Chronological alert list with urgency badges.
  - One-click "Renew Instrument Now" action button linked directly to the pre-filled submission wizard.
- **Backend Operations & APIs:**
  - `GET /api/alerts`: Retrieves notifications filtered to the logged-in college.

---

## 5. ⚙️ Complete Core Functions & API Directory

### 5.1 Security & Cryptography Layer (`src/lib/crypto.ts`)
- `encryptBuffer(buffer: Buffer): { encrypted: Buffer; iv: string; authTag: string }`: Encrypts uploaded FDR PDF documents using **AES-256-GCM** with an initialization vector (IV) and authentication tag for tamper resistance at rest.
- `decryptBuffer(encrypted: Buffer, iv: string, authTag: string): Buffer`: Decrypts stored ciphertext into original PDF stream for authenticated streaming.
- `hashPassword(password: string): Promise<string>`: Generates secure bcrypt salt and hash.
- `verifyPassword(password: string, hash: string): Promise<boolean>`: Validates login credentials.

### 5.2 Tamper-Evident HMAC Hash Chaining (`src/lib/audit.ts`)
- `createAuditHash(prevHash, actorId, action, entity, entityId, payloadStr, timestampStr): string`: Computes HMAC-SHA256 signature chaining the current block to the previous block's hash.
- `logAudit(params)`: Transactionally appends an immutable record to the `AuditLog` table.
- `verifyChainIntegrity(): Promise<{ valid: boolean; totalRecords: number; brokenIndex?: number }>`: Sequentially recomputes every hash from the genesis block (`00000000...`) to current head to verify that zero rows have been modified, inserted, or deleted directly in the database.

### 5.3 Simulated Core Banking System (CBS) Adapter (`src/lib/services/bank.ts`)
- `queryMockCBS(fdrNumber, bankCode, statedAmount)`: Simulates real-time API call to Finacle or BaNCS core banking systems, returns account balance, live lien status, and matches or identifies anomalies.

### 5.4 Native Date Arithmetic Engine (`src/lib/date-utils.ts`)
- Zero-dependency UTC calendar calculator (`differenceInCalendarDays`, `addDays`, `isBefore`, `startOfMonth`, `endOfMonth`, `format`) ensuring 100% precision without timezone distortion or bundle optimization runtime bugs.

---

## 6. 🎙️ Production-Ready Video Generation Scripts

Use either of the two scripts below in your AI video generator (e.g. InVideo, HeyGen, Synthesia, or Descript).

---

### Script 1: The 2-Minute High-Impact Executive Pitch
*Target Duration: 2 Minutes · Tone: Authoritative, energetic, innovative.*

| Timestamp | Visual Cue / Screen Recording | Voiceover Narration |
|---|---|---|
| **0:00 – 0:18** | Split screen: Fragmented paper spreadsheets vs. FinMatrix clean unified UI. Zoom into AICTE Ministry header. | "Across India, thousands of technical institutions pledge Fixed Deposit Receipts worth hundreds of crores as mandatory security deposits for AICTE approvals. Yet for decades, these deposits were tracked through fragmented regional spreadsheets—leading to missed maturities, verification delays, and zero real-time visibility. Introducing **FinMatrix**—the automated, dual-source regulatory clearinghouse for AICTE." |
| **0:19 – 0:42** | Navigate to `/admin` dashboard. Hover over KPI cards (Total Pledged ₹ Crores, Verified 98.4%), pan across Regional Distribution Charts. | "At the core of FinMatrix is the Executive Command Center. Senior regulators have instant, nationwide oversight. Real-time telemetry maps every active deposit across all five regional bureaus, tracking total regulatory exposure and identifying expiring instruments before they pose compliance risks." |
| **0:43 – 1:08** | Open `/admin/verification`. Click on an unverified FDR. Click **"Query Core Banking System"**. Watch the badge flip from `Submitted` to `Bank-confirmed` (Teal). | "FinMatrix pioneers **Dual-Source Verification**. When an institution submits an FDR, regulators don't just rely on uploaded scans. With a single click, our engine cross-references the instrument directly with Core Banking System records—detecting parameter deviations, premature encashment, or lien mismatches instantly." |
| **1:09 – 1:30** | Switch to `/admin/audit`. Click **"Verify Chain Integrity"**. Watch the green success indicator glow. | "Security and trust are non-negotiable. Every document upload, bank query, and approval is sealed inside an **immutable HMAC-SHA256 cryptographic audit chain**. Regulators can mathematically verify ledger integrity from the genesis block in milliseconds, guaranteeing zero tampering." |
| **1:31 – 2:00** | Transition to `/portal`. Show the College Compliance Health Meter at 100%. Click "Submit New FDR" to show the 3-step wizard with AES-256 encryption badge. | "For colleges, FinMatrix provides a self-service portal with instant compliance tracking, automated renewal chaining, and guided 3-step deposit submissions protected by AES-256-GCM encryption. FinMatrix: Every deposit. Tracked. Verified. Secured. Built for AICTE and the future of smart regulatory governance." |

---

### Script 2: The 5-Minute Technical Deep-Dive Walkthrough
*Target Duration: 5 Minutes · Tone: Professional, technical, comprehensive.*

- **Scene 1 (0:00 – 0:45) — Introduction & The Regulatory Mandate**
  - *Visual:* Title card with FinMatrix branding. Transition to `/login` showing dual roles and AICTE seal.
  - *Voiceover:* "Welcome to FinMatrix—an enterprise regulatory clearinghouse designed for the All India Council for Technical Education under Smart India Hackathon 2026. Technical colleges in India must deposit mandatory fixed deposits to guarantee institutional solvency. FinMatrix replaces error-prone spreadsheets with an automated, cryptographically secure clearinghouse."
- **Scene 2 (0:45 – 1:30) — Central Admin Dashboard & 5-Stage Surveillance Matrix**
  - *Visual:* Admin logs into `/admin`. Screen highlights the 4 KPI cards, regional breakdown chart, and the 5-stage countdown matrix (`90d`, `60d`, `30d`, `15d`, `7d`).
  - *Voiceover:* "FinMatrix continuously surveils all active instruments. Our automated countdown engine scans maturities at 90, 60, 30, 15, and 7-day thresholds. Notice how instruments approaching expiry trigger color-coded urgency flags, with critical overdue deposits automatically escalating to Senior Bureau Advisors."
- **Scene 3 (1:30 – 2:30) — Dual-Source CBS Verification & Discrepancy Detection**
  - *Visual:* Navigate to `/admin/verification`. Show pending queue. Open comparison modal. Show Mock Core Banking query.
  - *Voiceover:* "Here in the Verification Queue, FinMatrix solves the problem of fraudulent certificates. The dual-source presentation juxtaposes the college's stated figures with live Core Banking System records. If an amount or maturity date diverges, the system triggers a visual mismatch badge, allowing officers to flag discrepancies with mandatory scrutiny remarks."
- **Scene 4 (2:30 – 3:15) — Encrypted Document Enclave & Scrutiny Note Sheet**
  - *Visual:* Navigate to `/admin/fdrs/[id]`. Show PDF document viewer streaming live.
  - *Voiceover:* "Original deposit certificates are never stored publicly. They reside inside an AES-256-GCM encrypted document vault. When viewed by an authorized officer, documents are decrypted on-the-fly and immediately logged in the audit trail."
- **Scene 5 (3:15 – 4:00) — Tamper-Evident Cryptographic Audit Trail**
  - *Visual:* Navigate to `/admin/audit`. Show the hash chain. Click **"Verify Chain Integrity"**.
  - *Voiceover:* "Regulators require absolute legal defensibility. FinMatrix implements an immutable hash-chained audit ledger powered by HMAC-SHA256. Every action links to the previous block's hash. The 'Verify Chain Integrity' tool recomputes mathematical proofs from the Genesis block, ensuring complete non-repudiation."
- **Scene 6 (4:00 – 4:40) — College Self-Service Portal & 3-Step Wizard**
  - *Visual:* Log in as `nodal@dtu.ac.in` on `/portal`. Show Deposit Health Meter. Click "Submit New FDR" on `/portal/fdrs/new`.
  - *Voiceover:* "On the institution side, college nodal officers benefit from complete transparency. The Deposit Health Meter shows exact statutory compliance. The 3-step submission wizard guides colleges through bank selection, validity terms, and secure certificate uploads, complete with renewal chaining."
- **Scene 7 (4:40 – 5:00) — Release Stepper & Conclusion**
  - *Visual:* Quick view of `/admin/releases` showing 4-stage stepper and discharge voucher `AICTE/REL/2026/XXXX`. End with FinMatrix logo.
  - *Voiceover:* "From submission and core banking verification to automated surveillance and formal release discharge vouchers, FinMatrix delivers an end-to-end sovereign financial custody clearinghouse for technical education in India."

---

## 7. 📋 Quick Reference: Default Demonstration Credentials

| Role | Email | Password | Quick Preset on `/login` |
|---|---|---|---|
| Central Administrator | `admin@finmatrix.gov.in` | `Admin@1234` | Click **"AICTE Central Admin"** |
| Senior Bureau Advisor | `senior@finmatrix.gov.in` | `Admin@1234` | Type email & password |
| College Nodal Officer (DTU) | `nodal@dtu.ac.in` | `College@1234` | Click **"DTU College Portal"** |

---
*FinMatrix — Ministry of Education / AICTE · Smart India Hackathon 2026*

