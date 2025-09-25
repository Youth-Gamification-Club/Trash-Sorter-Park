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
            <div className="max-w-2xl w-full text-center bg-white/10 border border-white/15 rounded-3xl p-10 backdrop-blur-xl shadow-[0_10px_60px_-10px_rgba(56,189,248,0.4)]">
                <h2 className="text-4xl sm:text-5xl font-extrabold drop-shadow-[0_0_18px_rgba(56,189,248,0.35)]">
                    {title}
                </h2>
                <p className="mt-4 text-blue-200/90">
                    This mission is under construction. Check back soon and keep the planet shining in the meantime.
                </p>

                <Button
                    onClick={onBack}
                    className="mt-8 inline-flex items-center justify-center px-6 py-3 rounded-full font-bold bg-cyan-400 text-blue-950 hover:bg-cyan-300 transition"
                >
                    Back to Levels
                </Button>
            </div>
        </div>
    );
}
