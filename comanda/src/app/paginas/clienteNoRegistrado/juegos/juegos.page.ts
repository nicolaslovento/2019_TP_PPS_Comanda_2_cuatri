import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CloudFirestoreService } from '../../../servicios/cloud-firestore.service';

@Component({
  selector: 'app-juegos',
  templateUrl: './juegos.page.html',
  styleUrls: ['./juegos.page.scss'],
})
export class JuegosPage implements OnInit {

  constructor(private router: Router,
    private serviceFirestore: CloudFirestoreService) { }

  ngOnInit() {
  }

  tipoPerfil() {
    let cliente=JSON.parse(localStorage.getItem('usuario'));
    return cliente.perfil;
  }

  juegoDescuento() {
    this.router.navigateByUrl("juego-descuento");
  }

  juegoBebida() {
    this.router.navigateByUrl("juego-bebida");
  }

  juegoPostre() {
    this.router.navigateByUrl("juego-postre");
  }

}
