export default function GameOver({
    score,
    onRestart,
    onLevels,
}: {
    score: number;
    onRestart: () => void;
    onLevels?: () => void;
}) {
    return (
        <div className="game-over text-center flex flex-col items-center justify-center min-h-screen space-y-12 px-4">
            <h2 className="text-6xl font-extrabold text-green-600">Well Done!</h2>

            <div className="space-y-4">
                <p className="text-3xl font-semibold">
                    Your Final Score: <span className="text-blue-600">{score}</span>
                </p>
            </div>

            <div className="flex gap-4 flex-wrap items-center justify-center">
                <button
                    onClick={onRestart}
                    className="inline-flex items-center justify-center px-10 py-4 bg-green-500 text-white rounded-full hover:bg-green-600 text-2xl font-extrabold shadow-2xl transform hover:scale-105 transition-all duration-200 min-w-[220px]"
                >
                    <span className="mr-2 text-2xl">♻️</span>
                    <span>Play Again</span>
                </button>

                {onLevels && (
                    <button
                        onClick={onLevels}
                        className="inline-flex items-center justify-center px-10 py-4 bg-cyan-500 text-blue-950 rounded-full hover:bg-cyan-400 text-2xl font-extrabold shadow-2xl transform hover:scale-105 transition-all duration-200 min-w-[220px]"
                    >
                        Levels
                    </button>
                )}
            </div>
        </div>
    );
}
