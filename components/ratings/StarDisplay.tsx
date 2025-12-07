/**
 * Created by: Jude Hosmer
 * Stateless star display component for showing ratings with support for half stars.
 */

import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

type StarDisplayProps = {
    /** Rating value on a 0–10 scale */
    rating: number;
    /** Maximum rating value, defaults to 10 to match TMDB api. */
    scale?: number;
    /** Size of each star icon in pixels. */
    size?: number;
    /** Additional classes applied to the wrapper. */
    className?: string;
};

/**
 * Stateless star display that supports half-stars by rounding to the nearest 0.5.
 */
export default function StarDisplay({
    rating,
    scale = 10,
    size = 14,
    className = "",
}: StarDisplayProps) {
    const clamped = Math.min(Math.max(rating, 0), scale);
    const scaled = (clamped / scale) * 5; // convert to 5-star scale
    const rounded = Math.round(scaled * 2) / 2; // nearest 0.5

    const fullStars = Math.floor(rounded);
    const hasHalfStar = rounded - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    /** Renders star icons based on calculated full, half, and empty stars */
    return (
        <div className={`flex items-center gap-1 text-amber-400 ${className}`}>
            {Array.from({ length: fullStars }).map((_, idx) => (
                
                <FaStar key={`full-${idx}`} size={size} aria-hidden />
            ))}
            {hasHalfStar && <FaStarHalfAlt size={size} aria-hidden />}
            {Array.from({ length: emptyStars }).map((_, idx) => (
                <FaRegStar key={`empty-${idx}`} size={size} aria-hidden />
            ))}
        </div>
    );
}
