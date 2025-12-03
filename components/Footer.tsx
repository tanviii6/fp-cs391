
export default function Footer() {
    return (
        <footer className="w-full border-t bg-white mt-12">
            <div className="max-w-6xl mx-auto p-4 text-center text-sm text-gray-500">
                <p>© {new Date().getFullYear()} FilmFlow — Built for CS391</p>
                <p className="mt-1">
                    Powered by <span className="font-semibold">Next.js</span> &{" "}
                    <span className="font-semibold">TMDB API</span>
                </p>
            </div>
        </footer>
    );
}
