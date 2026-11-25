import { INGREDIENTS, RECIPES, SHIFT_DURATION, GRILL_COOK_TIME, GRILL_BURN_TIME, FRYER_COOK_TIME, FRYER_BURN_TIME } from './config.js';
import { createRNG, pick } from './random.js';

export function recipeMatches(plateIngredients, recipeIngredients) {
  if (plateIngredients.length !== recipeIngredients.length) return false;
  const pSet = new Set(plateIngredients);
  const rSet = new Set(recipeIngredients);
  if (pSet.size !== rSet.size) return false;
  for (const ing of rSet) {
    if (!pSet.has(ing)) return false;
  }
  return true;
}

export function plateSetKey(ingredients) {
  return [...ingredients].sort().join(',');
}

export function createGame(seed = 12345) {
  const rng = createRNG(seed);
  return {
    phase: 'title', // 'title', 'playing', 'paused', 'summary'
    score: 0,
    coins: 0,
    combo: 0,
    bestCombo: 0,
    hearts: 3,
    timeLeft: SHIFT_DURATION,
    orders: [],
    plates: [
      { ingredients: [] },
      { ingredients: [] },
      { ingredients: [] }
    ],
    grill: [
      { item: null, state: 'empty', progress: 0 },
      { item: null, state: 'empty', progress: 0 }
    ],
    fryer: [
      { item: null, state: 'empty', progress: 0 },
      { item: null, state: 'empty', progress: 0 }
    ],
    chopping: {
      item: null,
      progress: 0,
      active: false
    },
    hand: null,
    selectedPlate: 0,
    stats: {
      dishesServed: 0,
      ordersMissed: 0,
      bestScore: 0
    },
    popups: [],
    screenShake: 0,
    rng,
    nextSpawnTimer: 8,
    orderIdCounter: 1,
    audioTriggers: {
      chop: false,
      ding: false,
      error: false,
      tick: false,
      confetti: false,
      servePop: null, // combo number
      activeSizzles: [] // slot indices
    }
  };
}

export function startShift(game) {
  game.phase = 'playing';
  game.score = 0;
  game.coins = 0;
  game.combo = 0;
  game.bestCombo = 0;
  game.hearts = 3;
  game.timeLeft = SHIFT_DURATION;
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
  game.stats = { dishesServed: 0, ordersMissed: 0, bestScore: game.stats.bestScore };
  game.popups = [];
  game.screenShake = 0;
  game.nextSpawnTimer = 5;

  // Spawn initial 2 orders
  spawnOrder(game);
  spawnOrder(game);
}

export function spawnOrder(game) {
  if (game.orders.length >= 4) return;
  const recipeIndex = Math.floor(game.rng() * RECIPES.length);
  // Patience scales from 45s down to 30s as shift progresses
  const progressRatio = 1 - (game.timeLeft / SHIFT_DURATION);
  const patience = Math.max(30, 45 - 15 * progressRatio);
  
  game.orders.push({
    id: game.orderIdCounter++,
    recipeIndex,
    patience,
    maxPatience: patience
  });
}

export function grabIngredient(game, ingId) {
  if (game.phase !== 'playing') return;
  const def = INGREDIENTS[ingId];
  if (!def) return;

  if (game.hand === ingId) {
    // Clicking same bin returns item
    game.hand = null;
  } else {
    game.hand = ingId;
  }
}

export function selectPlate(game, plateIndex) {
  if (game.phase !== 'playing') return;
  if (plateIndex >= 0 && plateIndex < 3) {
    game.selectedPlate = plateIndex;
  }
}

export function placeOnPlate(game, plateIndex) {
  if (game.phase !== 'playing') return;
  if (!game.hand) {
    selectPlate(game, plateIndex);
    return;
  }
  const plate = game.plates[plateIndex];
  if (!plate) return;

  if (plate.ingredients.length >= 6) {
    addPopup(game, 'Piring Penuh!', 700, 300, '#e74c3c');
    return;
  }
  if (plate.ingredients.includes(game.hand)) {
    addPopup(game, 'Sudah Ada!', 700, 300, '#e74c3c');
    return;
  }

  plate.ingredients.push(game.hand);
  game.hand = null;
  game.selectedPlate = plateIndex;
}

export function placeOnGrill(game, slotIndex) {
  if (game.phase !== 'playing') return;
  const slot = game.grill[slotIndex];
  if (!slot) return;

  if (slot.state === 'empty') {
    if (game.hand === 'daging') {
      slot.item = 'daging';
      slot.state = 'cooking';
      slot.progress = 0; // 0 to 6 seconds
      game.hand = null;
    } else {
      addPopup(game, 'Bukan untuk Grill!', 400, 600, '#e74c3c');
    }
  } else if (slot.state === 'cooked' || slot.state === 'burnt') {
    takeFromGrill(game, slotIndex);
  }
}

