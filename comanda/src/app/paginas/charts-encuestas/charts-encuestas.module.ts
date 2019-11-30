import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChartsEncuestasPage } from './charts-encuestas.page';

const routes: Routes = [
  {
    path: '',
    component: ChartsEncuestasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ChartsEncuestasPage]
})
export class ChartsEncuestasPageModule {}
