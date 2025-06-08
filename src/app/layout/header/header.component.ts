import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-header',
  standalone: true, // si usas componentes standalone
  imports: [RouterLink, CommonModule, MatIconModule, MatDividerModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
    userName = '';
  menuVisible = false;
  private subscription: Subscription | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
  this.subscription = this.authService.isLoggedIn().subscribe((loggedIn) => {
    this.isLoggedIn = loggedIn;
    if (loggedIn) {
      this.userName = this.authService.getUser()?.fullName || this.authService.getUser()?.username || 'Usuario';
    } else {
      this.userName = '';
    }
  });
}


  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  onDatosUsuario() {
    this.router.navigate(['/perfil']); // Ajusta según tu ruta real
    this.menuVisible = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirección tras cerrar sesión
    this.menuVisible = false;
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
