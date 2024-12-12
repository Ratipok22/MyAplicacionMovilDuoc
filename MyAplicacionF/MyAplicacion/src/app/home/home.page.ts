import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { SmsService } from '../sms.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  Usuario: string = '';  // Email del usuario logueado.
  monto: number = 0;
  usuarioId: string = '';
  viajes: any[] = [];
  direccion: string = ''; // Nueva variable para la dirección.
  mostrarInputMonto: boolean = false;
  to: string = '';       // Número de teléfono al que enviar el mensaje
  message: string = '';  // Contenido del mensaje

  constructor(
    public alertController: AlertController,
    private activeroute: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private smsService: SmsService
  ) {
    // Obtener el usuario desde la navegación.
    this.activeroute.queryParams.subscribe((params) => {
      const navigation = this.router.getCurrentNavigation()?.extras.state;
      this.Usuario = navigation?.['user'] || '';
      this.usuarioId = navigation?.['user']?.id || '';
      this.cargarViajes();
    });
  }

  // Cargar los viajes del usuario logueado.
  cargarViajes() {
    this.apiService.getViajesPorUsuarioId(this.usuarioId).subscribe({
      next: (viajes) => {
        this.viajes = viajes;
        console.log('Viajes cargados:', viajes);
      },
      error: (err) => {
        console.error('Error al cargar viajes:', err);
      },
    });
  }
  
  

  // Crear un nuevo viaje para el usuario logueado.
  crearViaje() {
    const nuevoViaje = {
      destino: this.direccion, // Usar la dirección ingresada en el input.
      fecha: new Date().toISOString(),
      usuario: this.Usuario, // Asignar el email del usuario logueado.
      viaje_tomado: 'no tomado' // Inicialmente, el viaje no está tomado.
    };
    
    this.apiService.crearViaje(nuevoViaje).subscribe({
      next: (response) => {
        console.log('Viaje creado:', response);
        this.presentAlert('Éxito', 'El viaje ha sido creado.');
        this.cargarViajes();
        this.direccion = ''; // Limpiar el input después de crear el viaje.
      },
      error: (err) => console.error('Error al crear viaje:', err),
    });
  }

  // Modificar un viaje existente.
  modificarViaje(id: number, nuevoDestino: string) {
    this.apiService.modificarViaje(id, { destino: nuevoDestino }).subscribe({
      next: (response) => {
        console.log('Viaje modificado:', response);
        this.presentAlert('Éxito', 'El viaje ha sido modificado.');
        this.cargarViajes();
      },
      error: (err) => console.error('Error al modificar viaje:', err),
    });
  }

  // Eliminar un viaje.
  eliminarViaje(id: number) {
    this.apiService.eliminarViaje(id).subscribe({
      next: (response) => {
        console.log(`Viaje con ID ${id} eliminado.`);
        this.presentAlert('Éxito', 'El viaje ha sido eliminado.');
        this.cargarViajes();
      },
      error: (err) => console.error('Error al eliminar viaje:', err),
    });
  }

  mostrarInput() {
    this.mostrarInputMonto = true;
  }

  actualizarPrecio() {
  if (this.monto > 0) {
    console.log(`Actualizando precio para el usuario con ID: ${this.usuarioId}, Monto: ${this.monto}`);

    // Primero, actualizamos el precio en 'users'.
    this.apiService.upPrecio(this.usuarioId, this.monto).subscribe({
      next: (userResponse) => {
        console.log('Precio del usuario actualizado:', userResponse);

        // Ahora, actualizamos el precio en los viajes correspondientes.
        this.apiService.upPrecioViajes(this.usuarioId, this.monto).subscribe({
          next: (viajeResponse) => {
            console.log('Precio actualizado en los viajes:', viajeResponse);
            alert('Precio actualizado exitosamente en usuario y viajes');
          },
          error: (viajeError) => {
            console.error('Error al actualizar el precio en los viajes:', viajeError);
            alert(`Ocurrió un error al actualizar el precio en los viajes: ${viajeError.message}`);
          }
        });
      },
      error: (userError) => {
        console.error('Error al actualizar el precio del usuario:', userError);
        alert(`Ocurrió un error al actualizar el precio del usuario: ${userError.message}`);
      }
    });
  } else {
    alert('Por favor, ingrese un monto válido');
  }
}

  cerrar() {
    localStorage.removeItem('ingresado');
    this.router.navigate(['login']);
  }

  async presentAlert(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });

    await alert.present();
  }

  sendSms() {
    this.smsService.sendSms(this.to, this.message)
      .then(response => {
        console.log('Mensaje enviado con SID:', response.data.sid);
        alert('Mensaje enviado exitosamente!');
      })
      .catch(error => {
        console.error('Error al enviar el mensaje:', error);
        alert('Error al enviar el mensaje.');
      });
  }

}
