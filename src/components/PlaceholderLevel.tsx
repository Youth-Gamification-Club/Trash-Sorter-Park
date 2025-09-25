import { Button } from "@/components/ui/button";

export default function PlaceholderLevel({
    title,
    onBack,
}: {
    title: string;
    onBack: () => void;
}) {
    return (
        <div className="min-h-screen w-full levels-bg text-blue-100 flex flex-col items-center justify-center px-6">
            <div className="max-w-2xl w-full text-center bg-white/10 border border-white/15 rounded-3xl p-10 backdrop-blur-xl shadow-[0_10px_60px_-10px_rgba(56,189,248,0.4)] overflow-hidden">
                <h2 className="text-4xl sm:text-5xl font-extrabold drop-shadow-[0_0_18px_rgba(56,189,248,0.35)] text-balance">
                    {title}
                </h2>
                <p className="mt-6 text-blue-200/90 leading-relaxed">
                    This mission is under construction. Check back soon and keep
                    the planet shining in the meantime.
                </p>

                <div className="mt-10 -mx-10 -mb-10">
                    <Button
                        onClick={onBack}
                        className="inline-flex items-center justify-center w-full px-6 py-4 min-h-12 rounded-none font-bold bg-cyan-400 text-blue-950 hover:bg-cyan-300 transition border-t border-white/15"
                    >
                        Back to Levels
                    </Button>
                </div>
            </div>
        </div>
    );
}
