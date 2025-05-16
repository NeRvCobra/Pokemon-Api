import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { TitleCasePipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatDividerModule, MatButtonModule, TitleCasePipe],
  template: `
    <h1 mat-dialog-title class="title">
      {{ data.name | titlecase }} <small>(#{{ data.id }})</small>
    </h1>

    <div mat-dialog-content>
      <img [src]="data.sprite" [alt]="data.name">
      <mat-divider></mat-divider>
      <p><strong>Altura:</strong> {{ data.height }} dm</p>
      <p><strong>Peso:</strong> {{ data.weight }} hg</p>
    </div>

    <div mat-dialog-actions align="end">
      <button mat-raised-button color="primary" mat-dialog-close>Cerrar</button>
    </div>
  `,
  styles: [`
    .title { text-align:center; }
    img { display:block; margin:0 auto 8px; width:200px; }
    mat-dialog-content { text-align:center; }
  `]
})
export class PokemonDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
