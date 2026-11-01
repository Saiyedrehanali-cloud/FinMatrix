import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const db = new PrismaClient();

const AUDIT_SECRET =
  process.env.AUDIT_KEY || "finmatrix-tamper-evident-audit-hmac-key-2026";
let lastAuditHash =
  "0000000000000000000000000000000000000000000000000000000000000000";

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function subDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

function encryptBuffer(buffer: Buffer): Buffer {
  const hex =
    process.env.DOC_ENC_KEY ||
    "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
  const key = Buffer.from(hex, "hex");
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]);
}

function createAuditHash(
  prevHash: string,
  actorId: string | null,
  action: string,
  entity: string,
  entityId: string,
  payloadStr: string | null,
  timestampStr: string
): string {
  const content = [
    prevHash,
    actorId || "SYSTEM",
    action,
    entity,
    entityId,
    payloadStr || "",
    timestampStr,
  ].join("|");
  return crypto.createHmac("sha256", AUDIT_SECRET).update(content).digest("hex");
}

async function recordSeedAudit(
  actorId: string | null,
  action: string,
  entity: string,
  entityId: string,
  payload?: any,
  dateOffsetDays: number = 0
) {
  const payloadStr = payload ? JSON.stringify(payload) : null;
  const targetDate = subDays(new Date(), dateOffsetDays);
  const timestampStr = targetDate.toISOString();

  const hash = createAuditHash(
    lastAuditHash,
    actorId,
    action,
    entity,
    entityId,
    payloadStr,
    timestampStr
  );

  const log = await db.auditLog.create({
    data: {
      actorId,
      action,
      entity,
      entityId,
      payload: payloadStr,
      prevHash: lastAuditHash,
      hash,
      createdAt: targetDate,
    },
  });

  lastAuditHash = hash;
  return log;
}

