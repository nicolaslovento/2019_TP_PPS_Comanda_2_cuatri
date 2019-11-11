import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

/*redireccion segun opción elegida*/
  redireccionar(eleccion:number){
    switch(eleccion){

      case 1:
        this.router.navigateByUrl('alta-supervisor');
        break;

      case 2:
          this.router.navigateByUrl('aprobar-supervisor');
        break;

      case 3:
        break;

      case 4:
        break;

      case 5:
        break;

      case 6:
        break;
    }
  }

  irAtras(){
    localStorage.clear();
    this.router.navigateByUrl('home');
  }
  
  cerrarSesion(){
    localStorage.clear();
    this.router.navigateByUrl('home');
  }

}
