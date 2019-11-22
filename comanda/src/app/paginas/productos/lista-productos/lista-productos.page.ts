import { Component, OnInit } from '@angular/core';
import { CloudFirestoreService } from 'src/app/servicios/cloud-firestore.service';
import { AlertControllerService } from 'src/app/servicios/alert-controller.service';

import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.page.html',
  styleUrls: ['./lista-productos.page.scss'],
})
export class ListaProductosPage implements OnInit {

  productos=new Array();

  platos=new Array();
  bebidas=new Array();
  postres=new Array();

  total:number = 0;

  pedidos = new Array();

  pedidosBebidas = new Array();
  pedidosPlatos = new Array();
  pedidosPostres = new Array();

  constructor(
    private dbService:CloudFirestoreService,
    private router:Router,
    private alertService:AlertControllerService,

  ) { }

  ngOnInit() {
    this.cargarListaProductos();
  }

  cargarListaProductos(){

    this.dbService.traerProductos().subscribe((productos)=>{
      this.productos.length=0;
      this.platos.length=0;
      this.bebidas.length=0;
      this.postres.length=0;
      productos.map((producto:any)=>{
        if(producto.payload.doc.data().tipo=='postre')
        {
          this.postres.push(producto.payload.doc.data());
        } else if(producto.payload.doc.data().tipo=='bebida')
        {
          this.bebidas.push(producto.payload.doc.data());
        } else if (producto.payload.doc.data().tipo=='plato')
        {
          this.platos.push(producto.payload.doc.data());
        }
      })
    })
  }

  separarPedidosPorTipo() {
    this.pedidos.forEach(pedido => {
      switch(pedido.tipo) {
        case "bebida":
        this.pedidosBebidas.push(pedido);
        break;
        case "postre":
        this.pedidosPostres.push(pedido);
        break;
        case "plato":
        this.pedidosPlatos.push(pedido);
        break;
      }
    });
  }
  
  hacerPedido() {
    let cliente=JSON.parse(localStorage.getItem('usuario'));
    this.separarPedidosPorTipo();

    let pedidoNuevo={
      total:this.total,
      cliente:(cliente.usuario).toString(),
      pedidoPlatos: this.pedidosPlatos,
      pedidoBebidas: this.pedidosBebidas,
      pedidoPostres: this.pedidosPostres,
    }
    this.dbService.cargarPedido(pedidoNuevo).then(()=>{
      this.alertService.alertBienvenida("Realizando pedido..",2000).then(()=>{
        this.router.navigateByUrl('menu-cliente');
      });
    }).catch((error)=>{
      this.alertService.alertError(error);
      console.log(error);
    });
  }

  agregarProducto(cantidad, producto) {

    let flag = 0;
    
    if(this.pedidos != null) {
      this.pedidos.forEach(pedido => {
        if(pedido.nombre == producto.nombre) {
          flag = 1;
          if(pedido.cantidad != cantidad) {
            pedido.cantidad = cantidad;
            pedido.precio = (cantidad * producto.precio);
          }
        }
      });
    }

    if(flag == 0) {
      this.pedidos.push({"tipo":producto.tipo,"cantidad":cantidad,"nombre":producto.nombre,"precio":(producto.precio*cantidad)});
    }

    this.total = 0;

    this.pedidos.forEach(pedido => {
      this.total += pedido.precio;
    })

  }


}
