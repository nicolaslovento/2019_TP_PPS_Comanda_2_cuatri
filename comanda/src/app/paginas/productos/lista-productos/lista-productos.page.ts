import { Component, OnInit } from '@angular/core';
import { CloudFirestoreService } from 'src/app/servicios/cloud-firestore.service';
import { AlertControllerService } from 'src/app/servicios/alert-controller.service';

import { Router } from '@angular/router';

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
  totalPlatos = 0;
  totalBebidas = 0;
  totalPostres = 0;
  cantidadPlatos = 0;
  cantidadBebidas = 0;
  cantidadPostres = 0;
  nombrePlato: string = "";
  nombreBebida: string = "";
  nombrePostre: string = "";
  pedido = new Array();

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
  
  hacerPedido() {
    let cliente=JSON.parse(localStorage.getItem('usuario'));

    let pedidoNuevo={
      total:this.total,
      cliente:(cliente.usuario).toString(),
      platos:this.nombrePlato+"-"+this.cantidadPlatos,
      postres:this.nombrePostre+"-"+this.cantidadPostres,
      bebidas:this.nombreBebida+"-"+this.cantidadBebidas,   
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

  agregarProducto(cantidad, precioUnitario, tipo, nombre) {
    if(tipo == "plato") 
    {
      this.totalPlatos = cantidad * precioUnitario;
      this.cantidadPlatos = cantidad;
      this.nombrePlato = nombre;
    }

    if(tipo == "bebida") 
    {
      this.totalBebidas = cantidad * precioUnitario;
      this.cantidadBebidas = cantidad;
      this.nombreBebida = nombre;
    }

    if(tipo == "postre") 
    {
      this.totalPostres = cantidad * precioUnitario;
      this.cantidadPostres = cantidad;
      this.nombrePostre = nombre;
    }

    this.total = this.totalPlatos + this.totalPostres + this.totalBebidas;
  }

  

}
