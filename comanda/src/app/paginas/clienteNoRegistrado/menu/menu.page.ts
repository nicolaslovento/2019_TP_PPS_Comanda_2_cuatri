import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ScannerService } from 'src/app/servicios/scanner.service';
import { AlertControllerService } from 'src/app/servicios/alert-controller.service';
import { CloudFirestoreService } from 'src/app/servicios/cloud-firestore.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  mesasDisponibles = new Array();
  mesasNoDisponibles = new Array();
  constructor(
    private router: Router,
    private scannerService: ScannerService,
    private serviceFirestore: CloudFirestoreService,
    private alertService: AlertControllerService,
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
    this.scannerService.iniciarScanner().then((qr: any) => {

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

                this.alertService.alertMensajeConTiempo("Asignado mesa..", 2000).then(() => {

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
            this.alertService.alertError("La mesa está ocupada.");
          }
        } else {
          this.alertService.alertError("usted ya tiene una mesa asignada.");
        }
      } else {
        this.alertService.alertError("La mesas están ocupadas.");
      }
    })


  }



  ingresarAlLocal() {
    let cliente = JSON.parse(localStorage.getItem('usuario'));
    this.scannerService.iniciarScanner().then((codigoQR: any) => {
      alert(codigoQR);
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
