import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CloudFirestoreService } from 'src/app/servicios/cloud-firestore.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
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
        this.serviceFirestore.cambiarEstadoDePedido(p, "recibidoEmpleado").then(() => {

        })

        break;
      case 2:
        this.serviceFirestore.cambiarEstadoDePedido(p, "servido").then(() => {

        })

        break;
    }
  }

  cerrarPedido(p: any) {
    
    let cliente={usuario: ""};
    let mesa={qr: p.mesa};
  
    this.serviceFirestore.cerrarPedido(p).then(() => {
        this.serviceFirestore.cambiarEstadoMesa(cliente, mesa, true).then(() => {
          this.serviceFirestore.cambiarNumeroEstadoMesa(p.mesa, "").then(() => {
            cliente={usuario: p.cliente};
            this.serviceFirestore.cambiarEstadoDeEspera(cliente, false).then(() => {
              this.serviceFirestore.habilitarClienteParaPedirMesa(cliente, false).then(() => {
              })
            })
          })
        })
    })
  }

  irAtras() {
    localStorage.clear();
    this.router.navigateByUrl('home');
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigateByUrl('home');
  }
}
