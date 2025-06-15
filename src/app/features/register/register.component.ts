import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../enviroments/enviroment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  username = '';
  password = '';
  firstName = '';
  lastName = '';
  image = '';
  error: string | null = null;
  success: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.error = null;
    this.success = null;

    const body = {
      username: this.username,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      image: this.image
    };

    this.http.post(`${environment.apiUrl}/auth/register`, body, { responseType: 'text' }).subscribe({
      next: (res) => {
        this.success = '¡Usuario registrado con éxito! Ahora puedes iniciar sesión.';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        if (err.status === 409) {
          this.error = 'El nombre de usuario ya existe.';
        } else {
          this.error = 'No se pudo registrar el usuario';
        }
      }
    });
  }
}
