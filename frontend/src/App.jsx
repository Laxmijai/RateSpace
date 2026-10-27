import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function App() {
  const [message, setMessage] = useState("Checking server...");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    async function checkServer() {
      try {
        const response = await fetch(`${API_URL}/health`);

        if (!response.ok) {
          throw new Error("Server returned an error");
        }

        const data = await response.json();

        setMessage(data.message);
        setIsConnected(true);
      } catch (error) {
        setMessage("Could not connect to the backend.");
        setIsConnected(false);
        console.error("Backend connection failed:", error);
      }
    }

    checkServer();
  }, []);

  return (
    <main style={{ fontFamily: "Arial, sans-serif", padding: "40px" }}>
      <h1>RateSpace</h1>

      <p>A simple platform for rating stores.</p>

      <p>
        Backend status:{" "}
        <strong>{isConnected ? "Connected" : "Not connected"}</strong>
      </p>

      <p>{message}</p>
    </main>
  );
}

export default App;