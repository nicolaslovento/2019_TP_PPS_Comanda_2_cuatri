import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScannerService } from 'src/app/servicios/scanner.service';
import { CloudFirestoreService } from 'src/app/servicios/cloud-firestore.service';
import { AlertControllerService } from 'src/app/servicios/alert-controller.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  mesasDisponibles = new Array();
  mesasNoDisponibles = new Array();
  mesas = new Array();

  constructor(
    private router:Router,
    private scannerService:ScannerService,
    private serviceFirestore:CloudFirestoreService,
    private alertService:AlertControllerService,
    ) { }

  ngOnInit() {
    this.cargarMesasDisponibles();
  }

  cargarMesasDisponibles() {
    this.serviceFirestore.traerMesas().subscribe((mesas) => {
      this.mesasDisponibles.length = 0;
      mesas.map((mesa: any) => {
        if (mesa.payload.doc.data().disponible == true)
          this.mesasDisponibles.push(mesa.payload.doc.data());

      })
    })
  }

  cargarMesasOcupadas() {
    this.serviceFirestore.traerMesas().subscribe((mesas) => {
      this.mesasNoDisponibles.length = 0;
      mesas.map((mesa: any) => {
        if (mesa.payload.doc.data().disponible == false)
          this.mesasNoDisponibles.push(mesa.payload.doc.data());

      })
    })
  }


  pedirMesa() {
    let mesaDisponible = false;
    let cliente = JSON.parse(localStorage.getItem("usuario"));
    let mesa = false;
    let tieneMesa = false;
    let sentado=false;
    this.scannerService.iniciarScanner().then((qr: any) => {

      /* Recorro todas las mesas ocupadas, si el qr coincide con alguna mesa ocupada y esa mesa
       ocupada coincide con el usuario del local storage y el estado de esa mesa es = a 1 
       entonces lo envío al cliente a menu2 donde puede ver su pedido, juegos, encuesta.
       IMPORTANTÍSIMO: cuando el cliente haya pagado la cuenta acordarse de poner mesa.usuario = "",
       mesa.estado = "" y mesa.ocupada=false */

       this.cargarMesasOcupadas();

       for (let i = 0; i < this.mesasNoDisponibles.length; i++) {

        //alert("For: "+ i);

        if (this.mesasNoDisponibles[i].qr == qr) {
          //alert("El qr de la mesa no disponible coincide con el qr escaneado.");
          //alert(this.mesasNoDisponibles[i].qr+" y qr escaneado:"+qr);
          if (this.mesasNoDisponibles[i].usuario == cliente.usuario) {
            //alert("Chequeo que el usuario de la mesa coincida con el del localstorage");
            //alert(this.mesasNoDisponibles[i].usuario+" y local:"+cliente.usuario);
            if (this.mesasNoDisponibles[i].estado == "1")
            {
              //alert("El estado de la mesa es igual a 1");
              //alert(this.mesasNoDisponibles[i].estado);
              sentado=true;
              this.router.navigateByUrl('menu2');
            } else if(this.mesasNoDisponibles[i].estado == "") {
              this.router.navigateByUrl('lista-productos');
            }
          }
        }
      }


      if (this.mesasDisponibles.length > 0) {

        for (let i = 0; i < this.mesasNoDisponibles.length; i++) {
          if (this.mesasNoDisponibles[i].usuario == cliente.usuario) {
            tieneMesa = true;
          }
        }

        if (!tieneMesa) {


          for (let i = 0; i < this.mesasDisponibles.length; i++) {
            if (this.mesasDisponibles[i].qr == qr) {
              mesa = this.mesasDisponibles[i];
              mesaDisponible = true;
            }
          }


          if (mesaDisponible) {



            this.serviceFirestore.verificarSiEstaHabilitado(cliente).then(() => {

              this.serviceFirestore.cambiarEstadoMesa(cliente, mesa, false).then(() => {

                this.alertService.alertMensajeConTiempo("Asignando mesa..", 2000).then(() => {

                  this.serviceFirestore.habilitarClienteParaPedirMesa(cliente, true).then(() => {
                    //acá cambio estado de habilitado por false, porque ya está sentado en la mesa
                    this.alertService.alertError("Mesa asignada con éxito").then(() => {

                      this.alertService.alertMensajeConTiempo("Cargando productos...", 2000).then(() => {

                        this.router.navigateByUrl('lista-productos');
                      })
                    });
                  })
                });
              });
            }).catch(() => {
              this.alertService.alertError("No está habilitado para pedir una mesa.");
            });

          } else {
            this.alertService.alertError("Código inválido ó Mesa ocupada.");
          }
        } else {
          if(!sentado){
            this.alertService.alertError("Usted ya tiene una mesa asignada.");
          }
          
        }
      } else {
        this.alertService.alertError("La mesas están ocupadas.");
      }
    })


  }


  ingresarAlLocal() {
    let cliente = JSON.parse(localStorage.getItem('usuario'));
    this.scannerService.iniciarScanner().then((codigoQR: any) => {
      
      this.serviceFirestore.verificarIngresoAlRestaurante(codigoQR).then((msj) => {

        this.alertService.alertBienvenida("Ingresando al local..", 2000).then(() => {
          this.serviceFirestore.cambiarEstadoDeEspera(cliente, true).then(() => {
            this.alertService.alertBienvenida("Poniendo en lista de espera..", 2000).then(() => {
              this.router.navigateByUrl('menu-clienteNoRegistrado');
            })
          })
        })
      });
    }).catch((error) => {
      this.alertService.alertError("No se pudo leer el codigo QR");
    });
  }

}
