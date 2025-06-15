import { Component, OnInit } from '@angular/core';
import { Deck, DeckService } from '../../core/services/deck.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-decks-list',
  templateUrl: './decks-list.component.html',
  imports: [
    MatCardModule,
    MatProgressSpinnerModule,
    CommonModule,
    RouterLink
  ],
})
export class DecksListComponent implements OnInit {
  decks: Deck[] = [];
  loading = true;

  constructor(private deckService: DeckService) {}

  ngOnInit(): void {
    this.deckService.getAllDecks().subscribe({
      next: decks => {
        this.decks = decks;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        // Manejo de error
      }
    });
  }

  getDeckImageUrl(imagePath: string): string {
  // Si imagePath ya viene con el host y todo, solo retorna imagePath
  // Si viene solo el nombre, concatena la URL base del backend
  return imagePath.startsWith('http')
    ? imagePath
    : `http://localhost:8080/uploads/${imagePath}`;
}

}
