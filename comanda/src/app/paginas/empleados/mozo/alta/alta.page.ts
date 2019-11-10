import { Component, OnInit } from '@angular/core';

import { CamaraService } from 'src/app/servicios/camara.service';
import { AlertControllerService } from 'src/app/servicios/alert-controller.service';
import { CloudFirestoreService } from 'src/app/servicios/cloud-firestore.service';
import { Router } from '@angular/router';
import { ScannerService } from 'src/app/servicios/scanner.service';
@Component({
  selector: 'app-alta',
  templateUrl: './alta.page.html',
  styleUrls: ['./alta.page.scss'],
})
export class AltaPage implements OnInit {
  numero=0;
  comensales=0;
  foto:any="";
  codigo:string="";
  error:string="";

  constructor(
    private cameraService:CamaraService,
    private serviceFirestore:CloudFirestoreService,
    private alertService:AlertControllerService,
    private router:Router,
    private scannerService:ScannerService
  ){}

  ngOnInit() {
 
  }

  

  tomarFoto(){
    let  usuarioActual=JSON.parse(localStorage.getItem('usuario'));
    let nombreFoto=usuarioActual.dni+"-"+(new Date()).getTime();
    this.cameraService.tomarFoto(nombreFoto).then(fotoSacada=>{
      this.foto=fotoSacada;
    });
    
  }

  darDeAlta(){

    if(!this.verificarError()){

      let mesaNueva={
        numero:this.numero,
        comensales:this.comensales,
        foto:this.foto,
        codigo:this.numero+"ABC"
      }
      this.serviceFirestore.cargarMesa(mesaNueva).then(()=>{
        this.alertService.alertBienvenida("Cargando mesa..",2000).then(()=>{
          this.limpiarForm();
          this.irAtras();
        });
      }).catch((error)=>{
        this.alertService.alertError(error);
        console.log(error);
      });
    }  
  }


  verificarError(){

    let errores=0;
    if(this.numero<0){
      this.error="El número de mesa no puede estar vacío.";
      errores++;
    }
    if(this.comensales<0){

      this.error="Debe haber al menos 1 comensal.";
      errores++;
    }

    if(this.foto==""){

      this.error="Debe tomarse una foto.";
      errores++;
      
    }

    if(errores==1){
      this.alertService.alertError(this.error);
      return true;
    }
    if(errores>1){
      this.alertService.alertError("No puede haber campos vacíos.");
      return true
    }

  }

  cerrarSesion(){
    localStorage.clear();
    this.router.navigateByUrl('home');
  }

  irAtras(){
    this.limpiarForm();
    this.router.navigateByUrl('menu-mozo');
  }

  limpiarForm(){
    this.numero=0;
    this.comensales=0;
    this.foto="";
  }

  leerCodigoConQr(){

    this.scannerService.iniciarScanner().then((codigoQR:any)=>{
      alert(codigoQR);
      this.codigo=codigoQR;
    }).catch((error)=>{
      this.alertService.alertError("No se pudo leer el codigo QR");
    });
  }
  

}