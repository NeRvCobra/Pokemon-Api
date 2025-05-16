import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pokemon {
  name: string;
  id: number;
  height: number;
  weight: number;
  sprite: string;
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
