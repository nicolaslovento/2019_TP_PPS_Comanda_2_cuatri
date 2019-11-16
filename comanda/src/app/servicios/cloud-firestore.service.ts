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
  var existe=false;
  var turnos=[];
  return new Promise((resolve,rejected)=>{
  this.dbFirestore.collection('usuarios').get().subscribe((user)=>{
    user.docs.map((user:any)=>{
      //console.log(usuario+" "+clave);
    if(user.data().usuario==usuario && user.data().clave==clave){
      existe=true;
      if(user.data().perfil=="cliente"){

          if(user.data().estado=='aprobado'){
              resolve(user.data());
          }else{
            if(user.data().estado=='noAprobado'){

              rejected("Tu solicitud de registro todavía no fue aprobada");
            }else{

              rejected("Tu solicitud de registro ha sido rechazada");
            }
          }
           
    }else{
        resolve(user.data());
        
    }
  }
   

  });
   
  })

  /*if(!existe){
    rejected("Usuario o contraseña incorrecta");
  }*/
  
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

    this.dbFirestore.collection("usuarios").doc(usuarioNuevo.usuario).set({
    
    nombre:usuarioNuevo.nombre,
    usuario:usuarioNuevo.usuario,
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

//Cargar un pedido a la base de datos
cargarPedido(pedidoNuevo: any) {

  return new Promise((resolve,rejected)=>{

    this.dbFirestore.collection("pedidos").doc(pedidoNuevo.cliente).set({
    
    total:pedidoNuevo.total,
    cliente:pedidoNuevo.cliente,
    pedido:pedidoNuevo.pedido,
    
  }).then(()=>{
    resolve(pedidoNuevo);
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

traerProductos() {
  return this.dbFirestore.collection('productos').snapshotChanges();
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


/*devuelve resolve si el qr es correcto*/
async verificarIngresoAlRestaurante(qr:string){
  
  
  return new Promise((resolve,rejected)=>{
  this.dbFirestore.collection('restaurante').get().subscribe((res)=>{
    res.docs.map((res:any)=>{
      
    if(res.data().qr==qr){

      resolve("Bienvenido al restaurante")

    }else{
      rejected("No pudo ingresar al restaurante")
    }
   

  });
   
  })

})
}

async verificarCargarQrMesa(qr: string) {

  return new Promise((resolve,rejected)=>{
    this.dbFirestore.collection('mesas').get().subscribe((res)=>{
      res.docs.map((res:any)=>{
                
      if(res.data().qr==qr && res.data().disponible == true){
  
        resolve("Lista de productos.")
  
      }     
  
    });
     
    })
  
  })
}

/*cambia el estado del usuario a "esperandoMesa"*/
async cambiarEstadoDeEspera(cliente,estado:boolean){
  
  
  return new Promise((resolve,rejected)=>{
    
    this.dbFirestore.collection("usuarios").doc(cliente.usuario).update({
    
    esperandoMesa:estado
  
   }).then(()=>{
     resolve("Se asignó")
   }).catch(()=>{
     rejected("No se asignó")
   })
})

}

/*trae todas las mesas(luego utilizar con subscribe)*/
traerMesas(){
  
  return this.dbFirestore.collection('mesas').snapshotChanges();

}

/*cambia el estado de mesa y asigna usuario a la misma*/
async cambiarEstadoMesa(cliente,mesa,estado:boolean){
  
  
  return new Promise((resolve,rejected)=>{
    
    this.dbFirestore.collection("mesas").doc(mesa.qr).update({
    usuario:cliente.usuario,
    disponible:estado
  
   }).then(()=>{
     resolve("Se asignó")
   }).catch(()=>{
     rejected("No se asignó")
   })
})

}


}