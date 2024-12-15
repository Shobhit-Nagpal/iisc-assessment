import { useState } from "react";
import { Map } from "./components/map";
import { LocationSearch } from "./components/location-search";
import { Toaster } from "./components/ui/toaster";

function App() {
  const [coords, setCoords] = useState<number[][]>([]);
  const [altCoords, setAltCoords] = useState<number[][][]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<"input" | "click">("input");
  const [origin, setOrigin] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);

  return (
    <main className="min-h-screen flex flex-col">
      <div className="relative flex-1">
        <Map
          mode={mode}
          origin={origin}
          destination={destination}
          path={coords}
          onLoading={setLoading}
          altPaths={altCoords}
          onCoordinatesChange={setCoords}
          onAltCoordinatesChange={setAltCoords}
          onOriginChange={setOrigin}
          onDestinationChange={setDestination}
        />
        <div className="absolute inset-x-0 top-0 z-[99999]">
          <LocationSearch
            origin={origin}
            destination={destination}
            loading={loading}
            onLoading={setLoading}
            onModeChange={setMode}
            onCoordinatesChange={setCoords}
            onAltCoordinatesChange={setAltCoords}
            onOriginChange={setOrigin}
            onDestinationChange={setDestination}
          />
        </div>
      </div>
      <Toaster />
    </main>
  );
}

export default App;
