import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
declare var google;

@Component({
  selector: 'app-charts-encuestas',
  templateUrl: './charts-encuestas.page.html',
  styleUrls: ['./charts-encuestas.page.scss'],
})
export class ChartsEncuestasPage implements OnInit {

  constructor(public platform: Platform) { 
    this.platform.ready().then(()=>{
      google.charts.load('current',{'packages':['corechart']});
      //this.DrawPieChart();
    })
   }

   DrawPieChart() {
     var data = google.visualization.arrayToDataTable([
       ['vehicle status','count'],
       ['in motion', 10],
       ['Idling', 5],
       ['Stopped',7]
     ]);
     var options = {
       title: 'Vehicle count according to',
       is3D: true
     }
     var chart = new google.visualization.PieChart(document.getElementById('div_pie'));
     chart.draw(data, options);
   }

  ngOnInit() {
  }

  

}
