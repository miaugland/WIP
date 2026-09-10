"use client"

import { useState } from "react";

export default function StarRatingInput({
    value,
    onChange,
    disabled = false,
}: {
    value: number;
    onChange: (value: number) => void,
    disabled?: boolean,
}) {
    const [hovered, setHovered] = useState(0);
    const displayValue = hovered || value;

    return (
        <div className="flex" onMouseLeave={() => setHovered(0)}>
            {[1, 2, 3, 4, 5].map((star) => {
                const fillPercent = Math.max(0, Math.min(100, (displayValue - (star - 1)) * 100));

                return (
                    <div key={star} className="relative h-6.5 w-6.5 text-2xl leading-none">
                        <span className="pointer-events-none absolute inset-0 select-none text-[#e2cdd2]">
                            ★
                        </span>
                        <span className="pointer-events-none absolute inset-0 select-none overflow-hidden text-accent-hover"
                            style={{ width: `${fillPercent}%` }}
                        >
                            ★
                        </span>
                        <button
                            type="button"
                            aria-label={`Rate ${star - 0.5} stars`}
                            disabled={disabled}
                            onClick={() => onChange(star - 0.5)}
                            onMouseEnter={() => setHovered(star - 0.5)}
                            className="absolute inset-y-0 left-0 w-1/2 disabled:cursor-not-allowed"
                        />
                        <button
                            type="button"
                            aria-label={`Rate ${star} stars`}
                            disabled={disabled}
                            onClick={() => setHovered(star)}
                            className="absolute inset-y-0 right-0 w-1/2 disabled:cursor-not-allowed"
                        />
                    </div>
                );
            })}
        </div>
    )
}