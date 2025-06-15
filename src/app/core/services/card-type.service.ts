import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CardTypeService {
  private apiUrl = `${environment.apiUrl}/card-types`;

  constructor(private http: HttpClient) {}

  getTypes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
