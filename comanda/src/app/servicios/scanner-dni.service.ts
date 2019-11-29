import { Injectable } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  constructor(private barcodeScanner:BarcodeScanner) { }

  iniciarScanner(){
    return new Promise((resolve,reject)=>{
      this.barcodeScanner.scan({prompt: "Enfoque el código de barras del DNI", formats: "PDF_417"}).then((result)=>{
       resolve(result);
    }).catch((error)=>{
      reject(error);
    })
  })

  }

}