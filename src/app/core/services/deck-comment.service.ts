import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeckCommentDTO } from '../../models/deck-comment-dto';
import { DeckCommentCreateDTO } from '../../models/deck-comment-create-dto';
import { environment } from '../../../enviroments/enviroment';

@Injectable({ providedIn: 'root' })
export class DeckCommentService {
  private apiUrl = `${environment.apiUrl}/deck-comments`;

  constructor(private http: HttpClient) {}

  getCommentsByDeck(deckId: number): Observable<DeckCommentDTO[]> {
    return this.http.get<DeckCommentDTO[]>(`${this.apiUrl}/deck/${deckId}`);
  }

  addComment(comment: DeckCommentCreateDTO): Observable<DeckCommentDTO> {
    return this.http.post<DeckCommentDTO>(this.apiUrl, comment);
  }

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${commentId}`);
  }
}
