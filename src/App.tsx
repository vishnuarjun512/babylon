import Configurator from "./Babylon/Configurator";
import BabylonScene from "./BabylonScene";
import THREE from "./THREE";

function App() {
  return (
    <>
      <div className="max-h-screen relative overflow-hidden">
        <Configurator />
        <BabylonScene />
      </div>
      {/* <THREE /> */}
    </>
  );
}

export default App;
