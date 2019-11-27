import { Component, OnInit } from '@angular/core';

import { CamaraService } from 'src/app/servicios/camara.service';
import { AlertControllerService } from 'src/app/servicios/alert-controller.service';
import { CloudFirestoreService } from 'src/app/servicios/cloud-firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alta',
  templateUrl: './alta.page.html',
  styleUrls: ['./alta.page.scss'],
})
export class AltaPage implements OnInit {

  nombre:string="";
  descripcion:string="";
  tiempoElab="";
  precio="";
  foto1:any=""; 
  foto2:any=""; 
  foto3:any=""; 
  error:string="";
  tipo:string="";


  constructor(
    private cameraService:CamaraService,
    private serviceFirestore:CloudFirestoreService,
    private alertService:AlertControllerService,
    private router:Router,
    //private scannerService:ScannerService
  ) { }

  ngOnInit() {
  }

  tomarFoto1(){
    let nombreFoto=this.nombre;
    this.cameraService.tomarFoto(nombreFoto+"1").then(fotoSacada=>{
      this.foto1=fotoSacada;
    });
    
  }

  tomarFoto2(){
    let nombreFoto=this.nombre;
    this.cameraService.tomarFoto(nombreFoto+"2").then(fotoSacada=>{
      this.foto2=fotoSacada;
    });
    
  }

  tomarFoto3(){
    let nombreFoto=this.nombre;
    this.cameraService.tomarFoto(nombreFoto+"3").then(fotoSacada=>{
      this.foto3=fotoSacada;
    });
    
  }

  darDeAlta(){

      if(!this.verificarErrorAltaProducto()){

        let productoNuevo={
          nombre:this.nombre,
          descripcion:this.descripcion,
          tiempoElab:this.tiempoElab.toString(),
          precio:this.precio.toString(),
          tipo:this.tipo,
          foto1:this.foto1,
          foto2:this.foto2,
          foto3:this.foto3,
        }
        this.serviceFirestore.cargarProducto(productoNuevo).then(()=>{
          this.alertService.alertBienvenida("Cargando producto..",2000).then(()=>{
            this.limpiarForm();
            this.irAtras();
          });
        }).catch((error)=>{
          this.alertService.alertError(error);
          console.log(error);
        });
      }
    
  }

  verificarErrorAltaProducto(){

    let errores=0;
    if(this.nombre==""){
      this.error="El nombre no puede estar vacío.";
      errores++;
    }
    if(this.descripcion==""){

      this.error="La descripción no puede estar vacía.";
      errores++;
    }

    if(this.tiempoElab.length<1){

      this.error="El tiempo de elaboración no puede ser menor a 1 minuto.";
      errores++;
     
    }

    if(this.foto1==""){

      this.foto1="";
      
    }

    if(this.foto2==""){

      this.foto2="";
      
    }

    if(this.foto3==""){

      this.foto3="";
      
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
    this.router.navigateByUrl('menu-cocinero');
  }

  limpiarForm(){
    this.nombre="";
    this.descripcion="";
    this.tiempoElab="";
    this.precio="";
    this.foto1="";
    this.foto2="";
    this.foto3="";
  }

}
