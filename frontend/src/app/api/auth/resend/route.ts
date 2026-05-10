export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createVerificationCode } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/mail";
import { sendSMS } from "@/lib/sms";
import { VerificationType } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { email, type } = await req.json();

    if (!email || !type) {
      return NextResponse.json(
        { error: "Дутуу мэдээлэл (email, type)" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Хэрэглэгч олдсонгүй." }, { status: 404 });
    }

    // Шинэ код үүсгэх
    const verification = await createVerificationCode(user.id, type as VerificationType);

    if (type === "EMAIL") {
      await sendOtpEmail(user.email, verification.code);
    } else {
      await sendSMS({
        to: user.phone,
        message: `Mind Bridge: Таны шинэ код: ${verification.code}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Шинэ код илгээлээ.",
    });
  } catch (error: any) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: "Серверийн алдаа гарлаа." },
      { status: 500 }
    );
  }
}
