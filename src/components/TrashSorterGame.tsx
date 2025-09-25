import { useMemo, useRef, useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import GameOver from "./GameOver";
import type { Material, TrashItem } from "../game/types";

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

// types moved to src/game/types

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

export default function TrashSorterPark() {
    const initialItems: TrashItem[] = useMemo(
        () => [
            {
                id: "plastic_1",
                type: "plastic",
                src: plasticBottle,
                alt: "Plastic bottle",
                sorted: false,
            },
            {
                id: "plastic_2",
                type: "plastic",
                src: plasticBag,
                alt: "Plastic bag",
                sorted: false,
            },
            {
                id: "paper_1",
                type: "paper",
                src: paperBag1,
                alt: "Paper bag 1",
                sorted: false,
            },
            {
                id: "paper_2",
                type: "paper",
                src: paperBag2,
                alt: "Paper bag 2",
                sorted: false,
            },
            {
                id: "metal_1",
                type: "metal",
                src: metalCan1,
                alt: "Metal can 1",
                sorted: false,
            },
            {
                id: "metal_2",
                type: "metal",
                src: metalCan2,
                alt: "Metal can 2",
                sorted: false,
            },
            {
                id: "glass_1",
                type: "glass",
                src: glassBottle,
                alt: "Glass bottle",
                sorted: false,
            },
            {
                id: "glass_2",
                type: "glass",
                src: glassJar,
                alt: "Glass jar",
                sorted: false,
            },
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

    // Reuse audio instances
    const correctSoundRef = useRef<HTMLAudioElement | null>(null);
    const wrongSoundRef = useRef<HTMLAudioElement | null>(null);

    if (!correctSoundRef.current) correctSoundRef.current = new Audio(dingMp3);
    if (!wrongSoundRef.current) wrongSoundRef.current = new Audio(oomphMp3);

    useEffect(() => {
        if (items.every((i) => i.sorted) && !gameOver) {
            setGameOver(true);
        }
    }, [items, gameOver]);

    const play = (audio: HTMLAudioElement | null) => {
        if (!audio) return;
        audio.currentTime = 0;
        void audio.play();
    };

    const handleCorrectDrop = (material: Material, droppedId: string) => {
        // Mark item as sorted
        setItems((prev) =>
            prev.map((item) =>
                item.id === droppedId ? { ...item, sorted: true } : item,
            ),
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
        setBinGlow((bg) => ({ ...bg, [material]: "error" }));
        setTimeout(
            () => setBinGlow((bg) => ({ ...bg, [material]: undefined })),
            1000,
        );
        play(wrongSoundRef.current);
    };

    // onDrop is unused with react-dnd but kept for fallback; react-dnd handlers below perform drops

    const materials: Material[] = ["plastic", "paper", "metal", "glass"];

    // Helper drag-and-drop components using react-dnd
    function DraggableTrash({ item }: { item: TrashItem }) {
        const [{ isDragging }, dragRef] = useDrag(() => ({
            type: item.type,
            item: { id: item.id, type: item.type },
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }));

        return (
            <div
                id={item.id}
                ref={dragRef as unknown as React.Ref<HTMLDivElement>}
                className={`trash w-[120px] h-[120px] cursor-grab text-center flex items-center justify-center ${
                    isDragging ? "opacity-60 scale-95" : ""
                } ${item.sorted ? "opacity-0" : ""}`}
            >
                <img
                    src={item.src}
                    alt={item.alt}
                    className="max-w-[100px] max-h-[100px]"
                />
            </div>
        );
    }

    function BinDropTarget({
        mat,
        binGlow,
        infoByBin,
        onDropCorrect,
        onDropWrong,
    }: {
        mat: Material;
        binGlow: Partial<Record<Material, "success" | "error">>;
        infoByBin: Partial<Record<Material, string>>;
        onDropCorrect: (droppedId: string) => void;
        onDropWrong: () => void;
    }) {
        const [{ isOver, draggedItem }, dropRef] = useDrop(() => ({
            accept: ["plastic", "paper", "metal", "glass"],
            drop: (dropped: { id: string; type: Material }) => {
                if (dropped.type === mat) onDropCorrect(dropped.id);
                else onDropWrong();
                return undefined;
            },
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
                draggedItem: monitor.getItem() as { type: Material } | null,
            }),
        }));

        const isCorrectBin = isOver && draggedItem && draggedItem.type === mat;
        const isWrongBin = isOver && draggedItem && draggedItem.type !== mat;

        return (
            <div
                ref={dropRef as unknown as React.Ref<HTMLDivElement>}
                id={`${mat}-bin`}
                className={`bin w-[150px] min-h-[150px] flex items-center justify-center relative rounded-lg flex-col transition-all duration-200 ${
                    binGlow[mat] === "success"
                        ? "shadow-[0_0_20px_5px_rgba(0,107,0,1)] border-[3px] border-green-500"
                        : ""
                } ${
                    binGlow[mat] === "error"
                        ? "shadow-[0_0_20px_5px_rgba(220,53,69,0.7)] border-[3px] border-red-500"
                        : ""
                } ${
                    isCorrectBin
                        ? "shadow-[0_0_20px_5px_rgba(0,107,0,1)] border-[3px] border-green-500 scale-105"
                        : ""
                } ${
                    isWrongBin
                        ? "shadow-[0_0_20px_5px_rgba(220,53,69,0.7)] border-[3px] border-red-500 scale-105"
                        : ""
                }`}
            >
                <img
                    src={binImages[mat]}
                    alt={`${mat} bin`}
                    className="w-full h-auto"
                />
                <div
                    className="info-box hidden w-11/12 text-center bg-black/70 text-white p-2 rounded text-sm mt-2.5"
                    style={{ display: infoByBin[mat] ? "block" : "none" }}
                >
                    {infoByBin[mat]}
                </div>
            </div>
        );
    }

    const restartGame = () => {
        setItems(
            initialItems.map((i) => ({
                ...i,
                sorted: false,
            })),
        );
        setScore(0);
        setSortedCounts({
            plastic: 0,
            paper: 0,
            metal: 0,
            glass: 0,
        });
        setGameOver(false);
        setBinGlow({});
        setInfoByBin({});
    };

    const GameOverView = () => (
        <GameOver score={score} onRestart={restartGame} />
    );

    return (
        <div className="trash-sorter-wrapper w-full flex flex-col h-full">
            {gameOver ? (
                <GameOverView />
            ) : (
                <>
                    <div className="fixed top-2.5 right-2.5 bg-white/80 px-8 py-4 rounded-lg shadow-lg text-xl font-bold text-black min-w-[120px]">
                        Score: <Badge variant="secondary" id="score">{score}</Badge>
                    </div>
                    <h1 className="mt-2 mb-3 text-center game-title text-5xl sm:text-6xl">
                        Trash Sorter Park
                        <span aria-hidden className="sparkle" />
                    </h1>

                    <div id="game-area">
                        <div id="trash-container">
                            {items.map((item) => (
                                <DraggableTrash key={item.id} item={item} />
                            ))}
                        </div>
                        <div id="bins-container">
                            {materials.map((mat) => (
                                <BinDropTarget
                                    key={mat}
                                    mat={mat}
                                    binGlow={binGlow}
                                    infoByBin={infoByBin}
                                    onDropCorrect={(droppedId: string) =>
                                        handleCorrectDrop(mat, droppedId)
                                    }
                                    onDropWrong={() => handleWrongDrop(mat)}
                                />
                            ))}
                        </div>
                    </div>
                    <p className="pb-6 text-center game-subtitle text-base sm:text-lg bg-white/80 rounded-t-lg shadow-lg font-bold text-black p-4">
                        Drag each item into the correct recycling bin!
                    </p>
                </>
            )}
        </div>
    );
}
