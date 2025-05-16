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
        const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${n.trim().toLowerCase()}`);
        if (!r.ok) throw new Error(`No encontrado: ${n}`);
        const data = await r.json();
        return {
          name: data.name,
          id: data.id,
          height: data.height,
          weight: data.weight,
          sprite: data.sprites.other['official-artwork'].front_default
        };
      })
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('API escuchando en http://localhost:3000'));