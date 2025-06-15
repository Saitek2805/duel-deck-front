import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CardRarityService {
  private apiUrl = `${environment.apiUrl}/card-rarities`;

  constructor(private http: HttpClient) {}

  getRarities(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
