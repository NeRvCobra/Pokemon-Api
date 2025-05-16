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
}
