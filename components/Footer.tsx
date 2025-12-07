/**
 * Created by: Jude Hosmer + Charlie Howard
 * Simple footer with dynamic year and tech credits.
 */
export default function Footer() {
    return (
        <footer className="mt-12 w-full border-t border-slate-800 bg-[#0f1318]">
            <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-slate-400">
                {/* Keep year in sync automatically */}
                <p>© {new Date().getFullYear()} FilmFlow — Built for CS391</p>
                <p className="mt-1">
                    Powered by <span className="font-semibold text-slate-200">Next.js</span> &{" "}
                    <span className="font-semibold text-slate-200">TMDB API</span>
                </p>
            </div>
        </footer>
    );
}
