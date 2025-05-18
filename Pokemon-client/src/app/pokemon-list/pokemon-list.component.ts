import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PokemonService, Pokemon } from '../pokemon.service';
import { PokemonDialogComponent } from '../pokemon-dialog/pokemon-dialog.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    PokemonDialogComponent
  ]
})
export class PokemonListComponent implements OnInit {
  @Input({ required: true }) names: string[] = [];
  pokemons: Pokemon[] = [];
  loading = false;
  groupedPokemons: { color: string; pokemons: Pokemon[] }[] = [];

  constructor(private api: PokemonService, private dialog: MatDialog) {}

  ngOnInit() { if (this.names.length) this.fetch(); }

  fetch() {
    this.loading = true;
    this.api.getMany(this.names).subscribe({
      next: data => {
        // 1. Agrupa por color
        const groups = data.reduce<Record<string, Pokemon[]>>((acc, p) => {
          const c = p.color || 'unknown';
          (acc[c] = acc[c] || []).push(p);
          return acc;
        }, {});

        // 2. Ordena cada grupo alfabéticamente
        Object.values(groups).forEach(arr =>
          arr.sort((a, b) => a.name.localeCompare(b.name))
        );

        // 3. Ordena los colores por tamaño de grupo (desc)
        const sortedColors = Object.keys(groups).sort(
          (a, b) => groups[b].length - groups[a].length
        );

        // 4. Monta el array final de grupos
        this.groupedPokemons = sortedColors.map(color => ({
          color,
          pokemons: groups[color]
        }));

        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  openDetails(p: Pokemon): void {
    this.dialog.open(PokemonDialogComponent, {
      data: p,
      maxWidth: '340px',
      panelClass: 'poke-dialog'   // ← aquí añades el panelClass
    });
  }
}
