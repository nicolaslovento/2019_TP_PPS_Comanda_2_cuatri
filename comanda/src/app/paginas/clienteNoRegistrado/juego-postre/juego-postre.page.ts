import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CloudFirestoreService } from '../../../servicios/cloud-firestore.service';
import { AlertControllerService } from 'src/app/servicios/alert-controller.service';

@Component({
  selector: 'app-juego-postre',
  templateUrl: './juego-postre.page.html',
  styleUrls: ['./juego-postre.page.scss'],
})
export class JuegoPostrePage implements OnInit {

  constructor(private router: Router,
    private serviceFirestore: CloudFirestoreService,
    private alertService: AlertControllerService) { }
    

    gano: number = 0;
  pedidos = new Array();

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

  ngOnInit() {
    this.gano = 0;
    this.obtenerPedido();
  }

  juego(numero) {

    console.log(this.pedidos);

    if(this.yaJugo() == false) {
      let numeroRnd = Math.floor(Math.random() * 4) + 1;

      if(numeroRnd == numero) {
        this.gano = 1;
        this.serviceFirestore.cambiarDescuento(this.pedidos[0], this.calcularDescuento()+this.pedidos[0].descuento);
        this.serviceFirestore.actualizarTotal(this.pedidos[0], this.pedidos[0], 10+this.pedidos[0].descuento);
      } else {
        this.gano = 2;
      }

      localStorage.setItem("juegoPostre", "si");
    } else {
      this.alertService.alertError("Usted ya jugó a este juego.");
    }
    
  }

  calcularDescuento() {
    let descuento: number;
    descuento = (200*100)/this.pedidos[0].total;

    return descuento;
  }

  yaJugo() {
    let respuesta = false;

    if(localStorage.getItem("juegoPostre") == undefined) {
      return respuesta;
    }

    if(localStorage.getItem("juegoPostre") == "si") {
      respuesta = true;
    }

    return respuesta;
  }

}
