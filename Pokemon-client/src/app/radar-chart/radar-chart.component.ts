// src/app/radar-chart/radar-chart.component.ts
import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

/* NgChartsModule expone la directiva baseChart */
import { NgChartsModule } from 'ng2-charts';

/* Chart.js: registrar controladores / escalas / plugins */
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);    // ⬅️ se ejecuta solo la primera vez

@Component({
  selector: 'app-radar-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],   // ① SOLO módulos / directivas
  template: `
    <canvas baseChart
            [data]="data"
            [type]="'radar'"
            [options]="opts">
    </canvas>
  `,
  styles: [`canvas{max-width:260px;margin:0 auto;}`]
})
export class RadarChartComponent implements OnChanges {
  /* Recibe el objeto { hp: 80, attack: 82, ... } */
  @Input() stats!: { [k: string]: number };

  data: any;
  opts = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      r: { ticks: { display: false }, pointLabels: { font: { size: 10 } } }
    }
  };

  ngOnChanges(): void {
    if (!this.stats) return;
    this.data = {
      labels: Object.keys(this.stats).map(s => s.toUpperCase()),
      datasets: [
        { data: Object.values(this.stats), fill: true }
      ]
    };
  }
}
