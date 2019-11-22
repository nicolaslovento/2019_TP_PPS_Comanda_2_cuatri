import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScannerService } from 'src/app/servicios/scanner.service';
import { CloudFirestoreService } from 'src/app/servicios/cloud-firestore.service';
import { AlertControllerService } from 'src/app/servicios/alert-controller.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  constructor(
    private router:Router,
    private scannerService:ScannerService,
    private serviceFirestore:CloudFirestoreService,
    private alertService:AlertControllerService,
    ) { }

  ngOnInit() {
    
  }
  

  ingresarAlLocal(){
    let cliente=JSON.parse(localStorage.getItem('usuario'));
      this.scannerService.iniciarScanner().then((codigoQR:any)=>{
        alert(codigoQR);
        this.serviceFirestore.verificarIngresoAlRestaurante(codigoQR).then((msj)=>{

          this.alertService.alertBienvenida("Ingresando al local..",2000).then(()=>{
              this.serviceFirestore.cambiarEstadoDeEspera(cliente,true).then(()=>{
                this.alertService.alertBienvenida("Poniendo en lista de espera..",2000).then(()=>{
                  this.router.navigateByUrl('menu-cliente');
                })
              })
          })
        });
      }).catch((error)=>{
        this.alertService.alertError("No se pudo leer el codigo QR");
      });
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
    

}
