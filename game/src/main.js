import { createGame, update } from './world.js';
import { drawGame } from './render.js';
import { attachInput } from './input.js';
import { SoundEngine } from './audio.js';
import { ParticleSystem } from './particles.js';
import { applyShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const audio = new SoundEngine();
const particles = new ParticleSystem();
const game = createGame(12345);

const mouse = attachInput(canvas, game, audio);

// Check URL params for screenshot / shot mode
const urlParams = new URLSearchParams(window.location.search);
const shotName = urlParams.get('shot');
const shotSeed = parseInt(urlParams.get('seed') || '7', 10);

if (shotName) {
  applyShot(game, shotName, shotSeed);
  // Render exactly one frame and stop
  requestAnimationFrame(() => {
    drawGame(ctx, game, mouse, particles);
  });
} else {
  // Normal game loop
  let lastTime = performance.now();
  const maxDt = 0.1;

  function gameLoop(now) {
    let dt = (now - lastTime) / 1000;
    lastTime = now;
    if (dt > maxDt) dt = maxDt;

    // Update world
    update(game, dt);
    particles.update(dt);

    // Audio triggers handling
    if (game.audioTriggers.chop) audio.chop();
    if (game.audioTriggers.ding) audio.ding();
    if (game.audioTriggers.error) audio.error();
    if (game.audioTriggers.tick) audio.tick();
    if (game.audioTriggers.confetti) particles.spawnConfetti();
    if (game.audioTriggers.servePop !== null) audio.servePop(game.audioTriggers.servePop);
    audio.updateSizzle(game.audioTriggers.activeSizzles);

    // Render
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGame(ctx, game, mouse, particles);
    particles.draw(ctx);

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
}
