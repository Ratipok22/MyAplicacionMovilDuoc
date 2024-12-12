import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { NavController, ToastController, AnimationController } from "@ionic/angular";

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {
  usuario: string = '';

  @ViewChild('recuperarCard', { read: ElementRef, static: false })
  recuperarCard!: ElementRef;

  constructor(
    public toastController: ToastController,
    private navCtrl: NavController,
    private animationCtrl: AnimationController
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.playAnimation();
  }

  async presentToast(message: string, duration?: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration ? duration : 2000
    });
    toast.present();
  }

  recuperar() {
    if (this.usuario) {
      if (this.validarUsuario(this.usuario)) {
        this.presentToast('Se envió un correo para recuperar la contraseña');
        this.usuario = ''; // Limpiar el campo después de enviar
      } else {
        this.presentToast('Por favor, ingrese un usuario');
      }
    }
  }

  goBack() {
    this.navCtrl.back();
  }

  validarUsuario(dato: string) {
    return dato.length >= 3 && dato.includes('@duocuc.cl');
  }

  playAnimation() {
    const animation = this.animationCtrl
      .create()
      .addElement(this.recuperarCard.nativeElement)
      .duration(1000)
      .easing('ease-in-out')
      .fromTo('transform', 'translateY(100px)', 'translateY(0px)')
      .fromTo('opacity', '0', '1');

    animation.play();
  }
}
