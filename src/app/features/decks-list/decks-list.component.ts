import { Component, OnInit } from '@angular/core';
import { Deck, DeckService } from '../../core/services/deck.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '../../../enviroments/enviroment';


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

  getDeckImageUrl(imagePath?: string): string {
    if (!imagePath) return 'assets/placeholder.jpg'; // Imagen por defecto
    if (imagePath.startsWith('http')) return imagePath;
  
    // Quita /api si existe en apiUrl
    const baseUrl = environment.apiUrl.endsWith('/api')
      ? environment.apiUrl.slice(0, -4)
      : environment.apiUrl;
  
    return `${baseUrl}/uploads/${imagePath}`;
  }

}
