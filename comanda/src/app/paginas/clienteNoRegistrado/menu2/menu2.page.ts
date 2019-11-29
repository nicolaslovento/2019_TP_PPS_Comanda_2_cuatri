import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CloudFirestoreService } from '../../../servicios/cloud-firestore.service';
import { AlertControllerService } from 'src/app/servicios/alert-controller.service';


@Component({
  selector: 'app-menu2',
  templateUrl: './menu2.page.html',
  styleUrls: ['./menu2.page.scss'],
})
export class Menu2Page implements OnInit {

  pedidos = new Array();

  constructor(private router: Router,
    private alertService: AlertControllerService,
    private serviceFirestore: CloudFirestoreService) { }

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
    let cliente = JSON.parse(localStorage.getItem("usuario"));
    if(localStorage.getItem("hizoEncuesta") != "si") {
      if(this.pedidos.length>=1)
      {
        if(cliente.usuario == this.pedidos[0].cliente) {
          this.router.navigateByUrl('encuesta');
        }
      } else {
        this.alertService.alertError("Usted no está habilitado para completar la encuesta.");
      }
    } else {
      this.alertService.alertError("Usted ya ha completado la encuesta");
    }
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
