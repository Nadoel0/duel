import React, { useRef, useEffect } from 'react';

const Canvas = ({ hero1Sett, hero2sett }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const heroRad = 20;
        const spellRad = 5;

        let hero1 = {
            x: heroRad,
            y: canvas.height/2,
            speed: hero1Sett.speed,
            direction: 1,
            spellColor: hero1Sett.spellColor,
            cooldown: hero1Sett.cooldown,
            lastShot: 0
        }

        let hero2 = {
            x: canvas.width - heroRad,
            y: canvas.height/2,
            speed: hero2sett.speed,
            direction: -1,
            spellColor: hero2sett.spellColor,
            cooldown: hero2sett.cooldown,
            lastShot: 0
        }

        let spells = [];
        let score = { hero1: 0, hero2: 0 };

        function drawHero(hero) {
            ctx.beginPath();
            ctx.arc(hero.x, hero.y, heroRad, 0, Math.PI * 2);
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.closePath();
        }

        function drawSpell(spell) {
            ctx.beginPath();
            ctx.arc(spell.x, spell.y, spellRad, 0, Math.PI * 2);
            ctx.fillStyle = spell.color;
            ctx.fill();
            ctx.closePath();
        }

        function updateHero(hero) {
            hero.y += hero.speed * hero.direction;

            if (hero.y - heroRad <= 0 || hero.y + heroRad >= canvas.height) hero.direction *= -1;
        }

        function shoot(hero) {
            const now = Date.now();
            if (now - hero.lastShot >= hero.cooldown) {
                const spell = {
                    x: hero.x,
                    y: hero.y,
                    speed: 4,
                    direction: hero === hero1 ? 1 : -1,
                    color: hero.spellColor
                }
                spells.push(spell);
                hero.lastShot = now;
            }
        }

        function updateSpeel(spell) {
            spells.forEach((spell, index) => {
                spell.x += spell.speed * spell.direction;

                if (spell.direction === 1 && spell.x + spellRad >= hero2.x - heroRad) {
                    if (Math.abs(spell.y - hero2.y) < heroRad) {
                        score.hero1++;
                        spells.splice(index, 1);
                    }
                } else if (spell.direction === -1 && spell.x - spellRad <= hero1.x + heroRad) {
                    if (Math.abs(spell.y - hero1.y) < heroRad) {
                        score.hero2++;
                        spells.splice(index, 1)
                    }
                } 

                if (spell.x < 0 || spell.x > canvas.width) spells.splice(index, 1);
            });
        }

        function drawScore() {
            ctx.font = '16px Arial';
            ctx.fillStyle = 'black';
            ctx.fillText(`Hero 1: ${score.hero1}`, 10, 20);
            ctx.fillText(`Hero 2: ${score.hero2}`, canvas.width - 80, 20);
        }

        function gameLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            updateHero(hero1);
            updateHero(hero2);
            shoot(hero1);
            shoot(hero2);
            updateSpeel();

            drawHero(hero1);
            drawHero(hero2);
            spells.forEach(drawSpell);
            drawScore();

            requestAnimationFrame(gameLoop)
        }

        gameLoop()
    }, [hero1Sett, hero2sett]);

    return (
        <canvas ref={canvasRef} width={800} height={400} />
    );
};

export default Canvas;