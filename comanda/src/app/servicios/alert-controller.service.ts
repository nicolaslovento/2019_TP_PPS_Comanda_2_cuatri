import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { timer } from 'rxjs';
import { messaging } from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class AlertControllerService {

  constructor(public alertController: AlertController) { }


  async alertMesaConfirmacion(mesa) {
    const alert = await this.alertController.create({
      header: 'Mesa: '+mesa.numero,
      message: 'Esta mesa se encuentra disponible!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancelar',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Asignar',
          cssClass: 'success',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }
/*
  Despliega un alert de error indicando mensaje.
*/
  async alertError(mensajeDeError:string) {
    var alert;
      alert = await this.alertController.create({

        mode:"md",
        
        message: '<b align=center>'+mensajeDeError+'</b>',
        buttons: ['Cerrar']
        
      });

    await alert.present();
    
  }

  /*
  Despliega un alert indicando mensaje y tiempo.
  */
  async alertBienvenida(mensajeBienvenida:string,tiempo){

    var alert = await this.alertController.create({

      header: 'Bienvenido!',
      mode:"md",
      message: '<b align=center>'+mensajeBienvenida+'</b>&nbsp;&nbsp;<ion-spinner name="bubbles"></ion-spinner>'
        
        
    });

    await alert.present();
    return new Promise((resolve,reject)=>{

      timer(tiempo).subscribe(()=>{

        this.alertController.dismiss();
        resolve();

      });

    })
  }
  
}
