import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CloudFirestoreService } from '../../../servicios/cloud-firestore.service';
import { CamaraService } from 'src/app/servicios/camara.service';
import { AlertControllerService } from 'src/app/servicios/alert-controller.service';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
})
export class EncuestaPage implements OnInit {

  aaa(g) {
    console.log(g);
  }

  data = [
    {
      name: 'El servicio fue rápido.',
      selected: false
    },
    {
      name: 'El lugar está agradable.',
      selected: false
    },
    {
      name: 'El servicio fue lento.',
      selected: false
    },
    {
      name: 'Los precios son caros.',
      selected: false
    },
  ]

  form = new Array();
  calificacion=0;
  comentarios: string = "";
  foto1:any=""; 
  foto2:any=""; 
  foto3:any=""; 
  nosEligen:string = "";
  opciones = new Array();
  opcionesFinal = new Array();
  entry:any;
  gustos:string = "";

  constructor(private cameraService:CamaraService,
    private router: Router,
    private serviceFirestore: CloudFirestoreService,
    private alertService: AlertControllerService,) { }
    

  ngOnInit() {
  }

  onClick(check) {

    //console.log(check);
    let flagYaEsta = 0;

    if(check.selected == true) {
      this.opciones.forEach(opcion => {
        if(opcion == check.name) {
          flagYaEsta = 1;
        }
      });

      if(flagYaEsta == 0) {
        this.opciones.push(check.name);
      }
    } else if(check.selected == false) {
      for(let i=0; i<this.opciones.length;i++) {
        if(this.opciones[i] == check.name) {
          this.opciones[i] = "";
        }
      }
    }
  }


  prepararOpciones() {
    this.opciones.forEach(opcion => {
      if(opcion != "") {
        this.opcionesFinal.push(opcion);
      }
    });

    if(this.opciones.length<1) {
      this.opcionesFinal.push("vacio");
    }
  }


  enviarEncuesta() {

    this.prepararOpciones();

    if(this.gustos == undefined) {
      this.gustos = "";
    }

    let encuestaNueva= {
      calificacion:this.calificacion,
      comentarios:this.comentarios,
      foto1:this.foto1,
      foto2:this.foto2,
      foto3:this.foto3,
      nosEligen:this.nosEligen,
      opciones:this.opcionesFinal,
      gustos:this.gustos,
    }

    this.serviceFirestore.cargarEncuesta(encuestaNueva).then(()=>{
      this.alertService.alertComun("Enviando encuesta..",2000).then(()=>{
      });
    }).catch((error)=>{
      this.alertService.alertError(error);
      console.log(error);
    });

    this.router.navigateByUrl('menu2');

  }


  tomarFoto1(){
    let cliente = JSON.parse(localStorage.getItem("usuario"));
    this.cameraService.tomarFoto(cliente.usuario+"1"+Date.now().toString()).then(fotoSacada=>{
      this.foto1=fotoSacada;
    });
    
  }

  tomarFoto2(){
    let cliente = JSON.parse(localStorage.getItem("usuario"));
    this.cameraService.tomarFoto(cliente.usuario+"2"+Date.now().toString()).then(fotoSacada=>{
      this.foto2=fotoSacada;
    });
    
  }

  tomarFoto3(){
    let cliente = JSON.parse(localStorage.getItem("usuario"));
    this.cameraService.tomarFoto(cliente.usuario+"3"+Date.now().toString()).then(fotoSacada=>{
      this.foto3=fotoSacada;
    });
    
  }

  tipoPerfil() {
    let cliente=JSON.parse(localStorage.getItem('usuario'));
    return cliente.perfil;
  }

  

}
