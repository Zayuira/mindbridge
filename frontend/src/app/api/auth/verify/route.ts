export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { VerificationType } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { email, code, type } = await req.json();

    if (!email || !code || !type) {
      return NextResponse.json(
        { error: "Дутуу мэдээлэл (email, code, type)" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        verificationCodes: {
          where: {
            type: type as VerificationType,
            used: false,
            expiresAt: { gt: new Date() },
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Хэрэглэгч олдсонгүй." }, { status: 404 });
    }

    const verification = user.verificationCodes[0];

    if (!verification || verification.code !== code) {
      return NextResponse.json(
        { error: "Баталгаажуулах код буруу эсвтал хугацаа нь дууссан байна." },
        { status: 400 }
      );
    }

    // Кодыг ашигласан гэж тэмдэглэх
    await prisma.verificationCode.update({
      where: { id: verification.id },
      data: { used: true },
    });

    // Хэрэглэгчийн статусыг шинэчлэх
    const updateData: any = {};
    if (type === "EMAIL") updateData.email_verified = true;
    if (type === "PHONE") updateData.phone_verified = true;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    // Хэрэв хоёулаа баталгаажсан бол ерөнхий баталгаажуулалтыг true болгоно
    if (updatedUser.email_verified && updatedUser.phone_verified) {
      await prisma.user.update({
        where: { id: user.id },
        data: { is_verified: true },
      });
    }

    return NextResponse.json({
      success: true,
      message: `${type === "EMAIL" ? "И-мэйл" : "Утас"} амжилттай баталгаажлаа.`,
      email_verified: updatedUser.email_verified,
      phone_verified: updatedUser.phone_verified,
    });
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Серверийн алдаа гарлаа." },
      { status: 500 }
    );
  }
}
