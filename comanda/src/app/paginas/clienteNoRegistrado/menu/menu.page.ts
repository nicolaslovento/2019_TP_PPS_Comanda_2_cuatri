import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ScannerService } from 'src/app/servicios/scanner.service';
import { AlertControllerService } from 'src/app/servicios/alert-controller.service';
import { CloudFirestoreService } from 'src/app/servicios/cloud-firestore.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  mesas=new Array();

  constructor(
    private router:Router,
    private scannerService:ScannerService,
    private serviceFirestore:CloudFirestoreService,
    private alertService:AlertControllerService,
    ) { }

  ngOnInit() {
    this.cargarMesas();
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

   cargarQrMesa() {
    let cliente=JSON.parse(localStorage.getItem('usuario'));
    this.scannerService.iniciarScanner().then((codigoQR: any) => {
      alert(codigoQR);
      this.serviceFirestore.verificarCargarQrMesa(codigoQR).then((msj)=>{

        this.alertService.alertBienvenida("Cargando productos...", 2000).then(()=>{
            //this.serviceFirestore.cambiarEstadoMesa(cliente, codigoQR, true).then(()=>{ 
              this.router.navigateByUrl('lista-productos');
        })
      //})
      });
    }).catch(()=>{
      this.alertService.alertError("No se pudo leer el codigo QR");
    });
  }

   

   pedirMesa(){

    let cliente=JSON.parse(localStorage.getItem("usuario"));
    let mesa=false;
    this.scannerService.iniciarScanner().then((qr:any)=>{
      if(this.mesas.length>0){
        for(let i=0;i<this.mesas.length;i++){
          if(this.mesas[i].qr==qr){
              mesa=this.mesas[i];
          }
        }
        this.serviceFirestore.verificarSiEstaHabilitado(cliente).then(()=>{

          this.serviceFirestore.cambiarEstadoMesa(cliente,mesa,false).then(()=>{

            this.alertService.alertBienvenida("Asignado mesa..",2000).then(()=>{

              this.serviceFirestore.habilitarClienteParaPedirMesa(cliente,false).then(()=>{
                  //acá cambio estado de habilitado por false, porque ya está sentado en la mesa
                this.alertService.alertError("Mesa asignada con éxito");
              })
            });
          });
        }).catch(()=>{
          this.alertService.alertError("No está habilitado para pedir una mesa.");
        });

      }else{
        this.alertService.alertError("La mesa está ocupada");
      }
    })
        
    
  }

  

  ingresarAlLocal(){
    let cliente=JSON.parse(localStorage.getItem('usuario'));
      this.scannerService.iniciarScanner().then((codigoQR:any)=>{
        alert(codigoQR);
        this.serviceFirestore.verificarIngresoAlRestaurante(codigoQR).then((msj)=>{

          this.alertService.alertBienvenida("Ingresando al local..",2000).then(()=>{
              this.serviceFirestore.cambiarEstadoDeEspera(cliente,true).then(()=>{
                this.alertService.alertBienvenida("Poniendo en lista de espera..",2000).then(()=>{
                  this.router.navigateByUrl('menu-clienteNoRegistrado');
                })
              })
          })
        });
      }).catch((error)=>{
        this.alertService.alertError("No se pudo leer el codigo QR");
      });
    }   
    
 
}
