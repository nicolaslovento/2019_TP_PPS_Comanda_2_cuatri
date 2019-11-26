import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PedidosCocineroPage } from './pedidos-cocinero.page';

const routes: Routes = [
  {
    path: '',
    component: PedidosCocineroPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PedidosCocineroPage]
})
export class PedidosCocineroPageModule {}
