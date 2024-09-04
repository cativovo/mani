import { Greet } from "@wails/go/main/App";
import { useState } from "react";
import "./App.css";
import { Button } from "@/components/shadcn/button";

function App() {
  const [resultText, setResultText] = useState(
    "Please enter your name below 👇",
  );
  const [name, setName] = useState("");
  const updateName = (e: any) => setName(e.target.value);
  const updateResultText = (result: string) => setResultText(result);

  function greet() {
    Greet(name).then(updateResultText);
  }

  return (
    <div>
      <div className="text-red-600">{resultText}</div>
      <div>
        <input
          onChange={updateName}
          autoComplete="off"
          name="input"
          type="text"
        />
        <Button onClick={greet}>Greet</Button>
      </div>
    </div>
  );
}

export default App;
