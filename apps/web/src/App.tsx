import { useState } from "react";
import { Map } from "./components/map";
import { Navbar } from "./components/navbar";
import { LocationSearch } from "./components/location-search";

function App() {
  const [coords, setCoords] = useState<number[][]>([]);
  return (
    <>
      <Navbar />
      <LocationSearch onCoordinatesChange={setCoords} />
      <Map path={coords}/>
    </>
  );
}

export default App;
