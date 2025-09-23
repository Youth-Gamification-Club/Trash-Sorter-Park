import "./App.css";
import TrashSorterGame from "./components/TrashSorterGame";
import { Toaster } from "react-hot-toast";

export default function App() {
    return (
        <div className="min-h-[100dvh] min-w-[100vw] w-full bg-[url('/images/background.jpg')] bg-cover bg-center bg-no-repeat flex flex-col items-stretch justify-start text-black overflow-hidden">
            <TrashSorterGame />
            <Toaster />
        </div>
    );
}
