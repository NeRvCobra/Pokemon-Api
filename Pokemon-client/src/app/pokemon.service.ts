import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pokemon {
  name: string;
  id: number;
  sprite: string;
  height: number;
  weight: number;
  types: string[];
  stats: { [k: string]: number };
  evolution: { name: string; sprite: string }[];
  color: string;
}


@Injectable({ providedIn: 'root' })
export class PokemonService {
  private api = 'http://localhost:3000/pokemon';

  constructor(private http: HttpClient) {}

  getMany(names: string[]): Observable<Pokemon[]> {
    const query = names.join(',');
    return this.http.get<Pokemon[]>(`${this.api}?names=${query}`);
  }
}
