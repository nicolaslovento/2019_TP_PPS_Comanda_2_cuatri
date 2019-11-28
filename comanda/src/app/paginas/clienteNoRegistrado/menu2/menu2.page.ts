import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertControllerService } from 'src/app/servicios/alert-controller.service';
import { CloudFirestoreService } from '../../../servicios/cloud-firestore.service';
import { ScannerService } from 'src/app/servicios/scanner-dni.service';

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

  juegos() {
    this.router.navigateByUrl('juegos');
  }

  encuesta() {
    this.router.navigateByUrl('encuesta');
  }

  cargarPropina() {
    this.scannerService.iniciarScanner().then((barcodeData:any)=>{
      this.alertService.alertError("Propina actualizada!");
      this.pedidos[0].propina=barcodeData.text;
    }).catch((error)=>{
      this.alertService.alertError("No se pudo leer el codigo QR");
    });
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
