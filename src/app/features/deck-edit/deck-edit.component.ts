import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeckService } from '../../core/services/deck.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatFormField } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatError } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { ImagesService } from '../../core/services/images.service';
import { CardService } from '../../core/services/card.service';
import { MatOption} from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-deck-edit',
  templateUrl: './deck-edit.component.html',
  imports:[CommonModule,MatCardModule,MatInputModule,MatButtonModule,MatIconModule,MatProgressSpinnerModule,MatFormField,MatLabel,MatError,ReactiveFormsModule,MatOption,MatIcon,MatSelectModule,MatFormFieldModule]
})
export class DeckEditComponent implements OnInit {

  deckForm!: FormGroup;
  deckId!: number;
  loading = true;
  error = '';
  imagePreview: string | null = null;
  addCardForm!: FormGroup;
  allCards: any[] = [];
  deckCards: any[] = [];
  addingCard = false;

  constructor(
    private fb: FormBuilder,
    private deckService: DeckService,
    private route: ActivatedRoute,
    private router: Router,
    private imagesService: ImagesService,
    private cardService: CardService
  ) {}

  ngOnInit() {
    this.deckId = Number(this.route.snapshot.paramMap.get('id'));
    this.deckService.getDeckById(this.deckId).subscribe({
      next: (deck) => {
        this.deckForm = this.fb.group({
          name: [deck.name, [Validators.required, Validators.maxLength(100)]],
          description: [deck.description, [Validators.required, Validators.maxLength(255)]],
          image: [deck.image || '', [Validators.maxLength(255)]]
        });
        this.imagePreview = deck.image ? this.getDeckImageUrl(deck.image) : null;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error cargando el mazo';
        this.loading = false;
      }
    });
    this.addCardForm = this.fb.group({
      cardId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(3)]]
    });
    // Obtener todas las cartas disponibles
    this.cardService.fetchCards(0, 500, 'name', 'asc').subscribe({
      next: res => this.allCards = res.content || res, // según tu API
      error: () => this.allCards = []
    });

    // Obtener cartas que ya están en el mazo
    this.deckService.getCardsInDeck(this.deckId).subscribe({
      next: res => this.deckCards = res,
      error: () => this.deckCards = []
    });
  }

  onSubmit() {
    if (this.deckForm.invalid) return;
    const deckData = this.deckForm.value;
    this.deckService.updateDeck(this.deckId, deckData).subscribe({
      next: () => this.router.navigate(['/decks', this.deckId]),
      error: () => this.error = 'No se pudo actualizar el mazo'
    });
  }

  

  getDeckImageUrl(imagePath: string): string {
  // Si imagePath ya viene con el host y todo, solo retorna imagePath
  // Si viene solo el nombre, concatena la URL base del backend
  return imagePath.startsWith('http')
    ? imagePath
    : `http://localhost:8080/uploads/${imagePath}`;
}
onImageChange(event: any) {
  const file: File = event.target.files[0];
  if (file) {
    this.imagesService.uploadImage(file).subscribe({
      next: (res) => {
        this.deckForm.get('image')?.setValue(res.fileName);
        this.imagePreview = this.imagesService.getPublicImageUrl(res.fileName);
      },
      error: () => {
        // Manejar error
      }
    });
  }
}
onAddCard() {
    if (this.addCardForm.invalid) return;
    this.addingCard = true;
    const { cardId, quantity } = this.addCardForm.value;
    // Llama a tu servicio para añadir carta al mazo
    this.deckService.addCardToDeck(this.deckId, cardId, quantity).subscribe({
      next: () => {
        // Recargar las cartas del mazo
        this.deckService.getCardsInDeck(this.deckId).subscribe({
          next: res => this.deckCards = res,
          error: () => {}
        });
        this.addCardForm.reset({ cardId: null, quantity: 1 });
        this.addingCard = false;
      },
      error: () => this.addingCard = false
    });
  }

  onDeleteDeckCard(deckCard: any) {
  if (!deckCard || !deckCard.cardId) return;
  // Puedes añadir confirmación si quieres:
  if (!confirm(`¿Eliminar "${deckCard.cardName}" del mazo?`)) return;

  this.deckService.deleteCardFromDeck(this.deckId, deckCard.cardId).subscribe({
    next: () => {
      // Vuelve a cargar las cartas del mazo
      this.deckService.getCardsInDeck(this.deckId).subscribe({
        next: res => this.deckCards = res,
        error: () => {}
      });
    }
  });
}
  onDeleteDeck() {
  if (confirm('¿Estás seguro de que quieres borrar este mazo? Esta acción no se puede deshacer.')) {
    this.deckService.deleteDeck(this.deckId).subscribe({
      next: () => {
        // Redirige a la lista de mazos o a donde prefieras
        this.router.navigate(['/decks']);
      },
      error: () => {
        this.error = 'No se pudo borrar el mazo';
      }
    });
  }
}


}
