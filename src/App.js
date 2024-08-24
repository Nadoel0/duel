import React, { useState } from "react";
import Canvas from "./components/Canvas";
import HeroSett from "./components/HeroSett";

function App() {
  const [hero1Sett, setHero1Sett] = useState({
    speed: 2,
    cooldown: 1000,
    spellColor: 'violet'
  });

  const [hero2Sett, setHero2Sett] = useState({
    speed: 2,
    cooldown: 1000,
    spellColor: 'orange'
  })

  return (
    <div className="App">
      <Canvas hero1Sett={hero1Sett} hero2sett={hero2Sett}/>
      <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
        <HeroSett hero={hero1Sett} onUpdate={setHero1Sett}/>
        <HeroSett hero={hero2Sett} onUpdate={setHero2Sett}/>
      </div>
    </div>
  );
}

export default App;
