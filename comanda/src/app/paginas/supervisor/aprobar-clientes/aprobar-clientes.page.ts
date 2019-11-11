import { Component, OnInit } from '@angular/core';
import { CloudFirestoreService } from 'src/app/servicios/cloud-firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aprobar-clientes',
  templateUrl: './aprobar-clientes.page.html',
  styleUrls: ['./aprobar-clientes.page.scss'],
})
export class AprobarClientesPage implements OnInit {

  clientes=new Array();
  constructor(
    private dbService:CloudFirestoreService,
    private router:Router
  ) { }

  ngOnInit() {
    /*this.dbService.cargarClientesNoAprobados().then((clientes:any)=>{

      this.clientes.push(clientes);
      console.log(this.clientes)
    })*/
    this.cargarClientesNoAprobados();
    
  }

  cargarClientesNoAprobados(){

    this.dbService.traerUsuarios().subscribe((clientes)=>{
      this.clientes.length=0;
      clientes.map((cliente:any)=>{
        if(cliente.payload.doc.data().perfil=='cliente' && cliente.payload.doc.data().estado=='noAprobado')
         this.clientes.push(cliente.payload.doc.data());
        
      })
    })
  }

  aprobarCliente(cliente:any){
    this.dbService.darEstadoACliente(cliente,'aprobado').then((msj)=>{
      console.log(msj);
    });
  }

  rechazarCliente(cliente:any){
    this.dbService.darEstadoACliente(cliente,'rechazado').then((msj)=>{
      console.log(msj);
    });
  }
}
