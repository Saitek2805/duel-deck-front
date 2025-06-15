import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../enviroments/enviroment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
  profileForm!: FormGroup;
  loading = true;
  saving = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Obtener el username actual (del JWT decodificado)
    const user = this.authService.getUser();
    if (!user?.username) {
      this.error = 'No se ha podido identificar el usuario';
      this.loading = false;
      return;
    }

    this.http.get<any>(`${environment.apiUrl}/users/username/${user.username}`).subscribe({
      next: userData => {
        this.profileForm = this.fb.group({
          username: [{ value: userData.username, disabled: true }],
          firstName: [userData.firstName || '', [Validators.required, Validators.maxLength(100)]],
          lastName: [userData.lastName || '', [Validators.required, Validators.maxLength(100)]],
          image: [userData.image || '', [Validators.maxLength(255)]]
        });
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el perfil';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) return;
    this.saving = true;
    this.error = null;
    this.success = null;

    // Tienes que enviar SOLO los campos editables (no username)
    const { firstName, lastName, image } = this.profileForm.getRawValue();
    const user = this.authService.getUser();
    if (!user || !user.username) {
      this.error = 'No se ha podido identificar el usuario';
      this.loading = false;
      return;
    }
    this.http.put<any>(
      `${environment.apiUrl}/users/username/${user.username}`,
      { firstName, lastName, image }
    ).subscribe({
      next: (res) => {
        this.success = 'Perfil actualizado correctamente';
        this.saving = false;
      },
      error: () => {
        this.error = 'No se pudo actualizar el perfil';
        this.saving = false;
      }
    });
  }

  getUserImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    return imagePath.startsWith('http')
      ? imagePath
      : `/uploads/${imagePath}`;
  }
}
