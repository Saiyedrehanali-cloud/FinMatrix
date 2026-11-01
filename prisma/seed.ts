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
  payload?: any
) {
  const payloadStr = payload ? JSON.stringify(payload) : null;
  const now = new Date();
  const timestampStr = now.toISOString();

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
      createdAt: now,
    },
  });

  lastAuditHash = hash;
  return log;
}

async function main() {
  console.log("🧹 Cleaning all dummy records from FinMatrix database...");

  // 1. Wipe all existing fake records
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

  // 2. Clear out local encrypted document storage
  const storageDir = path.join(process.cwd(), "storage", "fdr-documents");
  if (fs.existsSync(storageDir)) {
    const files = fs.readdirSync(storageDir);
    for (const f of files) {
      try {
        fs.unlinkSync(path.join(storageDir, f));
      } catch (err) {
        // ignore
      }
    }
  } else {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  console.log("✓ All fake FDRs, institutions, alerts, and mock records deleted.");

  // 3. Seed statutory Alert Rules
  await db.alertRule.createMany({
    data: [
      {
        type: "EXPIRING",
        thresholdsJson: JSON.stringify([90, 60, 30, 15, 7]),
        escalateAfterDays: 7,
        enabled: true,
      },
      {
        type: "OVERDUE",
        thresholdsJson: JSON.stringify([0]),
        escalateAfterDays: 3,
        enabled: true,
      },
      {
        type: "PENDING_STALE",
        thresholdsJson: JSON.stringify([3]),
        escalateAfterDays: 5,
        enabled: true,
      },
      {
        type: "DISCREPANCY_UNRESOLVED",
        thresholdsJson: JSON.stringify([7]),
        escalateAfterDays: 7,
        enabled: true,
      },
    ],
  });
  console.log("✓ Initialized standard 90/60/30/15/7 day alert rules");

  // 4. Default Passwords for Administrators
  // Primary password: Admin@1234
  const adminPasswordHash = await bcrypt.hash("Admin@1234", 10);
  const collegePasswordHash = await bcrypt.hash("College@1234", 10);

  // 5. Create Central AICTE Administration Accounts
  const adminUser = await db.user.create({
    data: {
      name: "AICTE Central Administrator",
      email: "admin@finmatrix.gov.in",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  // Secondary admin alias
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

  console.log("✓ Created Central AICTE Administrators (admin@finmatrix.gov.in)");

  // 6. Create clean starter institution ready for immediate deposit testing
  const starterInst = await db.institution.create({
    data: {
      aicteId: "1-50000001",
      name: "Delhi Technological University",
      state: "Delhi",
      city: "New Delhi",
      region: "Northern",
      type: "Engineering",
      nodalOfficer: "Prof. Nodal Officer",
      email: "nodal@dtu.ac.in",
      phone: "+91 9811002233",
      requiredDeposit: 3500000,
    },
  });

  await db.user.create({
    data: {
      name: "DTU Nodal Officer",
      email: "nodal@dtu.ac.in",
      passwordHash: collegePasswordHash,
      role: "INSTITUTION",
      institutionId: starterInst.id,
    },
  });

  console.log("✓ Registered starter affiliated institution (nodal@dtu.ac.in)");

  // 7. Genesis Audit Trail Block
  await recordSeedAudit(
    adminUser.id,
    "SYSTEM_INIT",
    "SYSTEM",
    "ROOT",
    {
      description: "FinMatrix Secure Clearinghouse initialized with zero dummy records.",
      version: "1.0.0-PROD",
      genesisTimestamp: new Date().toISOString(),
    }
  );

  console.log("✓ Cryptographic HMAC-SHA256 Genesis audit block recorded.");
  console.log("🎉 FinMatrix is now clean and initialized for genuine real-world operations!");
}

main()
  .catch((e) => {
    console.error("❌ Clean seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
