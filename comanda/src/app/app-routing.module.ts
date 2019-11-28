import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  //login
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  //paginas dueño
  { path: 'menu-dueño', loadChildren: './paginas/dueño/menu/menu.module#MenuPageModule' },
  { path: 'alta-dueño', loadChildren: './paginas/dueño/alta/alta.module#AltaPageModule' },
  { path: 'aprobar-dueño', loadChildren: './paginas/dueño/aprobar-clientes/aprobar-clientes.module#AprobarClientesPageModule' },
//paginas supervisor
  { path: 'alta-supervisor', loadChildren: './paginas/supervisor/alta/alta.module#AltaPageModule' },
  { path: 'menu-supervisor', loadChildren: './paginas/supervisor/menu/menu.module#MenuPageModule' },
  { path: 'aprobar-supervisor', loadChildren: './paginas/supervisor/aprobar-clientes/aprobar-clientes.module#AprobarClientesPageModule' },
//paginas metre
  { path: 'menu-metre', loadChildren: './paginas/empleados/metre/menu/menu.module#MenuPageModule' },
//paginas cocinero
  { path: 'menu-cocinero', loadChildren: './paginas/empleados/cocinero/menu/menu.module#MenuPageModule' },
  { path: 'alta-cocinero', loadChildren: './paginas/empleados/cocinero/alta/alta.module#AltaPageModule' },
  { path: 'pedidos-cocinero', loadChildren: './paginas/empleados/cocinero/pedidos-cocinero/pedidos-cocinero.module#PedidosCocineroPageModule' },
//paginas bartender
  { path: 'alta-bartender', loadChildren: './paginas/empleados/bartender/alta/alta.module#AltaPageModule' },
  { path: 'menu-bartender', loadChildren: './paginas/empleados/bartender/menu/menu.module#MenuPageModule' },
  { path: 'pedidos-bartender', loadChildren: './paginas/empleados/bartender/pedidos-bartender/pedidos-bartender.module#PedidosBartenderPageModule' },
//paginas clienteRegistrado
  { path: 'menu-cliente', loadChildren: './paginas/cliente/menu/menu.module#MenuPageModule' },
  { path: 'alta-cliente', loadChildren: './paginas/cliente/alta/alta.module#AltaPageModule' },
//paginas mozo
 { path: 'menu-mozo', loadChildren: './paginas/empleados/mozo/menu/menu.module#MenuPageModule' },
 
//paginas clienteNoRegistrado
  { path: 'alta-clienteNoRegistrado', loadChildren: './paginas/clienteNoRegistrado/alta/alta.module#AltaPageModule' },
  { path: 'menu-clienteNoRegistrado', loadChildren: './paginas/clienteNoRegistrado/menu/menu.module#MenuPageModule' },
  
//paginas compartidas entre cliente y clienteNoRegistrado
  { path: 'lista-productos', loadChildren: './paginas/productos/lista-productos/lista-productos.module#ListaProductosPageModule' },
  { path: 'menu2', loadChildren: './paginas/clienteNoRegistrado/menu2/menu2.module#Menu2PageModule' },
  { path: 'juegos', loadChildren: './paginas/clienteNoRegistrado/juegos/juegos.module#JuegosPageModule' },
  { path: 'encuesta', loadChildren: './paginas/clienteNoRegistrado/encuesta/encuesta.module#EncuestaPageModule' },

  

  
 



 

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
