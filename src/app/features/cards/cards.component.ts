import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core'; // Importa las utilidades necesarias para el componente.
import { CommonModule } from '@angular/common'; // Importa CommonModule para directivas como ngIf y ngFor.
import { CardService } from '../../core/services/card.service'; // Importa el servicio para obtener las cartas.
import { Router } from '@angular/router'; // Importa el Router para realizar la redirección.
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';



@Component({
    selector: 'app-cards', // Selector del componente.
    imports: [CommonModule, MatTableModule,MatPaginatorModule,MatSortModule], // Módulos necesarios para las funcionalidades comunes de Angular.
    templateUrl: './cards.component.html', // Archivo de plantilla HTML asociado.
    styleUrls: ['./cards.component.scss'], // Archivo de estilos SCSS asociado.
})

export class CardsComponent implements OnInit {
    displayedColumns: string[] = ['id','name','expansion','type'];

    dataSource = new MatTableDataSource<any>([]);

    totalElements: number = 0 ;

    totalPages: number =0;

    currentPage: number =0;

    pageSize: number = 10;

    sortColumn: string = 'name';

    sortDirection: string = 'asc';
    
    error: string | null = null; // Almacena un mensaje de error si ocurre.

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    @ViewChild(MatSort) sort!: MatSort;


    constructor(
        private cardService: CardService,
        private router: Router
        ) {} // Inyecta el servicio RegionsService y el Router.

        ngOnInit() {
            this.fetchCards(this.currentPage, this.pageSize, this.sortColumn, this.sortDirection);
        
        }
        
        /**
         * Método que se ejecuta después de que la vista ha sido inicializada.
         * Se usa para asociar el paginador y la ordenación a la tabla.
         */
        ngAfterViewInit() {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        
            // Suscripción al evento de cambio de ordenación
            this.sort.sortChange.subscribe((sort: Sort) => this.handleSortEvent(sort));
        }

        fetchCards(page: number, size: number, sortColumn: string, sortDirection: string) {
            console.log(`Llamando al servicio con página: ${page}, tamaño: ${size}, orden: ${sortColumn} ${sortDirection}`);
        
            this.cardService.fetchCards(page, size, sortColumn, sortDirection).subscribe({
                next: (res: any) => {
                    console.log(`Datos recibidos: ${res.content.length} elementos, total páginas: ${res.totalPages}`);
        
                    // Se actualiza la fuente de datos con los nuevos registros
                    this.dataSource.data = res.content;
                    this.totalElements = res.totalElements;
                    this.totalPages = res.totalPages;
                    this.currentPage = res.number;
                    this.pageSize = res.size;

                    this.groupCardsByExpansion();
        
                    // Se actualiza el paginador y la vista
                    setTimeout(() => {
                        this.paginator.length = this.totalElements;
                        this.paginator.pageIndex = this.currentPage;
                        this.paginator.pageSize = this.pageSize;
                    });
                },
                error: (err) => {
                    console.error('Error al obtener datos:', err);
        
                    // Si el error es de autenticación, se redirige al usuario a la página de acceso denegado
                    if (err.status === 403) {
                        this.router.navigate(['/forbidden']);
                    } else {
                        this.error = 'Error al cargar las cartas';
                    }
                },
            });
        }

        handlePageEvent(event: PageEvent) {
            console.log(`Cambio de página detectado: Página ${event.pageIndex}, Tamaño: ${event.pageSize}`);
            this.fetchCards(event.pageIndex, event.pageSize, this.sortColumn, this.sortDirection);
        }
        
        /**
         * Maneja el evento de cambio de ordenación en la tabla.
         * Llama nuevamente al servicio con la nueva columna y dirección de ordenación.
         * @param sort Evento de ordenación que contiene la columna y la dirección ('asc' o 'desc').
         */
        handleSortEvent(sort: Sort) {
            console.log(`Cambio de orden detectado: Ordenando por ${sort.active} (${sort.direction})`);
        
            this.sortColumn = sort.active;
            this.sortDirection = sort.direction || 'asc'; // Si no hay dirección, por defecto 'asc'
        
            this.fetchCards(this.currentPage, this.pageSize, this.sortColumn, this.sortDirection);
        }

        groupedCards: { expansion: string; cards: any[] }[] = [];



groupCardsByExpansion() {
  const grouped = new Map<string, any[]>();
  for (const card of this.dataSource.data) {
    const expansionName = card.expansion?.name || 'Desconocida';
    if (!grouped.has(expansionName)) {
      grouped.set(expansionName, []);
    }
    grouped.get(expansionName)!.push(card); // el ! evita el warning innecesario aquí
  }

  this.groupedCards = Array.from(grouped.entries()).map(([expansion, cards]) => ({
    expansion,
    cards,
  }));
}
  getImageUrl(card: any): string {
  if (!card.image) return '';
  if (card.image.startsWith('http')) return card.image; // ya es URL completa

  // prefijá la URL base del backend
  return `http://localhost:8080/uploads${card.image.startsWith('/') ? '' : '/'}${card.image}`;
}




}