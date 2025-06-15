import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { DeckCardDTO } from '../../models/deck-card-dto';

export interface Deck {
  id: number;
  user_id: number;
  name: string;
  description: string;
  image?: string;
  userName: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  createDeck(data: any) {
  return this.http.post<any>(`${this.apiUrl}`, data);
}

  private apiUrl = `${environment.apiUrl}/decks`;
  private deckCardsApiUrl = `${environment.apiUrl}/deck-cards`;

  constructor(private http: HttpClient) {}

  // Simple, todos los mazos (sin paginación ni auth)
  getAllDecks(): Observable<Deck[]> {
    return this.http.get<Deck[]>(this.apiUrl);
  }

  getCardsInDeck(deckId: number): Observable<DeckCardDTO[]> {
    return this.http.get<DeckCardDTO[]>(`${this.deckCardsApiUrl}/deck/${deckId}`);
  }

  getDeckById(id: number): Observable<Deck> {
  return this.http.get<Deck>(`${this.apiUrl}/${id}`);
}
  fetchMyDecks(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/my`);
}

updateDeck(id: number, data: any) {
  return this.http.put(`${this.apiUrl}/${id}`, data);
}

  addCardToDeck(deckId: number, cardId: number, quantity: number) {
  // Si tu backend espera un array de DTOs
  return this.http.post(`${environment.apiUrl}/deck-cards`, [{
    deckId,
    cardId,
    quantity
  }]);
}

  deleteCardFromDeck(deckId: number, cardId: number) {
  return this.http.delete(`${this.deckCardsApiUrl}/deck/${deckId}/card/${cardId}`);
}

  deleteDeck(id: number) {
  return this.http.delete(`${this.apiUrl}/${id}`);
}

}
