import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable, retry, switchMap } from 'rxjs';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl = 'https://0ca810ea-5e60-43bd-b4b3-60c005d33a52-00-2najn7t85ftpo.worf.replit.dev'; 
  api = 'https://0ca810ea-5e60-43bd-b4b3-60c005d33a52-00-2najn7t85ftpo.worf.replit.dev/send-sms'; // URL del backend para enviar SMS

  httpOptions = {
    headers: new HttpHeaders({ 
      "Content-Type": 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };
  
  constructor(private http: HttpClient) { }

  sendSms(to: string, body: string) {
    return axios.post(this.api, { to, body });
  }

  getUsuarios(Usuario: string): Observable<any> {
    return this.http.get(this.apiUrl + '/users?email=' + Usuario, { headers: this.httpOptions.headers }).pipe(
        retry(3)
    );
  }

  getConductores(Usuario: string): Observable<any> {
    return this.http.get(this.apiUrl + '/conductor?email=' + Usuario, { headers: this.httpOptions.headers }).pipe(
        retry(3)
    );
  }
  
  upPrecio(id: string, monto: number): Observable<any> {
    const url = `${this.apiUrl}/users/${id}`;
    return this.http.patch(url, { precio: monto }, { headers: this.httpOptions.headers }).pipe(retry(3));
  }

  // Actualizar precio en los viajes del usuario.
  upPrecioViajes(usuarioId: string, nuevoPrecio: number): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/viajes?usuario.id=${usuarioId}`, { headers: this.httpOptions.headers }).pipe(
      retry(3),
      // Una vez obtenidos los viajes, los actualizamos en paralelo.
      switchMap((viajes) => {
        const actualizaciones = viajes.map((viaje) => 
          this.http.patch(`${this.apiUrl}/viajes/${viaje.id}`, { usuario: { ...viaje.usuario, precio: nuevoPrecio } }, { headers: this.httpOptions.headers })
        );
        return forkJoin(actualizaciones); // Esperamos a que todas las peticiones finalicen.
      })
    );
  }

  // Obtener los viajes del usuario logueado.
  getViajesPorUsuario(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/viajes?usuario=${email}`, { headers: this.httpOptions.headers }).pipe(retry(3));
  }

  // Obtener los viajes creados por el usuario logueado (filtrando por ID).
  getViajesPorUsuarioId(usuarioId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/viajes?usuario.id=${usuarioId}`, { headers: this.httpOptions.headers }).pipe(
      retry(3)
    );
  }

  // Crear un nuevo viaje.
  crearViaje(viaje: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/viajes`, viaje, { headers: this.httpOptions.headers });
  }

  // Modificar un viaje existente.
  modificarViaje(id: number, datos: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/viajes/${id}`, datos, { headers: this.httpOptions.headers });
  }

  // Eliminar un viaje por ID.
  eliminarViaje(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/viajes/${id}`, { headers: this.httpOptions.headers });
  }

  buscarViajePorId(id: number): Observable<any> {
    const url = `${this.apiUrl}/viajes/${id}`;
    return this.http.get(url, { headers: this.httpOptions.headers }).pipe(retry(3));
  }

  // Cambiar el estado de viaje_tomado
  actualizarViajeTomado(id: number, viajeTomado: string): Observable<any> {
    const url = `${this.apiUrl}/viajes/${id}`;
    return this.http.patch(url, { viaje_tomado: viajeTomado }, { headers: this.httpOptions.headers });
  }
}