export function takeFromGrill(game, slotIndex) {
  if (game.phase !== 'playing') return;
  const slot = game.grill[slotIndex];
  if (!slot) return;

  if (slot.state === 'cooked') {
    if (game.hand) {
      // Swap or drop
      const temp = game.hand;
      game.hand = INGREDIENTS[slot.item]?.result || 'patty_panggang';
      slot.item = temp === 'daging' ? 'daging' : null;
      slot.state = temp === 'daging' ? 'cooking' : 'empty';
      slot.progress = 0;
    } else {
      game.hand = INGREDIENTS[slot.item]?.result || 'patty_panggang';
      slot.item = null;
      slot.state = 'empty';
      slot.progress = 0;
    }
  } else if (slot.state === 'burnt') {
    // Clear burnt
    slot.item = null;
    slot.state = 'empty';
    slot.progress = 0;
    game.screenShake = 0.2;
    addPopup(game, 'Gosong!', 400, 600, '#e74c3c');
  }
}

export function startChop(game) {
  if (game.phase !== 'playing') return;
  if (!game.hand) return;

  const def = INGREDIENTS[game.hand];
  if (def && def.chopsOn === 'board') {
    if (!game.chopping.active && !game.chopping.item) {
      game.chopping.item = game.hand;
      game.chopping.progress = 0;
      game.chopping.active = true;
      game.hand = null;
    }
  }
}

export function chopClick(game) {
  if (game.phase !== 'playing') return;
  if (!game.chopping.active) return;

  game.chopping.progress++;
  game.audioTriggers.chop = true;
  addPopup(game, 'Cincang!', 660, 650, '#27ae60');

  if (game.chopping.progress >= 3) {
    const raw = game.chopping.item;
    const result = INGREDIENTS[raw]?.result;
    game.hand = result || raw;
    game.chopping.item = null;
    game.chopping.progress = 0;
    game.chopping.active = false;
  }
}

export function placeOnFryer(game, slotIndex) {
  if (game.phase !== 'playing') return;
  const slot = game.fryer[slotIndex];
  if (!slot) return;

  if (slot.state === 'empty') {
    if (game.hand === 'telur') {
      slot.item = 'telur';
      slot.state = 'cooking';
      slot.progress = 0; // 0 to 5 seconds
      game.hand = null;
    } else {
      addPopup(game, 'Bukan untuk Gorengan!', 900, 600, '#e74c3c');
    }
  } else if (slot.state === 'cooked' || slot.state === 'burnt') {
    takeFromFryer(game, slotIndex);
  }
}

export function takeFromFryer(game, slotIndex) {
  if (game.phase !== 'playing') return;
  const slot = game.fryer[slotIndex];
  if (!slot) return;

  if (slot.state === 'cooked') {
    game.hand = INGREDIENTS[slot.item]?.result || 'telur_goreng';
    slot.item = null;
    slot.state = 'empty';
    slot.progress = 0;
  } else if (slot.state === 'burnt') {
    slot.item = null;
    slot.state = 'empty';
    slot.progress = 0;
    game.screenShake = 0.2;
    addPopup(game, 'Gosong!', 900, 600, '#e74c3c');
  }
}

export function serveSelected(game) {
  if (game.phase !== 'playing') return;
  const plate = game.plates[game.selectedPlate];
  if (!plate || plate.ingredients.length === 0) {
    game.audioTriggers.error = true;
    game.screenShake = 0.15;
    addPopup(game, 'Piring Kosong!', 700, 400, '#e74c3c');
    return;
  }

  // Find oldest matching order
  let matchIndex = -1;
  for (let i = 0; i < game.orders.length; i++) {
    const ord = game.orders[i];
    const rec = RECIPES[ord.recipeIndex];
    if (recipeMatches(plate.ingredients, rec.ingredients)) {
      matchIndex = i;
      break;
    }
  }

  if (matchIndex !== -1) {
    const ord = game.orders[matchIndex];
    const rec = RECIPES[ord.recipeIndex];
    game.orders.splice(matchIndex, 1);

    const patienceFraction = ord.patience / ord.maxPatience;
    const comboMultiplier = 1 + 0.1 * Math.max(0, game.combo);
    const earned = Math.round((rec.baseScore + 50 * patienceFraction) * comboMultiplier);

    game.score += earned;
    game.coins += Math.round(rec.baseScore / 10);
    game.combo++;
    if (game.combo > game.bestCombo) game.bestCombo = game.combo;
    game.stats.dishesServed++;

    plate.ingredients = [];
    game.audioTriggers.ding = true;
    game.audioTriggers.servePop = game.combo;
    if (game.combo >= 3) {
      game.audioTriggers.confetti = true;
    }

    addPopup(game, `+${earned}`, 1120, 350, '#f1c40f', true);
  } else {
    game.audioTriggers.error = true;
    game.screenShake = 0.2;
    addPopup(game, 'Menu Salah!', 700, 400, '#e74c3c');
  }
}

