import "./App.css";
import TrashSorterPark from "./components/TrashSorterPark";
import LevelSelect from "./components/LevelSelect";
import PlaceholderLevel from "./components/PlaceholderLevel";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

export default function App() {
    const [view, setView] = useState<"menu" | "park" | "ocean" | "reef">(
        "menu",
    );

    const renderView = () => {
        switch (view) {
            case "park":
                return <TrashSorterPark />;
            case "ocean":
                return (
                    <PlaceholderLevel
                        title="Ocean Cleanup — Coming Soon"
                        onBack={() => setView("menu")}
                    />
                );
            case "reef":
                return (
                    <PlaceholderLevel
                        title="Reef Rescue — Coming Soon"
                        onBack={() => setView("menu")}
                    />
                );
            default:
                return <LevelSelect onSelect={(lvl) => setView(lvl)} />;
        }
    };

    const isPark = view === "park";

    return (
        <div
            className={
                isPark
                    ? "h-full w-full bg-[url('/images/background.jpg')] bg-cover bg-center bg-no-repeat flex flex-col items-stretch justify-start text-black"
                    : "min-h-screen w-full bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-900 flex flex-col items-stretch justify-start text-blue-100"
            }
        >
            {renderView()}
            <Toaster />
        </div>
    );
}
