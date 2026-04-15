import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { startWebsocketClient } from './lib/ws';

createRoot(document.getElementById("root")!).render(<App />);

// start websocket client for live demo (non-blocking)
startWebsocketClient();