export function trashHandOrPlate(game) {
  if (game.phase !== 'playing') return;
  if (game.hand) {
    game.hand = null;
    addPopup(game, 'Dibuang', 1120, 650, '#95a5a6');
  } else {
    const plate = game.plates[game.selectedPlate];
    if (plate && plate.ingredients.length > 0) {
      plate.ingredients = [];
      addPopup(game, 'Piring Dicuci', 700, 400, '#95a5a6');
    }
  }
}

export function addPopup(game, text, x, y, color = '#2c3e50', isBig = false) {
  game.popups.push({
    text,
    x,
    y,
    life: 1.0,
    color,
    isBig
  });
}

export function update(game, dt) {
  // Reset audio triggers
  game.audioTriggers.chop = false;
  game.audioTriggers.ding = false;
  game.audioTriggers.error = false;
  game.audioTriggers.tick = false;
  game.audioTriggers.confetti = false;
  game.audioTriggers.servePop = null;
  game.audioTriggers.activeSizzles = [];

  if (game.phase !== 'playing') return;

  // Screen shake decay
  if (game.screenShake > 0) {
    game.screenShake = Math.max(0, game.screenShake - dt * 2);
  }

  // Shift timer
  game.timeLeft -= dt;
  if (game.timeLeft <= 0) {
    game.timeLeft = 0;
    game.phase = 'summary';
    if (game.score > game.stats.bestScore) {
      game.stats.bestScore = game.score;
    }
    return;
  }

  // Order spawn timer (shrinks from 11s to 7s over shift)
  const progressRatio = 1 - (game.timeLeft / SHIFT_DURATION);
  const currentSpawnInterval = 11 - 4 * progressRatio;
  game.nextSpawnTimer -= dt;
  if (game.nextSpawnTimer <= 0) {
    spawnOrder(game);
    game.nextSpawnTimer = currentSpawnInterval;
  }

  // Update orders patience
  for (let i = game.orders.length - 1; i >= 0; i--) {
    const ord = game.orders[i];
    ord.patience -= dt;
    if (ord.patience < 10 && ord.patience + dt >= 10) {
      game.audioTriggers.tick = true;
    }
    if (ord.patience <= 0) {
      // Order expired
      game.orders.splice(i, 1);
      game.hearts--;
      game.combo = 0;
      game.screenShake = 0.3;
      addPopup(game, 'Pesanan Batal!', 600, 100, '#e74c3c', true);
      game.stats.ordersMissed++;
      if (game.hearts <= 0) {
        game.phase = 'summary';
        if (game.score > game.stats.bestScore) {
          game.stats.bestScore = game.score;
        }
        return;
      }
    }
  }

  // Update grill slots
  const activeSizzles = [];
  for (let i = 0; i < game.grill.length; i++) {
    const slot = game.grill[i];
    if (slot.state === 'cooking') {
      slot.progress += dt;
      activeSizzles.push(`grill_${i}`);
      if (slot.progress >= GRILL_COOK_TIME) {
        slot.state = 'cooked';
        slot.progress = 0;
      }
    } else if (slot.state === 'cooked') {
      slot.progress += dt;
      if (slot.progress >= GRILL_BURN_TIME) {
        slot.state = 'burnt';
        slot.progress = 0;
      }
    }
  }

  // Update fryer slots
  for (let i = 0; i < game.fryer.length; i++) {
    const slot = game.fryer[i];
    if (slot.state === 'cooking') {
      slot.progress += dt;
      activeSizzles.push(`fryer_${i}`);
      if (slot.progress >= FRYER_COOK_TIME) {
        slot.state = 'cooked';
        slot.progress = 0;
      }
    } else if (slot.state === 'cooked') {
      slot.progress += dt;
      if (slot.progress >= FRYER_BURN_TIME) {
        slot.state = 'burnt';
        slot.progress = 0;
      }
    }
  }
  game.audioTriggers.activeSizzles = activeSizzles;

  // Update popups
  for (let i = game.popups.length - 1; i >= 0; i--) {
    const pop = game.popups[i];
    pop.life -= dt * 1.2;
    pop.y -= dt * 40;
    if (pop.life <= 0) {
      game.popups.splice(i, 1);
    }
  }
}