// 25 Realistic Indian Technical Institutions across all 5 AICTE regions
const INSTITUTIONS_DATA = [
  { aicteId: "1-50000001", name: "Delhi Technological University", city: "New Delhi", state: "Delhi", region: "Northern", type: "Engineering", deposit: 3500000, email: "nodal@dtu.ac.in", officer: "Prof. S. K. Raman" },
  { aicteId: "1-50000002", name: "Demo Institute of Technology", city: "Bhopal", state: "Madhya Pradesh", region: "Central", type: "Engineering", deposit: 2500000, email: "nodal@ditbhopal.ac.in", officer: "Dr. Alok Verma" },
  { aicteId: "1-50000003", name: "Sardar Patel Institute of Technology", city: "Mumbai", state: "Maharashtra", region: "Western", type: "Engineering", deposit: 4000000, email: "nodal@spit.ac.in", officer: "Prof. Ananya Joshi" },
  { aicteId: "1-50000004", name: "Techno India Management Academy", city: "Kolkata", state: "West Bengal", region: "Eastern", type: "Management", deposit: 2000000, email: "admin@technoindia.edu.in", officer: "Dr. Debabrata Roy" },
  { aicteId: "1-50000005", name: "Vidyapeeth Pharmacy Institute", city: "Bengaluru", state: "Karnataka", region: "Southern", type: "Pharmacy", deposit: 1500000, email: "principal@vidyapeeth.org", officer: "Dr. Meenakshi Sundaram" },
  { aicteId: "1-50000006", name: "Madras Polytechnic College", city: "Chennai", state: "Tamil Nadu", region: "Southern", type: "Polytechnic", deposit: 1000000, email: "nodal@madraspoly.edu.in", officer: "Prof. K. Venkatesh" },
  { aicteId: "1-50000007", name: "Gujarat Business School", city: "Ahmedabad", state: "Gujarat", region: "Western", type: "Management", deposit: 2500000, email: "director@gbs-edu.in", officer: "Dr. Hiren Patel" },
  { aicteId: "1-50000008", name: "Rajasthan Engineering Academy", city: "Jaipur", state: "Rajasthan", region: "Northern", type: "Engineering", deposit: 3000000, email: "registrar@rea.ac.in", officer: "Prof. R. C. Meena" },
  { aicteId: "1-50000009", name: "Punjab Technical College", city: "Ludhiana", state: "Punjab", region: "Northern", type: "Engineering", deposit: 2000000, email: "nodal@ptcludhiana.in", officer: "Dr. Gurpreet Singh" },
  { aicteId: "1-50000010", name: "Lucknow Institute of Management", city: "Lucknow", state: "Uttar Pradesh", region: "Northern", type: "Management", deposit: 1500000, email: "info@limlucknow.org", officer: "Prof. Neeraj Gupta" },
  { aicteId: "1-50000011", name: "Patna Institute of Technology", city: "Patna", state: "Bihar", region: "Eastern", type: "Engineering", deposit: 2500000, email: "contact@pitpatna.ac.in", officer: "Dr. Saurabh Mishra" },
  { aicteId: "1-50000012", name: "Bhubaneswar College of Engineering", city: "Bhubaneswar", state: "Odisha", region: "Eastern", type: "Engineering", deposit: 3000000, email: "nodal@bceodisha.ac.in", officer: "Dr. Pradipta Mohanty" },
  { aicteId: "1-50000013", name: "Assam Technical Institute", city: "Guwahati", state: "Assam", region: "Eastern", type: "Polytechnic", deposit: 1200000, email: "nodal@atiassam.gov.in", officer: "Prof. Bikash Barua" },
  { aicteId: "1-50000014", name: "Hyderabad Engineering College", city: "Hyderabad", state: "Telangana", region: "Southern", type: "Engineering", deposit: 4500000, email: "nodal@hechyd.ac.in", officer: "Dr. K. Srinivas Rao" },
  { aicteId: "1-50000015", name: "Andhra College of Pharmacy", city: "Visakhapatnam", state: "Andhra Pradesh", region: "Southern", type: "Pharmacy", deposit: 1800000, email: "principal@acpvizag.org", officer: "Dr. Lakshmi Prasad" },
  { aicteId: "1-50000016", name: "Cochin Institute of Science & Tech", city: "Kochi", state: "Kerala", region: "Southern", type: "Engineering", deposit: 3200000, email: "nodal@cistkochi.edu.in", officer: "Prof. George Mathew" },
  { aicteId: "1-50000017", name: "Indore Institute of Management", city: "Indore", state: "Madhya Pradesh", region: "Central", type: "Management", deposit: 2200000, email: "nodal@iimindore-inst.in", officer: "Dr. Pooja Tiwari" },
  { aicteId: "1-50000018", name: "Raipur College of Engineering", city: "Raipur", state: "Chhattisgarh", region: "Central", type: "Engineering", deposit: 2800000, email: "nodal@rcecg.in", officer: "Prof. Arvind Sahu" },
  { aicteId: "1-50000019", name: "Nagpur Institute of Technology", city: "Nagpur", state: "Maharashtra", region: "Western", type: "Engineering", deposit: 3500000, email: "nodal@nitnagpur.ac.in", officer: "Dr. Sunil Deshmukh" },
  { aicteId: "1-50000020", name: "Goa College of Architecture", city: "Panaji", state: "Goa", region: "Western", type: "Architecture", deposit: 1500000, email: "principal@gca-goa.gov.in", officer: "Prof. Maria Fernandes" },
];

const BANKS = [
  { name: "State Bank of India", branches: ["Parliament Street New Delhi", "Nariman Point Mumbai", "MG Road Bengaluru", "Sector 17 Chandigarh", "Bhopal Main Branch"] },
  { name: "Punjab National Bank", branches: ["Connaught Place Delhi", "BBD Bagh Kolkata", "Civil Lines Jaipur", "Hazratganj Lucknow"] },
  { name: "HDFC Bank", branches: ["Kasturba Gandhi Marg Delhi", "Bandra Kurla Complex Mumbai", "Anna Salai Chennai", "Somajiguda Hyderabad"] },
  { name: "Canara Bank", branches: ["Town Hall Bengaluru", "George Town Chennai", "Moti Jheel Kanpur", "Camp Pune"] },
  { name: "Bank of Baroda", branches: ["Alkapuri Vadodara", "Marine Drive Mumbai", "Ashok Nagar Jaipur", "Park Street Kolkata"] },
  { name: "Union Bank of India", branches: ["Fort Mumbai", "Paharganj New Delhi", "Mall Road Shimla", "Kalyan Nagar Bengaluru"] },
];

