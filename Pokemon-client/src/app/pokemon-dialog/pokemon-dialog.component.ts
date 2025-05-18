import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { TitleCasePipe, CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { DomSanitizer } from '@angular/platform-browser';
import { RadarChartComponent } from '../radar-chart/radar-chart.component';
import { Pokemon } from '../pokemon.service';


@Component({
  selector: 'app-pokemon-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatDividerModule,
    MatButtonModule,
    MatChipsModule,
    TitleCasePipe,
    RadarChartComponent
  ],
  template: `
    <h1 mat-dialog-title class="center">
      {{ data.name | titlecase }} <small>#{{ data.id }}</small>
    </h1>

    <div mat-dialog-content class="content">
      <img [src]="data.sprite" [alt]="data.name">
      <!-- tipos -->
      <mat-chip-listbox class="chips">
        <mat-chip *ngFor="let t of data.types" [ngStyle]="typeColor(t)">
          {{ t | titlecase }}
        </mat-chip>
      </mat-chip-listbox>

      <!-- radar -->
      <app-radar-chart [stats]="data.stats"></app-radar-chart>


      <!-- evolución -->
      <div class="evo" *ngIf="data.evolution && data.evolution.length > 1">
        <ng-container *ngFor="let e of data.evolution; let last = last">
          <img [src]="e.sprite" [alt]="e.name" class="mini">
          <svg *ngIf="!last" viewBox="0 0 24 24">
            <path d="M4 12h16M15 5l7 7-7 7"/>
          </svg>
        </ng-container>
      </div>
    </div>

    <div mat-dialog-actions align="end">
      <a mat-stroked-button color="accent"
        [href]="'https://www.pokemon.com/us/pokedex/'+data.name"
        target="_blank">Ver en Pokédex</a>
      <button mat-raised-button color="primary" mat-dialog-close>Cerrar</button>
    </div>
  `,
  styles: [`
    .center{text-align:center;}
    img{display:block;margin:0 auto 8px;width:200px;}
    .chips{justify-content:center;margin:4px 0 8px;}
    .chips mat-chip{color:#fff;font-weight:600}
    .evo{display:flex;align-items:center;justify-content:center;margin-top:8px;}
    .mini{width:56px;height:56px;object-fit:contain}
    svg{width:32px;fill:none;stroke:#555;stroke-width:2;transform:translateY(-4px);}
  `]
})

export class PokemonDialogComponent {
  data: Pokemon;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: Pokemon,
    private s: DomSanitizer
  ) {
    // Garantiza siempre un array
    this.data = {
      ...data,
      evolution: data.evolution ?? []
    };
  }

  /** Colores tipo (muy simplificado) */
  typeColor(t: string){
    const m:any={fire:'#EE8130',water:'#6390F0',grass:'#7AC74C',
                 electric:'#F7D02C',psychic:'#F95587',ice:'#96D9D6',
                 fighting:'#C22E28',rock:'#B6A136',ground:'#E2BF65',
                 ghost:'#735797',dark:'#705746',steel:'#B7B7CE',
                 fairy:'#D685AD',dragon:'#6F35FC',poison:'#A33EA1',
                 bug:'#A6B91A',flying:'#A98FF3',normal:'#A8A77A'};
    return {'background-color': m[t]||'#666'};
  }  
}
