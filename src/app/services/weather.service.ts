import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root', 
})
export class WeatherService {
  private apiKey = 'f66ca4e5b7686d364fc8caea8c8017f7'; 
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather'; 

  constructor(private http: HttpClient) {}


  getWeatherByCity(city: string, countryCode?: string): Observable<any> {
    
    const query = countryCode ? `${city},${countryCode}` : city;
    
    const url = `${this.apiUrl}?q=${query}&units=metric&appid=${this.apiKey}`;

    return this.http.get(url).pipe(
      catchError(this.handleError) 
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error al obtener los datos del clima.';
    if (error.error instanceof ErrorEvent) {
    
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error(errorMessage); 
    return throwError(errorMessage); 
  }
}