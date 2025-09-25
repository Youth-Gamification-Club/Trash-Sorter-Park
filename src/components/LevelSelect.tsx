import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
            <header className="w-full px-6 sm:px-10 pt-20 sm:pt-24 pb-8 text-center">
                <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight drop-shadow-[0_0_20px_rgba(56,189,248,0.35)]">
                    Cleansweep Saga
                </h1>
                <p className="mt-6 sm:mt-8 text-blue-200/90 text-lg">
                    Choose your mission
                </p>
            </header>

            <main className="w-full max-w-6xl px-6 sm:px-10 pb-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {levels.map((lvl) => (
                        <Card
                            key={lvl.id}
                            className={`group relative text-center backdrop-blur-xl transition-all duration-200 overflow-hidden gap-8 p-0 shadow-xl border-2 flex flex-col ${
                                lvl.status === "playable"
                                    ? "bg-white/10 border-cyan-400/40 hover:scale-[1.025] hover:shadow-[0_10px_40px_-10px_rgba(34,211,238,0.55)]"
                                    : "bg-white/5 border-white/10 opacity-80 cursor-pointer hover:scale-[1.01]"
                            }`}
                            onClick={
                                lvl.status === "coming-soon"
                                    ? () => onSelect(lvl.id)
                                    : undefined
                            }
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-blue-600/10 pointer-events-none" />
                            <CardHeader className="relative px-8 sm:px-10 pt-10 sm:pt-12 pb-5">
                                <div className="flex flex-col items-center gap-3">
                                    <CardTitle className="text-2xl font-bold text-blue-50 text-center">
                                        {lvl.title}
                                    </CardTitle>
                                    {lvl.status === "playable" ? (
                                        <Badge
                                            variant="secondary"
                                            className="text-base font-semibold uppercase tracking-wide bg-cyan-400/20 border border-cyan-300/40 text-cyan-100 px-6 py-2.5 rounded-full whitespace-nowrap"
                                        >
                                            Level 1
                                        </Badge>
                                    ) : (
                                        <Badge
                                            variant="outline"
                                            className="text-base font-semibold uppercase tracking-wide bg-white/10 border border-white/20 text-blue-200 px-6 py-2.5 rounded-full whitespace-nowrap"
                                        >
                                            Coming Soon
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="relative flex flex-col flex-1 px-8 sm:px-10 pb-10 pt-6 items-center text-center gap-7">
                                <p className="text-blue-200/90 leading-relaxed text-base">
                                    {lvl.description}
                                </p>
                                <div className="mt-auto w-full -mx-8 sm:-mx-10 -mb-10">
                                    <Button
                                        onClick={
                                            lvl.status === "playable"
                                                ? () => onSelect(lvl.id)
                                                : undefined
                                        }
                                        variant={
                                            lvl.status === "playable"
                                                ? "default"
                                                : "secondary"
                                        }
                                        className={`inline-flex items-center gap-2 px-7 py-3 text-base font-bold transition w-full justify-center rounded-none ${
                                            lvl.status === "playable"
                                                ? "bg-cyan-400 text-blue-950 hover:bg-cyan-300"
                                                : "bg-white/10 text-blue-200 hover:bg-white/20"
                                        }`}
                                        style={{
                                            minHeight: 48,
                                        }}
                                    >
                                        {lvl.status === "playable"
                                            ? "Play"
                                            : "Preview"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
