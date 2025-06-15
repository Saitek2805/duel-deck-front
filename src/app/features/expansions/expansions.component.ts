import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpansionService } from '../../core/services/expansion.service';
import { Router } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { environment } from '../../../enviroments/enviroment';

@Component({
  selector: 'app-expansions',
  templateUrl: './expansions.component.html',
  styleUrls: ['./expansions.component.scss'],
  standalone: true,
  imports: [CommonModule, MatPaginatorModule,RouterModule]
})
export class ExpansionsComponent implements OnInit {
  expansions: any[] = [];
  totalElements = 0;
  currentPage = 0;
  pageSize = 10;
  sortColumn = 'name';
  sortDirection = 'asc';
  isLoading = true;

  constructor(private expansionService: ExpansionService, private router: Router) {}

  ngOnInit(): void {
    this.fetchExpansions(this.currentPage, this.pageSize, this.sortColumn, this.sortDirection);
  }

  fetchExpansions(page: number, size: number, sortColumn: string, sortDirection: string): void {
    this.isLoading = true;
    this.expansionService.fetchExpansions(page, size, sortColumn, sortDirection).subscribe({
      next: (res) => {
        this.expansions = res.content;
        this.totalElements = res.totalElements;
        this.currentPage = res.number;
        this.pageSize = res.size;
         this.isLoading = false;
         console.log('Expansions:', this.expansions);

      },
      error: (err) => {
        console.error('Error al obtener expansiones:', err);
        if (err.status === 403) {
          this.router.navigate(['/forbidden']);
           this.isLoading = false;
        }
      }
    });
  }

  handlePageEvent(event: PageEvent): void {
    this.fetchExpansions(event.pageIndex, event.pageSize, this.sortColumn, this.sortDirection);
  }

  getImageUrl(expansion: any): string {
  if (!expansion?.image) return '';
  if (expansion.image.startsWith('http')) return expansion.image;

  // Obtener la base del backend sin el "/api" al final si lo tiene
  const baseUrl = environment.apiUrl.endsWith('/api')
    ? environment.apiUrl.slice(0, -4)
    : environment.apiUrl;

  // Evita dobles barras
  return `${baseUrl}/uploads${expansion.image.startsWith('/') ? '' : '/'}${expansion.image}`;
}


}
