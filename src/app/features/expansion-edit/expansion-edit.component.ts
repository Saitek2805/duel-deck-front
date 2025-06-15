import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExpansionService } from '../../core/services/expansion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-expansion-edit',
  standalone: true,
  imports: [
    MatOptionModule,
    MatSelectModule,
    CommonModule,
    MatIcon,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './expansion-edit.component.html'
})
export class ExpansionEditComponent implements OnInit {
  expansionForm!: FormGroup;
  expansionId!: number;
  loading = true;
  saving = false;
  error: string | null = null;
  success: string | null = null;
  imagePreview: string | null = null;
  selectedImageFile: File | null = null;
  allExpansions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private expansionService: ExpansionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Obtener id de expansión actual
    this.expansionId = Number(this.route.snapshot.paramMap.get('id'));

    // Formulario reactivo
    this.expansionForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      releaseDate: [null, Validators.required],
      description: ['', [Validators.maxLength(1000)]],
      image: ['']
    });

    // Cargar todas las expansiones para el selector
    this.expansionService.fetchExpansions(0, 500, 'name', 'asc').subscribe({
      next: res => this.allExpansions = res.content || res,
      error: () => this.allExpansions = []
    });

    // Cargar datos de la expansión a editar
    this.expansionService.getExpansionById(this.expansionId).subscribe({
      next: (exp: any) => {
        this.expansionForm.patchValue({
          code: exp.code,
          name: exp.name,
          releaseDate: exp.releaseDate ? new Date(exp.releaseDate) : null,
          description: exp.description,
          image: exp.image
        });
        this.imagePreview = exp.image ? this.getExpansionImageUrl(exp.image) : null;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar la expansión';
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

  onExpansionSelect(event: MatSelectChange) {
    const selectedId = event.value;
    if (!selectedId || selectedId === this.expansionId) return;
    this.router.navigate(['/expansions', selectedId, 'edit']);
  }

  onSubmit() {
    if (this.expansionForm.invalid) return;
    this.saving = true;
    this.error = null;
    this.success = null;

    const formData = new FormData();
    const dto = { ...this.expansionForm.value };
    if (dto.releaseDate instanceof Date) {
      dto.releaseDate = dto.releaseDate.toISOString();
    }
    formData.append('expansion', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
    if (this.selectedImageFile) {
      formData.append('imageFile', this.selectedImageFile);
    }

    this.expansionService.updateExpansion(this.expansionId, formData).subscribe({
      next: () => {
        this.success = '¡Expansión actualizada!';
        setTimeout(() => this.router.navigate(['/expansions']), 1200);
        this.saving = false;
      },
      error: () => {
        this.error = 'No se pudo actualizar la expansión';
        this.saving = false;
      }
    });
  }

  onDeleteExpansion() {
    if (confirm('¿Estás seguro de que quieres eliminar esta expansión? Esta acción no se puede deshacer.')) {
      this.error = null;
      this.expansionService.deleteExpansion(this.expansionId).subscribe({
        next: () => {
          this.router.navigate(['/expansions']);
        },
        error: () => {
          this.router.navigate(['/expansions']);
        }
      });
    }
  }

  getExpansionImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    return imagePath.startsWith('http')
      ? imagePath
      : `http://localhost:8080/uploads/${imagePath}`;
  }
}
