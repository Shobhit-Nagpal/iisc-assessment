import { useState } from "react";
import { Map } from "./components/map";
import { LocationSearch } from "./components/location-search";
import { Toaster } from "./components/ui/toaster";

function App() {
  const [coords, setCoords] = useState<number[][]>([]);
  const [altCoords, setAltCoords] = useState<number[][][]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<"input" | "click">("input");

  return (
    <main className="min-h-screen flex flex-col">
      <div className="relative flex-1">
        <Map
          mode={mode}
          path={coords}
          onLoading={setLoading}
          altPaths={altCoords}
          onCoordinatesChange={setCoords}
          onAltCoordinatesChange={setAltCoords}
        />
        <div className="absolute inset-x-0 top-0 z-[99999]">
          <LocationSearch
            path={coords}
            loading={loading}
            onLoading={setLoading}
            onModeChange={setMode}
            onCoordinatesChange={setCoords}
            onAltCoordinatesChange={setAltCoords}
          />
        </div>
      </div>
      <Toaster />
    </main>
  );
}

export default App;
