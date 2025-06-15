import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIcon,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-admin.component.html'
})
export class UserAdminComponent implements OnInit {
  users: any[] = [];
  loading = true;
  error: string | null = null;
  success: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar la lista de usuarios';
        this.loading = false;
      }
    });
  }

  toggleUserEnabled(user: any) {
    const enabled = !user.enabled;
    this.userService.updateUserEnabled(user.id, enabled).subscribe({
      next: (updated: any) => {
        user.enabled = updated.enabled;
        this.success = enabled ? 'Usuario activado' : 'Usuario desactivado';
        setTimeout(() => this.success = null, 2000);
      },
      error: () => {
        this.error = 'No se pudo cambiar el estado del usuario';
        setTimeout(() => this.error = null, 2000);
      }
    });
  }
}
