"use client"

import { useState } from "react";

function StarIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
    );
}

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
                    <div key={star} className="relative h-6.5 w-6.5">
                        <StarIcon className="absolute inset-0 h-full w-full text-[#e2cdd2]" />

                        <div
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: `${fillPercent}%` }}
                        >
                            <StarIcon className="h-6.5 w-6.5 text-accent-hover" />
                        </div>

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
                            onClick={() => onChange(star)}
                            onMouseEnter={() => setHovered(star)}
                            className="absolute inset-y-0 right-0 w-1/2 disabled:cursor-not-allowed"
                        />
                    </div>
                );
            })}
        </div>
    )
}