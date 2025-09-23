import React, { useMemo, useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";

// Asset imports (relative paths so Vite bundles them)
import plasticBottle from "/images/plastic_bottle.png";
import plasticBag from "/images/plastic_bag.png";
import paperBag1 from "/images/paper_bag_1.png";
import paperBag2 from "/images/paper_bag_2.png";
import metalCan1 from "/images/metal_can_1.png";
import metalCan2 from "/images/metal_can_2.png";
import glassBottle from "/images/glass_bottle.png";
import glassJar from "/images/glass_jar.png";

import plasticBinImg from "/images/plastic-bin.png";
import paperBinImg from "/images/paper-bin.png";
import metalBinImg from "/images/metal-bin.png";
import glassBinImg from "/images/glass-bin.png";

import dingMp3 from "/sounds/ding.mp3";
import oomphMp3 from "/sounds/oomph.mp3";

type Material = "plastic" | "paper" | "metal" | "glass";

type TrashItem = {
    id: string;
    type: Material;
    src: string;
    alt: string;
};

const materialInfo: Record<Material, [string, string]> = {
    plastic: [
        "Plastic takes hundreds of years to decompose.",
        "Recycling helps reduce pollution!",
    ],
    paper: [
        "Paper is made from trees.",
        "Recycling saves forests and reduces waste.",
    ],
    metal: [
        "Metal is highly recyclable.",
        "It can be melted and reused many times.",
    ],
    glass: [
        "Glass is 100% recyclable.",
        "It can be reused without losing quality.",
    ],
};

const binImages: Record<Material, string> = {
    plastic: plasticBinImg,
    paper: paperBinImg,
    metal: metalBinImg,
    glass: glassBinImg,
};

export default function TrashSorterGame() {
    const initialItems: TrashItem[] = useMemo(
        () => [
            {
                id: "plastic_1",
                type: "plastic",
                src: plasticBottle,
                alt: "Plastic bottle",
            },
            {
                id: "plastic_2",
                type: "plastic",
                src: plasticBag,
                alt: "Plastic bag",
            },
            {
                id: "paper_1",
                type: "paper",
                src: paperBag1,
                alt: "Paper bag 1",
            },
            {
                id: "paper_2",
                type: "paper",
                src: paperBag2,
                alt: "Paper bag 2",
            },
            {
                id: "metal_1",
                type: "metal",
                src: metalCan1,
                alt: "Metal can 1",
            },
            {
                id: "metal_2",
                type: "metal",
                src: metalCan2,
                alt: "Metal can 2",
            },
            {
                id: "glass_1",
                type: "glass",
                src: glassBottle,
                alt: "Glass bottle",
            },
            { id: "glass_2", type: "glass", src: glassJar, alt: "Glass jar" },
        ],
        [],
    );

    const totalCounts = useMemo(() => {
        return initialItems.reduce(
            (acc, i) => ({ ...acc, [i.type]: (acc[i.type] ?? 0) + 1 }),
            { plastic: 0, paper: 0, metal: 0, glass: 0 } as Record<
                Material,
                number
            >,
        );
    }, [initialItems]);

    const [items, setItems] = useState<TrashItem[]>(initialItems);
    const [score, setScore] = useState(0);
    const [, setSortedCounts] = useState<Record<Material, number>>({
        plastic: 0,
        paper: 0,
        metal: 0,
        glass: 0,
    });
    const [binGlow, setBinGlow] = useState<
        Partial<Record<Material, "success" | "error">>
    >({});
    const [infoByBin, setInfoByBin] = useState<
        Partial<Record<Material, string>>
    >({});
    const [gameOver, setGameOver] = useState(false);
    const [wrongCount, setWrongCount] = useState(0);

    // Reuse audio instances
    const correctSoundRef = useRef<HTMLAudioElement | null>(null);
    const wrongSoundRef = useRef<HTMLAudioElement | null>(null);

    if (!correctSoundRef.current) correctSoundRef.current = new Audio(dingMp3);
    if (!wrongSoundRef.current) wrongSoundRef.current = new Audio(oomphMp3);

    useEffect(() => {
        if (items.length === 0 && !gameOver) {
            setGameOver(true);
        }
    }, [items.length, gameOver]);

    const onDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
        e.dataTransfer.setData("text/plain", id);
        const target = e.currentTarget;
        target.classList.add("dragging");
    };

    const onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove("dragging");
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const play = (audio: HTMLAudioElement | null) => {
        if (!audio) return;
        audio.currentTime = 0;
        void audio.play();
    };

    const handleCorrectDrop = (material: Material, droppedId: string) => {
        // Remove item from list
        setItems((prev: TrashItem[]) =>
            prev.filter((i: TrashItem) => i.id !== droppedId),
        );

        // Score and counts
        setScore((s: number) => s + 1);
        setSortedCounts((prev: Record<Material, number>) => {
            const next: Record<Material, number> = {
                ...prev,
                [material]: prev[material] + 1,
            };

            // Info message (first or second tip)
            const infoIndex = next[material] - 1;
            setInfoByBin((ib) => ({
                ...ib,
                [material]: materialInfo[material][infoIndex],
            }));
            setTimeout(
                () => setInfoByBin((ib) => ({ ...ib, [material]: "" })),
                3000,
            );

            // Bonus if all of that material are sorted
            if (next[material] === totalCounts[material]) {
                setScore((s: number) => s + 5);
                toast.success(`Bonus! You sorted all ${material} items!`);
            }
            return next;
        });

        // Success glow
        setBinGlow((bg) => ({ ...bg, [material]: "success" }));
        setTimeout(
            () => setBinGlow((bg) => ({ ...bg, [material]: undefined })),
            500,
        );

        play(correctSoundRef.current);
    };

    const handleWrongDrop = (material: Material) => {
        setScore((s: number) => s - 1);
        setWrongCount((prev) => prev + 1);
        setBinGlow((bg) => ({ ...bg, [material]: "error" }));
        setTimeout(
            () => setBinGlow((bg) => ({ ...bg, [material]: undefined })),
            1000,
        );
        play(wrongSoundRef.current);
    };

    const onDrop = (
        e: React.DragEvent<HTMLDivElement>,
        binMaterial: Material,
    ) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("text/plain");
        const item = items.find((i) => i.id === id);
        if (!item) return;

        const trashType = (id.split("_")[0] ?? "") as Material;
        if (trashType === binMaterial) {
            handleCorrectDrop(binMaterial, id);
        } else {
            handleWrongDrop(binMaterial);
        }
    };

    const materials: Material[] = ["plastic", "paper", "metal", "glass"];

    const restartGame = () => {
        setItems(initialItems);
        setScore(0);
        setSortedCounts({
            plastic: 0,
            paper: 0,
            metal: 0,
            glass: 0,
        });
        setGameOver(false);
        setWrongCount(0);
        setBinGlow({});
        setInfoByBin({});
    };

    const GameOver = () => (
        <div className="game-over text-center flex flex-col items-center justify-center min-h-screen space-y-12 px-4">
            <h2 className="text-6xl font-extrabold text-green-600">
                Well Done!
            </h2>

            <div className="space-y-4">
                <p className="text-3xl font-semibold">
                    Your Final Score:{" "}
                    <span className="text-blue-600">{score}</span>
                </p>
                <p className="text-2xl">
                    Mistakes Made:{" "}
                    <span
                        className={
                            wrongCount === 0 ? "text-green-500" : "text-red-500"
                        }
                    >
                        {wrongCount}
                    </span>
                </p>
            </div>

            <button
                onClick={restartGame}
                className="inline-flex items-center justify-center px-16 py-8 bg-green-500 text-white rounded-full hover:bg-green-600 text-3xl font-extrabold shadow-2xl transform hover:scale-105 transition-all duration-200 min-w-[320px]"
            >
                <span className="mr-3 text-2xl">♻️</span>
                <span>Play Again</span>
            </button>
        </div>
    );

    return (
        <div className="trash-sorter-wrapper w-full">
            {gameOver ? (
                <GameOver />
            ) : (
                <>
                    <div className="fixed top-2.5 right-2.5 bg-white/80 px-8 py-4 rounded-lg shadow-lg text-xl font-bold text-black min-w-[120px]">
                        Score: <span id="score">{score}</span>
                    </div>
                    <h1 className="mt-2 mb-3 text-center game-title text-5xl sm:text-6xl">
                        Trash Sorter Park
                        <span aria-hidden className="sparkle" />
                    </h1>

                    <div className="grid grid-cols-4 auto-rows-auto gap-5 justify-items-start items-start w-full mx-auto mb-5">
                        <div className="col-span-full grid grid-cols-8 gap-5 w-full">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    id={item.id}
                                    className="trash w-[120px] h-[120px] cursor-grab text-center flex items-center justify-center"
                                    draggable
                                    onDragStart={(e) => onDragStart(e, item.id)}
                                    onDragEnd={onDragEnd}
                                >
                                    <img
                                        src={item.src}
                                        alt={item.alt}
                                        className="max-w-[100px] max-h-[100px]"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="col-span-full grid grid-cols-4 gap-5 w-full">
                            {materials.map((mat) => (
                                <div
                                    key={mat}
                                    id={`${mat}-bin`}
                                    className={`bin w-[150px] min-h-[150px] flex items-center justify-center relative rounded-lg flex-col ${
                                        binGlow[mat] === "success"
                                            ? "shadow-[0_0_20px_5px_rgba(0,107,0,1)] border-[3px] border-green-500"
                                            : ""
                                    } ${
                                        binGlow[mat] === "error"
                                            ? "shadow-[0_0_20px_5px_rgba(220,53,69,0.7)] border-[3px] border-red-500"
                                            : ""
                                    }`}
                                    onDragOver={onDragOver}
                                    onDrop={(e) => onDrop(e, mat)}
                                >
                                    <img
                                        src={binImages[mat]}
                                        alt={`${mat} bin`}
                                        className="w-full h-auto"
                                    />
                                    <div
                                        className="info-box hidden w-11/12 text-center bg-black/70 text-white p-2 rounded text-sm mt-2.5"
                                        style={{
                                            display: infoByBin[mat]
                                                ? "block"
                                                : "none",
                                        }}
                                    >
                                        {infoByBin[mat]}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="mt-0 mb-6 text-center game-subtitle text-base sm:text-lg">
                        Drag each item into the correct recycling bin!
                    </p>
                </>
            )}
        </div>
    );
}
