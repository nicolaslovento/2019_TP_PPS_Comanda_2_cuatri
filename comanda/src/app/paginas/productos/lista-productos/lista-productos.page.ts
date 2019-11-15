import { Component, OnInit } from '@angular/core';
import { CloudFirestoreService } from 'src/app/servicios/cloud-firestore.service';
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

  constructor(
    private dbService:CloudFirestoreService,
    private router:Router
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

}
