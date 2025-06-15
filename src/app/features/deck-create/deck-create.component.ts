import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DeckService } from '../../core/services/deck.service';
import { Router } from '@angular/router';
import { ImagesService } from '../../core/services/images.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-deck-create',
  templateUrl: './deck-create.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class DeckCreateComponent implements OnInit {
  deckForm!: FormGroup;
  loading = false;
  creating = false;
  error = '';
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private deckService: DeckService,
    private imagesService: ImagesService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.deckForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      image: ['', [Validators.maxLength(255)]]
    });
  }

  onSubmit() {
  if (this.deckForm.invalid) return;
  this.creating = true;
  const deckData = this.deckForm.value;

  // Obtener userId antes de crear el mazo
  this.authService.getUserIdFromApi().subscribe({
    next: (userId) => {
      if (!userId) {
        this.error = 'No se ha podido identificar el usuario';
        this.creating = false;
        return;
      }
      deckData.userId = userId;

      this.deckService.createDeck(deckData).subscribe({
        next: (deck) => {
          this.creating = false;
          this.router.navigate(['/decks', deck.id]);
        },
        error: () => {
          this.creating = false;
          this.error = 'No se pudo crear el mazo';
        }
      });
    },
    error: () => {
      this.creating = false;
      this.error = 'No se pudo identificar el usuario';
    }
  });
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
          // Maneja el error si quieres
        }
      });
    }
  }
}
