import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CardAttributeService {
  private apiUrl = `${environment.apiUrl}/card-attributes`;

  constructor(private http: HttpClient) {}

  getAttributes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
