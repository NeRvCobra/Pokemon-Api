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
  loading = true;

  filtered$ = this.searchCtrl.valueChanges.pipe(
    startWith(''),
    debounceTime(200),
    map(text => this.allPokemon.filter(n =>
      n.toLowerCase().includes(text?.toLowerCase() ?? '')))
  );

  constructor(private api: PokeApiService) {}

  ngOnInit(): void {
    this.api.getAllNames().subscribe(list => {
      this.allPokemon = list;
      this.loading = false;
      this.searchCtrl.setValue('');
    });
  }

  submit() {
    if (this.control.value?.length) {
      this.selected.emit(this.control.value);
    }
  }
}
