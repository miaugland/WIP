"use client"

import { useEffect, useRef, useState } from "react"

export default function BookDescription({ text }: { text: string }) {
    const [expanded, setExpanded] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const el = textRef.current;
        if (!el) return;
        setIsTruncated(el.scrollHeight > el.clientHeight + 1);
    }, [text]);

    return (
        <div className="mx-auto max-w-[70ch] text-left">
            <p
                ref={textRef}
                className={`text-sm leading-relaxed text-ink ${expanded ? "" : "line-clamp-4"}`}>
                {text}
            </p>

            {isTruncated && (
                <div className="mt-3 text-center">
                    <button
                        type="button"
                        onClick={() => setExpanded((prev) => !prev)}
                        className="text-[13px] font-medium text-accent-hover underline-offset-4 hover:underline">
                        {expanded ? "Read less" : "Read more"}
                    </button>
                </div>
            )}
        </div>
    );
}