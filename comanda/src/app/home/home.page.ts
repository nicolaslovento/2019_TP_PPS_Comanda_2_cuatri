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

  dni="";
  clave="";
  error="";

  ngOnInit() {
    
    
  }

  constructor(

    private dbFirestore:CloudFirestoreService,
    private alertService:AlertControllerService,
    private router:Router

  ) 
  {}

  
/*Verifica que los datos ingresados estén correctos*/
  verificarError(){

    if(this.dni=="" && this.clave==""){
      this.error="El dni y la clave no pueden estar vacíos.";
      this.alertService.alertError(this.error);
      
      return true;
    }
    if(this.dni==""){
      this.error="El dni no puede estar vacío.";
      this.alertService.alertError(this.error);
     
      return true;
    }

    if(this.dni.length<3){
      this.error="El dni debe tener al menos 3 dígitos.";
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
          this.dni="1111";
          this.clave="1111";
        break;
        case 2:
          //dueño
          this.dni="2222";
          this.clave="2222";
        break;
        case 3:
          //empleadoMozo
            this.dni="3333";
          this.clave="3333";
            
        break;
        case 4:
          //empleadoCocinero
            this.dni="4444";
            this.clave="4444";
        break;
        case 5:
          //empleadoBartender
            this.dni="5555";
            this.clave="5555";
        break;
        case 6:
          //clienteRegistrado
            this.dni="6666";
            this.clave="6666";
        break;
        case 7:
          //clienteAnonimo
            this.dni="7777";
            this.clave="7777";
        break;
        case 8:
          //empleadoMetre
            this.dni="8888";
            this.clave="8888";
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
      case 'cliente': //Este sería el cliente no registrado
        this.router.navigateByUrl('menu-cliente'); 
      break;
      case 'empleadoMetre':
        this.router.navigateByUrl('menu-metre');
      break;
    }
  }
    

  
/*Verifica que los datos estén correctos y luego verifica que el usuario esté en la BD*/
  login(){
    
    if(!this.verificarError()){

      this.dbFirestore.verificarUsuario(this.dni,this.clave).then((usuario)=>{
        console.log(usuario);
        this.alertService.alertBienvenida("Bienvenido",3000).then(()=>{
          localStorage.setItem('usuario',JSON.stringify(usuario));//guarda usuario en ls
          this.redireccionar(usuario);//aca hay que redireccionar a la pagina del usuario
        });
        
      }).catch((error)=>{
        this.alertService.alertError(error);
      })
    }

    
  }

  

}
