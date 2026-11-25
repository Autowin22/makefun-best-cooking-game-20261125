import { STATIONS, INGREDIENTS } from './config.js';
import {
  startShift,
  grabIngredient,
  selectPlate,
  placeOnPlate,
  placeOnGrill,
  takeFromGrill,
  startChop,
  chopClick,
  placeOnFryer,
  takeFromFryer,
  serveSelected,
  trashHandOrPlate
} from './world.js';

export function attachInput(canvas, game, audio) {
  const mouse = { x: 0, y: 0 };

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    mouse.x = (e.clientX - rect.left) * scaleX;
    mouse.y = (e.clientY - rect.top) * scaleY;
  });

  canvas.addEventListener('click', (e) => {
    audio.init();
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (game.phase === 'title') {
      startShift(game);
      return;
    }

    if (game.phase === 'summary') {
      startShift(game);
      return;
    }

    if (game.phase === 'paused') {
      return;
    }

    if (game.phase === 'playing') {
      // Check mute button top-right
      if (x >= 1200 && x <= 1260 && y >= 16 && y <= 56) {
        audio.setMuted(!audio.muted);
        return;
      }

      // Check Pantry (x: 16..248, y: 164..764)
      if (x >= STATIONS.pantry.x && x <= STATIONS.pantry.x + STATIONS.pantry.w &&
          y >= STATIONS.pantry.y && y <= STATIONS.pantry.y + STATIONS.pantry.h) {
        const relX = x - STATIONS.pantry.x;
        const relY = y - STATIONS.pantry.y;
        const col = relX < 116 ? 0 : 1;
        const row = Math.floor(relY / 135);
        const keys = ['roti', 'daging', 'selada', 'tomat', 'keju', 'saus', 'nasi', 'telur'];
        const index = row * 2 + col;
        if (index >= 0 && index < keys.length) {
          grabIngredient(game, keys[index]);
        }
        return;
      }

      // Check Plates
      for (let i = 0; i < STATIONS.plates.length; i++) {
        const p = STATIONS.plates[i];
        if (x >= p.x && x <= p.x + p.w && y >= p.y && y <= p.y + p.h) {
          placeOnPlate(game, i);
          return;
        }
      }

      // Check Grill
      const g = STATIONS.grill;
      if (x >= g.x && x <= g.x + g.w && y >= g.y && y <= g.y + g.h) {
        const slotW = g.w / 2;
        const slotIdx = x < g.x + slotW ? 0 : 1;
        if (game.grill[slotIdx].state === 'cooking') {
          // Can't take while cooking
        } else {
          placeOnGrill(game, slotIdx);
        }
        return;
      }

      // Check Chopping Board
      const b = STATIONS.board;
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
        if (game.chopping.active) {
          chopClick(game);
        } else {
          startChop(game);
        }
        return;
      }

      // Check Fryer
      const f = STATIONS.fryer;
      if (x >= f.x && x <= f.x + f.w && y >= f.y && y <= f.y + f.h) {
        const slotW = f.w / 2;
        const slotIdx = x < f.x + slotW ? 0 : 1;
        if (game.fryer[slotIdx].state === 'cooking') {
          // Can't take while cooking
        } else {
          placeOnFryer(game, slotIdx);
        }
        return;
      }

      // Check Bell (Serve)
      const bell = STATIONS.bell;
      if (x >= bell.x && x <= bell.x + bell.w && y >= bell.y && y <= bell.y + bell.h) {
        serveSelected(game);
        return;
      }

      // Check Trash
      const trash = STATIONS.trash;
      if (x >= trash.x && x <= trash.x + trash.w && y >= trash.y && y <= trash.y + trash.h) {
        trashHandOrPlate(game);
        return;
      }
    }
  });

  window.addEventListener('keydown', (e) => {
    audio.init();
    const key = e.key.toLowerCase();

    if (key === 'm') {
      audio.setMuted(!audio.muted);
      return;
    }

    if (key === 'p' || key === 'escape') {
      if (game.phase === 'playing') {
        game.phase = 'paused';
      } else if (game.phase === 'paused') {
        game.phase = 'playing';
      }
      return;
    }

    if (game.phase === 'title' || game.phase === 'summary') {
      if (key === 'r' || key === 'enter' || key === ' ') {
        startShift(game);
      }
      return;
    }

    if (game.phase === 'playing') {
      if (key >= '1' && key <= '8') {
        const keys = ['roti', 'daging', 'selada', 'tomat', 'keju', 'saus', 'nasi', 'telur'];
        const idx = parseInt(key) - 1;
        if (keys[idx]) grabIngredient(game, keys[idx]);
      } else if (key === 'z') {
        selectPlate(game, 0);
      } else if (key === 'x') {
        selectPlate(game, 1);
      } else if (key === 'c') {
        selectPlate(game, 2);
      } else if (key === ' ' || key === 'enter') {
        serveSelected(game);
      } else if (key === 't') {
        trashHandOrPlate(game);
      } else if (key === 'r') {
        startShift(game);
      }
    }
  });

  return mouse;
}
