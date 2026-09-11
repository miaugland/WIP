"use client"

import { useEffect, useRef, useState } from "react"

function splitHookSentence(text: string): { hook: string; rest: string } {
    const match = text.match(/^(.*?[.!?])\s+(.*)$/s);
    if (!match) {
        return { hook: text, rest: "" };
    }
    return { hook: match[1], rest: match[2] };
}

export default function BookDescription({ text }: { text: string }) {
    const [expanded, setExpanded] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);

    const { hook, rest } = splitHookSentence(text);

    useEffect(() => {
        const el = textRef.current;
        if (!el) return;
        setIsTruncated(el.scrollHeight > el.clientHeight + 1);
    }, [text]);

    return (
        <div className="mx-auto max-w-[70ch] text-left">
            <p
                ref={textRef}
                className={`text-sm leading-relaxed ${expanded ? "" : "line-clamp-5"}`}>
                <span className="font-display text-lg text-ink">{hook}</span>
                {rest &&
                    <>
                        <br />
                        <br />
                        <span className="text-sm text-[#584449]">{rest}</span>
                    </>
                }
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