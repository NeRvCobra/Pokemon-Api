import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PokeApiService {
  constructor(private http: HttpClient) {}

  getAllNames() {
    return this.http
      .get<{ results: { name: string }[] }>(
        'https://pokeapi.co/api/v2/pokemon?limit=2000&offset=0'
      )
      .pipe(map(r => r.results.map(p => p.name)));
  }
  // poke-api.service.ts
  getTypes() {
    return this.http.get<{ results: { name:string }[] }>(
      'https://pokeapi.co/api/v2/type?limit=100'
    ).pipe(map(r => r.results.map(t => t.name).filter(n => n !== 'unknown' && n !== 'shadow')));
  }

  getPokemonByType(type: string) {
    return this.http.get<{ pokemon:{pokemon:{name:string}}[] }>(
      `https://pokeapi.co/api/v2/type/${type}`
    ).pipe(map(r => r.pokemon.map(p => p.pokemon.name)));
  }
}
