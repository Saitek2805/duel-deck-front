import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../enviroments/enviroment';
import { Card } from '../../models/card';


@Injectable({
 providedIn: 'root'
})
export class CardService {


 constructor(private http: HttpClient, private authService: AuthService) { }


 /**
 * Método para obtener las cartas desde la API.
 * @returns Observable que emite la lista de cartas.
 */
fetchCards(page: number, size: number, sortColumn: string, sortDirection: string): Observable<any> {
  const params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set('sort', `${sortColumn},${sortDirection}`);

  // La petición se hace sin encabezado Authorization
  return this.http.get(`${environment.apiUrl}/cards`, { params: params });
}

 getCardById(cardId: number): Observable<Card> {
  return this.http.get<Card>(`${environment.apiUrl}/cards/${cardId}`);
}
createCard(formData: FormData) {
  return this.http.post(`${environment.apiUrl}/cards`, formData);
}
updateCard(id: number, formData: FormData) {
  return this.http.put(`${environment.apiUrl}/cards/${id}`, formData);
}
deleteCard(id: number) {
  return this.http.delete(`${environment.apiUrl}/cards/${id}`);
}


}
