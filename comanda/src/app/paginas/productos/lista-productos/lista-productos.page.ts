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
  mesas=new Array();

  platos=new Array();
  bebidas=new Array();
  postres=new Array();

  total:number = 0;

  pedidos = new Array();

  pedidosBebidas = new Array();
  pedidosPlatos = new Array();
  pedidosPostres = new Array();

  estadoPlatos: string = "";
  estadoBebidas: string = "";
  estadoPostres: string = "";

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

        this.pedidosBebidas.forEach(pedidoBebidas => {

        let indiceBebida: number = this.pedidosBebidas.indexOf(pedidoBebidas);
  
        if(pedidoBebidas.cantidad == 0)
        {
          this.pedidosBebidas.splice(indiceBebida,1);
        }
        });

        if(this.pedidosBebidas.length == 0) {
          this.estadoBebidas = "sinPedir";
        } else {
          this.estadoBebidas = "recibidoMozo";
        }

        break;

        case "postre":
        this.pedidosPostres.push(pedido);

        this.pedidosPostres.forEach(pedidoPostres => {

        let indicePostre: number = this.pedidosPostres.indexOf(pedidoPostres);
  
        if(pedidoPostres.cantidad == 0)
        {
          this.pedidosBebidas.splice(indicePostre,1);
        }
        });

        if(this.pedidosPostres.length == 0) {
          this.estadoPostres = "sinPedir";
        } else {
          this.estadoBebidas = "recibidoMozo";
        }

        break;

        case "plato":
        this.pedidosPlatos.push(pedido);

        this.pedidosPlatos.forEach(pedidoPlatos => {

        let indicePlato: number = this.pedidosPlatos.indexOf(pedidoPlatos);
  
        if(pedidoPlatos.cantidad == 0)
        {
          this.pedidosPlatos.splice(indicePlato,1);
        }
        });

        if(this.pedidosPlatos.length == 0) {
          this.estadoPlatos = "sinPedir";
        } else {
          this.estadoPlatos = "recibidoMozo";
        }

        break;
      }
    });
  }
  
  hacerPedido() {
    let cliente=JSON.parse(localStorage.getItem('usuario'));
    let mesaActual:string = "";

    this.dbService.traerMesas().subscribe((mesas)=>{
      this.mesas.length=0;
      mesas.map((mesa:any)=>{
        this.mesas.push(mesa.payload.doc.data());
      })
    });

    for(let i=0; i<=this.mesas.length; i++) {

      if(this.mesas[i].usuario == cliente.usuario)
      {
        mesaActual = this.mesas[i].qr;
        break;
      }
    }
    
    this.separarPedidosPorTipo();

    let pedidoNuevo={
      total:this.total,
      cliente:cliente.usuario,
      mesa: mesaActual,
      pedidoPlatos: this.pedidosPlatos,
      pedidoBebidas: this.pedidosBebidas,
      pedidoPostres: this.pedidosPostres,
      estado: "recibidoMozo",
      estadoPlatos: this.estadoPlatos,
      estadoBebidas: this.estadoBebidas,
      estadoPostres: this.estadoPostres,
      descuento: 0,
      propina: 0

    }
    alert(JSON.stringify(pedidoNuevo));
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

  tipoPerfil() {
    let cliente=JSON.parse(localStorage.getItem('usuario'));
    return cliente.perfil;
  }

}
