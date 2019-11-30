import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { CloudFirestoreService } from 'src/app/servicios/cloud-firestore.service';
import { Router } from '@angular/router';

declare var google;

@Component({
  selector: 'app-charts-encuestas',
  templateUrl: './charts-encuestas.page.html',
  styleUrls: ['./charts-encuestas.page.scss'],
})
export class ChartsEncuestasPage implements OnInit {

  encuestas = new Array();
  nosEligen = new Array();
  opciones = new Array();
  calificaciones = new Array();

  totalGustosPlatos = 0;
  totalGustosBebidas = 0;
  totalGustosPostres = 0;
  totalGustosTres = 0;

  totalSi = 0;
  totalNo = 0;
  totalTalVez = 0;

  totalRapido = 0;
  totalAgradable = 0;
  totalLento = 0;
  totalCaro = 0;

  promedioCalificaciones = 0;

  constructor(private dbService:CloudFirestoreService,
    private router:Router, public platform: Platform, ) { 
    this.platform.ready().then(()=>{
      google.charts.load('current',{'packages':['corechart']});
      //this.DrawPieChart();
    })
   }

   traerEncuestas() {
    this.dbService.traerEncuestas().subscribe((encuestas)=>{
      this.encuestas.length=0;
      encuestas.map((encuesta:any)=>{
        if(encuesta.payload.doc.data().gustos != "")
          this.encuestas.push({gustos:encuesta.payload.doc.data().gustos,valor:1});
      })
    })
   }

   traerNosEligen() {
    this.dbService.traerEncuestas().subscribe((nosel)=>{
      this.nosEligen.length=0;
      nosel.map((n:any)=>{
        if(n.payload.doc.data().nosEligen != "")
          this.nosEligen.push({nosEligen:n.payload.doc.data().nosEligen});
      })
    })
   }

   traerOpciones() {
    this.dbService.traerEncuestas().subscribe((op)=>{
      this.opciones.length=0;
      op.map((o:any)=>{
        if(o.payload.doc.data().opciones.length>=1)
          this.opciones.push({opciones:o.payload.doc.data().opciones});
      })
    })
   }

   traerCalificaciones() {
    this.dbService.traerEncuestas().subscribe((cal)=>{
      this.nosEligen.length=0;
      cal.map((c:any)=>{
          this.calificaciones.push({calificacion:c.payload.doc.data().calificacion});
      })
    })
   }

   calcularGustos() {
     this.encuestas.forEach(encuesta => {
       if(encuesta.gustos == "enEseOrden") {
        this.totalGustosTres += 1;
       } else if(encuesta.gustos == "platos") {
        this.totalGustosPlatos += 1;
       } else if(encuesta.gustos == "bebidas") {
        this.totalGustosBebidas += 1;
       } else if(encuesta.gustos == "postres") {
        this.totalGustosPostres += 1;
       }
     });
   }

   calcularNosEligen() {
    this.nosEligen.forEach(encuesta => {
      if(encuesta.nosEligen == "si") {
       this.totalSi += 1;
      } else if(encuesta.nosEligen == "talVez") {
       this.totalTalVez += 1;
      } else if(encuesta.nosEligen == "no") {
       this.totalNo += 1;
      } 
    });
   }

   calcularOpciones() {
     console.log(this.opciones);

    for(let i=0;i<this.opciones.length;i++) {
      for(let j=0;j<this.opciones[i].opciones.length;j++) {
        if(this.opciones[i].opciones[j] == "El servicio fue lento.") {
          this.totalLento += 1;
        } else if(this.opciones[i].opciones[j]=="El servicio fue rápido.") {
          this.totalRapido +=1;
        } else if(this.opciones[i].opciones[j]=="El lugar está agradable.") {
          this.totalAgradable +=1;
        } else if(this.opciones[i].opciones[j] == "Los precios son caros.") {
          this.totalCaro +=1 ;
        }
      }
    }

    console.log(this.totalLento);
    console.log(this.totalRapido);
  }

   calcularCalificaciones() {
     this.traerCalificaciones();
     let cantidad = 0;
     let suma = 0;
    this.calificaciones.forEach(cal => {
      cantidad +=1;
      suma += cal.calificacion;
    })

    this.promedioCalificaciones = suma /cantidad;
   }

   DrawPieChart() {
    //this.chartPromedio();
    this.calcularGustos();
     var data = google.visualization.arrayToDataTable([
      ['gustos','cantidad'],
      ['Platos', this.totalGustosPlatos],
      ['Bebidas', this.totalGustosBebidas],
      ['Postres', this.totalGustosPostres],
      ['Las tres por igual', this.totalGustosTres],
     ]);
     var options = {
       title: 'Lo que mas le gustó a la gente',
       is3D: true
     }
     var chart = new google.visualization.PieChart(document.getElementById('div_pie'));
     chart.draw(data, options);

     this.chartNosEligen();
   }

   chartNosEligen() {
    this.calcularNosEligen();
    var data = google.visualization.arrayToDataTable([
     ['Nos Eligen','cantidad'],
     ['Si', this.totalSi],
     ['No', this.totalNo],
     ['Tal Vez', this.totalTalVez],
    ]);
    var options = {
      title: 'Volverían a elegirnos',
      pieHole: 0.4,
      is3D: false
    }
    var chart = new google.visualization.PieChart(document.getElementById('div_pie2'));
    chart.draw(data, options);

    this.chartOpciones();
   }

   chartOpciones() {
     this.calcularOpciones();
     console.log(this.opciones);
     var data = google.visualization.arrayToDataTable([
      ['Opciones','cantidad'],
      ['El servicio fue rápido.', this.totalRapido],
      ['El lugar está agradable.', this.totalAgradable],
      ['El servicio fue lento.', this.totalLento],
      ['Los precios son caros.', this.totalCaro],
     ]);
     var options = {
       title: 'Opciones',
       is3D: false
     }
     //var chart = new google.visualization.PieChart(document.getElementById('div_pie3'));
     var chart = new google.visualization.ColumnChart(document.getElementById('div_pie3'));
     chart.draw(data, options);

     this.chartPromedio();
   }

   chartPromedio() {
    this.calcularCalificaciones();
    var data = google.visualization.arrayToDataTable([
     ['Calificacion','count'],
     ['Puntajes', this.promedioCalificaciones],
    ]);
    var options = {
      title: 'Calificaciones',
      redFrom: 0, redTo: 40,
      yellowFrom:40, yellowTo: 70,
      greenFrom:70, greenTo: 100,
    }
    var chart = new google.visualization.Gauge(document.getElementById('div_pie4'));
    chart.draw(data, options);
   }

  ngOnInit() {
    this.traerCalificaciones();
    this.traerEncuestas();
    this.traerNosEligen();
    this.traerOpciones();
  }

  

}
