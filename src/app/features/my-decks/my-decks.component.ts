
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Deck, DeckService } from '../../core/services/deck.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-my-decks',
  templateUrl: './my-decks.component.html',
  imports:[CommonModule,MatCardModule,MatProgressSpinnerModule,MatIcon,RouterLink]
})
export class MyDecksComponent implements OnInit {
onEditClick(deckId: number, event: Event) {
  event.stopPropagation(); // Así el click NO navega por la card
  this.router.navigate(['/decks', deckId, 'edit']);
}

  myDecks: any[] = [];
  loading = true;

  constructor(private deckService: DeckService,private router: Router) {}

  ngOnInit() {
    this.deckService.fetchMyDecks().subscribe({
      next: decks => {
        this.myDecks = decks;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
  editDeck(deckId: number) {
  this.router.navigate(['/decks', deckId, 'edit']);
}

  // Navega a la creación de mazo
  createDeck() {
    this.router.navigate(['/decks/create']);
  }

  getDeckImageUrl(imagePath: string): string {
  // Si imagePath ya viene con el host y todo, solo retorna imagePath
  // Si viene solo el nombre, concatena la URL base del backend
  return imagePath.startsWith('http')
    ? imagePath
    : `http://localhost:8080/uploads/${imagePath}`;
}
}
