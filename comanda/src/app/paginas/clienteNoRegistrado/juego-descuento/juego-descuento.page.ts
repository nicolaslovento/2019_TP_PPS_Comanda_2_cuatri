import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CloudFirestoreService } from '../../../servicios/cloud-firestore.service';
import { AlertControllerService } from 'src/app/servicios/alert-controller.service';


@Component({
  selector: 'app-juego-descuento',
  templateUrl: './juego-descuento.page.html',
  styleUrls: ['./juego-descuento.page.scss'],
})
export class JuegoDescuentoPage implements OnInit {

  constructor(private router: Router,
    private serviceFirestore: CloudFirestoreService,
    private alertService: AlertControllerService) { }

  gano: number = 0;

  ngOnInit() {
  }

  juego(numero) {

    if(this.yaJugo() == false) {
      let numeroRnd = Math.floor(Math.random() * 4) + 1;

      if(numeroRnd == numero) {
        this.gano = 1;
      } else {
        this.gano = 2;
      }

      localStorage.setItem("jugoDescuento", "si");
    } else {

    }
    
  }

  yaJugo() {
    let respuesta = false;

    if(localStorage.getItem("jugoDescuento") == undefined) {
      return respuesta;
    }

    if(localStorage.getItem("jugoDescuento") == "si") {
      respuesta = true;
    }

    return respuesta;
  }

}
