import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { timer } from 'rxjs';
import { messaging } from 'firebase';
import { reject, isRejected } from 'q';
import { resolve } from 'url';


@Injectable({
  providedIn: 'root'
})
export class AlertControllerService {

  constructor(public alertController: AlertController) { }


  
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
