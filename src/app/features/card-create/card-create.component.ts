import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardService } from '../../core/services/card.service';
import { ExpansionService } from '../../core/services/expansion.service';
import { CardAttributeService } from '../../core/services/card-attribute.service';
import { CardTypeService } from '../../core/services/card-type.service';
import { CardTypingService } from '../../core/services/card-typing.service';
import { CardRarityService } from '../../core/services/card-rarity.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-card-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './card-create.component.html'
})
export class CardCreateComponent implements OnInit {
  selectedImageFile: File | null = null;
  imagePreview: string | null = null;

  cardForm!: FormGroup;
  expansions: any[] = [];
  attributes: any[] = [];
  types: any[] = [];
  typings: any[] = [];
  rarities: any[] = [];
  creating = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private cardService: CardService,
    private expansionService: ExpansionService,
    private cardAttributeService: CardAttributeService,
    private cardTypeService: CardTypeService,
    private cardTypingService: CardTypingService,
    private cardRarityService: CardRarityService,
    private router: Router
  ) {}

  ngOnInit() {
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

    // Cargar selectores
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
  }

  onSubmit() {
  if (this.cardForm.invalid) return;
  this.creating = true;

  const formData = new FormData();
  // 'card' debe ir como JSON, como espera tu backend
  formData.append('card', new Blob([JSON.stringify(this.cardForm.value)], { type: 'application/json' }));

  if (this.selectedImageFile) {
    formData.append('imageFile', this.selectedImageFile);
  }

  this.cardService.createCard(formData).subscribe({
    next: () => {
      this.success = '¡Carta creada con éxito!';
      setTimeout(() => this.router.navigate(['/cards']), 1200);
    },
    error: () => {
      this.error = 'No se pudo crear la carta';
      this.creating = false;
    }
  });}
  onImageChange(event: any) {
  const file: File = event.target.files[0];
  if (file) {
    this.selectedImageFile = file;
    const reader = new FileReader();
    reader.onload = e => this.imagePreview = reader.result as string;
    reader.readAsDataURL(file);
  }
}

}
