import { Component, OnInit } from '@angular/core';
import { CloudFirestoreService } from 'src/app/servicios/cloud-firestore.service';
import { Router } from '@angular/router';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Component({
  selector: 'app-aprobar-clientes',
  templateUrl: './aprobar-clientes.page.html',
  styleUrls: ['./aprobar-clientes.page.scss'],
})
export class AprobarClientesPage implements OnInit {

  clientes=new Array();
  constructor(
    private dbService:CloudFirestoreService,
    private router:Router,
    private email:EmailComposer
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
      this.enviarCorreo(cliente.correo,true);
    });
  }

  rechazarCliente(cliente:any){
    this.dbService.darEstadoACliente(cliente,'rechazado').then((msj)=>{
      this.enviarCorreo(cliente.correo,false);
    });
  }

  private obtenerMensaje(acepta) {
    let auxReturn = `Estimado/a cliente: <br>
    Su solicitud ha sido ${(acepta === true ? 'confirmada' : 'rechazada')}.<br>`;
    if (acepta) {
      auxReturn += `Ya puede ingresar y disfrutar de los beneficios.<br>`;
    } else {
      auxReturn += `Lamentamos las molestias ocasionadas.<br>`;
    }
    auxReturn += `<br>Saludos atte.<br>`;
    return auxReturn;
  }

  private enviarCorreo(correo: string, acepta: boolean) {
    const email = {
      to: correo,
      subject: 'La comanda - Inscripción ' + (acepta === true ? 'Confirmada' : 'Rechazada'),
      body: this.obtenerMensaje(acepta),
      isHtml: true
    };
    
    this.email.open(email).catch(err => {
      console.log(err);
    });
  }
}
