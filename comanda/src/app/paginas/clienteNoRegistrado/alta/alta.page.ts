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

  nombre:string="";
  apellido:string="";
  usuario:string="";
  
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
    
    let nombreFoto=new Date().getTime();
    this.cameraService.tomarFoto(nombreFoto.toString()).then(fotoSacada=>{
      this.foto=fotoSacada;
    });
    
  }

  darDeAlta(){

      if(!this.verificarCliente()){

        let usuarioNuevo={
          nombre:this.nombre,
          usuario:this.usuario.toString(),
          
          foto:this.foto,
          clave:this.clave,
          esperandoMesa:false,
          habilitado:false
        }
        this.serviceFirestore.cargarClienteAnonimo(usuarioNuevo).then(()=>{
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

    if(this.usuario.length<4){

      this.error="El usuario debe tener 4 caractéres.";
      errores++;
     
    }

    
    if(this.clave.length<4){

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
    this.usuario="";
    this.foto="";
    this.clave="";
  }

  

}
