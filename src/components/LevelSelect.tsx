type Level = {
    id: "park" | "ocean" | "reef";
    title: string;
    status: "playable" | "coming-soon";
    description: string;
};

export default function LevelSelect({
    onSelect,
}: {
    onSelect: (levelId: Level["id"]) => void;
}) {
    const levels: Level[] = [
        {
            id: "park",
            title: "Park Cleanup",
            status: "playable",
            description: "Sort trash in the park and keep nature green!",
        },
        {
            id: "ocean",
            title: "Ocean Cleanup",
            status: "coming-soon",
            description: "Dive into the deep blue to save marine life.",
        },
        {
            id: "reef",
            title: "Reef Rescue",
            status: "coming-soon",
            description: "Protect the coral reefs from pollution.",
        },
    ];

    return (
        <div className="min-h-screen w-full levels-bg text-blue-100 flex flex-col items-center justify-start">
            <header className="w-full px-6 sm:px-10 pt-10 pb-4 text-center">
                <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight drop-shadow-[0_0_20px_rgba(56,189,248,0.35)]">
                    Cleansweep Saga
                </h1>
                <p className="mt-3 text-blue-200/90 text-lg">
                    Choose your mission
                </p>
            </header>

            <main className="w-full max-w-6xl px-6 sm:px-10 pb-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
                    {levels.map((lvl) => (
                        <button
                            key={lvl.id}
                            onClick={() => onSelect(lvl.id)}
                            className={`group relative rounded-2xl p-6 text-left backdrop-blur-xl border transition-all duration-200 overflow-hidden ${
                                lvl.status === "playable"
                                    ? "bg-white/10 border-cyan-400/30 hover:scale-[1.02] hover:shadow-[0_10px_40px_-10px_rgba(34,211,238,0.45)]"
                                    : "bg-white/5 border-white/10 opacity-80 cursor-pointer hover:scale-[1.01]"
                            }`}
                            aria-label={`${lvl.title} ${lvl.status === "coming-soon" ? "(Coming soon)" : ""}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-blue-600/10 pointer-events-none" />
                            <div className="relative">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-2xl font-bold text-blue-50">
                                        {lvl.title}
                                    </h3>
                                    {lvl.status === "playable" ? (
                                        <span className="text-xs font-semibold uppercase bg-cyan-400/20 border border-cyan-300/40 text-cyan-100 px-2 py-1 rounded-full">
                                            Level 1
                                        </span>
                                    ) : (
                                        <span className="text-xs font-semibold uppercase bg-white/10 border border-white/20 text-blue-200 px-2 py-1 rounded-full">
                                            Coming Soon
                                        </span>
                                    )}
                                </div>
                                <p className="mt-3 text-blue-200/90 leading-relaxed">
                                    {lvl.description}
                                </p>
                                <div className="mt-6">
                                    <span
                                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition ${
                                            lvl.status === "playable"
                                                ? "bg-cyan-400 text-blue-950 group-hover:bg-cyan-300"
                                                : "bg-white/10 text-blue-200"
                                        }`}
                                    >
                                        {lvl.status === "playable"
                                            ? "Play"
                                            : "Preview"}
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
}
