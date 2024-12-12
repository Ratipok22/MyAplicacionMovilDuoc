import { Component, OnInit } from '@angular/core';
import { NumericValueAccessor, ToastController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { state } from '@angular/animations';
import { NavController } from '@ionic/angular';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user:any;
  login:any={
    Usuario:"",
    Contrasena:"",
  }

  faltante:string="";

  constructor(public toastController: ToastController, private router:Router, private navCtrl: NavController, private apiService :ApiService ) { }

  goBack() {
    this.navCtrl.back();
  }

  ngOnInit() {
  }

  validateModel(model:any){
    for(var[key,value] of Object.entries(model)){
      if(value==""){
        this.faltante = key;
        return false;
      }
    }
    return true;
  }

  validarUsuario(dato:String){
    if(dato.length>=3 && dato.includes('@duocuc.cl') || dato.includes('@conductorduoc.cl')){
      return true
    }
    return false;
  }

  validarContra(dato:String){
    if(dato.length>=8 && dato.length<=15 ){
      return true
    }
    return false;
  }

  ingresar(){
    this.login.Contrasena = btoa(this.login.Contrasena);
    var varLogin = { Usuario: this.login.Usuario, Contrasena: this.login.Contrasena };
    if(this.validateModel(this.login)){
      if(this.validarUsuario(this.login.Usuario)){
        if(this.validarContra(this.login.Contrasena)){
          if(this.login.Usuario.includes('@duocuc.cl'))
          {
            this.apiService.getUsuarios(this.login.Usuario).subscribe((data) => {
              console.log(data);
              this.presentToast("Wena " + this.login.Usuario);
              this.login.Usuario = data[0]; // Asegúrate de que es un array y toma el primer resultado
              let NavigationExtras: NavigationExtras = {
                state: { user: this.login.Usuario }
              };
              localStorage.setItem('ingresado', 'true');
              localStorage.setItem('varLogin', JSON.stringify(varLogin));
              this.router.navigate(['home'], NavigationExtras);
            });
          }else{
            this.apiService.getConductores(this.login.Usuario).subscribe((data) =>{
              console.log(data)
              this.presentToast("Wena "+this.login.Usuario);
              this.login.Usuario=data;
              let NavigationExtras:NavigationExtras={
                state:{user:this.login.Usuario}
              }
              console.log('Ingresado');
              localStorage.setItem('ingresado','true');
              localStorage.setItem('varLogin',JSON.stringify(varLogin));
              this.router.navigate(['homeconductor'],NavigationExtras);
            
            });
          }
            
        }else{
          this.presentToast("La contrasena debe tener un minimo de 8 caracteres y un maximo de 15");
          this.login.Contrasena="";
        }
      }else{
        this.presentToast("El largo del nombre de usuario debe ser un minimo de 3 e incluir @duocuc.cl");
        this.login.Usuario="";
      }
    }
    else{
      this.presentToast("Falta Rellenar El Campo de "+this.faltante);
    }
  }
  

  async presentToast(message:string, duration?:number){
    const toast = await this.toastController.create(
      {
        message:message,
        duration:duration?duration:5000
      }
    );
    toast.present();
  }
  
}
