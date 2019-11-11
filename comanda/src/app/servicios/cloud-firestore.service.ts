import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';
import { reject } from 'q';
import { resolve } from 'url';
@Injectable({
  providedIn: 'root'
})
export class CloudFirestoreService {

  constructor(private dbFirestore:AngularFirestore) { }

  /*
  Verifica que el usuario exista
  */
 async verificarUsuario(usuario:string,clave:string){
  var turnos=[];
  return new Promise((resolve,rejected)=>{
  this.dbFirestore.collection('usuarios').get().subscribe((user)=>{
    user.docs.map((user:any)=>{
      
      if(user.data().perfil=='cliente' && user.data().usuario==usuario && user.data().clave==clave){
        switch(user.data().estado){
          case 'aprobado':
            resolve(user.data());
          break;
          case 'noAprobado':
            rejected("Tu solicitud de registro todavía no fue aprobada");
          break;
          case 'rechazado':
            rejected("Tu solicitud de registro ha sido rechazada");
          break;
        }
      }

      if(user.data().usuario==usuario && user.data().clave==clave){
        resolve(user.data());
      }
      
    });
   
  })
  
})
}

  

/*carga un dueño o supervisor a la bd, su id será el dni->(también lo tienen los clientes y empleados)*/  
cargarDueñoOSupervisor(usuarioNuevo:any){

    return new Promise((resolve,rejected)=>{

      this.dbFirestore.collection("usuarios").doc(usuarioNuevo.dni.toString()).set({
      
      nombre:usuarioNuevo.nombre,
      apellido:usuarioNuevo.apellido,
      dni:usuarioNuevo.dni,
      cuil:usuarioNuevo.cuil,
      foto:usuarioNuevo.foto,
      perfil:usuarioNuevo.perfil,
      clave:usuarioNuevo.clave,

    }).then(()=>{
      resolve(usuarioNuevo);
    }).catch((error)=>{
      rejected(error);
    });
  })
}

//Cargar cliente a la bd
cargarCliente(usuarioNuevo:any) {
  return new Promise((resolve,rejected)=>{

    this.dbFirestore.collection("usuarios").doc(usuarioNuevo.usuario).set({
    
    nombre:usuarioNuevo.nombre,
    apellido:usuarioNuevo.apellido,
    dni:usuarioNuevo.dni,
    foto:usuarioNuevo.foto,
    clave:usuarioNuevo.clave,
    perfil:"cliente",
    estado:usuarioNuevo.estado

  }).then(()=>{
    resolve(usuarioNuevo);
  }).catch((error)=>{
    rejected(error);
  });
})
}

//Cargar cliente anonimo a la bd
cargarClienteAnonimo(usuarioNuevo:any) {
  return new Promise((resolve,rejected)=>{

    this.dbFirestore.collection("usuarios").doc(usuarioNuevo.dni.toString()).set({
    
    nombre:usuarioNuevo.nombre,
    dni:usuarioNuevo.dni,
    foto:usuarioNuevo.foto,
    clave:usuarioNuevo.clave,
    perfil:"clienteAnonimo",

  }).then(()=>{
    resolve(usuarioNuevo);
  }).catch((error)=>{
    rejected(error);
  });
})
}

//Carga un producto a la Base de Datos 
cargarProducto(productoNuevo:any) {
  return new Promise((resolve,rejected)=>{

    this.dbFirestore.collection("productos").doc(productoNuevo.nombre).set({
    
    nombre:productoNuevo.nombre,
    descripcion:productoNuevo.descripcion,
    tiempoElab:productoNuevo.tiempoElab,
    precio:productoNuevo.precio,
    foto1:productoNuevo.foto1,
    foto2:productoNuevo.foto1,
    foto3:productoNuevo.foto1,

    
  }).then(()=>{
    resolve(productoNuevo);
  }).catch((error)=>{
    rejected(error);
  });
})
}

//Carga una mesa a la bd, su id será el numero 
cargarMesa(mesaNueva:any){

  return new Promise((resolve,rejected)=>{

    this.dbFirestore.collection("mesas").doc(mesaNueva.numero.toString()).set({
    
    numero:mesaNueva.numero,
    comensales:mesaNueva.comensales,
    foto:mesaNueva.foto,
    codigo:mesaNueva.codigo,

  }).then(()=>{
    resolve(mesaNueva); 
  }).catch((error)=>{
    rejected(error);
  });
})
}  


//retorna todos los usuarios de la bd
traerUsuarios(){
  
  
  return this.dbFirestore.collection('usuarios').snapshotChanges();
    
}

//cambia estado de cliente 
darEstadoACliente(cliente:any,estado:string){

  return new Promise((resolve,rejected)=>{
    
    this.dbFirestore.collection("usuarios").doc(cliente.usuario).update({
    
    estado:estado
  
   }).then(()=>{
     resolve("Se aprobó")
   }).catch(()=>{
     rejected("No se aprobó")
   })
})


}


}
