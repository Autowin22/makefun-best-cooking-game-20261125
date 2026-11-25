import { STATIONS, INGREDIENTS, RECIPES, SHIFT_DURATION } from './config.js';

export function drawFoodIcon(ctx, kind, x, y, s = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);

  switch (kind) {
    case 'roti':
      // Bun base + top
      ctx.fillStyle = '#d99b52';
      ctx.beginPath();
      ctx.ellipse(0, 4, 18, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f0c242';
      ctx.beginPath();
      ctx.ellipse(0, -2, 16, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'daging':
      // Raw patty
      ctx.fillStyle = '#8b3a3a';
      ctx.beginPath();
      ctx.roundRect(-16, -8, 32, 16, 6);
      ctx.fill();
      break;
    case 'patty_panggang':
      // Grilled patty (darker, grill marks)
      ctx.fillStyle = '#592615';
      ctx.beginPath();
      ctx.roundRect(-16, -8, 32, 16, 6);
      ctx.fill();
      ctx.strokeStyle = '#38160c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-10, -5); ctx.lineTo(10, 5);
      ctx.moveTo(-5, -6); ctx.lineTo(12, 3);
      ctx.stroke();
      break;
    case 'selada':
    case 'selada_cincang':
      // Green lettuce frills
      ctx.fillStyle = kind === 'selada' ? '#4a8c4a' : '#3b703b';
      ctx.beginPath();
      ctx.arc(-8, 0, 10, 0, Math.PI * 2);
      ctx.arc(8, 0, 10, 0, Math.PI * 2);
      ctx.arc(0, -4, 10, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'tomat':
    case 'tomat_cincang':
      // Red tomato slices
      ctx.fillStyle = kind === 'tomat' ? '#bf3b3b' : '#992a2a';
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffcccc';
      ctx.beginPath();
      ctx.arc(-4, -2, 3, 0, Math.PI * 2);
      ctx.arc(4, 2, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'keju':
      // Yellow cheese slice (triangle/square with corner drop)
      ctx.fillStyle = '#f0c242';
      ctx.beginPath();
      ctx.moveTo(-14, -10);
      ctx.lineTo(14, -10);
      ctx.lineTo(16, 10);
      ctx.lineTo(-14, 10);
      ctx.closePath();
      ctx.fill();
      // Cheese holes
      ctx.fillStyle = '#d49b20';
      ctx.beginPath();
      ctx.arc(-4, 0, 3, 0, Math.PI * 2);
      ctx.arc(6, 4, 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'saus':
      // Red sauce streak
      ctx.fillStyle = '#a62424';
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 6, 0.2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'nasi':
      // Rice mound
      ctx.fillStyle = '#f5f5f0';
      ctx.beginPath();
      ctx.ellipse(0, 4, 18, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, 0, 12, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'telur':
    case 'telur_goreng':
      // Fried egg / raw egg
      ctx.fillStyle = kind === 'telur' ? '#f2e3b6' : '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, 2, 16, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      // Yolk
      ctx.fillStyle = '#e8bc48';
      ctx.beginPath();
      ctx.arc(2, 0, 7, 0, Math.PI * 2);
      ctx.fill();
      break;
    default:
      ctx.fillStyle = '#888';
      ctx.fillRect(-10, -10, 20, 20);
      break;
  }
  ctx.restore();
}

export function drawGame(ctx, game, mouse, particles) {
  ctx.save();

  // Screen shake offset
  if (game.screenShake > 0) {
    const shakeX = (Math.sin(Date.now() * 0.1) * game.screenShake * 15);
    const shakeY = (Math.cos(Date.now() * 0.12) * game.screenShake * 15);
    ctx.translate(shakeX, shakeY);
  }

  // 1. Background (Warm cream wall + terracotta tiled floor counter base)
  ctx.fillStyle = '#f7f4eb';
  ctx.fillRect(0, 0, 1280, 800);

  // Wall wainscoting / tile line at y=164
  ctx.fillStyle = '#e8e1cf';
  ctx.fillRect(0, 0, 1280, 164);
  ctx.strokeStyle = '#d4c9b0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 164); ctx.lineTo(1280, 164);
  ctx.stroke();

  // Kitchen Wall Decor (x 280-1264, y 170-310)
  // 1. Small Window with Warm Sky
  ctx.fillStyle = '#d2b48c';
  ctx.fillRect(320, 185, 130, 100);
  ctx.fillStyle = '#fad390';
  ctx.fillRect(328, 193, 114, 84);
  ctx.strokeStyle = '#8b4513';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(385, 193); ctx.lineTo(385, 277);
  ctx.moveTo(328, 235); ctx.lineTo(442, 235);
  ctx.stroke();
  ctx.strokeStyle = '#d2b48c';
  ctx.lineWidth = 6;
  ctx.strokeRect(320, 185, 130, 100);

  // 2. Wooden Shelf with 4 Jars/Bottles
  ctx.fillStyle = '#8b4513';
  ctx.fillRect(520, 240, 260, 12);
  ctx.fillStyle = '#5c3a21';
  ctx.fillRect(540, 252, 16, 20);
  ctx.fillRect(740, 252, 16, 20);
  
  // Jar 1 (spice)
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillRect(545, 205, 30, 35);
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(547, 215, 26, 23);
  ctx.fillStyle = '#d2b48c';
  ctx.fillRect(553, 197, 14, 8);

  // Jar 2 (bottle)
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillRect(590, 195, 22, 45);
  ctx.fillStyle = '#2ecc71';
  ctx.fillRect(592, 205, 18, 33);
  ctx.fillStyle = '#8b4513';
  ctx.fillRect(596, 190, 10, 5);

  // Jar 3 (honey jar)
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillRect(630, 210, 34, 30);
  ctx.fillStyle = '#f1c40f';
  ctx.fillRect(632, 218, 30, 20);
  ctx.fillStyle = '#fff';
  ctx.fillRect(638, 224, 18, 10);
  ctx.fillStyle = '#8b4513';
  ctx.fillRect(637, 205, 20, 5);

  // Jar 4 (short jar)
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillRect(680, 215, 28, 25);
  ctx.fillStyle = '#3498db';
  ctx.fillRect(682, 222, 24, 16);
  ctx.fillStyle = '#7f8c8d';
  ctx.fillRect(686, 210, 20, 5);

  // 3. Hanging Pans/Pots from Hooks
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(850, 185); ctx.lineTo(1050, 185);
  ctx.stroke();

  // Pan 1
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(890, 185); ctx.lineTo(890, 215);
  ctx.stroke();
  ctx.fillStyle = '#444';
  ctx.beginPath();
  ctx.ellipse(890, 235, 32, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(890, 235); ctx.lineTo(890, 275);
  ctx.stroke();

  // Pot 2
  ctx.beginPath();
  ctx.moveTo(980, 185); ctx.lineTo(980, 210);
  ctx.stroke();
  ctx.fillStyle = '#7f8c8d';
  ctx.beginPath();
  ctx.roundRect(955, 210, 50, 40, [0, 0, 10, 10]);
  ctx.fill();
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(952, 225, 6, Math.PI/2, Math.PI*1.5, false);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(1008, 225, 6, -Math.PI/2, Math.PI/2, false);
  ctx.stroke();

  // Countertops background (dark wood / terracotta)
  ctx.fillStyle = '#3e2723';
  ctx.fillRect(STATIONS.pantry.x, STATIONS.pantry.y, STATIONS.pantry.w, STATIONS.pantry.h);

  // 2. Top Bar (y 0-64)
  ctx.fillStyle = '#2c1e1a';
  ctx.fillRect(0, 0, 1280, 64);
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 64); ctx.lineTo(1280, 64);
  ctx.stroke();

  // Title left
  ctx.fillStyle = '#f4f4f5';
  ctx.font = 'bold 24px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('WOK & EMBER', 24, 40);
  ctx.font = '12px "Trebuchet MS", sans-serif';
  ctx.fillStyle = '#d4af37';
  ctx.fillText('DAPUR RUSH', 24, 56);

  // Score & Coins center
  ctx.fillStyle = '#f4f4f5';
  ctx.textAlign = 'center';
  ctx.font = 'bold 20px "Trebuchet MS", sans-serif';
  ctx.fillText(`Skor: ${game.score}`, 540, 38);
  ctx.font = '14px "Trebuchet MS", sans-serif';
  ctx.fillStyle = '#f1c40f';
  ctx.fillText(`Koin: ${game.coins} | Koin Kombo: x${game.combo}`, 540, 56);

  // Timer & Progress bar right
  ctx.textAlign = 'right';
  ctx.fillStyle = '#f4f4f5';
  ctx.font = 'bold 20px "Trebuchet MS", sans-serif';
  const mins = Math.floor(game.timeLeft / 60).toString().padStart(2, '0');
  const secs = Math.floor(game.timeLeft % 60).toString().padStart(2, '0');
  ctx.fillText(`${mins}:${secs}`, 1120, 38);

  // Timer bar background
  ctx.fillStyle = '#555';
  ctx.fillRect(980, 46, 140, 10);
  ctx.fillStyle = game.timeLeft < 30 ? '#e74c3c' : '#2ecc71';
  ctx.fillRect(980, 46, 140 * (game.timeLeft / SHIFT_DURATION), 10);

  // Hearts (3 max)
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = i < game.hearts ? '#e74c3c' : '#444';
    const hx = 1128 + i * 28 + 10;
    const hy = 32;
    ctx.beginPath();
    ctx.arc(hx - 4, hy - 2, 4, Math.PI, 0, false);
    ctx.arc(hx + 4, hy - 2, 4, Math.PI, 0, false);
    ctx.lineTo(hx, hy + 8);
    ctx.closePath();
    ctx.fill();
  }

  // Mute button top-right corner
  ctx.fillStyle = '#444';
  ctx.fillRect(1200, 16, 56, 32);
  ctx.fillStyle = '#fff';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(game.muted ? 'SUARA OFF' : 'SUARA ON', 1228, 36);

  // 3. Order Board (y 72-156)
  ctx.fillStyle = '#2c1e1a';
  ctx.fillRect(260, 72, 1004, 84);
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2;
  ctx.strokeRect(260, 72, 1004, 84);

  // Ticket rail line
  ctx.strokeStyle = '#b8860b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(270, 80); ctx.lineTo(1254, 80);
  ctx.stroke();

  // Draw tickets (up to 4)
  for (let i = 0; i < game.orders.length; i++) {
    const ord = game.orders[i];
    const rec = RECIPES[ord.recipeIndex];
    const tx = 276 + i * 248;
    const ty = 86;
    const tw = 240;
    const th = 66;

    ctx.fillStyle = '#fffdf0';
    ctx.fillRect(tx, ty, tw, th);
    ctx.strokeStyle = ord.patience < 10 ? '#e74c3c' : '#d4af37';
    ctx.lineWidth = ord.patience < 10 ? 3 : 1;
    ctx.strokeRect(tx, ty, tw, th);

    // Ticket header
    ctx.fillStyle = '#2c1e1a';
    ctx.font = 'bold 13px "Trebuchet MS", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(rec.name, tx + 8, ty + 18);

    ctx.fillStyle = '#7f8c8d';
    ctx.font = '11px "Trebuchet MS", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`+${rec.baseScore}`, tx + tw - 8, ty + 18);

    // Required ingredients mini icons
    let ix = tx + 10;
    const iy = ty + 42;
    for (const ingId of rec.ingredients) {
      drawFoodIcon(ctx, ingId, ix + 10, iy, 0.7);
      ix += 26;
    }

    // Patience bar
    const pWidth = tw - 16;
    const pFrac = Math.max(0, ord.patience / ord.maxPatience);
    ctx.fillStyle = '#ddd';
    ctx.fillRect(tx + 8, ty + th - 10, pWidth, 6);
    ctx.fillStyle = pFrac > 0.4 ? '#2ecc71' : (pFrac > 0.2 ? '#f39c12' : '#e74c3c');
    ctx.fillRect(tx + 8, ty + th - 10, pWidth * pFrac, 6);
  }

  // 4. Pantry (Left: x 16-248, y 164-764)
  const keys = ['roti', 'daging', 'selada', 'tomat', 'keju', 'saus', 'nasi', 'telur'];
  for (let i = 0; i < keys.length; i++) {
    const ingId = keys[i];
    const def = INGREDIENTS[ingId];
    const col = i % 2;
    const row = Math.floor(i / 2);
    const bx = STATIONS.pantry.x + 12 + col * 108;
    const by = STATIONS.pantry.y + 16 + row * 138;
    const bw = 100;
    const bh = 122;

    // Bin card background
    ctx.fillStyle = '#2d3748';
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, 10);
    ctx.fill();
    ctx.strokeStyle = game.hand === ingId ? '#f1c40f' : '#4a5568';
    ctx.lineWidth = game.hand === ingId ? 3 : 1;
    ctx.stroke();

    // Key badge top-left
    ctx.fillStyle = '#1a202c';
    ctx.fillRect(bx + 6, by + 6, 22, 22);
    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(def.key, bx + 17, by + 21);

    // Food icon inside bin
    drawFoodIcon(ctx, ingId, bx + bw / 2, by + 56, 1.2);

    // Label
    ctx.fillStyle = '#f4f4f5';
    ctx.font = 'bold 12px "Trebuchet MS", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(def.label, bx + bw / 2, by + 105);
  }

  // 5. Plates (3 Assembly Plates at y ~320-500)
  for (let i = 0; i < STATIONS.plates.length; i++) {
    const p = STATIONS.plates[i];
    const isSelected = game.selectedPlate === i;

    // Plate counter base
    ctx.fillStyle = '#4a3b32';
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.strokeStyle = isSelected ? '#f1c40f' : '#5c483d';
    ctx.lineWidth = isSelected ? 4 : 2;
    ctx.strokeRect(p.x, p.y, p.w, p.h);

    // Plate ceramic disk
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(p.x + p.w / 2, p.y + p.h / 2 + 10, 85, 45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#dcdcdc';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Label
    ctx.fillStyle = isSelected ? '#f1c40f' : '#7f8c8d';
    ctx.font = 'bold 13px "Trebuchet MS", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(p.label + (isSelected ? ' (Aktif)' : ''), p.x + p.w / 2, p.y + 24);

    // Stacked ingredients on plate
    const ings = game.plates[i].ingredients;
    let stackY = p.y + p.h / 2 + 18;
    for (let j = 0; j < ings.length; j++) {
      drawFoodIcon(ctx, ings[j], p.x + p.w / 2, stackY - j * 11, 1.6);
    }
  }

  // 6. Stations Bottom Row (y 560-770): Grill, Chopping Board, Fryer, Bell, Trash
  // Grill (x 280, w 240)
  const g = STATIONS.grill;
  ctx.fillStyle = '#2d2d30';
  ctx.fillRect(g.x, g.y, g.w, g.h);
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 2;
  ctx.strokeRect(g.x, g.y, g.w, g.h);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PANGGANGAN (Grill)', g.x + g.w / 2, g.y + 24);

  // Grill 2 slots
  const slotW = 100;
  const slotH = 120;
  for (let i = 0; i < 2; i++) {
    const sx = g.x + 20 + i * 120;
    const sy = g.y + 40;
    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(sx, sy, slotW, slotH);
    ctx.strokeStyle = '#444';
    ctx.strokeRect(sx, sy, slotW, slotH);

    const slot = game.grill[i];
    if (slot.state !== 'empty') {
      const iconItem = slot.state === 'cooked' ? 'patty_panggang' : (slot.state === 'burnt' ? 'patty_panggang' : slot.item);
      drawFoodIcon(ctx, iconItem, sx + slotW / 2, sy + 50, 1.2);

      if (slot.state === 'burnt') {
        ctx.fillStyle = '#000';
        ctx.fillRect(sx, sy, slotW, slotH);
        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('GOSONG!', sx + slotW / 2, sy + 65);
      } else if (slot.state === 'cooked') {
        ctx.fillStyle = '#f1c40f';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('MATANG!', sx + slotW / 2, sy + 65);
      } else if (slot.state === 'cooking') {
        // Progress ring
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 4;
        ctx.beginPath();
        const pFrac = slot.progress / 6;
        ctx.arc(sx + slotW / 2, sy + 50, 30, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pFrac);
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = '#666';
      ctx.font = '11px sans-serif';
      ctx.fillText('[ Taruh Daging ]', sx + slotW / 2, sy + 60);
    }
  }

  // Chopping Board (x 540, w 240)
  const b = STATIONS.board;
  ctx.fillStyle = '#b5651d';
  ctx.fillRect(b.x, b.y, b.w, b.h);
  ctx.strokeStyle = '#8b4513';
  ctx.lineWidth = 3;
  ctx.strokeRect(b.x, b.y, b.w, b.h);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TALENAN (Chopping)', b.x + b.w / 2, b.y + 24);

  // Board surface circle
  ctx.fillStyle = '#d2b48c';
  ctx.beginPath();
  ctx.ellipse(b.x + b.w / 2, b.y + 110, 80, 50, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#bc8f8f';
  ctx.lineWidth = 2;
  ctx.stroke();

  if (game.chopping.active) {
    drawFoodIcon(ctx, game.chopping.item, b.x + b.w / 2, b.y + 105, 1.3);
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`Klik Cincang: ${game.chopping.progress}/3`, b.x + b.w / 2, b.y + 185);
  } else {
    ctx.fillStyle = '#5c3a21';
    ctx.font = '12px sans-serif';
    ctx.fillText('Klik dengan Selada/Tomat', b.x + b.w / 2, b.y + 115);
  }

  // Fryer (x 800, w 240)
  const f = STATIONS.fryer;
  ctx.fillStyle = '#3a3a3a';
  ctx.fillRect(f.x, f.y, f.w, f.h);
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 2;
  ctx.strokeRect(f.x, f.y, f.w, f.h);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GORENGAN (Fryer)', f.x + f.w / 2, f.y + 24);

  for (let i = 0; i < 2; i++) {
    const sx = f.x + 20 + i * 120;
    const sy = f.y + 40;
    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(sx, sy, slotW, slotH);
    ctx.strokeStyle = '#444';
    ctx.strokeRect(sx, sy, slotW, slotH);

    const slot = game.fryer[i];
    if (slot.state !== 'empty') {
      const iconItem = slot.state === 'cooked' ? 'telur_goreng' : (slot.state === 'burnt' ? 'telur_goreng' : slot.item);
      drawFoodIcon(ctx, iconItem, sx + slotW / 2, sy + 50, 1.2);

      if (slot.state === 'burnt') {
        ctx.fillStyle = '#000';
        ctx.fillRect(sx, sy, slotW, slotH);
        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('GOSONG!', sx + slotW / 2, sy + 65);
      } else if (slot.state === 'cooked') {
        ctx.fillStyle = '#f1c40f';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('MATANG!', sx + slotW / 2, sy + 65);
      } else if (slot.state === 'cooking') {
        ctx.strokeStyle = '#f39c12';
        ctx.lineWidth = 4;
        ctx.beginPath();
        const pFrac = slot.progress / 5;
        ctx.arc(sx + slotW / 2, sy + 50, 30, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pFrac);
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = '#666';
      ctx.font = '11px sans-serif';
      ctx.fillText('[ Taruh Telur ]', sx + slotW / 2, sy + 60);
    }
  }

  // 7. Bell & Trash (Right column: x 1080)
  // Bell (y 300-480)
  const bell = STATIONS.bell;
  ctx.fillStyle = '#d4af37';
  ctx.beginPath();
  ctx.roundRect(bell.x, bell.y, bell.w, bell.h, 12);
  ctx.fill();
  ctx.strokeStyle = '#b8860b';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#2c1e1a';
  ctx.font = 'bold 16px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🔔', bell.x + bell.w / 2, bell.y + 60);
  ctx.fillText('SAJIKAN', bell.x + bell.w / 2, bell.y + 100);
  ctx.font = '11px sans-serif';
  ctx.fillText('(Space / Klik)', bell.x + bell.w / 2, bell.y + 130);

  // Trash (y 560-770)
  const trash = STATIONS.trash;
  ctx.fillStyle = '#7f8c8d';
  ctx.beginPath();
  ctx.roundRect(trash.x, trash.y, trash.w, trash.h, 12);
  ctx.fill();
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 16px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🗑️', trash.x + trash.w / 2, trash.y + 60);
  ctx.fillText('TEMPAT SAMPAH', trash.x + trash.w / 2, trash.y + 100);
  ctx.font = '11px sans-serif';
  ctx.fillText('(T / Klik)', trash.x + trash.w / 2, trash.y + 130);

  // 8. Held Item at Mouse Cursor
  if (game.hand) {
    drawFoodIcon(ctx, game.hand, mouse.x, mouse.y, 1.4);
  }

  // 9. Floating Popups
  for (const pop of game.popups) {
    ctx.save();
    ctx.globalAlpha = pop.life;
    ctx.fillStyle = pop.color;
    ctx.font = pop.isBig ? 'bold 24px "Trebuchet MS", sans-serif' : 'bold 16px "Trebuchet MS", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(pop.text, pop.x, pop.y);
    ctx.restore();
  }

  // 10. Overlays (Title, Paused, Summary)
  if (game.phase === 'title') {
    ctx.fillStyle = 'rgba(18, 18, 20, 0.85)';
    ctx.fillRect(0, 0, 1280, 800);

    ctx.fillStyle = '#f4f4f5';
    ctx.font = 'bold 56px "Trebuchet MS", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('WOK & EMBER', 640, 260);
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 28px "Trebuchet MS", sans-serif';
    ctx.fillText('DAPUR RUSH', 640, 310);

    ctx.fillStyle = '#fff';
    ctx.font = '18px "Trebuchet MS", sans-serif';
    ctx.fillText('Klik di mana saja atau tekan R untuk Mulai', 640, 420);

    // How-to strip
    ctx.fillStyle = '#2c2e33';
    ctx.fillRect(240, 480, 800, 180);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.strokeRect(240, 480, 800, 180);

    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('CARA BERMAIN:', 640, 515);

    ctx.fillStyle = '#fff';
    ctx.font = '14px sans-serif';
    ctx.fillText('1. Ambil Bahan dari Pantry (Kunci 1-8 / Klik)', 640, 545);
    ctx.fillText('2. Olah di Panggangan atau Talenan / Fryer', 640, 575);
    ctx.fillText('3. Susun di Piring (Z / X / C atau Klik)', 640, 605);
    ctx.fillText('4. Sajikan ke Bel (Space / Klik) sebelum waktu habis!', 640, 635);
  } else if (game.phase === 'paused') {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, 1280, 800);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px "Trebuchet MS", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('JEDA (PAUSED)', 640, 360);
    ctx.font = '20px "Trebuchet MS", sans-serif';
    ctx.fillText('Tekan P atau Esc untuk Lanjut', 640, 420);
  } else if (game.phase === 'summary') {
    ctx.fillStyle = 'rgba(18, 18, 20, 0.9)';
    ctx.fillRect(0, 0, 1280, 800);

    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 48px "Trebuchet MS", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SHIFT SELESAI!', 640, 180);

    ctx.fillStyle = '#fff';
    ctx.font = '22px "Trebuchet MS", sans-serif';
    const served = game.stats.dishesServed;
    const missed = game.stats.ordersMissed;
    const accuracy = (served + missed) > 0 ? Math.round((served / (served + missed)) * 100) : 0;

    ctx.fillText(`Total Skor: ${game.score}`, 640, 260);
    ctx.fillText(`Hidangan Disajikan: ${served}`, 640, 310);
    ctx.fillText(`Kombo Terbaik: x${game.bestCombo}`, 640, 360);
    ctx.fillText(`Pesanan Terlewat: ${missed}`, 640, 410);
    ctx.fillText(`Akurasi: ${accuracy}%`, 640, 460);

    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 22px "Trebuchet MS", sans-serif';
    ctx.fillText('Tekan R atau Klik untuk Main Lagi', 640, 560);
  }

  ctx.restore();
}
