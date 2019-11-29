import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CloudFirestoreService } from '../../../servicios/cloud-firestore.service';
import { ScannerService } from 'src/app/servicios/scanner.service';
import { AlertControllerService } from 'src/app/servicios/alert-controller.service';

@Component({
  selector: 'app-menu2',
  templateUrl: './menu2.page.html',
  styleUrls: ['./menu2.page.scss'],
})
export class Menu2Page implements OnInit {

  pedidos = new Array();

  constructor(private router: Router,
    private serviceFirestore: CloudFirestoreService,
    private alertService:AlertControllerService,
    private scannerService:ScannerService) { }

  ngOnInit() {
    this.cargarPedidos();
    console.log(this.pedidos);
  }

  cargarPedidos() {
    let cliente = JSON.parse(localStorage.getItem("usuario"));

    this.serviceFirestore.traeroPedidos().subscribe((pedidos) => {
      this.pedidos.length = 0;
      pedidos.map((pedido: any) => {
        if(pedido.payload.doc.data().cliente == cliente.usuario) {
          this.pedidos.push(pedido.payload.doc.data());
        }
      })
    })
  }

  cargarPropina(p:any) {
    this.scannerService.iniciarScanner().then((qr:any)=>{
      let propina=qr.split("propina-");
               
        this.serviceFirestore.cambiarPropina(p, propina[1]).then(() => {

          this.serviceFirestore.actualizarTotal(p, propina[1], p.descuento);
          
          this.alertService.alertError("Propina actualizada: "+propina[1]+"%");    
        })
    }).catch((error)=>{
      this.alertService.alertError("No se pudo leer el codigo QR");
    });
  }

  juegos() {
    this.router.navigateByUrl('juegos');
  }

  encuesta() {
    this.router.navigateByUrl('encuesta');
  }

  confirmarPedido() {
    this.serviceFirestore.cambiarEstadoDePedido(this.pedidos[0],'servidoConfirmado');
  }

  pedirCuenta() {
    this.serviceFirestore.cambiarEstadoDePedido(this.pedidos[0],'cuentaPedida');
  }

  irAtras() {
    localStorage.clear();
    this.router.navigateByUrl('home');
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigateByUrl('home');
  }

  tipoPerfil() {
    let cliente=JSON.parse(localStorage.getItem('usuario'));
    return cliente.perfil;
  }

}