async function main() {
  console.log("🧹 Initializing database with rich, realistic video-demo data...");

  // 1. Wipe old data
  await db.auditLog.deleteMany();
  await db.remark.deleteMany();
  await db.releaseRequest.deleteMany();
  await db.alert.deleteMany();
  await db.alertRule.deleteMany();
  await db.discrepancyFlag.deleteMany();
  await db.bankVerification.deleteMany();
  await db.mockBankRecord.deleteMany();
  await db.fDRDocument.deleteMany();
  await db.fDR.deleteMany();
  await db.user.deleteMany();
  await db.institution.deleteMany();

  // 2. Set up document enclave directory
  const storageDir = path.join(process.cwd(), "storage", "fdr-documents");
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  // Load sample PDF buffer for document attachments
  const samplePdfPath = path.join(process.cwd(), "public", "sample-fdr-1.pdf");
  let samplePdfBuffer: Buffer | null = null;
  if (fs.existsSync(samplePdfPath)) {
    samplePdfBuffer = fs.readFileSync(samplePdfPath);
  }

  // 3. Statutory Alert Rules
  await db.alertRule.createMany({
    data: [
      { type: "EXPIRING", thresholdsJson: JSON.stringify([90, 60, 30, 15, 7]), escalateAfterDays: 7, enabled: true },
      { type: "OVERDUE", thresholdsJson: JSON.stringify([0]), escalateAfterDays: 3, enabled: true },
      { type: "PENDING_STALE", thresholdsJson: JSON.stringify([3]), escalateAfterDays: 5, enabled: true },
      { type: "DISCREPANCY_UNRESOLVED", thresholdsJson: JSON.stringify([7]), escalateAfterDays: 7, enabled: true },
    ],
  });

  // 4. Create Standard Accounts
  const adminPasswordHash = await bcrypt.hash("Admin@1234", 10);
  const collegePasswordHash = await bcrypt.hash("College@1234", 10);

  const adminUser = await db.user.create({
    data: {
      name: "AICTE Central Administrator",
      email: "admin@finmatrix.gov.in",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  await db.user.create({
    data: {
      name: "AICTE Admin Officer",
      email: "admin@aicte.demo",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  const seniorAdmin = await db.user.create({
    data: {
      name: "Senior Bureau Advisor",
      email: "senior@finmatrix.gov.in",
      passwordHash: adminPasswordHash,
      role: "SENIOR_ADMIN",
    },
  });

  // Genesis audit block
  await recordSeedAudit(
    adminUser.id,
    "SYSTEM_INIT",
    "SYSTEM",
    "ROOT",
    {
      description: "FinMatrix Secure Clearinghouse initialized with AICTE Master Matrix.",
      version: "1.0.0-PROD",
      genesisTimestamp: new Date().toISOString(),
    },
    30
  );

  console.log("✓ AICTE Central Administrators and Genesis Audit Block created.");

  // 5. Create Institutions and Institutional Users
  const createdInstitutions: any[] = [];
  const createdInstUsers: any[] = [];

  for (let i = 0; i < INSTITUTIONS_DATA.length; i++) {
    const item = INSTITUTIONS_DATA[i];
    const inst = await db.institution.create({
      data: {
        aicteId: item.aicteId,
        name: item.name,
        state: item.state,
        city: item.city,
        region: item.region,
        type: item.type,
        nodalOfficer: item.officer,
        email: item.email,
        phone: `+91 ${9810000000 + i * 1111}`,
        requiredDeposit: item.deposit,
      },
    });

    const user = await db.user.create({
      data: {
        name: item.officer,
        email: item.email,
        passwordHash: collegePasswordHash,
        role: "INSTITUTION",
        institutionId: inst.id,
      },
    });

    createdInstitutions.push(inst);
    createdInstUsers.push(user);
  }

  console.log(`✓ Seeded ${createdInstitutions.length} affiliated universities and colleges.`);

  // 6. Seed Specific Tailored FDRs for DTU (First institution: nodal@dtu.ac.in)
  // DTU Required Deposit = ₹35,00,000.
  // - FDR 1: ₹25,00,000 (SBI, Verified, Active)
  // - FDR 2: ₹10,00,000 (HDFC, Verified, Active, Maturing in 18 days for renewal demo)
  // Total Active Pledged = ₹35,00,000 (Exact 100% on the Deposit Health Meter!)
  // - FDR 3: ₹15,00,000 (PNB, Historical Released with voucher)
  const dtu = createdInstitutions[0];
  const dtuUser = createdInstUsers[0];
  const today = new Date();

  const dtuFdr1 = await db.fDR.create({
    data: {
      refNo: "FDR/SBI/2024/7821",
      institutionId: dtu.id,
      bankName: "State Bank of India",
      branch: "Parliament Street New Delhi",
      amount: 2500000,
      issueDate: subDays(today, 365),
      maturityDate: addDays(today, 730),
      verificationStatus: "VERIFIED",
      verifiedById: adminUser.id,
      verifiedAt: subDays(today, 360),
      purpose: "Approval Security Deposit",
      academicYear: "2024-25",
    },
  });

  const dtuFdr2 = await db.fDR.create({
    data: {
      refNo: "FDR/HDFC/2025/1109",
      institutionId: dtu.id,
      bankName: "HDFC Bank",
      branch: "Kasturba Gandhi Marg Delhi",
      amount: 1000000,
      issueDate: subDays(today, 180),
      maturityDate: addDays(today, 18),
      verificationStatus: "VERIFIED",
      verifiedById: adminUser.id,
      verifiedAt: subDays(today, 175),
      purpose: "New Course Security Deposit (AI/ML)",
      academicYear: "2025-26",
    },
  });

  const dtuFdr3 = await db.fDR.create({
    data: {
      refNo: "FDR/PNB/2021/3340",
      institutionId: dtu.id,
      bankName: "Punjab National Bank",
      branch: "Connaught Place Delhi",
      amount: 1500000,
      issueDate: subDays(today, 1075),
      maturityDate: subDays(today, 60),
      verificationStatus: "VERIFIED",
      verifiedById: adminUser.id,
      verifiedAt: subDays(today, 1070),
      purpose: "Polytechnic Wing Security Deposit",
      academicYear: "2021-22",
      releaseRequested: true,
      releasedAt: subDays(today, 55),
    },
  });

  // Create CBS Mock Bank Records for DTU FDRs
  await db.mockBankRecord.createMany({
    data: [
      { bankName: dtuFdr1.bankName, refNo: dtuFdr1.refNo, amount: dtuFdr1.amount, issueDate: dtuFdr1.issueDate, maturityDate: dtuFdr1.maturityDate, holderName: dtu.name },
      { bankName: dtuFdr2.bankName, refNo: dtuFdr2.refNo, amount: dtuFdr2.amount, issueDate: dtuFdr2.issueDate, maturityDate: dtuFdr2.maturityDate, holderName: dtu.name },
      { bankName: dtuFdr3.bankName, refNo: dtuFdr3.refNo, amount: dtuFdr3.amount, issueDate: dtuFdr3.issueDate, maturityDate: dtuFdr3.maturityDate, holderName: dtu.name },
    ],
  });

  // Bank verification confirmations for DTU active FDRs
  await db.bankVerification.createMany({
    data: [
      { fdrId: dtuFdr1.id, status: "MATCH", source: "MOCK_BANK_API", confirmedJson: JSON.stringify({ bankName: dtuFdr1.bankName, refNo: dtuFdr1.refNo, amount: dtuFdr1.amount, lienTo: "AICTE" }), checkedById: adminUser.id, checkedAt: subDays(today, 360) },
      { fdrId: dtuFdr2.id, status: "MATCH", source: "MOCK_BANK_API", confirmedJson: JSON.stringify({ bankName: dtuFdr2.bankName, refNo: dtuFdr2.refNo, amount: dtuFdr2.amount, lienTo: "AICTE" }), checkedById: adminUser.id, checkedAt: subDays(today, 175) },
      { fdrId: dtuFdr3.id, status: "MATCH", source: "MOCK_BANK_API", confirmedJson: JSON.stringify({ bankName: dtuFdr3.bankName, refNo: dtuFdr3.refNo, amount: dtuFdr3.amount, lienTo: "AICTE" }), checkedById: adminUser.id, checkedAt: subDays(today, 1070) },
    ],
  });

  // Alert for DTU expiring FDR (dtuFdr2 maturing in 18 days)
  await db.alert.create({
    data: {
      fdrId: dtuFdr2.id,
      institutionId: dtu.id,
      type: "EXPIRING",
      threshold: 30,
      severity: "WARNING",
      audience: "INSTITUTION",
      title: `Notice: Deposit ${dtuFdr2.refNo} maturing in 18 days`,
      message: `Your security deposit of ₹10.00 Lakhs at HDFC Bank matures on ${dtuFdr2.maturityDate.toISOString().split("T")[0]}. Please initiate renewal via portal.`,
      isRead: false,
    },
  });

  // Historical release record for dtuFdr3
  await db.releaseRequest.create({
    data: {
      fdrId: dtuFdr3.id,
      requestedById: dtuUser.id,
      reason: "Course Closure & Polytechnic Restructuring Completed",
      remarks: "Statutory lock-in period concluded. NOC obtained from AICTE Bureau.",
      status: "RELEASED",
      decisionById: adminUser.id,
      decisionRemarks: "Full audit complete. Security deposit released.",
      releaseRef: "AICTE/REL/2026/0142",
      requestedAt: subDays(today, 70),
      decidedAt: subDays(today, 60),
      releasedAt: subDays(today, 55),
    },
  });

  // Attach encrypted PDF certificate to dtuFdr1
  if (samplePdfBuffer) {
    const encBuffer = encryptBuffer(samplePdfBuffer);
    const storedName = `${crypto.randomUUID()}.enc`;
    fs.writeFileSync(path.join(storageDir, storedName), encBuffer);

    await db.fDRDocument.create({
      data: {
        fdrId: dtuFdr1.id,
        kind: "FDR_COPY",
        fileName: "DTU-SBI-Security-Deposit-Cert.pdf",
        storedName,
        mimeType: "application/pdf",
        sizeBytes: samplePdfBuffer.length,
        fileHash: crypto.createHash("sha256").update(samplePdfBuffer).digest("hex"),
        version: 1,
        uploadedById: dtuUser.id,
        uploadedAt: subDays(today, 365),
      },
    });
  }

  // Add scrutiny remarks on DTU FDR
  await db.remark.create({
    data: {
      fdrId: dtuFdr1.id,
      authorId: adminUser.id,
      text: "Scrutiny Note: Verified joint endorsement with AICTE and confirmation letter received from SBI Parliament Street branch.",
      createdAt: subDays(today, 360),
    },
  });

  console.log("✓ DTU institution setup with 100% compliance meter & expiring renewal instrument.");

  // 7. Seed Diverse National Fixed Deposit Receipts across all other lifecycle states
  // We need:
  // - PENDING (Ready to click "Query Core Banking System" on /admin/verification!)
  // - EXPIRING (7 days, 15 days, 30 days for priority table on /admin)
  // - OVERDUE (Critical escalation to SENIOR_ADMIN)
  // - MISMATCH (Discrepancy anomaly detected)
  // - RELEASE_REQUESTS (4-stage stepper: REQUESTED, UNDER_SCRUTINY, APPROVED, RELEASED)
  const fdrBatches = [
    // BATCH 1: PENDING VERIFICATION (Gray 'Submitted' badge for Scene 3)
    { instIdx: 1, bankIdx: 0, branchIdx: 0, amount: 2500000, daysOffset: 365, status: "PENDING", isMismatch: false },
    { instIdx: 2, bankIdx: 1, branchIdx: 1, amount: 3000000, daysOffset: 400, status: "PENDING", isMismatch: false },
    { instIdx: 3, bankIdx: 2, branchIdx: 2, amount: 2000000, daysOffset: 500, status: "PENDING", isMismatch: false },
    { instIdx: 4, bankIdx: 3, branchIdx: 0, amount: 1500000, daysOffset: 300, status: "PENDING", isMismatch: false },

    // BATCH 2: CRITICAL EXPIRING (≤7 Days for Scene 2 Countdown Table)
    { instIdx: 5, bankIdx: 0, branchIdx: 1, amount: 1000000, daysOffset: 4, status: "VERIFIED", isMismatch: false, alertSeverity: "CRITICAL", alertDays: 7 },
    { instIdx: 6, bankIdx: 2, branchIdx: 3, amount: 2500000, daysOffset: 6, status: "VERIFIED", isMismatch: false, alertSeverity: "CRITICAL", alertDays: 7 },

    // BATCH 3: URGENT EXPIRING (8 - 15 Days)
    { instIdx: 7, bankIdx: 1, branchIdx: 2, amount: 3000000, daysOffset: 12, status: "VERIFIED", isMismatch: false, alertSeverity: "HIGH", alertDays: 15 },
    { instIdx: 8, bankIdx: 4, branchIdx: 0, amount: 2000000, daysOffset: 14, status: "VERIFIED", isMismatch: false, alertSeverity: "HIGH", alertDays: 15 },

    // BATCH 4: WARNING EXPIRING (16 - 30 Days)
    { instIdx: 9, bankIdx: 3, branchIdx: 1, amount: 1500000, daysOffset: 22, status: "VERIFIED", isMismatch: false, alertSeverity: "WARNING", alertDays: 30 },
    { instIdx: 10, bankIdx: 5, branchIdx: 2, amount: 2500000, daysOffset: 28, status: "VERIFIED", isMismatch: false, alertSeverity: "WARNING", alertDays: 30 },

    // BATCH 5: OVERDUE (Escalated to Senior Admin)
    { instIdx: 11, bankIdx: 0, branchIdx: 3, amount: 3000000, daysOffset: -12, status: "VERIFIED", isMismatch: false, isOverdue: true },
    { instIdx: 12, bankIdx: 2, branchIdx: 1, amount: 1200000, daysOffset: -5, status: "VERIFIED", isMismatch: false, isOverdue: true },

    // BATCH 6: DISCREPANCY MISMATCH (Scene 3 Discrepancy Tab)
    { instIdx: 13, bankIdx: 1, branchIdx: 0, amount: 4500000, daysOffset: 180, status: "DISCREPANCY", isMismatch: true, bankAmount: 3500000 },
    { instIdx: 14, bankIdx: 4, branchIdx: 1, amount: 1800000, daysOffset: 210, status: "DISCREPANCY", isMismatch: true, bankAmount: 1500000 },

    // BATCH 7: RELEASE REQUESTS (Scene 6 Stepper)
    { instIdx: 15, bankIdx: 3, branchIdx: 2, amount: 3200000, daysOffset: 90, status: "VERIFIED", releaseStage: "REQUESTED" },
    { instIdx: 16, bankIdx: 0, branchIdx: 4, amount: 2200000, daysOffset: 120, status: "VERIFIED", releaseStage: "UNDER_SCRUTINY" },
    { instIdx: 17, bankIdx: 2, branchIdx: 0, amount: 2800000, daysOffset: 150, status: "VERIFIED", releaseStage: "APPROVED" },
    { instIdx: 18, bankIdx: 5, branchIdx: 1, amount: 3500000, daysOffset: 60, status: "RELEASED", releaseStage: "RELEASED" },

    // BATCH 8: HEALTHY LONG-TERM VERIFIED DEPOSITS
    { instIdx: 19, bankIdx: 1, branchIdx: 3, amount: 1500000, daysOffset: 720, status: "VERIFIED" },
    { instIdx: 1, bankIdx: 4, branchIdx: 2, amount: 2000000, daysOffset: 650, status: "VERIFIED" },
    { instIdx: 2, bankIdx: 3, branchIdx: 3, amount: 2500000, daysOffset: 800, status: "VERIFIED" },
    { instIdx: 3, bankIdx: 0, branchIdx: 2, amount: 3500000, daysOffset: 580, status: "VERIFIED" },
  ];

  let fdrCounter = 1001;
  const createdFdrs: any[] = [dtuFdr1, dtuFdr2, dtuFdr3];

  for (const item of fdrBatches) {
    const inst = createdInstitutions[item.instIdx];
    const bank = BANKS[item.bankIdx];
    const branch = bank.branches[item.branchIdx % bank.branches.length];
    const refNo = `FDR/${bank.name.split(" ")[0].toUpperCase()}/2024/${fdrCounter++}`;
    const issueDate = subDays(today, 365);
    const maturityDate = addDays(today, item.daysOffset);

    const fdr = await db.fDR.create({
      data: {
        refNo,
        institutionId: inst.id,
        bankName: bank.name,
        branch,
        amount: item.amount,
        issueDate,
        maturityDate,
        verificationStatus: item.status,
        verifiedById: item.status === "VERIFIED" || item.status === "RELEASED" ? adminUser.id : null,
        verifiedAt: item.status === "VERIFIED" || item.status === "RELEASED" ? subDays(today, 10) : null,
        discrepancyReason: item.isMismatch ? "Core Banking System reports divergence in pledged principal amount." : null,
        purpose: "Approval Security Deposit",
        academicYear: "2024-25",
        releaseRequested: !!item.releaseStage,
        releasedAt: item.releaseStage === "RELEASED" ? subDays(today, 2) : null,
      },
    });

    createdFdrs.push(fdr);

    // Seed CBS mock record
    const bankRecordAmount = item.isMismatch && item.bankAmount ? item.bankAmount : item.amount;
    await db.mockBankRecord.create({
      data: {
        bankName: bank.name,
        refNo,
        amount: bankRecordAmount,
        issueDate,
        maturityDate,
        holderName: inst.name,
      },
    });

    // Seed Bank Verification record if verified or mismatch
    if (item.status === "VERIFIED" || item.status === "RELEASED" || item.isMismatch) {
      await db.bankVerification.create({
        data: {
          fdrId: fdr.id,
          status: item.isMismatch ? "MISMATCH" : "MATCH",
          source: "MOCK_BANK_API",
          confirmedJson: JSON.stringify({
            bankName: bank.name,
            refNo,
            amount: bankRecordAmount,
            holderName: inst.name,
            lienTo: "AICTE New Delhi",
          }),
          diffsJson: item.isMismatch ? JSON.stringify(["amount"]) : null,
          checkedById: adminUser.id,
          checkedAt: subDays(today, 5),
        },
      });
    }

    // Seed Discrepancy Flag
    if (item.isMismatch) {
      await db.discrepancyFlag.create({
        data: {
          fdrId: fdr.id,
          code: "BANK_AMOUNT_MISMATCH",
          severity: "HIGH",
          message: `Core Banking System reports principal of ₹${(bankRecordAmount / 100000).toFixed(2)} Lakhs vs submitted claim of ₹${(item.amount / 100000).toFixed(2)} Lakhs.`,
          evidence: JSON.stringify({ submitted: item.amount, bankConfirmed: bankRecordAmount }),
          resolved: false,
          createdAt: subDays(today, 4),
        },
      });
    }

    // Seed Alerts
    if (item.alertSeverity && item.alertDays) {
      await db.alert.create({
        data: {
          fdrId: fdr.id,
          institutionId: inst.id,
          type: "EXPIRING",
          threshold: item.alertDays,
          severity: item.alertSeverity,
          audience: "ADMIN",
          title: `Notice: FDR ${fdr.refNo} maturing in ${item.daysOffset} days`,
          message: `${inst.name} security deposit of ₹${(item.amount / 100000).toFixed(2)} Lakhs matures on ${maturityDate.toISOString().split("T")[0]}.`,
          isRead: false,
        },
      });
    } else if (item.isOverdue) {
      await db.alert.create({
        data: {
          fdrId: fdr.id,
          institutionId: inst.id,
          type: "OVERDUE",
          threshold: 0,
          severity: "CRITICAL",
          audience: "SENIOR_ADMIN",
          title: `ESCALATION: Overdue Security Deposit ${fdr.refNo}`,
          message: `${inst.name} deposit of ₹${(item.amount / 100000).toFixed(2)} Lakhs has lapsed by ${Math.abs(item.daysOffset)} days without renewal. Escalated to Executive Bureau.`,
          isRead: false,
        },
      });
    }

    // Seed Release Requests
    if (item.releaseStage) {
      await db.releaseRequest.create({
        data: {
          fdrId: fdr.id,
          requestedById: createdInstUsers[item.instIdx].id,
          reason: "Statutory 10-Year Lock-in Period Concluded & Course Rationalized",
          remarks: "No outstanding complaints from students or faculty. All clearances attached.",
          status: item.releaseStage,
          decisionById: item.releaseStage !== "REQUESTED" ? adminUser.id : null,
          decisionRemarks: item.releaseStage === "APPROVED" || item.releaseStage === "RELEASED" ? "Executive clearance granted. All audit parameters verified." : null,
          releaseRef: item.releaseStage === "APPROVED" || item.releaseStage === "RELEASED" ? `AICTE/REL/2026/${fdrCounter}` : null,
          requestedAt: subDays(today, 10),
          decidedAt: item.releaseStage !== "REQUESTED" ? subDays(today, 3) : null,
          releasedAt: item.releaseStage === "RELEASED" ? subDays(today, 1) : null,
        },
      });
    }

    // Attach sample encrypted PDF for first 6 FDRs
    if (samplePdfBuffer && fdrCounter <= 1008) {
      const encBuffer = encryptBuffer(samplePdfBuffer);
      const storedName = `${crypto.randomUUID()}.enc`;
      fs.writeFileSync(path.join(storageDir, storedName), encBuffer);

      await db.fDRDocument.create({
        data: {
          fdrId: fdr.id,
          kind: "FDR_COPY",
          fileName: `${refNo.replace(/\//g, "-")}-Certificate.pdf`,
          storedName,
          mimeType: "application/pdf",
          sizeBytes: samplePdfBuffer.length,
          fileHash: crypto.createHash("sha256").update(samplePdfBuffer).digest("hex"),
          version: 1,
          uploadedById: createdInstUsers[item.instIdx].id,
          uploadedAt: subDays(today, 30),
        },
      });
    }
  }

  console.log(`✓ Seeded ${createdFdrs.length} Fixed Deposit Receipts across all lifecycle states.`);

  // 8. Connect Renewal Chains (oldFDR -> newFDR)
  const oldFdr = createdFdrs[3];
  const newFdr = createdFdrs[4];
  await db.fDR.update({
    where: { id: newFdr.id },
    data: {
      renewalOfId: oldFdr.id,
      renewedAt: subDays(today, 5),
    },
  });
  console.log("✓ Connected renewal chains (oldFDR -> newFDR).");

  // 9. Create 10 Rich Chained HMAC-SHA256 Audit Log Entries
  // This ensures Scene 5 ("Verify Chain Integrity") proves mathematical integrity across a real ledger!
  await recordSeedAudit(adminUser.id, "COLLEGE_ONBOARDED", "INSTITUTION", dtu.id, { aicteId: dtu.aicteId, name: dtu.name }, 25);
  await recordSeedAudit(dtuUser.id, "FDR_SUBMITTED", "FDR", dtuFdr1.id, { refNo: dtuFdr1.refNo, amount: dtuFdr1.amount }, 20);
  await recordSeedAudit(adminUser.id, "CBS_QUERY_EXECUTED", "MOCK_BANK", dtuFdr1.id, { status: "MATCH", bank: dtuFdr1.bankName }, 19);
  await recordSeedAudit(adminUser.id, "FDR_VERIFIED", "FDR", dtuFdr1.id, { status: "VERIFIED", officer: "AICTE Central Admin" }, 19);
  await recordSeedAudit(dtuUser.id, "FDR_SUBMITTED", "FDR", dtuFdr2.id, { refNo: dtuFdr2.refNo, amount: dtuFdr2.amount }, 15);
  await recordSeedAudit(adminUser.id, "FDR_VERIFIED", "FDR", dtuFdr2.id, { status: "VERIFIED" }, 14);
  await recordSeedAudit(adminUser.id, "DISCREPANCY_FLAGGED", "FDR", createdFdrs[15].id, { code: "BANK_AMOUNT_MISMATCH", discrepancyAmount: 1000000 }, 8);
  await recordSeedAudit(seniorAdmin.id, "OVERDUE_ESCALATION_NOTED", "ALERT", createdFdrs[13].id, { priority: "CRITICAL", daysOverdue: 12 }, 4);
  await recordSeedAudit(adminUser.id, "RELEASE_APPROVED", "RELEASE", createdFdrs[18].id, { voucher: "AICTE/REL/2026/1018", status: "APPROVED" }, 2);

  console.log("✓ Recorded 10-block cryptographically chained HMAC-SHA256 audit ledger.");
  console.log("🎉 FinMatrix database is perfectly primed for video recording!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
