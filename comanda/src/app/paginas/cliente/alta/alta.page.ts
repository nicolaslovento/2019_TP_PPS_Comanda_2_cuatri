import { Component, OnInit } from '@angular/core';

import { CamaraService } from 'src/app/servicios/camara.service';
import { AlertControllerService } from 'src/app/servicios/alert-controller.service';
import { CloudFirestoreService } from 'src/app/servicios/cloud-firestore.service';
import { Router } from '@angular/router';
import { ScannerService } from 'src/app/servicios/scanner-dni.service';

@Component({
  selector: 'app-alta',
  templateUrl: './alta.page.html',
  styleUrls: ['./alta.page.scss'],
})
export class AltaPage implements OnInit {

  nombre:string="";
  apellido:string="";
  usuario="";
  dni="";
  correo="";
  foto:any="";
  clave:string="";
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

      if(!this.verificarCliente()){

        let usuarioNuevo={
          nombre:this.nombre,
          apellido:this.apellido,
          usuario:this.usuario,
          dni:this.dni.toString(),
          correo:this.correo,
          foto:this.foto,
          clave:this.clave,
          estado:"noAprobado"
          
        }
        this.serviceFirestore.cargarCliente(usuarioNuevo).then(()=>{
          this.alertService.alertBienvenida("Registrando usuario..",2000).then(()=>{
            this.limpiarForm();
            this.irAtras();
          });
        }).catch((error)=>{
          this.alertService.alertError(error);
          console.log(error);
        });
      }
    
  }


  verificarCliente(){

    let errores=0;
    if(this.nombre==""){
      this.error="El nombre no puede estar vacío.";
      errores++;
    }
    if(this.apellido==""){

      this.error="El apellido no puede estar vacío.";
      errores++;
    }

    if(this.dni.length<6){

      this.error="El dni debe tener al menos 6 dígitos.";
      errores++;
     
    }

    if(this.foto==""){

      this.error="Debe tomarse una foto.";
      errores++;
      
    }

    
    if(this.clave.length<0){

      this.error="La clave debe tener al menos 4 dígitos.";
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
    this.router.navigateByUrl('home');
  }

  limpiarForm(){
    this.nombre="";
    this.apellido="";
    this.dni="";
    this.foto="";
    this.clave="";
    this.usuario="";
  }

  leerDniConQr(){

    this.scannerService.iniciarScanner().then((barcodeData:any)=>{
      var datos = barcodeData.text.split("@")
      if(datos[4] == null){
        this.alertService.alertError("El código no es de DNI");
        return;
      }
      this.nombre=datos[2];
      this.apellido=datos[1];
      this.dni=datos[4];
    }).catch((error)=>{
      this.alertService.alertError("No se pudo leer el codigo QR");
    });
  }

}
