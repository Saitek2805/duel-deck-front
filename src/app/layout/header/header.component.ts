import { Component, OnInit, OnDestroy , ElementRef, HostListener} from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, MatIconModule, MatDividerModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  userName = '';
  userRoleLabel = 'Usuario autenticado';
  menuVisible = false;
  private subscription: Subscription | null = null;

  constructor(private authService: AuthService, private router: Router,
  private elementRef: ElementRef) {}

  ngOnInit() {
  this.subscription = this.authService.isLoggedIn().subscribe((loggedIn) => {
    this.isLoggedIn = loggedIn;

    if (loggedIn) {
      const user = this.authService.getUser();
      this.userName = user?.fullName || user?.username || 'Usuario';
      this.userRoles = user?.roles || [];

      if (this.hasRoleAdmin) {
        this.userRoleLabel = 'Usuario administrador';
      } else if (this.hasRoleManager) {
        this.userRoleLabel = 'Usuario gestor';
      } else {
        this.userRoleLabel = 'Usuario autenticado';
      }
    } else {
      this.userName = '';
      this.userRoles = [];
      this.userRoleLabel = '';
    }
  });
}


  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  onDatosUsuario() {
    this.router.navigate(['/perfil']);
    this.menuVisible = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.menuVisible = false;
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  @HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent): void {
  const clickedInside = this.elementRef.nativeElement.contains(event.target);
  if (!clickedInside && this.menuVisible) {
    this.menuVisible = false;
  }
}

//personalziacion del menu desplegable
  userRoles: string[] = [];

get hasRoleAdmin(): boolean {
  return this.userRoles.includes('ROLE_ADMIN');
}

get hasRoleManager(): boolean {
  return this.userRoles.includes('ROLE_MANAGER');
}

get isRegularUser(): boolean {
  return !this.hasRoleAdmin && !this.hasRoleManager;
}

}
