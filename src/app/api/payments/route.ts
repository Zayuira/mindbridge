import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia", // Matches the environment's type definitions
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { amount, jobId, contractId, description } = await req.json();

        // Create a Stripe Checkout session
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "mnt", // Using MNT as per the Mongolian context in other files
                        product_data: {
                            name: description || `Payment for Job ${jobId}`,
                        },
                        unit_amount: amount * 100, // Stripe expects amounts in cents/tiin
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.NEXTAUTH_URL}/contracts/${contractId}?payment=success`,
            cancel_url: `${process.env.NEXTAUTH_URL}/contracts/${contractId}?payment=cancel`,
            metadata: {
                jobId,
                contractId,
                userId: session.user.id,
            },
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error: any) {
        console.error("Stripe Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
