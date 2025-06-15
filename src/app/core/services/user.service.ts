import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs';

// Puedes definir la interfaz si quieres más tipado:
export interface UserDTO {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  image?: string;
  enabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${environment.apiUrl}/users`);
  }

  updateUserEnabled(id: number, enabled: boolean): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${environment.apiUrl}/users/${id}/enabled`, { enabled });
  }

  getUserByUsername(username: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${environment.apiUrl}/users/username/${username}`);
  }
}
