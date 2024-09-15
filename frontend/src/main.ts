import "./app.css";
import App from "./App.svelte";
import "./monaco-worker";

const app = new App({
  target: document.getElementById("app")!,
});

export default app;
