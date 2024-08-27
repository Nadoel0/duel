import React, { useRef, useEffect } from 'react';

const Canvas = ({ hero1Sett, hero2Sett }) => {
    const canvasRef = useRef(null);
    const heroRadius = 20;
    const spellRadius = 5;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let hero1 = {
            x: heroRadius,
            y: canvas.height / 2,
            speed: hero1Sett.speed,
            direction: 1,
            spellColor: hero1Sett.spellColor,
            cooldown: hero1Sett.cooldown,
            lastShot: 0,
            lastMouseBounce: 0,
            mouseBounceCooldown: 1000,
        };

        let hero2 = {
            x: canvas.width - heroRadius,
            y: canvas.height / 2,
            speed: hero2Sett.speed,
            direction: 1,
            spellColor: hero2Sett.spellColor,
            cooldown: hero2Sett.cooldown,
            lastShot: 0,
            lastMouseBounce: 0,
            mouseBounceCooldown: 1000,
        };

        let spells = [];
        let score = { hero1: 0, hero2: 0 };

        function drawHero(hero) {
            ctx.beginPath();
            ctx.arc(hero.x, hero.y, heroRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.closePath();
        }

        function drawSpell(spell) {
            ctx.beginPath();
            ctx.arc(spell.x, spell.y, spellRadius, 0, Math.PI * 2);
            ctx.fillStyle = spell.color;
            ctx.fill();
            ctx.closePath();
        }

        function updateHero(hero) {
            hero.y += hero.speed * hero.direction;

            if (hero.y - heroRadius <= 0 || hero.y + heroRadius >= canvas.height) {
                hero.direction *= -1;
            }
        }

        function shoot(hero) {
            const now = Date.now();
            if (now - hero.lastShot >= hero.cooldown) {
                const spell = {
                    x: hero.x,
                    y: hero.y,
                    speed: 4,
                    direction: hero === hero1 ? 1 : -1,
                    color: hero.spellColor,
                };
                spells.push(spell);
                hero.lastShot = now;
            }
        }

        function updateSpells() {
            spells.forEach((spell, index) => {
                spell.x += spell.speed * spell.direction;

                if (spell.direction === 1 && spell.x + spellRadius >= hero2.x - heroRadius) {
                    if (Math.abs(spell.y - hero2.y) < heroRadius) {
                        score.hero1++;
                        spells.splice(index, 1);
                    }
                } else if (spell.direction === -1 && spell.x - spellRadius <= hero1.x + heroRadius) {
                    if (Math.abs(spell.y - hero1.y) < heroRadius) {
                        score.hero2++;
                        spells.splice(index, 1);
                    }
                }

                if (spell.x < 0 || spell.x > canvas.width) {
                    spells.splice(index, 1);
                }
            });
        }

        function drawScore() {
            ctx.font = '16px Arial';
            ctx.fillStyle = 'black';
            ctx.fillText(`Hero 1: ${score.hero1}`, 10, 20);
            ctx.fillText(`Hero 2: ${score.hero2}`, canvas.width - 80, 20);
        }

        function checkMouseProximity(hero, mouseX, mouseY) {
            const dx = mouseX - hero.x;
            const dy = mouseY - hero.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const now = Date.now();
            if (distance < heroRadius * 2 && now - hero.lastMouseBounce >= hero.mouseBounceCooldown) {
                hero.direction *= -1;
                hero.lastMouseBounce = now;
            }
        }

        function handleMouseMove(event) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            checkMouseProximity(hero1, mouseX, mouseY);
            checkMouseProximity(hero2, mouseX, mouseY);
        }

        canvas.addEventListener('mousemove', handleMouseMove);

        function gameLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            hero1.speed = hero1Sett.speed;
            hero1.spellColor = hero1Sett.spellColor;
            hero1.cooldown = hero1Sett.cooldown;

            hero2.speed = hero2Sett.speed;
            hero2.spellColor = hero2Sett.spellColor;
            hero2.cooldown = hero2Sett.cooldown;

            updateHero(hero1);
            updateHero(hero2);
            shoot(hero1);
            shoot(hero2);
            updateSpells();

            drawHero(hero1);
            drawHero(hero2);
            spells.forEach(drawSpell);
            drawScore();

            requestAnimationFrame(gameLoop);
        }

        gameLoop();

        return () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, [hero1Sett, hero2Sett]);

    return (
        <canvas ref={canvasRef} width={800} height={400} />
    );
};

export default Canvas;
