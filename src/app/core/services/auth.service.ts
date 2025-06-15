import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, throwError, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../enviroments/enviroment';
import { tap } from 'rxjs/operators';

import {jwtDecode} from 'jwt-decode';

@Injectable({
 providedIn: 'root',
})
export class AuthService {
 private token = new BehaviorSubject<string | null>(null);
 // BehaviorSubject almacena el token y permite a otros componentes reaccionar cuando cambia.


 constructor(private http: HttpClient, private router: Router) {
  if (typeof window !== 'undefined') {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      this.token.next(savedToken);
    }
  }}


 /**
  * Método para autenticar al usuario.
  * @param username - Nombre de usuario ingresado.
  * @param password - Contraseña ingresada.
  * @returns Observable que emite un objeto con el token de autenticación si la solicitud es exitosa.
  */
 login(username: string, password: string): Observable<{ token: string }> {
  return this.http.post<{ token: string }>(
      `${environment.apiUrl}/v1/authenticate`,
      { username, password },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
  ).pipe(
      tap(response => {
          this.setToken(response.token);
          console.log('Login exitoso, conectando a WebSockets...');
          // Iniciar WebSocket usando el método connect
         
      })
  );
}

getUser(): { username: string; fullName?: string; roles?: string[] } | null {
  const token = this.getToken();
  if (!token) return null;

  try {
    const decodedToken: any = jwtDecode(token);
    return {
      username: decodedToken.sub || '',
      fullName: decodedToken.fullName || '', // ajusta según cómo venga del backend
      roles: decodedToken.roles || [],
    };
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
}



 /**
  * Almacena el token de autenticación en el BehaviorSubject.
  * @param token - Token recibido tras una autenticación exitosa.
  */
 setToken(token: string): void {
  this.token.next(token);
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
}


 /**
  * Obtiene el token actual almacenado en el BehaviorSubject.
  * @returns El token actual o null si no está definido.
  */
 getToken(): string | null {
  if (typeof window !== 'undefined') {
    return this.token.value || localStorage.getItem('token');
  }
  return this.token.value;
}
 getUsername(): string | null {
  const token = this.getToken();
  if (!token) return null;

  try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.sub || null; // 'sub' es el campo estándar para el nombre de usuario
  } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
  }
}

 /**
  * Devuelve un observable que emite el estado de autenticación basado en la existencia del token.
  * @returns Observable<boolean>
  */
 isLoggedIn(): Observable<boolean> {
   // Verifica si el token existe y emite un valor booleano.
   return this.token.asObservable().pipe(map((token: string | null) => !!token));
 }


 /**
  * Método para cerrar la sesión del usuario.
  * Elimina el token y redirige al usuario a la página de inicio de sesión.
  */
 logout(): void {
   this.token.next(null); // Limpia el token almacenado.
   localStorage.removeItem('token');
   this.router.navigate(['/']); // Redirige al usuario a la ruta raíz.
   
 }
 getUserIdFromApi(): Observable<number | null> {
  const username = this.getUsername(); // Usa tu método que lee el 'sub' del JWT
  if (!username) return of(null);
  return this.http.get<{ id: number }>(`${environment.apiUrl}/users/username/${username}`)
    .pipe(map(user => user.id));
}

 
}
