import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { SmsService } from '../sms.service';

@Component({
  selector: 'app-homeconductor',
  templateUrl: './homeconductor.page.html',
  styleUrls: ['./homeconductor.page.scss'],
})
export class HomeconductorPage implements OnInit {

  Usuario: string = '';  // Email del usuario logueado.
  viajes: any[] = [];
  precio: number = 0; 
  to: string = '';       // Número de teléfono al que enviar el mensaje
  message: string = '';  // Contenido del mensaje
  mostrarFormularioSms: boolean = false; 
  viajeSmsVisible: number | null = null; // Controla el viaje cuyo formulario SMS está visible.

  constructor(
    public alertController: AlertController,
    private activeroute: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private smsService: SmsService
  ) {
    this.activeroute.queryParams.subscribe((params) => {
      const navigation = this.router.getCurrentNavigation()?.extras.state;
      this.Usuario = navigation?.['user'] || '';
      this.cargarPrecio();  // Cargar usuario y su precio.
      this.cargarViajes();
    });
  }

  cargarPrecio() {
    this.apiService.getUsuarios(this.Usuario).subscribe({
      next: (usuario) => {
        if (usuario.length) {
          this.precio = usuario[0].precio;
        }
      },
      error: (err) => console.error('Error al cargar usuario:', err),
    });
  }

  // Cargar los viajes del usuario logueado.
  cargarViajes() {
    this.apiService.getViajesPorUsuario(this.Usuario).subscribe({
      next: (viajes) => (this.viajes = viajes),
      error: (err) => console.error('Error al cargar viajes:', err),
    });
  }

  openMaps(destino: string) {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destino)}`;
    window.open(url, '_blank');
  }

  // Método para que el conductor tome el viaje
  tomarViaje(id: number) {
    this.apiService.actualizarViajeTomado(id, 'tomado').subscribe({
        next: (response) => {
            console.log('Estado de viaje actualizado:', response);
            this.presentAlert('Éxito', 'El viaje ha sido tomado.');
            this.cargarViajes();
        },
        error: (err) => console.error('Error al actualizar el estado del viaje:', err),
    });
  }

  notomarViaje(id: number) {
    this.apiService.actualizarViajeTomado(id, 'no tomado').subscribe({
        next: (response) => {
            console.log('Estado de viaje actualizado:', response);
            this.presentAlert('Éxito', 'El viaje ha sido cancelado.');
            this.cargarViajes();
        },
        error: (err) => console.error('Error al actualizar el estado del viaje:', err),
    });
  }
  
  async presentAlert(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });

    await alert.present();
  }

  cerrar() {
    localStorage.removeItem('ingresado');
    this.router.navigate(['login']);
  }

  // Mostrar/ocultar el formulario para enviar SMS.
  toggleFormularioSms(viajeId: number) {
    // Si el formulario ya está visible, lo cerramos; si no, cerramos otros formularios.
    this.viajeSmsVisible = this.viajeSmsVisible === viajeId ? null : viajeId;
  }

  sendSms(viajeId: number) {
    this.smsService.sendSms(this.to, this.message)
      .then(response => {
        console.log('Mensaje enviado con SID:', response.data.sid);
        alert('Mensaje enviado exitosamente!');
        // Limpiar los campos después de enviar el SMS.
        this.to = '';
        this.message = '';
        this.viajeSmsVisible = null; // Ocultar el formulario después de enviar.
      })
      .catch(error => {
        console.error('Error al enviar el mensaje:', error);
        alert('Error al enviar el mensaje.');
      });
  }


  ngOnInit() {

  }

}
