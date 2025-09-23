import "./App.css";
import TrashSorterGame from "./components/TrashSorterGame";

export default function App() {
    return (
        <div
            className="trash-sorter-wrapper"
            style={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <TrashSorterGame />
        </div>
    );
}
