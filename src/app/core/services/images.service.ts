import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  private apiUrl = `${environment.apiUrl}/images`;

  constructor(private http: HttpClient) {}

  /**
   * Sube una imagen al backend
   * @param file El archivo de imagen a subir
   * @returns Observable con { fileName: string }
   */
  uploadImage(file: File): Observable<{ fileName: string }> {
    const formData = new FormData();
    formData.append('imageFile', file);
    return this.http.post<{ fileName: string }>(`${this.apiUrl}/upload`, formData);
  }

  /**
   * Devuelve la URL pública de una imagen almacenada en el servidor
   * @param fileName Nombre de la imagen (como lo guarda el backend)
   * @returns La URL pública
   */
  getPublicImageUrl(fileName: string): string {
    if (!fileName) return '';
    return `/uploads/${fileName}`;
    // Si necesitas la URL completa, usa:
    // return `${environment.apiUrl}/uploads/${fileName}`;
  }
}
