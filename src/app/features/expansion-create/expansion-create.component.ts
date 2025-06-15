import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExpansionService } from '../../core/services/expansion.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expansion-create',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './expansion-create.component.html'
})
export class ExpansionCreateComponent implements OnInit {
  expansionForm!: FormGroup;
  creating = false;
  error: string | null = null;
  success: string | null = null;
  imagePreview: string | null = null;
  selectedImageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private expansionService: ExpansionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.expansionForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      releaseDate: [null, Validators.required],
      description: ['', [Validators.maxLength(1000)]],
      image: ['']
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
    if (this.expansionForm.invalid) return;
    this.creating = true;
    const formData = new FormData();
    // 'expansion' debe ir como JSON, como espera tu backend
    const dto = { ...this.expansionForm.value };
    // Asegúrate de que la fecha es un string ISO
    if (dto.releaseDate instanceof Date) {
      dto.releaseDate = dto.releaseDate.toISOString();
    }
    formData.append('expansion', new Blob([JSON.stringify(dto)], { type: 'application/json' }));

    if (this.selectedImageFile) {
      formData.append('imageFile', this.selectedImageFile);
    }

    this.expansionService.createExpansion(formData).subscribe({
      next: () => {
        this.success = '¡Expansión creada!';
        setTimeout(() => this.router.navigate(['/expansions']), 1200);
      },
      error: () => {
        this.error = 'No se pudo crear la expansión';
        this.creating = false;
      }
    });
  }
}
