export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createVerificationCode } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/mail";
import { sendSMS } from "@/lib/sms";
import { VerificationType } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { email, phone, password, full_name, role } = await req.json();

    if (!email || !phone || !password || !full_name) {
      return NextResponse.json(
        { error: "Бүх талбарыг бөглөнө үү (Email, Phone, Password, Full Name)" },
        { status: 400 }
      );
    }

    // Email эсвэл Phone бүртгэлтэй эсэхийг шалгах
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      const field = existingUser.email === email ? "И-мэйл" : "Утасны дугаар";
      return NextResponse.json(
        { error: `Энэ ${field} аль хэдийн бүртгэлтэй байна.` },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        phone,
        passwordHash,
        full_name,
        role: role || "CLIENT",
        is_verified: false, // Баталгаажсаны дараа true болно
      },
    });

    // Profile үүсгэх
    if (newUser.role === "FREELANCER") {
      await prisma.freelancerProfile.create({
        data: {
          user_id: newUser.id,
          title: "",
          hourly_rate: 0,
          ai_score: 0,
          availability: "AVAILABLE",
        },
      });
    } else {
      await prisma.clientProfile.create({
        data: {
          user_id: newUser.id,
          company_name: "",
          industry: "",
          total_jobs_posted: 0,
        },
      });
    }

    // Баталгаажуулах кодууд үүсгэж илгээх
    const emailCode = await createVerificationCode(newUser.id, VerificationType.EMAIL);
    const smsCode = await createVerificationCode(newUser.id, VerificationType.PHONE);

    // Илгээх (Async-аар явуулбал илүү хурдан хариу өгнө)
    await Promise.all([
      sendOtpEmail(email, emailCode.code),
      sendSMS({
        to: phone,
        message: `Mind Bridge: Таны баталгаажуулах код: ${smsCode.code}`,
      }),
    ]);

    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          email: newUser.email,
          phone: newUser.phone,
          full_name: newUser.full_name,
          role: newUser.role,
        },
        message: "Бүртгэл амжилттай. Кодоо оруулж баталгаажуулна уу.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
