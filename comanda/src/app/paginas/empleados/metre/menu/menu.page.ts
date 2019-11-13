import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CloudFirestoreService } from 'src/app/servicios/cloud-firestore.service';
import { AlertControllerService } from 'src/app/servicios/alert-controller.service';
import { ScannerService } from 'src/app/servicios/scanner.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  clientes=new Array();
  mesas=new Array();
  
  constructor(
    private router:Router,
    private serviceFirestore:CloudFirestoreService,
    private alertService:AlertControllerService,
    private scannerService:ScannerService
    
    ) { }

  ngOnInit() {
    this.cargarClientesEnEspera();
    this.cargarMesas();
  }

  cargarClientesEnEspera(){

    this.serviceFirestore.traerUsuarios().subscribe((clientes)=>{
      this.clientes.length=0;
      clientes.map((cliente:any)=>{
        if(cliente.payload.doc.data().esperandoMesa==true)
         this.clientes.push(cliente.payload.doc.data());
        
      })
    })
  }

   
  cargarMesas(){
      this.serviceFirestore.traerMesas().subscribe((mesas)=>{
        this.mesas.length=0;
        mesas.map((mesa:any)=>{
          if(mesa.payload.doc.data().disponible==true)
           this.mesas.push(mesa.payload.doc.data());
          
        })
      })
   }

   asignarClienteAMesa(cliente){

    let mesa=false;
    this.scannerService.iniciarScanner().then((qr:any)=>{
      if(this.mesas.length>0){
        for(let i=0;i<this.mesas.length;i++){
          if(this.mesas[i].qr==qr){
              mesa=this.mesas[i];
          }
        }

        this.serviceFirestore.cambiarEstadoMesa(cliente,mesa,false).then(()=>{
          this.alertService.alertBienvenida("Asignado mesa..",2000).then(()=>{
            this.serviceFirestore.cambiarEstadoDeEspera(cliente,false).then(()=>{
              this.alertService.alertError("Mesa asignada con éxito");
            })
          });
        });

      }else{
        this.alertService.alertError("La mesa está ocupada");
      }
    })
    
  }
   

  



  irAtras(){
    localStorage.clear();
    this.router.navigateByUrl('home');
  }
  
  cerrarSesion(){
    localStorage.clear();
    this.router.navigateByUrl('home');
  }

}
