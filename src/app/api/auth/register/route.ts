import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/crypto";
import { signSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      aicteId,
      state,
      city,
      region = "Northern",
      type = "Engineering",
      nodalOfficer,
      email,
      phone,
      password,
      requiredDeposit = 2500000,
    } = body;

    if (!name || !aicteId || !email || !nodalOfficer || !password) {
      return NextResponse.json(
        { ok: false, error: "Please fill in all required fields (College Name, AICTE ID, Nodal Officer, Email, Password)." },
        { status: 422 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { ok: false, error: "Password must be at least 6 characters long." },
        { status: 422 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanAicteId = aicteId.trim();

    // Check duplicate AICTE ID
    const existingInst = await db.institution.findUnique({
      where: { aicteId: cleanAicteId },
    });
    if (existingInst) {
      return NextResponse.json(
        { ok: false, error: `An institution with AICTE ID '${cleanAicteId}' is already registered.` },
        { status: 409 }
      );
    }

    // Check duplicate email
    const existingUser = await db.user.findUnique({
      where: { email: cleanEmail },
    });
    if (existingUser) {
      return NextResponse.json(
        { ok: false, error: `An account with email '${cleanEmail}' already exists. Please sign in.` },
        { status: 409 }
      );
    }

    // Create Institution
    const institution = await db.institution.create({
      data: {
        name: name.trim(),
        aicteId: cleanAicteId,
        state: state?.trim() || "National",
        city: city?.trim() || "City",
        region,
        type,
        nodalOfficer: nodalOfficer.trim(),
        email: cleanEmail,
        phone: phone?.trim() || "+91 9800000000",
        requiredDeposit: Number(requiredDeposit) || 2500000,
      },
    });

    // Create Nodal User
    const passwordHash = await hashPassword(password);
    const user = await db.user.create({
      data: {
        name: nodalOfficer.trim(),
        email: cleanEmail,
        passwordHash,
        role: "INSTITUTION",
        institutionId: institution.id,
      },
    });

    // Log registration audit
    try {
      await logAudit({
        actorId: user.id,
        action: "INSTITUTION_REGISTERED",
        entity: "INSTITUTION",
        entityId: institution.id,
        payload: { name: institution.name, aicteId: institution.aicteId, email: user.email },
      });
    } catch (auditErr) {
      console.warn("Audit record write skipped:", auditErr);
    }

    // Sign session token for immediate seamless login
    const token = await signSessionToken({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: "INSTITUTION",
      institutionId: institution.id,
      institutionName: institution.name,
    });

    const response = NextResponse.json({
      ok: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          institutionId: institution.id,
          institutionName: institution.name,
        },
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error: any) {
    console.error("Institution self-registration error:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "An error occurred during registration" },
      { status: 500 }
    );
  }
}
