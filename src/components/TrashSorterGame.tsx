import React, { useMemo, useRef, useState } from "react";

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

    // Reuse audio instances
    const correctSoundRef = useRef<HTMLAudioElement | null>(null);
    const wrongSoundRef = useRef<HTMLAudioElement | null>(null);

    if (!correctSoundRef.current) correctSoundRef.current = new Audio(dingMp3);
    if (!wrongSoundRef.current) wrongSoundRef.current = new Audio(oomphMp3);

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
                alert(`Bonus! You sorted all ${material} items!`);
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

    return (
        <div className="trash-sorter-wrapper">
            <div id="scoreboard">
                Score: <span id="score">{score}</span>
            </div>
            <h1>Trash Sorter Park</h1>
            <p>Drag each item into the correct recycling bin!</p>

            <div id="game-area">
                <div className="trash-row">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            id={item.id}
                            className="trash"
                            draggable
                            onDragStart={(e) => onDragStart(e, item.id)}
                            onDragEnd={onDragEnd}
                        >
                            <img src={item.src} alt={item.alt} />
                        </div>
                    ))}
                </div>

                <div className="bins-row">
                    {materials.map((mat) => (
                        <div
                            key={mat}
                            id={`${mat}-bin`}
                            className={`bin ${binGlow[mat] === "success" ? "success-bin" : ""} ${binGlow[mat] === "error" ? "error-bin" : ""}`}
                            onDragOver={onDragOver}
                            onDrop={(e) => onDrop(e, mat)}
                        >
                            <img src={binImages[mat]} alt={`${mat} bin`} />
                            <div
                                className="info-box"
                                style={{
                                    display: infoByBin[mat]
                                        ? ("block" as const)
                                        : "none",
                                }}
                            >
                                {infoByBin[mat]}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
