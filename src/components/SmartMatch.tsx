// components/SmartMatch.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

interface Match {
    freelancer_id: string;
    name: string;
    title: string;
    hourly_rate: number;
    score: number;
    skill_similarity: number;
    skills: string[];
}

export default function SmartMatch({ jobId }: { jobId: string }) {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(false);

    const runMatch = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobId }),
            });
            const data = await res.json();
            setMatches(data.matches);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <button
                onClick={runMatch}
                disabled={loading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg"
            >
                {loading ? "Хайж байна..." : "Шилдэг фрилансеруудыг олох"}
            </button>

            {matches.map((m) => (
                <div key={m.freelancer_id} className="border rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center">
                        <div>
                            <Link href={`/freelancers/${m.freelancer_id}`} className="hover:text-purple-600 transition-colors">
                                <p className="font-medium">{m.name}</p>
                            </Link>
                            <p className="text-sm text-gray-500">{m.title}</p>
                        </div>
                        {/* Match score — хувиар харуулах */}
                        <span className="text-lg font-semibold text-purple-600">
                            {Math.round(m.score * 100)}%
                        </span>
                    </div>

                    {/* Score breakdown */}
                    <div className="text-xs text-gray-400 flex gap-4">
                        <span>Skill match: {Math.round(m.skill_similarity * 100)}%</span>
                        <span>${m.hourly_rate}/hr</span>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1">
                        {m.skills.slice(0, 5).map((s) => (
                            <span key={s} className="bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded-full">
                                {s}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}