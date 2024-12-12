import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, retry, switchMap } from 'rxjs';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:3000'; 
  private api = 'http://localhost:3000/send-sms'; // URL del backend para enviar SMS

  constructor(private http: HttpClient) { }

  sendSms(to: string, body: string) {
    return axios.post(this.api, { to, body });
  }

  getUsuarios(Usuario: string): Observable<any> {
    return this.http.get(this.apiUrl+'/users?email='+Usuario).pipe(
        retry(3)
    );
  }

  getConductores(Usuario: string): Observable<any> {
    return this.http.get(this.apiUrl+'/conductor?email='+Usuario).pipe(
        retry(3)
    );
  }
  
  upPrecio(id: string, monto: number): Observable<any> {
    const url = `${this.apiUrl}/users/${id}`;
    return this.http.patch(url, { precio: monto }).pipe(retry(3));
  }

  // Actualizar precio en los viajes del usuario.
  upPrecioViajes(usuarioId: string, nuevoPrecio: number): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/viajes?usuario.id=${usuarioId}`).pipe(
      retry(3),
      // Una vez obtenidos los viajes, los actualizamos en paralelo.
      switchMap((viajes) => {
        const actualizaciones = viajes.map((viaje) => 
          this.http.patch(`${this.apiUrl}/viajes/${viaje.id}`, { usuario: { ...viaje.usuario, precio: nuevoPrecio } })
        );
        return forkJoin(actualizaciones); // Esperamos a que todas las peticiones finalicen.
      })
    );
  }

  // Obtener los viajes del usuario logueado.
  getViajesPorUsuario(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/viajes?usuario=${email}`).pipe(retry(3));
  }

  // Obtener los viajes creados por el usuario logueado (filtrando por ID).
  getViajesPorUsuarioId(usuarioId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/viajes?usuario.id=${usuarioId}`).pipe(
      retry(3)
    );
  }


  // Crear un nuevo viaje.
  crearViaje(viaje: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/viajes`, viaje);
  }

  // Modificar un viaje existente.
  modificarViaje(id: number, datos: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/viajes/${id}`, datos);
  }

  // Eliminar un viaje por ID.
  eliminarViaje(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/viajes/${id}`);
  }

  buscarViajePorId(id: number): Observable<any> {
    const url = `${this.apiUrl}/viajes/${id}`;
    return this.http.get(url).pipe(retry(3));
  }

  // Cambiar el estado de viaje_tomado
  actualizarViajeTomado(id: number, viajeTomado: string): Observable<any> {
    const url = `${this.apiUrl}/viajes/${id}`;
    return this.http.patch(url, { viaje_tomado: viajeTomado });
  }


}
