import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button'; 
import { PokemonSelectorComponent } from './pokemon-selector/pokemon-selector.component';
import { PokemonListComponent } from './pokemon-list/pokemon-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <mat-toolbar color="primary" class="toolbar">
      🔴🔥🐉 Búsqueda de Pokemones 🐦‍🔥🍚
    </mat-toolbar>

    <div class="app-container">
      <app-pokemon-selector
        *ngIf="stage==='select'"
        (selected)="load($event)">
      </app-pokemon-selector>

      <ng-container *ngIf="stage==='list'">
        <button mat-stroked-button color="primary"
                (click)="stage='select'">
          ← Regresar
        </button>
        <app-pokemon-list [names]="names"></app-pokemon-list>
      </ng-container>
    </div>
  `,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    PokemonSelectorComponent,
    PokemonListComponent
  ]
})
export class AppComponent {
  stage: 'select'|'list' = 'select';
  names: string[] = [];
  load(list: string[]) { this.names = list; this.stage = 'list'; }
}
