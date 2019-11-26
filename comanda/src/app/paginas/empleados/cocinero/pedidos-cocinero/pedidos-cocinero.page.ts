import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CloudFirestoreService } from 'src/app/servicios/cloud-firestore.service';

@Component({
  selector: 'app-pedidos-cocinero',
  templateUrl: './pedidos-cocinero.page.html',
  styleUrls: ['./pedidos-cocinero.page.scss'],
})
export class PedidosCocineroPage implements OnInit {

  pedidos = new Array();

  constructor(private router: Router,
    private serviceFirestore: CloudFirestoreService) { }

  ngOnInit() {
    this.cargarPedidos();
  }


  cargarPedidos() {
    this.serviceFirestore.traeroPedidos().subscribe((pedido) => {
      this.pedidos.length = 0;
      pedido.map((p: any) => {
        this.pedidos.push(p.payload.doc.data());
        console.log(this.pedidos);
      })
    })
  }

  modificarPedido(p: any, eleccion: number) {
    switch (eleccion) {

      case 1:
        this.serviceFirestore.cambiarEstadoDePedido(p, "enPreparacion").then(() => {

        })

        break;
      case 2:
        this.serviceFirestore.cambiarEstadoDePlatosYPostres(p, "terminado").then(() => {
          this.serviceFirestore.verificarSiLosProductosEstanListos(p).then(()=>{
            this.serviceFirestore.cambiarEstadoDePedido(p, "terminado").then(() => {

            })
          })
        })

        break;
    }
  }

}
