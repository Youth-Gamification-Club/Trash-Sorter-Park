import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

export function RootWithBodyClass() {
    useEffect(() => {
        document.body.classList.add("trash-sorter-body");
        return () => document.body.classList.remove("trash-sorter-body");
    }, []);
    return <App />;
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RootWithBodyClass />
    </StrictMode>,
);
