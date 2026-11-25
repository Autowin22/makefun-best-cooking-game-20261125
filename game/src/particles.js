export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.confetti = [];
  }

  spawnSteam(x, y) {
    this.particles.push({
      x: x + (Math.random() - 0.5) * 30,
      y,
      vx: (Math.random() - 0.5) * 20,
      vy: -40 - Math.random() * 30,
      size: 8 + Math.random() * 12,
      alpha: 0.6,
      life: 1.0,
      decay: 0.8 + Math.random() * 0.5,
      type: 'steam'
    });
  }

  spawnChopBits(x, y, color) {
    for (let i = 0; i < 4; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 120,
        vy: -60 - Math.random() * 80,
        size: 4 + Math.random() * 4,
        alpha: 1.0,
        life: 0.6,
        decay: 1.5,
        color,
        type: 'chip'
      });
    }
  }

  spawnConfetti() {
    const colors = ['#e74c3c', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6', '#e67e22'];
    for (let i = 0; i < 60; i++) {
      this.confetti.push({
        x: 640 + (Math.random() - 0.5) * 400,
        y: 200 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 300,
        vy: -150 - Math.random() * 200,
        size: 6 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 10,
        life: 1.5,
        decay: 0.8
      });
    }
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt * p.decay;
      p.alpha = Math.max(0, p.life);
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const c = this.confetti[i];
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.vy += 300 * dt; // gravity
      c.rotation += c.vRot * dt;
      c.life -= dt * c.decay;
      if (c.life <= 0) {
        this.confetti.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    // Draw steam / chips
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      if (p.type === 'steam') {
        ctx.fillStyle = 'rgba(240, 240, 240, 0.7)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'chip') {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.restore();
    }

    // Draw confetti
    for (const c of this.confetti) {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rotation);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
      ctx.restore();
    }
  }
}
