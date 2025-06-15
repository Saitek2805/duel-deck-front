import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CardService } from '../../core/services/card.service';
import { ExpansionService } from '../../core/services/expansion.service';
import { CardAttributeService } from '../../core/services/card-attribute.service';
import { CardTypeService } from '../../core/services/card-type.service';
import { CardTypingService } from '../../core/services/card-typing.service';
import { CardRarityService } from '../../core/services/card-rarity.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
// Angular Material imports:
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Card } from '../../models/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-card-edit',
  standalone: true,
  imports: [MatIcon,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './card-edit.component.html'
})
export class CardEditComponent implements OnInit {
  cardForm!: FormGroup;
  cardId!: number;
  loading = true;
  saving = false;
  error: string | null = null;
  success: string | null = null;
  imagePreview: string | null = null;
  selectedImageFile: File | null = null;
  
  expansions: any[] = [];
  attributes: any[] = [];
  types: any[] = [];
  typings: any[] = [];
  rarities: any[] = [];

    allCards: Card[] = [];
  selectedCardId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private cardService: CardService,
    private expansionService: ExpansionService,
    private cardAttributeService: CardAttributeService,
    private cardTypeService: CardTypeService,
    private cardTypingService: CardTypingService,
    private cardRarityService: CardRarityService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Cargar todas las cartas para el selector
    this.cardService.fetchCards(0, 500, 'name', 'asc').subscribe({
      next: res => this.allCards = res.content || res,
      error: () => this.allCards = []
    });
    this.cardId = Number(this.route.snapshot.paramMap.get('id'));

    // Inicializar el formulario vacío (lo rellenamos tras cargar la carta)
    this.cardForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      type: [null, [Validators.required]],
      typing: [null, [Validators.required]],
      attribute: [null, [Validators.required]],
      level: [null],
      attack: [null],
      defense: [null],
      rarity: [null, [Validators.required]],
      image: ['', [Validators.maxLength(255)]],
      description: ['', [Validators.maxLength(255)]],
      expansion: [null, Validators.required]
    });

    // Cargar todos los selectores en paralelo
    this.expansionService.fetchExpansions(0, 100, 'name', 'asc').subscribe({
      next: res => this.expansions = res.content || res,
      error: () => this.expansions = []
    });
    this.cardAttributeService.getAttributes().subscribe({
      next: res => this.attributes = res,
      error: () => this.attributes = []
    });
    this.cardTypeService.getTypes().subscribe({
      next: res => this.types = res,
      error: () => this.types = []
    });
    this.cardTypingService.getTypings().subscribe({
      next: res => this.typings = res,
      error: () => this.typings = []
    });
    this.cardRarityService.getRarities().subscribe({
      next: res => this.rarities = res,
      error: () => this.rarities = []
    });

    // Cargar la carta para editar
    this.cardService.getCardById(this.cardId).subscribe({
  next: (card: any)=> {
    this.cardForm.patchValue({
      code: card.code,
      name: card.name,
      type: card.type,
      typing: card.typing,
      attribute: card.attribute,
      level: card.level,
      attack: card.attack,
      defense: card.defense,
      rarity: card.rarity,
      image: card.image,
      description: card.description,
      expansion: card.expansion?.id ?? null // <-- aquí el cambio
    });
    this.imagePreview = card.image ? this.getCardImageUrl(card.image) : null;
    this.loading = false;
  },
  error: () => {
    this.error = 'No se pudo cargar la carta';
    this.loading = false;
  }
});

  }

  onImageChange(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.cardForm.invalid) return;
    this.saving = true;
    this.error = null;
    this.success = null;

    const formData = new FormData();
    // Usar el mismo formato que el backend espera
    formData.append('card', new Blob([JSON.stringify(this.cardForm.value)], { type: 'application/json' }));
    if (this.selectedImageFile) {
      formData.append('imageFile', this.selectedImageFile);
    }

    this.cardService.updateCard(this.cardId, formData).subscribe({
      next: () => {
        this.success = '¡Carta actualizada!';
        setTimeout(() => this.router.navigate(['/cards']), 1200);
        this.saving = false;
      },
      error: () => {
        this.error = 'No se pudo actualizar la carta';
        this.saving = false;
      }
    });
  }

  getCardImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    return imagePath.startsWith('http')
      ? imagePath
      : `http://localhost:8080/uploads/${imagePath}`;
  }
  onCardSelect(cardId: number) {
  if (!cardId) return;
  this.router.navigate(['/cards', cardId, 'edit']);
}
onDeleteCard() {
  if (confirm('¿Estás seguro de que quieres eliminar esta carta? Esta acción no se puede deshacer.')) {
    this.cardService.deleteCard(this.cardId).subscribe({
      next: () => {
       this.router.navigateByUrl('/cards');

      },
      error: () => {
        this.router.navigateByUrl('/cards');
      }
    });
  }
}



}
