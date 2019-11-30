import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CloudFirestoreService } from '../../../servicios/cloud-firestore.service';
import { AlertControllerService } from 'src/app/servicios/alert-controller.service';


@Component({
  selector: 'app-juego-descuento',
  templateUrl: './juego-descuento.page.html',
  styleUrls: ['./juego-descuento.page.scss'],
})
export class JuegoDescuentoPage implements OnInit {

  constructor(private router: Router,
    private serviceFirestore: CloudFirestoreService,
    private alertService: AlertControllerService) { }

  gano: number = 0;
  pedidos = new Array();

  ngOnInit() {
    this.gano = 0;
    this.obtenerPedido();
  }

  obtenerPedido() {
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

  juego(numero) {

    console.log(this.pedidos);

    if(this.yaJugo() == false) {
      let numeroRnd = Math.floor(Math.random() * 6) + 1;

      if(numeroRnd == numero) {
        this.gano = 1;
        this.serviceFirestore.cambiarDescuento(this.pedidos[0], 10+this.pedidos[0].descuento);
      } else {
        this.gano = 2;
      }

      localStorage.setItem("jugoDescuento", "si");
    } else {
      this.alertService.alertError("Usted ya jugó a este juego.");
    }
    
  }

  yaJugo() {
    let respuesta = false;

    if(localStorage.getItem("jugoDescuento") == undefined) {
      return respuesta;
    }

    if(localStorage.getItem("jugoDescuento") == "si") {
      respuesta = true;
    }

    return respuesta;
  }

}
