import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CloudFirestoreService } from '../servicios/cloud-firestore.service';
import { AlertControllerService } from '../servicios/alert-controller.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  usuario="";
  clave="";
  error="";

  ngOnInit() {
    localStorage.clear();
  }

  constructor(

    private dbFirestore:CloudFirestoreService,
    private alertService:AlertControllerService,
    private router:Router

  ) 
  {}

  
/*Verifica que los datos ingresados estén correctos*/
  verificarError(){

    if(this.usuario=="" && this.clave==""){
      this.error="El usuario y la clave no pueden estar vacíos.";
      this.alertService.alertError(this.error);
      
      return true;
    }
    if(this.usuario==""){
      this.error="El usuario no puede estar vacío.";
      this.alertService.alertError(this.error);
     
      return true;
    }

    
    
    if(this.clave==""){
      this.error="La clave no puede estar vacía.";
      this.alertService.alertError(this.error);
      
      
      return true;
    }
    if(this.clave.length<4){
      this.error="La clave debe tener al menos 4 carácteres.";
      this.alertService.alertError(this.error);
      
     
      return true;
    }
  }


/*carga de usuarios a través de botones*/
  cargarUsuario(eleccion:number){
    switch(eleccion){
        case 1:
          //supervisor
          this.usuario="supervisor";
          this.clave="supervisor";
        break;
        case 2:
          //dueño
          this.usuario="dueño";
          this.clave="dueño";
        break;
        case 3:
          //empleadoMozo
            this.usuario="mozo";
          this.clave="mozo";
            
        break;
        case 4:
          //empleadoCocinero
            this.usuario="cocinero";
            this.clave="cocinero";
        break;
        case 5:
          //empleadoBartender
            this.usuario="bartender";
            this.clave="bartender";
        break;
        case 6:
          //clienteRegistrado
            this.usuario="registrado";
            this.clave="registrado";
        break;
        case 7:
          //clienteAnonimo
            this.usuario="anonimo";
            this.clave="anonimo";
        break;
        case 8:
          //empleadoMetre
            this.usuario="metre";
            this.clave="metre";
        break;
        case 9:
          this.router.navigateByUrl('alta-cliente');
        break;
        case 10:
            this.router.navigateByUrl('alta-clienteNoRegistrado');
        break;   
    }
  }

  /*redirecciona segun tipo de usuario*/
  redireccionar(usuario:any){
    switch(usuario.perfil){
      case 'dueño':
        this.router.navigateByUrl('menu-dueño');
      break;
      case 'supervisor':
        this.router.navigateByUrl('menu-supervisor');
      break;
      case 'empleadoMozo':
        this.router.navigateByUrl('menu-mozo');
      break;
      case 'empleadoCocinero':
        this.router.navigateByUrl('menu-cocinero');
      break;
      case 'empleadoBartender':
        this.router.navigateByUrl('menu-bartender');
      break;
      case 'clienteRegistrado': 
        this.router.navigateByUrl('menu-cliente'); 
      break;
      case 'clienteAnonimo': 
        this.router.navigateByUrl('menu-clienteNoRegistrado'); 
      break;
      
      case 'empleadoMetre':
        this.router.navigateByUrl('menu-metre');
      break;
    }
  }
    

  
/*Verifica que los datos estén correctos y luego verifica que el usuario esté en la BD*/
  login(){
    
    if(!this.verificarError()){
      console.log(this.usuario+" "+this.clave)
      this.dbFirestore.verificarUsuario(this.usuario,this.clave).then((usuario)=>{
        console.log(usuario);
        this.alertService.alertBienvenida("Espere..",3000).then(()=>{
          localStorage.setItem('usuario',JSON.stringify(usuario));//guarda usuario en ls
          this.redireccionar(usuario);//aca hay que redireccionar a la pagina del usuario
        });
        
      }).catch((error)=>{
        this.alertService.alertError(error);
      })
    }

    
  }

  

}
