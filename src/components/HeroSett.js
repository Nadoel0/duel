import React, { useState } from 'react';

const HeroSett = ({ hero, onUpdate }) => {
    const [speed, setSpeed] = useState(hero.speed);
    const [cooldown, setCooldown] = useState(hero.colldown);
    const [spellColor, setSpellColor] = useState(hero.spellColor);

    const handleSpeedChange = (event) => {
        setSpeed(Number(event.target.value));
        onUpdate({ ...hero, speed: Number(event.target.value) });
    }

    const handleCooldownChange = (event) => {
        setCooldown(Number(event.target.value));
        onUpdate({ ...hero, colldown: Number(event.target.value) });
    }

    const handleSpellColorChange = (event) => {
        setSpellColor(Number(event.target.value));
        onUpdate({ ...hero, spellColor: Number(event.target.value) });
    }

    return (
        <div>
            <h3></h3>
            <div>
                <label>Скорость передвижения: </label>
                <input type='range' min={1} max={5} value={speed} onChange={handleSpeedChange}/>
                <span>{speed}</span>
            </div>
            <div>
                <label>Частота стрельбы (мс): </label>
                <input type='range' min={500} max={2000} value={cooldown} onChange={handleCooldownChange}/>
                <span>{cooldown} мс</span>
            </div>
            <div>
                <label>Цвет заклинаний: </label>
                <input type='color' value={spellColor} onChange={handleSpellColorChange}/>
            </div>
        </div>
    );
};

export default HeroSett;