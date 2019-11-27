import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PedidosBartenderPage } from './pedidos-bartender.page';

const routes: Routes = [
  {
    path: '',
    component: PedidosBartenderPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PedidosBartenderPage]
})
export class PedidosBartenderPageModule {}
