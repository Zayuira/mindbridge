export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import prisma from "@/lib/prisma";
import { getOrSetCache } from "@/lib/redis";

interface SessionUser { id: string; role: string; }

interface AIMatch {
    freelancer_id: string;
    score: number;
    skill_similarity: number;
    explicit_skill_match: number;
    rate_fit: number;
    rating_score: number;
    activity_score: number;
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { role } = session.user as SessionUser;
        if (role !== "CLIENT" && role !== "ADMIN")
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const body = await req.json();
        const { jobId, availableOnly } = body;

        if (!jobId)
            return NextResponse.json({ error: "jobId is required" }, { status: 400 });

        // ✅ #1.2 — Cache key: jobId + availability filter хамтад
        const cacheKey = `ai:match:${jobId}:avail=${availableOnly ? "1" : "0"}`;

        const result = await getOrSetCache(cacheKey, 600, async () => {
            // Job + freelancer-уудыг зэрэг татна (Promise.all → хурдан)
            const [job, freelancers] = await Promise.all([
                prisma.job.findUnique({
                    where: { id: jobId },
                    include: { skills: true },
                }),
                // ✅ #1.4 — Availability шүүлтүүр: availableOnly=true бол зөвхөн AVAILABLE
                prisma.freelancerProfile.findMany({
                    where: availableOnly ? { availability: "AVAILABLE" } : undefined,
                    include: {
                        skills: { include: { skill: true } },
                        user: { select: { full_name: true } },
                        contracts: {
                            where: { status: "COMPLETED" },
                            include: { reviews: { select: { rating: true } } },
                        },
                    },
                }),
            ]);

            if (!job) return null;
            if (freelancers.length === 0) return { matches: [] };

            // Payload бэлтгэх
            const payload = {
                job_title: job.title,
                job_description: job.description,
                job_budget_max: job.budget_max,
                required_skills: job.skills.map((s) => s.name),
                freelancers: freelancers.map((fl) => {
                    const allReviews = fl.contracts.flatMap((c) => c.reviews);
                    const avgRating =
                        allReviews.length > 0
                            ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length
                            : 3.0;

                    return {
                        id: fl.id,
                        title: fl.title ?? "",
                        bio: fl.bio ?? "",
                        hourly_rate: fl.hourly_rate ?? 0,
                        avg_rating: parseFloat(avgRating.toFixed(2)),
                        completed_jobs: fl.contracts.length,
                        skills: fl.skills.map((s) => s.skill.name),
                        availability: fl.availability,
                    };
                }),
            };

            // AI сервис дуудах
            const aiServiceUrl = process.env.AI_SERVICE_URL;
            if (!aiServiceUrl) throw new Error("AI_SERVICE_URL environment variable is not set");

            const aiRes = await fetch(`${aiServiceUrl}/match`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                signal: AbortSignal.timeout(30_000),
            });

            if (!aiRes.ok) {
                const errText = await aiRes.text();
                throw new Error(`AI service error ${aiRes.status}: ${errText}`);
            }

            const { matches } = await aiRes.json() as { matches: AIMatch[] };

            // Freelancer map (O(n) lookup)
            const flMap = new Map(freelancers.map((f) => [f.id, f]));

            const enriched = matches.map((m) => {
                const fl = flMap.get(m.freelancer_id);
                return {
                    freelancer_id: m.freelancer_id,
                    score: m.score,
                    skill_similarity: m.skill_similarity,
                    explicit_skill_match: m.explicit_skill_match,
                    rate_fit: m.rate_fit,
                    rating_score: m.rating_score,
                    activity_score: m.activity_score,
                    name: fl?.user.full_name ?? "Unknown",
                    title: fl?.title ?? "",
                    hourly_rate: fl?.hourly_rate ?? 0,
                    availability: fl?.availability ?? "OFFLINE",
                    skills: fl?.skills.map((s) => s.skill.name) ?? [],
                };
            });

            return { matches: enriched };
        });

        if (result === null)
            return NextResponse.json({ error: "Job not found" }, { status: 404 });

        return NextResponse.json(result, { status: 200 });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Internal server error";
        console.error("[match/route.ts]", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}