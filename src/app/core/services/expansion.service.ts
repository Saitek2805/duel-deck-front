import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ExpansionService {
  constructor(private http: HttpClient) {}

  fetchExpansions(page: number, size: number, sortColumn: string, sortDirection: string): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sortColumn},${sortDirection}`);

    return this.http.get(`${environment.apiUrl}/expansions`, { params });
  }

  getExpansionById(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/expansions/${id}`);
  }
  createExpansion(formData: FormData) {
  return this.http.post(`${environment.apiUrl}/expansions`, formData);
}
updateExpansion(id: number, formData: FormData) {
  return this.http.put(`${environment.apiUrl}/expansions/${id}`, formData);
}

deleteExpansion(id: number) {
  return this.http.delete(`${environment.apiUrl}/expansions/${id}`);
}

}


