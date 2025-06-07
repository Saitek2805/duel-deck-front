import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit {
  weatherInformation: any = null; // Almacena los datos del clima
  errorMessage: string | null = null; // Almacena mensajes de error
  cityInput: string = ''; // Almacena la ciudad ingresada por el usuario

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    // Obtener el clima de Sevilla al iniciar el componente
    this.getWeather('Sevilla', 'es');
  }

  // Método para obtener el clima de una ciudad
  getWeather(city: string, countryCode?: string): void {
    this.weatherService.getWeatherByCity(city, countryCode).subscribe(
      (data) => {
        if (data && data.weather) {
          this.weatherInformation = data; // Guardar los datos del clima
          this.errorMessage = null; // Limpiar mensajes de error
        } else {
          this.errorMessage = 'Datos de clima no válidos.'; // Mensaje de error si los datos no son válidos
        }
      },
      (error) => {
        if (error.status === 404) {
          this.errorMessage = 'Ciudad no encontrada.'; // Mensaje de error si la ciudad no existe
        } else {
          this.errorMessage = 'Error al obtener el clima. Inténtalo de nuevo más tarde.'; // Mensaje de error genérico
        }
        console.error('Error en la solicitud:', error); // Registrar el error en la consola
      }
    );
  }

  // Método para buscar el clima de una ciudad ingresada por el usuario
  searchWeather(): void {
    if (this.cityInput.trim()) {
      this.getWeather(this.cityInput.trim()); // Llamar al método getWeather con la ciudad ingresada
    } else {
      this.errorMessage = 'Por favor, ingresa una ciudad.'; // Mensaje de error si no se ingresa una ciudad
    }
  }
}