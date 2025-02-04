import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CloudFirestoreService } from '../../../servicios/cloud-firestore.service';
import { ScannerService } from 'src/app/servicios/scanner.service';
import { AlertControllerService } from 'src/app/servicios/alert-controller.service';

@Component({
  selector: 'app-menu2',
  templateUrl: './menu2.page.html',
  styleUrls: ['./menu2.page.scss'],
})
export class Menu2Page implements OnInit {

  pedidos = new Array();
  tiempoMax = "1";
  total = 0;

  constructor(private router: Router,
    private serviceFirestore: CloudFirestoreService,
    private alertService:AlertControllerService,
    private scannerService:ScannerService) { }

  ngOnInit() {
    this.cargarPedidos()
    console.log(this.pedidos);
  }

  cargarPedidos() {
    let cliente = JSON.parse(localStorage.getItem("usuario"));

    this.serviceFirestore.traeroPedidos().subscribe((pedidos) => {
      this.pedidos.length = 0;
      pedidos.map((pedido: any) => {
        if(pedido.payload.doc.data().cliente == cliente.usuario) {
          this.pedidos.push(pedido.payload.doc.data());
          this.calcularTiempoMax(pedido.payload.doc.data());
          
          this.total = 0;
          pedido.payload.doc.data().pedidoBebidas.forEach(pedido => {
            this.total += pedido.precio;
          })
          pedido.payload.doc.data().pedidoPlatos.forEach(pedido => {
            this.total += pedido.precio;
          })
          pedido.payload.doc.data().pedidoPostres.forEach(pedido => {
            this.total += pedido.precio;
    })

        }
      })
    })   
  }

  cargarPropina(p:any) {
    this.scannerService.iniciarScanner().then((qr:any)=>{
      let propina=qr.split("propina-");
               
        this.serviceFirestore.cambiarPropina(p, propina[1]).then(() => {

          this.serviceFirestore.actualizarTotal(p, propina[1], p.descuento);
          
          this.alertService.alertError("Propina actualizada: "+propina[1]+"%");    
        })
    }).catch((error)=>{
      this.alertService.alertError("No se pudo leer el codigo QR");
    });
  }

  calcularTiempoMax(p:any){
    console.log(p);
    p.pedidoPlatos.forEach(plato=>{
      if(plato.tiempoElaboracion>=this.tiempoMax)
          this.tiempoMax=plato.tiempoElaboracion;
    });
    p.pedidoPostres.forEach(postre=>{
      if(postre.tiempoElaboracion>=this.tiempoMax)
          this.tiempoMax=postre.tiempoElaboracion;
    });         
  }

  juegos() {
    if(this.pedidos[0].estado != 'cuentaPedida' && this.pedidos[0].estado != 'finalizado') {
      this.router.navigateByUrl('juegos');
    } else {
      this.alertService.alertError("Ya no puede");
    }
    
  }

  encuesta() {
    let cliente = JSON.parse(localStorage.getItem("usuario"));
    if(localStorage.getItem("hizoEncuesta") != "si") {
      if(this.pedidos.length>=1)
      {
        if(cliente.usuario == this.pedidos[0].cliente) {
          this.router.navigateByUrl('encuesta');
        }
      } else {
        this.alertService.alertError("Usted no está habilitado para completar la encuesta.");
      }
    } else {
      this.alertService.alertError("Usted ya ha completado la encuesta");
    }
  }

  confirmarPedido() {
    this.serviceFirestore.cambiarEstadoDePedido(this.pedidos[0],'servidoConfirmado');
  }

  pedirCuenta() {
    this.serviceFirestore.cambiarEstadoDePedido(this.pedidos[0],'cuentaPedida');
  }

  irAtras() {
    localStorage.clear();
    this.router.navigateByUrl('home');
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigateByUrl('home');
  }

  tipoPerfil() {
    let cliente=JSON.parse(localStorage.getItem('usuario'));
    return cliente.perfil;
  }

}
