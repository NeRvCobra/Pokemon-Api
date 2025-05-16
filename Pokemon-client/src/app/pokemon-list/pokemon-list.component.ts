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

  constructor(private api: PokemonService, private dialog: MatDialog) {}

  ngOnInit() { if (this.names.length) this.fetch(); }

  fetch() {
    this.loading = true;
    this.api.getMany(this.names).subscribe({
      next: data => { this.pokemons = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  openDetails(p: Pokemon) {
    this.dialog.open(PokemonDialogComponent, { data: p, maxWidth: '320px' });
  }
}
