import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpansionService } from '../../core/services/expansion.service';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-expansion-detail',
  templateUrl: './expansion-detail.component.html',
  styleUrls: ['./expansion-detail.component.scss'],
  standalone: true,
  imports: [CommonModule,RouterLink,MatIcon]
})
export class ExpansionDetailComponent implements OnInit {
  expansion: any = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private expansionService: ExpansionService,
    private router: Router
  ) {}

  ngOnInit(): void {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  if (isNaN(id)) {
    this.error = 'ID inválido';
    return;
  }

  this.expansionService.getExpansionById(id).subscribe({
    next: (res) => {
      this.expansion = res;
    },
    error: (err) => {
      console.error('Error al cargar la expansión:', err);
      if (err.status === 403) {
        this.router.navigate(['/forbidden']);
      } else {
        this.error = 'No se pudo cargar la expansión.';
      }
    }
  });
}


  getImageUrl(expansion: any): string {
    if (!expansion.image) return '';
    if (expansion.image.startsWith('http')) return expansion.image;
    return `http://localhost:8080/uploads/${expansion.image}`;
  }
}
