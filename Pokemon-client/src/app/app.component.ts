import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PokemonSelectorComponent } from './pokemon-selector/pokemon-selector.component';
import { PokemonListComponent } from './pokemon-list/pokemon-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <app-pokemon-selector
      *ngIf="stage==='select'"
      (selected)="load($event)">
    </app-pokemon-selector>

    <ng-container *ngIf="stage==='list'">
      <button mat-stroked-button color="primary"
              (click)="stage='select'" style="margin:1rem 0">
        ← Regresar
      </button>

      <app-pokemon-list [names]="names"></app-pokemon-list>
    </ng-container>
  `,
  imports: [CommonModule, MatButtonModule, PokemonSelectorComponent, PokemonListComponent]
})
export class AppComponent {
  stage: 'select' | 'list' = 'select';
  names: string[] = [];

  load(list: string[]) {
    this.names = list;
    this.stage = 'list';
  }
}
