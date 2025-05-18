import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());          // permite llamadas desde tu Angular

// GET /pokemon?names=pikachu,bulbasaur,squirtle
app.get('/pokemon', async (req, res) => {
  // ⛔  ESTA línea limita a 5
  // const names = (req.query.names || '').split(',').slice(0, 5);

  // ✅  Esta linea permite muchos más:
  const names = (req.query.names || '')
                 .split(',')
                 .filter(Boolean)         // quita vacíos
                 .map(n => n.trim().toLowerCase());

  try {
    const results = await Promise.all(
      names.map(async n => {
        const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${n}`);
        const p = await r.json();

        // tipos
        const types = p.types.map(t => t.type.name);

        // stats
        const stats = Object.fromEntries(
          p.stats.map(s => [s.stat.name, s.base_stat])
        );

        // ▲ cadena evolución
        const species = await fetch(p.species.url).then(r => r.json());
        const color = species.color.name;          // 🆕
        const chainUrl = species.evolution_chain.url;
        const chain = await fetch(chainUrl).then(r => r.json());

        const evo = [];
        let node = chain.chain;
        while (node) {
          const name = node?.species?.name;
          const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${ await fetch(node.species.url).then(r=>r.json()).then(s=>s.id)}.png`;
          evo.push({ name, sprite });
          node = node.evolves_to?.[0];
        }

        return {
          name: p.name,
          id: p.id,
          sprite: p.sprites.other['official-artwork'].front_default,
          height: p.height,
          weight: p.weight,
          types,
          stats,
          evolution: evo, color                     // 🆕
        };
      })
    );
    res.json(results);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(3000, () => console.log('API escuchando en http://localhost:3000'));