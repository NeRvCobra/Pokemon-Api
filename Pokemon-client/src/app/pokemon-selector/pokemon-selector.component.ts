import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, map, startWith } from 'rxjs';
import { PokeApiService } from '../poke-api.service';

@Component({
  selector: 'app-pokemon-selector',
  standalone: true,
  templateUrl: './pokemon-selector.component.html',
  styleUrls: ['./pokemon-selector.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class PokemonSelectorComponent implements OnInit {
  @Output() selected = new EventEmitter<string[]>();

  allPokemon: string[] = [];
  control = new FormControl<string[]>([]);
  searchCtrl = new FormControl('');
  typeCtrl = new FormControl('all');
  loading = true;
  types: string[] = [];
  filteredList: string[] = [];
  allSelected = false;

  filtered$ = this.searchCtrl.valueChanges.pipe(
    startWith(''),
    debounceTime(200),
    map(text => this.allPokemon.filter(n =>
      n.toLowerCase().includes(text?.toLowerCase() ?? '')))
  );

  constructor(private api: PokeApiService) {}

  ngOnInit(): void {
    // ① carga tipos
    this.api.getTypes().subscribe(list => this.types = ['all', ...list]);

    // ② carga nombres iniciales = todos
    this.api.getAllNames().subscribe(n => {
      this.allPokemon = n; this.loading = false; this.searchCtrl.setValue('');
    });

    // ③ reactiva filtrado por tipo
    this.typeCtrl.valueChanges.subscribe(t => this.onTypeChange(t));

    // Cada vez que cambia el filtrado, actualizamos la lista visible
    this.filtered$.subscribe(list => {
      this.filteredList = list;
      // y reiniciamos el flag si se borró todo
      if (list.length === 0) this.allSelected = false;
    });

    // Si el usuario marca/desmarca manualmente, actualizamos el flag
    this.control.valueChanges.subscribe(vals => {
      this.allSelected = Array.isArray(vals)
        && vals.length === this.filteredList.length
        && this.filteredList.length > 0;
    });
  }

  selectAll(): void {
    if (this.allSelected) {
      this.control.setValue([]);
    } else {
      this.control.setValue(this.filteredList);
    }
  }


  submit(): void {
    if (this.control.value?.length) {
      this.selected.emit(this.control.value);
    }
  }

  onTypeChange(t: string|null) {
    this.loading = true;
    (t && t !== 'all'
      ? this.api.getPokemonByType(t)
      : this.api.getAllNames()
    ).subscribe(list => {
      this.allPokemon = list;           // refresca drop-down
      this.control.setValue([]);        // limpia selección
      this.loading = false;
      this.searchCtrl.setValue('');
    });
  }
}
