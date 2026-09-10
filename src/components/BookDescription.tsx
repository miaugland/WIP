"use client"

import { useState } from "react"

export default function BookDescription({ text }: { text: string }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div>
            <p className={`text-sm leading-relaxed text-ink ${expanded ? "" : "line-clamp-4"}`}>
                {text}
            </p>
            <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="mt-2 text-[13px] font-medium text-accent-hover hover:underline">
                {expanded ? "Read less" : "Read more"}
            </button>
        </div>
    );
}