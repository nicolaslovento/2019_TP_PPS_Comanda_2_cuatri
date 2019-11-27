import { Injectable } from '@angular/core';
import { ZBar, ZBarOptions } from '@ionic-native/zbar/ngx';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  constructor(private scanQr:ZBar) { }

  iniciarScanner(){
    var options: ZBarOptions = {
      flash: 'off',
      drawSight: false
    };
    return new Promise((resolve,reject)=>{
      this.scanQr.scan(options).then((codigoQR)=>{
       resolve(codigoQR);
    }).catch((error)=>{
      reject(error);
    })
  })

  }


}
