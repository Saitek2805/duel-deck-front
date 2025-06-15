import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeckService,Deck } from '../../core/services/deck.service';
import { AuthService } from '../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { DeckCardDTO } from '../../models/deck-card-dto';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators'
import { CardService } from '../../core/services/card.service'; 
import { Card } from '../../models/card'; 
import { DeckCommentService } from '../../core/services/deck-comment.service';
import { DeckCommentDTO } from '../../models/deck-comment-dto';
import { DeckCommentCreateDTO } from '../../models/deck-comment-create-dto';
import { MatFormField } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-decks-detail',
  templateUrl: './deck-details.component.html',
  imports:[MatCardModule,MatProgressSpinnerModule,CommonModule,MatFormField,FormsModule,MatInputModule,MatIcon]
})
export class DecksDetailsComponent implements OnInit {
  deck?: Deck;
  loading = true;
  deckId!: number;
  isLoggedIn = false;
  detailedCards: Card[] = [];
  cards: DeckCardDTO[] = [];
  cardsLoading = true;
  comments: DeckCommentDTO[] = [];
  commentsLoading = true;
  newComment = '';
  isAddingComment = false;

  

  constructor(
    private route: ActivatedRoute,
    private deckService: DeckService,
    private authService: AuthService,
     private cardService: CardService,
     private deckCommentService: DeckCommentService
  ) {}

  ngOnInit(): void {
  this.deckId = Number(this.route.snapshot.paramMap.get('id'));

  // Si isLoggedIn es Observable, SUSCRÍBETE:
  this.authService.isLoggedIn().subscribe(isLogged => {
    this.isLoggedIn = isLogged;
  });

  this.deckService.getDeckById(this.deckId).subscribe({
    next: deck => {
      this.deck = deck;
      this.loading = false;
    },
    error: err => { this.loading = false; }
  });
  this.deckService.getCardsInDeck(this.deckId).subscribe({
  next: cards => {
     console.log('Cartas base:', cards);
    this.cards = cards;
    this.cardsLoading = false;

    if (!cards || cards.length === 0) {
      this.detailedCards = [];
      return;
    }

    const requests = cards.map(deckCard =>
      this.cardService.getCardById(deckCard.cardId).pipe(
        map(card => ({ ...card, quantity: deckCard.quantity }))
      )
    );

    forkJoin(requests).subscribe({
      
      next: (cards: Card[]) => {
        console.log('Cartas detalladas:', cards);
        this.detailedCards = cards.flatMap(card =>
          Array(card.quantity).fill(card)
        );
      },
      error: err => {
        this.detailedCards = [];
      }
    });
    
  },
  error: err => { this.cardsLoading = false; }
});
  console.log(this.authService.getUser())
  
    this.loadComments();
}

getDeckImageUrl(imagePath?: string): string {
  if (!imagePath) return 'assets/placeholder.jpg'; // O cualquier imagen por defecto que quieras
  return imagePath.startsWith('http')
    ? imagePath
    : `http://localhost:8080/uploads/${imagePath}`;
}
  
  repeatByQuantity(card: any): any[] {
  // Retorna un array del tamaño de la cantidad, para *ngFor
  return Array(card.quantity).fill(card);
}
  getImageUrl(card: any): string {
  if (!card.image) return '';
  if (card.image.startsWith('http')) return card.image; // ya es URL completa

  // prefijá la URL base del backend
  return `http://localhost:8080/uploads${card.image.startsWith('/') ? '' : '/'}${card.image}`;
}

  loadComments() {
  this.commentsLoading = true;
  this.deckCommentService.getCommentsByDeck(this.deckId).subscribe({
    next: comments => {
      this.comments = comments;
      this.commentsLoading = false;
    },
    error: err => { this.commentsLoading = false; }
  });
}
addComment() {
  if (!this.newComment.trim()) return;
  this.isAddingComment = true;

  this.authService.getUserIdFromApi().subscribe(userId => {
    if (!userId) {
      // Maneja el caso de error (por ejemplo, muestra mensaje "No se pudo obtener el usuario")
      this.isAddingComment = false;
      return;
    }
    const comment: DeckCommentCreateDTO = {
      deckId: this.deckId,
      userId,
      content: this.newComment.trim()
    };

    this.deckCommentService.addComment(comment).subscribe({
      next: () => {
        this.loadComments();
        this.newComment = '';
        this.isAddingComment = false;
      },
      error: () => { this.isAddingComment = false; }
    });
  });
}
  deleteComment(commentId: number) {
  if (!confirm('¿Seguro que quieres borrar este comentario?')) return;
  this.isAddingComment = true;
  this.deckCommentService.deleteComment(commentId).subscribe({
    next: () => {
      this.loadComments();
      this.isAddingComment = false;
    },
    error: () => {
      this.isAddingComment = false;
      // Puedes mostrar un mensaje de error si quieres
    }
  });
}
  get hasRoleAdmin(): boolean {
  const user = this.authService.getUser();
  console.log('Evaluando roles:', user);
  if (!user || !user.roles) return false;
  return user.roles.includes('ROLE_ADMIN');
}
isCommentAuthor(comment: DeckCommentDTO): boolean {
  // Obtén el id del usuario logueado (puedes usar getUser() o getUserId())
  // Si tu AuthService ya tiene getUserIdFromApi que devuelve el id actual sincronamente, úsalo
  // Mejor aún, guarda el id del usuario logueado al iniciar sesión
  const user = this.authService.getUser();
  // Si en tu sistema los comentarios tienen el id del autor en comment.userId
  return !!user && (user.username === comment.userName);
}





}
