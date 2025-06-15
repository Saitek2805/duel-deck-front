import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CardTypingService {
  private apiUrl = `${environment.apiUrl}/card-typings`;

  constructor(private http: HttpClient) {}

  getTypings(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
