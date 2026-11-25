import { createGame, spawnOrder, addPopup } from './world.js';

export const SHOT_NAMES = ['start', 'play', 'serve', 'rush'];

export function applyShot(game, name, seed = 7) {
  // Reset / initialize base
  game.phase = 'playing';
  game.score = 0;
  game.coins = 0;
  game.combo = 0;
  game.bestCombo = 0;
  game.hearts = 3;
  game.timeLeft = 150;
  game.orders = [];
  game.plates = [{ ingredients: [] }, { ingredients: [] }, { ingredients: [] }];
  game.grill = [
    { item: null, state: 'empty', progress: 0 },
    { item: null, state: 'empty', progress: 0 }
  ];
  game.fryer = [
    { item: null, state: 'empty', progress: 0 },
    { item: null, state: 'empty', progress: 0 }
  ];
  game.chopping = { item: null, progress: 0, active: false };
  game.hand = null;
  game.selectedPlate = 0;
  game.popups = [];

  if (name === 'start') {
    game.phase = 'title';
    game.timeLeft = 150;
    spawnOrder(game);
    spawnOrder(game);
  } else if (name === 'play') {
    game.phase = 'playing';
    game.timeLeft = 72; // 01:12
    game.score = 340;
    game.coins = 34;
    game.combo = 3;
    game.bestCombo = 3;
    // 3 orders
    spawnOrder(game);
    spawnOrder(game);
    spawnOrder(game);
    // Plate 1 mid-assembly
    game.plates[0].ingredients = ['roti', 'patty_panggang', 'selada_cincang'];
    game.selectedPlate = 0;
    // Patty on grill at 70% (4.2s out of 6s)
    game.grill[0] = { item: 'daging', state: 'cooking', progress: 4.2 };
    // Chopping in progress 2/3 on board
    game.chopping = { item: 'tomat', progress: 2, active: true };
  } else if (name === 'serve') {
    game.phase = 'playing';
    game.timeLeft = 95;
    game.score = 520;
    game.coins = 52;
    game.combo = 4;
    spawnOrder(game);
    spawnOrder(game);
    // Plate 3 complete Burger Keju
    game.plates[2].ingredients = ['roti', 'patty_panggang', 'keju', 'saus'];
    game.selectedPlate = 2;
    addPopup(game, '+180', 1120, 350, '#f1c40f', true);
  } else if (name === 'rush') {
    game.phase = 'playing';
    game.timeLeft = 38;
    game.score = 890;
    game.coins = 89;
    game.combo = 5;
    game.bestCombo = 5;
    // 4 orders, one red <8s
    spawnOrder(game);
    spawnOrder(game);
    spawnOrder(game);
    spawnOrder(game);
    if (game.orders[0]) game.orders[0].patience = 6.5; // red urgent

    // Both grill slots cooking
    game.grill[0] = { item: 'daging', state: 'cooking', progress: 3.0 };
    game.grill[1] = { item: 'daging', state: 'cooked', progress: 0 };
    // Fryer cooking
    game.fryer[0] = { item: 'telur', state: 'cooking', progress: 2.5 };
    // Plates busy
    game.plates[0].ingredients = ['roti', 'patty_panggang'];
    game.plates[1].ingredients = ['nasi', 'telur_goreng', 'saus'];
    game.plates[2].ingredients = ['selada_cincang', 'tomat_cincang', 'saus'];
    game.selectedPlate = 0;
    game.hand = 'keju';
  }
}
